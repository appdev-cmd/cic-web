#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ETL migrate cic14005_cic_fs: MySQL/MariaDB (schema cu) -> PostgreSQL (schema moi).

Cach hoat dong:
  - Doc manifest.json (sinh tu chinh file schema PostgreSQL da vá, xem
    generate_manifest.py) de biet moi bang/cot moi lay du lieu tu bang/cot
    nao o MySQL, PHU THUOC FK vao bang nao (depends_on), va cot nao tu
    tham chieu chinh bang do (self_ref_cols).
  - Voi bang thuong (khong phai *_translations): copy 1-1, GIU NGUYEN id cu
    (dung OVERRIDING SYSTEM VALUE) de khong phai remap 92 cot khoa ngoai.
    Thu tu insert cac bang thuong duoc SAP XEP THEO TOPO (topological sort)
    dua tren manifest["depends_on"] - KHONG dung nguyen thu tu xuat hien
    trong file schema nua, vi 6 bang (users_permission x3, contents, news,
    products, banners, slideshow) co cot FK "that" duoc gan qua ALTER TABLE
    ADD CONSTRAINT o CUOI schema, tro toi 1 bang duoc CREATE TABLE SAU no
    trong file -> neu insert theo dung thu tu file se luon bi loi FK vi
    bang cha chua co du lieu.
  - Cac bang cay phan cap tu tham chieu (areas, menus_admin, menus_items,
    contents_categories, news_categories, products_categories) duoc insert
    2 buoc: buoc 1 insert voi cot self-ref (vd parent_id) = NULL, buoc 2
    UPDATE lai gia tri that sau khi TOAN BO dong cua bang da co san - tranh
    loi FK do thu tu dong trong data goc khong dam bao cha luon co id nho
    hon con.
  - Bang KHONG co cot "id" (hien tai: cic_products_categories_rel - bang
    trung gian N-N moi sinh ra bang cach PARSE CSV tu products.category_id,
    khong phai copy 1-1) se bi BO QUA voi canh bao ro rang, thay vi crash
    hoac insert sai du lieu - can vet ETL rieng cho bang nay (xem README).
  - Voi bang *_translations: voi moi dong o bang goc (vi) -> insert 1 dong
    locale='vi'; neu co bang _en tuong ung va co dong voi cung id -> insert
    them 1 dong locale='en'. entity_id = id cu (vi id da duoc giu nguyen o
    buoc tren nen entity_id luon khop voi id cua bang goc trong Postgres).
    Neu 1 cot duoc khai trong manifest nhung KHONG thuc su ton tai o bang
    MySQL nguon (vd sai lech giua comment schema va DB that, da gap voi
    products_translations.title) - se tu dong bo cot do va CANH BAO, thay
    vi lam crash toan bo bang.
  - 22 bang khai charset latin1 nhung thuc te chua UTF-8 (da xac nhan qua
    Phase 0) duoc tu dong sua khi doc tu MySQL.
  - TAO DATA AO CHO FK MOC COI: Tu dong doc depends_on tu manifest, neu
    bang can FK toi bang khac nhung ID do khong ton tai trong bang cha, se
    tu dong tao dummy record trong bang cha (voi OVERRIDING SYSTEM VALUE)
    truoc khi insert bang con. Dieu nay duoc lam TONG QUAT cho TAT CA cac bang,
    khong chi cac bang da gap loi trong log.
  - Sau khi load xong tung bang, reset sequence cua cot id ve dung MAX(id).

Yeu cau cai dat:
    pip install mysql-connector-python psycopg2-binary

