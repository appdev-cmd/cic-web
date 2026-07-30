import re
import json

SCHEMA_FILE = "cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql"


def _extract_dependency_graph(sql, table_names):
    """Doc lai toan bo schema de tim:
    - deps[table] = { cac bang khac (KHONG phai chinh no) ma table nay co
      REFERENCES toi, ke ca REFERENCES khai bao qua ALTER TABLE ... ADD
      CONSTRAINT o cuoi file } -> dung de sap xep lai thu tu insert Phase A.
    - self_ref[table] = [cac cot REFERENCES chinh bang do (cay phan cap)]
      -> dung de insert 2 buoc (NULL truoc, UPDATE lai sau).
    QUAN TRONG: chi doc REFERENCES trong PHAN CODE cua dong (truoc " -- "),
    KHONG doc trong comment, vi comment hay nhac lai "REFERENCES x(id)" de
    mo ta y dinh/lich su sua loi (khong phai FK that) -> neu khong loai tru
    se sinh phu thuoc gia.
    """
    table_name_set = set(table_names)
    deps = {t: set() for t in table_names}
    self_ref = {t: [] for t in table_names}

    table_blocks = re.findall(r'CREATE TABLE "(.*?)" \((.*?)\);', sql, re.DOTALL)
    for tname, body in table_blocks:
        for raw_line in body.split('\n'):
            line = raw_line.strip()
            if not line.startswith('"'):
                continue
            code_part = line.split(' -- ')[0]
            m = re.search(r'REFERENCES\s+"?(\w+)"?\(id\)', code_part)
            if not m:
                continue
            target = m.group(1)
            if not target.startswith("cic_"):
                target = "cic_" + target
            if target == tname:
                col_m = re.match(r'"([^"]+)"', code_part)
                if col_m:
                    self_ref[tname].append(col_m.group(1))
            elif target in table_name_set:
                deps.setdefault(tname, set()).add(target)

    for m in re.finditer(
        r'ALTER TABLE "(\w+)" ADD CONSTRAINT "[^"]+" FOREIGN KEY \("([^"]+)"\) '
        r'REFERENCES "(\w+)"\(id\)', sql
    ):
        tname, col, target = m.groups()
        if target == tname:
            self_ref.setdefault(tname, []).append(col)
        elif target in table_name_set:
            deps.setdefault(tname, set()).add(target)

    return deps, self_ref