Cach chay: xem file README.md di kem.
"""

import json
import sys
import logging
from datetime import datetime

import mysql.connector
import psycopg2
import psycopg2.extras

import config  # file config.py cung thu muc — sua thong tin ket noi o do

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger("migrate")

# ------------------------------------------------------------------
# 22 bang khai latin1 nhung du lieu that su la UTF-8 (xac nhan qua Phase 0)
# -> can doc lai bang cach ep charset khi ket noi rieng cho cac bang nay.
# ------------------------------------------------------------------
LATIN1_MISLABELED_TABLES = {
    "fs_application", "fs_application_en", "fs_email", "fs_email_en",
    "fs_khuvuc", "fs_khuvuc_en", "fs_languages", "fs_languages_contents",
    "fs_manufactories", "fs_manufactories_en", "fs_manufactories_en_bk",
    "fs_menus_groups", "fs_menus_groups_en", "fs_products_fields_groups",
    "fs_products_images", "fs_products_images_en", "fs_products_tables",
    "fs_products_tables_en", "fs_products_types", "fs_products_types_en",
    "fs_types_email", "fs_types_email_en",
}

# Cac bang bi loai tru hoan toan (backup/nhap/trung lap) - khong migrate
EXCLUDED_TABLES = {
    "fs_menus_items_en_bk", "fs_contents_en-bk", "fs_news_18052020",
    "fs_news_categories_copy1", "fs_news_en1", "fs_products_copy1",
    "fs_products_en_", "fs_manufactories_en_bk", "fs_banners_en_",
    "fs_image_en_", "fs_image_images_en_",
}


def load_manifest(path="manifest.json"):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def toposort_base_tables(manifest, base_tables):
    """Sap xep lai danh sach bang thuong theo FK dependency (manifest[t]
    ["depends_on"]) bang Kahn's algorithm, GIU thu tu goc trong file lam
    tie-break de ket qua on dinh + de doi chieu. Neu phat hien chu trinh
    that (khong tinh tu-tham-chieu, da tach rieng vao self_ref_cols) thi
    canh bao va fallback ve thu tu con lai theo file, thay vi treo chuong
    trinh."""
    base_set = set(base_tables)
    order_index = {t: i for i, t in enumerate(base_tables)}
    remaining_deps = {
        t: {d for d in manifest[t].get("depends_on", []) if d in base_set and d != t}
        for t in base_tables
    }

    result = []
    placed = set()
    remaining = set(base_tables)
    while remaining:
        # bang nao co the insert ngay (het phu thuoc chua duoc insert)
        ready = sorted(
            (t for t in remaining if remaining_deps[t] <= placed),
            key=lambda t: order_index[t],
        )
        if not ready:
            # chu trinh that su (khong nen xay ra voi schema hop le) ->
            # canh bao va insert not het theo thu tu file de khong treo
            log.warning(
                "Phat hien vong lap FK giua cac bang: %s. "
                "Insert theo thu tu file goc cho phan con lai.",
                sorted(remaining),
            )
            ready = sorted(remaining, key=lambda t: order_index[t])
        for t in ready:
            result.append(t)
            placed.add(t)
            remaining.discard(t)

    return result


def mysql_connect(source_table):
    """Mo ket noi MySQL rieng cho bang; ep charset dung neu bang nam trong
    danh sach 22 bang bi khai sai latin1 (du lieu that la UTF-8)."""
    if source_table in LATIN1_MISLABELED_TABLES:
        # Doc bang latin1 (bytes giu nguyen) roi tu decode lai bang utf8
        cnx = mysql.connector.connect(
            charset="latin1", use_unicode=True, **config.MYSQL
        )
    else:
        cnx = mysql.connector.connect(
            charset="utf8mb4", use_unicode=True, **config.MYSQL
        )
    return cnx


def fix_mislabeled_text(value, source_table):
    """Neu bang thuoc nhom latin1-mislabeled: value doc ve dang str (da bi
    Python/connector hieu nham la latin1) -> encode lai thanh bytes latin1
    roi decode dung thanh utf-8."""
    if value is None or source_table not in LATIN1_MISLABELED_TABLES:
        return value
    if not isinstance(value, str):
        return value
    try:
        return value.encode("latin1").decode("utf-8")
    except (UnicodeDecodeError, UnicodeEncodeError):
        # gia tri khong phai truong hop bi loi (vd toan so/ky tu ASCII) -> giu nguyen
        return value


def coerce_value(value, pg_type):
    """Ep kieu Python cho dung voi cot Postgres dich."""
    if value is None:
        return None
    if pg_type == "boolean":
        return bool(int(value))
    if pg_type == "numeric":
        try:
            return float(value)
        except (TypeError, ValueError):
            return None
    if pg_type in ("timestamptz",):
        if isinstance(value, datetime):
            return value
        return value  # mysql-connector da tra ve datetime object cho cot datetime
    return value


def fix_fk_violations(table_name, row_dict, self_ref_cols, depends_on):
    """Convert sentinel value 0 to NULL for self-reference and FK columns."""
    # Convert 0 to NULL for self-reference columns
    for col in self_ref_cols:
        if row_dict.get(col) == 0:
            row_dict[col] = None
    
    # Convert 0 to NULL for FK columns (based on depends_on)
    for dep_table in depends_on:
        dep_short = dep_table.replace("cic_", "")
        possible_cols = [f"{dep_short}_id", f"{dep_short}"]
        for col in possible_cols:
            if col in row_dict and row_dict.get(col) == 0:
                row_dict[col] = None
                break


def create_dummy_data_for_table(pg_cur, pg_cnx, table_name, info, all_ids, manifest):
    """Create dummy data for orphaned FK references before main migration.
    
    Doc depends_on tu manifest de biet bang nay FK toi bang nao, sau do
    kiem tra xem cac ID trong data MySQL co ton tai trong bang cha trong
    PostgreSQL khong. Neu khong, tao dummy record trong bang cha.
    
    QUAN TRONG: Dung OVERRIDING SYSTEM VALUE vi cot id la GENERATED ALWAYS
    AS IDENTITY trong schema PostgreSQL moi.
    """
    depends_on = info.get("depends_on", [])
    if not depends_on:
        return
    
    # Build FK column mapping: for each dependency table, find which column
    # in current table references it ( heuristic: column name usually matches
    # target table name without 'cic_' prefix, e.g., user_id -> cic_users)
    fk_col_map = {}
    for dep_table in depends_on:
        # Try to find column that references this table
        dep_short = dep_table.replace("cic_", "")
        possible_cols = [f"{dep_short}_id", f"{dep_short}"]
        for col_def in info["columns"]:
            col_name = col_def["col"]
            if col_name in possible_cols:
                fk_col_map[dep_table] = col_name
                break
    
    for dep_table, fk_col in fk_col_map.items():
        orphan_ids = all_ids.get(fk_col, set())
        if not orphan_ids:
            continue
        
        # Check which IDs actually exist in the parent table
        pg_cur.execute(f'SELECT id FROM "{dep_table}"')
        existing_ids = {r[0] for r in pg_cur.fetchall()}
        missing_ids = orphan_ids - existing_ids
        
        if not missing_ids:
            continue
        
        log.info(
            "Tao %d dummy records trong bang %s cho FK mồ côi tu %s",
            len(missing_ids), dep_table, table_name
        )
        
        # Get column info for parent table to create valid dummy records
        dep_info = manifest.get(dep_table, {})
        dep_cols = [c for c in dep_info.get("columns", []) if not c.get("synthetic")]
        
        # Build minimal dummy INSERT: id + required NOT NULL columns
        # For simplicity, just insert id and name/title if exists
        dummy_cols = ["id"]
        dummy_values = []
        
        # Try to find a name/title column
        name_col = None
        for c in dep_cols:
            if c["col"] in ("name", "title", "username", "email"):
                name_col = c["col"]
                break
        if name_col:
            dummy_cols.append(name_col)
        
        placeholders = ", ".join(["%s"] * len(dummy_cols))
        col_quoted = ", ".join(f'"{c}"' for c in dummy_cols)
        insert_sql = (
            f'INSERT INTO "{dep_table}" ({col_quoted}) '
            f'OVERRIDING SYSTEM VALUE VALUES ({placeholders}) '
            f'ON CONFLICT (id) DO NOTHING'
        )
        
        for missing_id in sorted(missing_ids):
            vals = [missing_id]
            if name_col:
                vals.append(f"dummy_{dep_table}_{missing_id}")
            try:
                pg_cur.execute(insert_sql, vals)
            except Exception as e:
                log.warning(
                    "Khong the tao dummy record id=%s trong %s: %s",
                    missing_id, dep_table, e
                )
        
        pg_cnx.commit()


def migrate_base_table(pg_cur, my_cnx, pg_cnx, table_name, info, manifest):
    """Copy 1 bang thuong (khong phai *_translations)."""
    source_table = info["source_table"]
    if not source_table:
        log.warning("Bo qua bang %s: khong xac dinh duoc bang nguon", table_name)
        return 0
    if source_table in EXCLUDED_TABLES:
        return 0

    self_ref_cols = set(info.get("self_ref_cols", []))
    depends_on = info.get("depends_on", [])

    data_cols = [c for c in info["columns"] if not c.get("synthetic")]
    my_col_names = [c["sources"][0]["col"] for c in data_cols]

    my_cur = my_cnx.cursor()
    col_list_sql = ", ".join(f"`{c}`" for c in ["id"] + my_col_names)
    my_cur.execute(f"SELECT {col_list_sql} FROM `{source_table}`")

    pg_col_names = ["id"] + [c["col"] for c in data_cols]
    placeholders = ", ".join(["%s"] * len(pg_col_names))
    col_quoted = ", ".join(f'"{c}"' for c in pg_col_names)
    insert_sql = (
        f'INSERT INTO "{table_name}" ({col_quoted}) '
        f'OVERRIDING SYSTEM VALUE VALUES ({placeholders}) '
        f'ON CONFLICT (id) DO NOTHING'
    )

    # First pass: collect all FK IDs
    all_ids = {}
    for row in my_cur:
        row = list(row)
        row_dict = {"id": row[0]}
        for val, col_def in zip(row[1:], data_cols):
            val = fix_mislabeled_text(val, source_table)
            val = coerce_value(val, col_def["pg_type"])
            if val is None and col_def["pg_type"] == "timestamptz":
                val = datetime(1970, 1, 1)
            row_dict[col_def["col"]] = val

        # Collect FK IDs - general approach based on depends_on
        for dep_table in depends_on:
            dep_short = dep_table.replace("cic_", "")
            possible_cols = [f"{dep_short}_id", f"{dep_short}"]
            for col in possible_cols:
                if col in row_dict and row_dict[col] is not None:
                    all_ids.setdefault(col, set()).add(row_dict[col])
                    break

    # Create dummy data for FK violations
    create_dummy_data_for_table(pg_cur, pg_cnx, table_name, info, all_ids, manifest)

    # Reset cursor for second pass
    my_cur.execute(f"SELECT {col_list_sql} FROM `{source_table}`")

    # Second pass: insert with fixed FK values
    # Voi cot tu tham chieu (self_ref_cols, vd parent_id cua cay phan cap):
    # luon insert NULL truoc, luu lai gia tri that de UPDATE sau khi CA
    # BANG da co du dong - tranh loi FK do thu tu dong trong data goc
    # khong dam bao id cha < id con.
    rows_out = []
    self_ref_updates = []  # list[(id, {col: value, ...})]
    for row in my_cur:
        row = list(row)
        row_id = row[0]
        values = [row_id]

        # Build row dict for FK fixing
        row_dict = {"id": row_id}
        for val, col_def in zip(row[1:], data_cols):
            val = fix_mislabeled_text(val, source_table)
            val = coerce_value(val, col_def["pg_type"])
            # Auto-fix NOT NULL constraints for timestamps
            if val is None and col_def["pg_type"] == "timestamptz":
                val = datetime(1970, 1, 1)
            values.append(val)
            row_dict[col_def["col"]] = val

        # Fix FK violations (0 -> NULL conversions for self-ref and FK columns)
        fix_fk_violations(table_name, row_dict, self_ref_cols, depends_on)

        if self_ref_cols:
            deferred = {c: row_dict[c] for c in self_ref_cols if row_dict.get(c) is not None}
            if deferred:
                self_ref_updates.append((row_id, deferred))
                for c in deferred:
                    row_dict[c] = None

        # Rebuild values with fixed FK values
        values = [row_id]
        for col_def in data_cols:
            values.append(row_dict[col_def["col"]])

        rows_out.append(values)

    if rows_out:
        psycopg2.extras.execute_batch(pg_cur, insert_sql, rows_out, page_size=500)

    if self_ref_updates:
        set_clause = ", ".join(f'"{c}" = %s' for c in sorted(self_ref_cols))
        col_order = sorted(self_ref_cols)
        update_sql = f'UPDATE "{table_name}" SET {set_clause} WHERE "id" = %s'
        update_rows = [
            [deferred.get(c) for c in col_order] + [row_id]
            for row_id, deferred in self_ref_updates
        ]
        psycopg2.extras.execute_batch(pg_cur, update_sql, update_rows, page_size=500)

    my_cur.close()
    return len(rows_out)


def migrate_translation_table(pg_cur, my_cnx, table_name, info):
    """Copy 1 bang *_translations: gop du lieu tu bang goc (vi) + bang _en."""
    source_table = info["source_table"]
    source_table_en = info.get("source_table_en")
    if not source_table:
        log.warning("Bo qua bang %s: khong xac dinh duoc bang nguon", table_name)
        return 0

    data_cols = [c for c in info["columns"] if not c.get("synthetic")]

    def fetch_locale_rows(src_table, source_index):
        """source_index: 0 = cot lay tu bang vi, 1 = cot lay tu bang en (neu co).
        Neu 1 cot khong thuc su ton tai o bang MySQL nguon (MySQL tra loi
        1054 Unknown column), tu dong loai cot do va CANH BAO thay vi
        crash ca bang."""
        cols_for_locale = [
            c for c in data_cols if len(c["sources"]) > source_index
        ]
        if not cols_for_locale and data_cols:
            # bang khong co cot nao cho locale nay (vd chi co ban vi, khong co en)
            return [], []

        while True:
            my_col_names = [c["sources"][source_index]["col"] for c in cols_for_locale]
            col_list_sql = ", ".join(f"`{c}`" for c in ["id"] + my_col_names)
            my_cur = my_cnx.cursor()
            try:
                my_cur.execute(f"SELECT {col_list_sql} FROM `{src_table}`")
                rows = list(my_cur)
                my_cur.close()
                return rows, cols_for_locale
            except mysql.connector.Error as e:
                my_cur.close()
                if getattr(e, "errno", None) == 1054 and cols_for_locale:
                    # loi bao thieu cot nao thi bo cot do, thu lai
                    bad_col = None
                    msg = str(e)
                    for c, my_col in zip(cols_for_locale, my_col_names):
                        if my_col in msg:
                            bad_col = c
                            break
                    if bad_col is None:
                        raise
                    log.warning(
                        "Bang %s: cot '%s' khai trong manifest nhung KHONG "
                        "ton tai o bang MySQL '%s' (lech schema vs DB that) "
                        "- bo qua cot nay, tiep tuc voi cac cot con lai.",
                        table_name, bad_col["col"], src_table,
                    )
                    cols_for_locale = [c for c in cols_for_locale if c is not bad_col]
                    if not cols_for_locale:
                        return [], []
                    continue
                raise

    total = 0

    # Fetch valid IDs from base table to prevent FK violations
    base_table_name = table_name.replace("_translations", "")
    pg_cur.execute(f'SELECT id FROM "{base_table_name}"')
    valid_ids = {r[0] for r in pg_cur.fetchall()}

    for locale, src_table, idx in (
        ("vi", source_table, 0),
        ("en", source_table_en, 1),
    ):
        if not src_table:
            continue
        try:
            rows, cols_for_locale = fetch_locale_rows(src_table, idx)
        except mysql.connector.Error as e:
            log.warning("Bang %s (locale=%s) loi khi doc: %s", src_table, locale, e)
            continue

        if not rows:
            continue

        pg_col_names = ["entity_id", "locale"] + [c["col"] for c in cols_for_locale]
        placeholders = ", ".join(["%s"] * len(pg_col_names))
        col_quoted = ", ".join(f'"{c}"' for c in pg_col_names)
        insert_sql = (
            f'INSERT INTO "{table_name}" ({col_quoted}) '
            f'VALUES ({placeholders}) '
            f'ON CONFLICT (entity_id, locale) DO NOTHING'
        )

        rows_out = []
        for row in rows:
            entity_id = row[0]
            if entity_id not in valid_ids:
                continue  # Skip orphaned translations
            values = [entity_id, locale]
            for val, col_def in zip(row[1:], cols_for_locale):
                val = fix_mislabeled_text(val, src_table)
                val = coerce_value(val, col_def["pg_type"])
                values.append(val)
            rows_out.append(values)

        psycopg2.extras.execute_batch(pg_cur, insert_sql, rows_out, page_size=500)
        total += len(rows_out)

    return total


def reset_sequence(pg_cur, table_name):
    pg_cur.execute(
        f'SELECT setval(pg_get_serial_sequence(%s, \'id\'), '
        f'COALESCE((SELECT MAX(id) FROM "{table_name}"), 1))',
        (table_name,),
    )


def main():
    manifest = load_manifest(config.MANIFEST_PATH)

    pg_cnx = psycopg2.connect(**config.POSTGRES)
    pg_cnx.autocommit = False
    pg_cur = pg_cnx.cursor()

    base_tables_raw = [t for t, i in manifest.items() if not i["is_translation"]]
    translation_tables = [t for t, i in manifest.items() if i["is_translation"]]

    # Bo qua cac bang khong co cot "id" (vd cic_products_categories_rel) -
    # sinh ra bang cach parse CSV, khong the copy 1-1 bang luong chung.
    no_pk_tables = [t for t in base_tables_raw if manifest[t].get("no_pk")]
    base_tables = [t for t in base_tables_raw if t not in no_pk_tables]
    for t in no_pk_tables:
        log.warning(
            "BO QUA bang %s: khong co cot 'id', can ETL rieng (vd parse CSV "
            "tu products.category_id) - xem README.", t
        )

    # Sap xep lai thu tu Phase A theo FK dependency thuc te (khong dung
    # nguyen thu tu xuat hien trong file schema, vi 6 bang co FK duoc gan
    # qua ALTER TABLE o CUOI schema, tro toi bang duoc CREATE TABLE SAU no).
    base_tables = toposort_base_tables(manifest, base_tables)

    report = {}
    for t in no_pk_tables:
        report[t] = "SKIPPED_NO_PK"

    # --- Phase A: bang thuong truoc (translations co REFERENCES ve bang nay) ---
    for table_name in base_tables:
        info = manifest[table_name]
        my_cnx = mysql_connect(info["source_table"])
        try:
            n = migrate_base_table(pg_cur, my_cnx, pg_cnx, table_name, info, manifest)
            reset_sequence(pg_cur, table_name)
            pg_cnx.commit()
            report[table_name] = n
            log.info("OK  %-35s %6d dong", table_name, n)
        except Exception:
            pg_cnx.rollback()
            log.exception("LOI khi migrate bang %s", table_name)
            report[table_name] = "ERROR"
        finally:
            my_cnx.close()

    # --- Phase B: bang *_translations ---
    for table_name in translation_tables:
        info = manifest[table_name]
        my_cnx = mysql_connect(info["source_table"])
        try:
            n = migrate_translation_table(pg_cur, my_cnx, table_name, info)
            pg_cnx.commit()
            report[table_name] = n
            log.info("OK  %-35s %6d dong", table_name, n)
        except Exception:
            pg_cnx.rollback()
            log.exception("LOI khi migrate bang %s", table_name)
            report[table_name] = "ERROR"
        finally:
            my_cnx.close()

    pg_cur.close()
    pg_cnx.close()

    log.info("=" * 60)
    log.info("XONG. Tong so bang: %d", len(report))
    errors = [t for t, v in report.items() if v == "ERROR"]
    if errors:
        log.warning("Cac bang LOI can kiem tra lai: %s", errors)
    if no_pk_tables:
        log.warning("Cac bang bi BO QUA (can ETL rieng): %s", no_pk_tables)
    with open("migration_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    sys.exit(main())