def generate_manifest():
    with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
        sql = f.read()

    manifest = {}
    table_blocks = re.findall(r'CREATE TABLE "(.*?)" \((.*?)\);', sql, re.DOTALL)
    table_names = [t for t, _ in table_blocks]

    deps, self_ref = _extract_dependency_graph(sql, table_names)
    
    # Kết nối MySQL để kiểm tra tồn tại cột và bảng
    try:
        import mysql.connector
        import config
        mysql_cnx = mysql.connector.connect(charset="utf8mb4", use_unicode=True, **config.MYSQL)
        mysql_cur = mysql_cnx.cursor()
        
        def table_exists_in_mysql(table_name):
            """Kiểm tra xem bảng có tồn tại trong MySQL không."""
            # Mapping từ cic_ sang fs_
            mysql_table = table_name.replace("cic_", "fs_")
            if mysql_table.startswith("fs_cic_"):
                mysql_table = "fs_" + mysql_table[7:]
            try:
                mysql_cur.execute(f"SHOW TABLES LIKE '{mysql_table}'")
                return mysql_cur.fetchone() is not None
            except:
                return False
        
        def column_exists_in_mysql(table_name, column_name):
            """Kiểm tra xem cột có tồn tại trong MySQL không."""
            # Mapping từ cic_ sang fs_
            mysql_table = table_name.replace("cic_", "fs_")
            if mysql_table.startswith("fs_cic_"):
                mysql_table = "fs_" + mysql_table[7:]
            try:
                mysql_cur.execute(f"SHOW COLUMNS FROM `{mysql_table}` LIKE '{column_name}'")
                return mysql_cur.fetchone() is not None
            except:
                return False
    except:
        mysql_cnx = None
        mysql_cur = None

    for table_name, body in table_blocks:
        is_trans = table_name.endswith("_translations")

        info = {
            "is_translation": is_trans,
            "source_table": None,
            "source_table_en": None,
            "columns": [],
            # NEW: FK truoc do phai insert xong (chi bang thuong, dung de
            # sap xep lai Phase A - tranh loi FK do thu tu file khong khop
            # thu tu ALTER TABLE ADD CONSTRAINT o cuoi schema).
            "depends_on": sorted(deps.get(table_name, set())),
            # NEW: cot REFERENCES chinh bang nay (cay phan cap: parent_id,
            # root_id...) -> migrate.py se insert NULL truoc, UPDATE sau.
            "self_ref_cols": self_ref.get(table_name, []),
        }

        source_tables = []

        lines = body.strip().split('\n')
        has_id_col = False
        for line in lines:
            line = line.strip()
            if not line.startswith('"'): continue

            # extract pg_col and pg_type
            match_col = re.match(r'"([^"]+)"\s+([a-zA-Z0-9_\(\)]+)', line)
            if not match_col: continue

            pg_col = match_col.group(1)
            pg_type = match_col.group(2).lower()
            if pg_type.startswith('varchar'): pg_type = 'varchar'
            if pg_type.startswith('numeric'): pg_type = 'numeric'

            if pg_col == "id":
                has_id_col = True

            synthetic = False
            sources = []

            # specific hardcoded synthetic columns
            if pg_col in ("id", "entity_id", "locale"):
                synthetic = True

            # extract sources
            match_comment = re.search(r'-- ← (.*?) \|', line)
            if match_comment and not synthetic:
                comment = match_comment.group(1).strip()
                if "mới" in comment.lower() or "chưa rõ" in comment.lower():
                    synthetic = True
                else:
                    parts = re.split(r'\s*[/+]\s*', comment)
                    for p in parts:
                        if '.' in p:
                            tbl, c = p.split('.', 1)
                            # Loại bỏ tiền tố cic_ nếu có trong comment (chỉ dùng fs_ cho MySQL)
                            tbl_clean = tbl.strip()
                            if tbl_clean.startswith("cic_"):
                                tbl_clean = "fs_" + tbl_clean[4:]  # cic_products -> fs_products
                            elif tbl_clean.startswith("fs_cic_"):
                                tbl_clean = "fs_" + tbl_clean[7:]  # fs_cic_products -> fs_products
                            sources.append({"col": c.strip()})
                            if tbl_clean not in source_tables:
                                source_tables.append(tbl_clean)

            # Kiểm tra xem cột có tồn tại trong MySQL không
            if mysql_cur and not synthetic and sources:
                # Nếu cột có source nhưng không tồn tại trong MySQL, đánh dấu synthetic
                col_exists = False
                for src in sources:
                    col_name = src["col"]
                    if column_exists_in_mysql(table_name, col_name):
                        col_exists = True
                        break
                if not col_exists:
                    synthetic = True

            info["columns"].append({
                "col": pg_col,
                "pg_type": pg_type,
                "synthetic": synthetic,
                "sources": sources
            })

        # NEW: bang khong co cot "id" (vd cic_products_categories_rel - bang
        # trung gian N-N moi, sinh ra bang cach parse CSV, KHONG phai copy
        # 1-1 tu 1 bang MySQL nao) -> khong the dung luong migrate_base_table
        # chung (luong do LUON gia dinh co cot "id" de OVERRIDING SYSTEM
        # VALUE). Danh dau de migrate.py bo qua + canh bao thay vi crash
        # hoac sinh sai du lieu.
        info["no_pk"] = not has_id_col

        if source_tables:
            # Kiểm tra bảng source có tồn tại trong MySQL không
            valid_sources = []
            for src in source_tables:
                try:
                    mysql_cur.execute(f"SHOW TABLES LIKE '{src}'")
                    if mysql_cur.fetchone():
                        valid_sources.append(src)
                except:
                    pass
            
            if valid_sources:
                if is_trans:
                    # Bang dich gop (vd blocks_translations): can CA HAI nguon,
                    # thu tu KHONG quan trong vi dung ca 2 cung luc.
                    info["source_table"] = valid_sources[0]
                    if len(valid_sources) > 1:
                        info["source_table_en"] = valid_sources[1]
                    else:
                        info["source_table_en"] = valid_sources[0] + "_en"
                elif table_name.endswith("_en"):
                    # [FIX Dot 7] Bang EN doc lap (tach khoi mo hinh
                    # translations). Comment cot luon liet ke VI truoc
                    # (vd "fs_products.id / fs_products_en.id") nen KHONG
                    # duoc lay valid_sources[0] mu quang - phai uu tien
                    # dung nguon co hau to _en cua chinh bang nay, neu khong
                    # toan bo du lieu se bi nap nham tu bang MySQL tieng Viet.
                    en_sources = [s for s in valid_sources if s.endswith("_en")]
                    info["source_table"] = en_sources[0] if en_sources else valid_sources[0]
                else:
                    # Bang VI doc lap / bang giu nguyen: uu tien nguon
                    # KHONG co hau to _en (tranh truong hop token dau tien
                    # trong comment vo tinh la ban _en).
                    vi_sources = [s for s in valid_sources if not s.endswith("_en")]
                    info["source_table"] = vi_sources[0] if vi_sources else valid_sources[0]
            else:
                # Fallback: thử mapping mặc định cho translation tables
                if is_trans:
                    base = table_name.replace("_translations", "")
                    # Loại bỏ tiền tố cic_ nếu có
                    if base.startswith("cic_"):
                        base = base[4:]
                    mysql_table = "fs_" + base
                    mysql_table_en = mysql_table + "_en"
                    try:
                        mysql_cur.execute(f"SHOW TABLES LIKE '{mysql_table}'")
                        if mysql_cur.fetchone():
                            info["source_table"] = mysql_table
                            info["source_table_en"] = mysql_table_en
                        else:
                            info["source_table"] = None
                            info["source_table_en"] = None
                    except:
                        info["source_table"] = None
                        info["source_table_en"] = None
                else:
                    info["source_table"] = None
                    info["source_table_en"] = None
        else:
            base = table_name.replace("_translations", "")
            # Loại bỏ tiền tố cic_ nếu có
            if base.startswith("cic_"):
                base = base[4:]
            mysql_table = "fs_" + base
            try:
                mysql_cur.execute(f"SHOW TABLES LIKE '{mysql_table}'")
                if mysql_cur.fetchone():
                    info["source_table"] = mysql_table
                    if is_trans:
                        info["source_table_en"] = mysql_table + "_en"
                else:
                    info["source_table"] = None
                    info["source_table_en"] = None
            except:
                info["source_table"] = None
                info["source_table_en"] = None

        manifest[table_name] = info

    # Đóng kết nối MySQL
    if mysql_cur:
        mysql_cur.close()
    if mysql_cnx:
        mysql_cnx.close()

    with open("manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    no_pk_tables = [t for t, i in manifest.items() if i["no_pk"]]
    print(f"Generated manifest.json with {len(manifest)} tables.")
    if no_pk_tables:
        print(f"CANH BAO: {len(no_pk_tables)} bang khong co cot 'id' se bi BO QUA "
              f"boi migrate.py (can migrate tay/rieng): {no_pk_tables}")


if __name__ == '__main__':
    generate_manifest()
