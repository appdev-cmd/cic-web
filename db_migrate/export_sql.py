#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Export data from MySQL to SQL INSERT statements for manual PostgreSQL import.

This script reads data from MySQL and generates SQL INSERT statements
that can be manually imported into PostgreSQL. It handles:
- Preserving original IDs with OVERRIDING SYSTEM VALUE
- Converting 0 to NULL for FK columns
- Handling self-reference columns (parent_id, etc.)
- Latin1-mislabeled UTF-8 data
- Topological sort based on FK dependencies

Output: export_data.sql file containing all INSERT statements.
"""

import json
import sys
import logging
from datetime import datetime

import mysql.connector

import config

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger("export_sql")

LATIN1_MISLABELED_TABLES = {
    "fs_application", "fs_application_en", "fs_email", "fs_email_en",
    "fs_khuvuc", "fs_khuvuc_en", "fs_languages", "fs_languages_contents",
    "fs_manufactories", "fs_manufactories_en", "fs_manufactories_en_bk",
    "fs_menus_groups", "fs_menus_groups_en", "fs_products_fields_groups",
    "fs_products_images", "fs_products_images_en", "fs_products_tables",
    "fs_products_tables_en", "fs_products_types", "fs_products_types_en",
    "fs_types_email", "fs_types_email_en",
}

EXCLUDED_TABLES = {
    "fs_menus_items_en_bk", "fs_contents_en-bk", "fs_news_18052020",
    "fs_news_categories_copy1", "fs_news_en1", "fs_products_copy1",
    "fs_products_en_", "fs_manufactories_en_bk", "fs_banners_en_",
    "fs_image_en_", "fs_image_images_en_",
}

# ============================================================
# CO CHE "STUB" CHO FK MO COI THAT (parent da bi xoa)
# ============================================================
# CHI danh cho cac quan he da duoc xac nhan bang check_fk_integrity.py
# la mo coi that (khoang gia tri con nam trong khoang ID cua bang cha)
# - KHONG dung cho cac FK sai he ID (vd cic_wards.city_id da duoc go
#   FK khoi manifest/schema, khong nam trong danh sach nay).
#
# ============================================================
# BANG ANH XA TUONG MINH CHO CAC TRUONG HOP HEURISTIC DOAN TEN COT SAI
# ============================================================
# Heuristic mac dinh doan ten cot FK bang cach ghep <dep_table_khong_prefix>_id
# (vd: cic_news_categories -> "news_categories_id"). Nhung nhieu bang trong
# thuc te dat ten cot FK ngan gon hon ("category_id", "group_id", "module_id"...)
# khong theo pattern do. Duoc xac nhan bang cach doi chieu truc tiep voi
# manifest.json (xem cot "columns" cua tung bang). Neu khong co trong day,
# fallback ve heuristic doan ten nhu cu.
#
# key: (child_table, dep_table) -> list cac ten cot FK thuc su trong child_table
FK_COLUMN_OVERRIDES = {
    ("cic_news", "cic_news_categories"): ["category_id"],
    ("cic_news_en", "cic_news_categories_en"): ["category_id"],
    ("cic_contents", "cic_contents_categories"): ["category_id"],
    ("cic_contents_en", "cic_contents_categories_en"): ["category_id"],
    ("cic_banners", "cic_banners_categories"): ["category_id"],
    ("cic_banners_en", "cic_banners_categories_en"): ["category_id"],
    ("cic_slideshow", "cic_slideshow_categories"): ["category_id"],
    ("cic_slideshow_en", "cic_slideshow_categories_en"): ["category_id"],
    ("cic_menus_items", "cic_menus_groups"): ["group_id"],
    ("cic_menus_items_en", "cic_menus_groups_en"): ["group_id"],
    ("cic_extends_items", "cic_extends_groups"): ["group_id"],
    ("cic_products_tables", "cic_products_fields_groups"): ["group_id"],
    ("cic_products_tables_en", "cic_products_fields_groups"): ["group_id"],
    ("cic_products_en", "cic_cities_en"): ["city_id"],
    ("cic_products_en", "cic_products_types_en"): ["types_id"],
    ("cic_products_images_en", "cic_products_en"): ["record_id"],
    ("cic_image_en", "cic_cities_en"): ["city_id"],
    ("cic_image_images_en", "cic_image_en"): ["record_id"],
    ("cic_blocks", "cic_config_modules"): ["module_id"],
}

# key: (child_table, fk_column) -> value: dep_table can tao stub
STUB_TARGETS = {
    ("cic_order_items", "product_id"): "cic_products",
    ("cic_users_permission", "user_id"): "cic_users",
    ("cic_users_permission", "task_id"): "cic_permission_tasks",
    ("cic_users_permission_field", "user_id"): "cic_users",
    ("cic_users_permission_fun", "user_id"): "cic_users",
    ("cic_products_images", "record_id"): "cic_products",
    ("cic_products_images_en", "record_id"): "cic_products_en",
    ("cic_product_contact", "products_id"): "cic_products",
    ("cic_image_images", "record_id"): "cic_image",
    ("cic_image_images_en", "record_id"): "cic_image_en",
    ("cic_menus_items_en", "group_id"): "cic_menus_groups_en",
}

# Cot duoc uu tien dien nhan "Du lieu da bi xoa" de de nhan biet trong UI/admin
LABEL_COL_CANDIDATES = [
    "name", "title", "fullname", "alias", "recipients_name", "content"
]

STUB_TYPE_DEFAULTS = {
    "integer": "0",
    "numeric": "0",
    "boolean": "FALSE",
    "timestamptz": "'1970-01-01 00:00:00'",
    "varchar": "''",
}


def generate_stub_rows(sql_file, dep_table, missing_ids, manifest, valid_ids):
    """Tao cac dong INSERT placeholder cho ID mo coi (cha da bi xoa),
    de giu lai du lieu con thay vi skip ca dong."""
    info = manifest.get(dep_table)
    if not info or not missing_ids:
        return 0

    cols = [c for c in info["columns"] if not c.get("synthetic")]
    label_col = next((c for c in cols if c["col"] in LABEL_COL_CANDIDATES), None)
    
    # Get FK column names for this table
    depends_on = info.get("depends_on", [])
    fk_col_names = set()
    for dep in depends_on:
        dep_short = dep.replace("cic_", "")
        possible_cols = [f"{dep_short}_id", f"{dep_short}"]
        if dep_short.endswith('s'):
            possible_cols.append(f"{dep_short[:-1]}_id")
            possible_cols.append(dep_short[:-1])
        possible_cols.append(f"{dep_short}s_id")
        # Special cases
        if dep == "cic_products":
            possible_cols.extend(["products_id", "record_id"])
        if dep == "cic_products_types":
            possible_cols.append("types_id")
        if dep == "cic_order":
            possible_cols.append("order_id")
        if dep == "cic_users":
            possible_cols.extend(["user_id", "author_id", "author_last_id"])
        if dep == "cic_cities":
            possible_cols.append("city_id")
        if dep == "cic_permission_tasks":
            possible_cols.append("task_id")
        if dep == "cic_image":
            possible_cols.append("record_id")
        if dep == "cic_news":
            possible_cols.extend(["author_id", "author_last_id"])
        # Special case for tables that use record_id as FK to cic_image
        if dep_table in ("cic_image_images", "cic_products_images") and dep == "cic_image":
            possible_cols.append("record_id")
        # Explicit overrides for known heuristic misses (see FK_COLUMN_OVERRIDES)
        possible_cols.extend(FK_COLUMN_OVERRIDES.get((dep_table, dep), []))
        fk_col_names.update(possible_cols)

    pg_col_names = ["id"] + [c["col"] for c in cols]
    col_quoted = ", ".join(f'"{c}"' for c in pg_col_names)

    rows = []
    for mid in sorted(missing_ids):
        values = [str(mid)]
        for c in cols:
            if label_col is not None and c is label_col:
                label = f"[Du lieu da bi xoa - ID goc: {mid}]"
                escaped = label.replace("\\", "\\\\").replace("'", "''")
                values.append(f"'{escaped}'")
            else:
                # FK columns should be NULL to avoid FK violations
                if c["col"] in fk_col_names:
                    values.append("NULL")
                # Use empty string for varchar NOT NULL columns
                elif c["pg_type"] == "varchar":
                    values.append("''")
                else:
                    values.append(STUB_TYPE_DEFAULTS.get(c["pg_type"], "NULL"))
        rows.append(f"  ({', '.join(values)})")

    if rows:
        sql_file.write(f"-- STUB rows for {dep_table} (placeholder cho FK mo coi da xac nhan)\n")
        sql_file.write(f'INSERT INTO "{dep_table}" ({col_quoted}) OVERRIDING SYSTEM VALUE VALUES\n')
        sql_file.write(",\n".join(rows))
        sql_file.write("\nON CONFLICT DO NOTHING;\n\n")
        
        # Update valid_ids immediately after stub generation
        if dep_table not in valid_ids:
            valid_ids[dep_table] = set()
        valid_ids[dep_table].update(missing_ids)

    return len(rows)


def load_manifest(path="manifest.json"):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def toposort_base_tables(manifest, base_tables):
    """Sort base tables by FK dependency using Kahn's algorithm."""
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
        ready = sorted(
            (t for t in remaining if remaining_deps[t] <= placed),
            key=lambda t: order_index[t],
        )
        if not ready:
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
    """Open MySQL connection with correct charset."""
    if source_table in LATIN1_MISLABELED_TABLES:
        cnx = mysql.connector.connect(
            charset="latin1", use_unicode=True, **config.MYSQL
        )
    else:
        cnx = mysql.connector.connect(
            charset="utf8mb4", use_unicode=True, **config.MYSQL
        )
    return cnx


def fix_mislabeled_text(value, source_table):
    """Fix latin1-mislabeled UTF-8 data."""
    if value is None or source_table not in LATIN1_MISLABELED_TABLES:
        return value
    if not isinstance(value, str):
        return value
    try:
        return value.encode("latin1").decode("utf-8")
    except (UnicodeDecodeError, UnicodeEncodeError):
        return value


def quote_pg_text(value):
    """Quote arbitrary legacy text safely for PostgreSQL.

    Rich Text legacy can contain newlines, quotes and Windows paths ending in
    backslashes. Dollar quoting avoids interactions between those characters
    and PostgreSQL string parsing. Pick a tag that is absent from the payload.
    """
    value = str(value).replace("\x00", "")
    suffix = ""
    while True:
        tag = f"$etl{suffix}$"
        if tag not in value:
            return f"{tag}{value}{tag}"
        suffix = "1" if suffix == "" else str(int(suffix) + 1)


def coerce_value(value, pg_type, col_name=None, table_name=None):
    """Convert Python value to PostgreSQL-compatible format."""
    if value is None:
        return "NULL"
    if pg_type == "boolean":
        return "TRUE" if bool(int(value)) else "FALSE"
    if pg_type == "numeric":
        try:
            return str(float(value))
        except (TypeError, ValueError):
            return "NULL"
    if pg_type in ("timestamptz",):
        if isinstance(value, datetime):
            return f"'{value.isoformat()}'"
        return f"'{value}'"
    if pg_type == "integer":
        int_val = int(value)
        # Convert 0 to NULL for known FK columns
        if int_val == 0 and col_name and table_name:
            # Known FK columns that should be NULL when 0
            fk_columns = [
                ("cic_products", "types_id"),
                ("cic_products", "user_id"),
                ("cic_news", "author_id"),
                ("cic_news", "author_last_id"),
                ("cic_news", "categories_id"),
                ("cic_cities", "area_id"),
                ("cic_image_images", "record_id"),
                ("cic_products_images", "record_id"),
                ("cic_order_items", "product_id"),
                ("cic_order_items", "order_id"),
            ]
            if (table_name, col_name) in fk_columns:
                return "NULL"
        # Convert any integer FK column with value 0 to NULL
        # This handles cases where the FK column name ends with _id
        if int_val == 0 and col_name and col_name.endswith("_id"):
            return "NULL"
        # Convert special FK columns to NULL if they're 0
        if int_val == 0 and col_name in ("record_id", "author_last_id", "author_id", "types_id"):
            log.info("Converting %s.%s=0 to NULL", table_name, col_name)
            return "NULL"
        return str(int_val)
    if pg_type in ("varchar", "text"):
        # Ensure value is string, escape backslashes first, then single quotes
        if value is None or value == "":
            # Handle NOT NULL constraints with default values
            if col_name and table_name:
                # Specific defaults for known NOT NULL columns
                if table_name == "cic_tables" and col_name == "field_alias":
                    return "''"
                if table_name == "cic_tables" and col_name == "field_type":
                    return "''"
                if table_name == "cic_order" and col_name == "recipients_name":
                    return "''"
                if table_name == "cic_order" and col_name == "cancel_people":
                    return "''"
                if table_name == "cic_order" and col_name == "cancel_money_penalty":
                    return "''"
                if table_name == "cic_order" and col_name == "cancel_username_penalty":
                    return "''"
                if table_name == "cic_order" and col_name == "cancel_money_compensation":
                    return "''"
                if table_name == "cic_order" and col_name == "cancel_username_compensation":
                    return "''"
                if table_name == "cic_onlinesupport" and col_name == "email":
                    return "''"
                if table_name == "cic_wards" and col_name == "location":
                    return "''"
                if table_name == "cic_wards" and col_name == "type":
                    return "''"
                if table_name == "cic_product_contact" and col_name == "email":
                    return "''"
                if table_name in ("cic_contact", "cic_contact_en") and col_name == "email":
                    return "''"
            return "NULL"
        value_str = str(value)
        # Truncate varchar(255) fields to avoid length violations
        if pg_type == "varchar" and len(value_str) > 255:
            original_len = len(value_str)
            value_str = value_str[:255]
            log.warning(
                "Truncated value for %s.%s from %d to 255 chars",
                table_name, col_name, original_len
            )
        return quote_pg_text(value_str)
    
    # Handle numeric types that might be too long for varchar columns
    if pg_type == "numeric":
        try:
            num_str = str(float(value))
            # If this is actually being used for a varchar column, truncate it
            if len(num_str) > 255:
                num_str = num_str[:255]
                log.warning(
                    "Truncated numeric value for %s.%s from %d to 255 chars",
                    table_name, col_name, len(str(value))
                )
            return num_str
        except (TypeError, ValueError):
            return "NULL"
    
    return str(value)


def escape_sql_value(value):
    """Escape SQL string values."""
    if value is None:
        return "NULL"
    if isinstance(value, str):
        return quote_pg_text(value)
    return str(value)


def export_base_table(sql_file, table_name, info, self_ref_cols, depends_on, valid_ids, manifest, fk_stats):
    """Export a base table to SQL INSERT statements."""
    source_table = info["source_table"]
    if not source_table:
        log.warning("Bo qua bang %s: khong xac dinh duoc bang nguon", table_name)
        return 0
    if source_table in EXCLUDED_TABLES:
        return 0

    data_cols = [c for c in info["columns"] if not c.get("synthetic")]
    
    # Filter out columns that don't exist in MySQL
    my_cnx = mysql_connect(source_table)
    my_cur = my_cnx.cursor()
    
    valid_data_cols = []
    valid_my_col_names = []
    
    for col_def in data_cols:
        my_col = col_def["sources"][0]["col"]
        try:
            my_cur.execute(f"SELECT `{my_col}` FROM `{source_table}` LIMIT 1")
            my_cur.fetchall()
            valid_data_cols.append(col_def)
            valid_my_col_names.append(my_col)
        except mysql.connector.Error as e:
            if getattr(e, "errno", None) == 1054:
                log.warning(
                    "Bang %s: cot '%s' khai trong manifest nhung KHONG "
                    "ton tai o bang MySQL '%s' - bo qua cot nay.",
                    table_name, my_col, source_table,
                )
            else:
                raise
    
    my_col_names = valid_my_col_names
    data_cols = valid_data_cols
    
    col_list_sql = ", ".join(f"`{c}`" for c in ["id"] + my_col_names)
    my_cur.execute(f"SELECT {col_list_sql} FROM `{source_table}`")

    pg_col_names = ["id"] + [c["col"] for c in data_cols]
    col_quoted = ", ".join(f'"{c}"' for c in pg_col_names)

    rows = []
    self_ref_updates = []
    exported_ids = set()
    skipped_rows = 0
    stub_needed = {}  # dep_table -> set(missing_ids), chi cho FK trong STUB_TARGETS
    
    # Track FK statistics: (table_name, col_name, dep_table) -> {"total": set(), "matched": set(), "stub": set()}
    fk_tracking = {}

    for row in my_cur:
        row = list(row)
        row_id = row[0]
        row_dict = {"id": str(row_id)}

        for val, col_def in zip(row[1:], data_cols):
            val = fix_mislabeled_text(val, source_table)
            val = coerce_value(val, col_def["pg_type"], col_def["col"], table_name)
            if val == "NULL" and col_def["pg_type"] == "timestamptz":
                val = "'1970-01-01 00:00:00'"
            row_dict[col_def["col"]] = val

        # Convert 0 to NULL for FK columns
        for col in self_ref_cols:
            if row_dict.get(col) == "0":
                row_dict[col] = "NULL"
            # Validate self-referencing FKs
            elif row_dict.get(col) != "NULL":
                try:
                    fk_val = int(row_dict[col])
                    if table_name in valid_ids and fk_val not in valid_ids[table_name]:
                        log.warning(
                            "Invalid self-ref FK in %s.%s=%s (ID not found), setting to NULL",
                            table_name, col, fk_val
                        )
                        row_dict[col] = "NULL"
                except (ValueError, TypeError):
                    pass

        # Skip row if any FK is invalid
        skip_row = False
        for dep_table in depends_on:
            dep_short = dep_table.replace("cic_", "")
            # Try multiple patterns for FK column names
            possible_cols = [f"{dep_short}_id", f"{dep_short}"]
            # Also try singular form if dep_short ends with 's'
            if dep_short.endswith('s'):
                possible_cols.append(f"{dep_short[:-1]}_id")
                possible_cols.append(dep_short[:-1])
            # Also try common patterns
            possible_cols.append(f"{dep_short}s_id")
            # Special cases
            if dep_table == "cic_products":
                possible_cols.extend(["products_id", "record_id"])
            if dep_table == "cic_products_types":
                possible_cols.append("types_id")
            if dep_table == "cic_order":
                possible_cols.append("order_id")
            if dep_table == "cic_users":
                possible_cols.extend(["user_id", "author_id", "author_last_id"])
            if dep_table == "cic_cities":
                possible_cols.append("city_id")
            if dep_table == "cic_permission_tasks":
                possible_cols.append("task_id")
            if dep_table == "cic_image":
                possible_cols.append("record_id")
            if dep_table == "cic_news":
                possible_cols.extend(["author_id", "author_last_id"])
            # Special case for tables that use record_id as FK to cic_image or cic_products
            if table_name in ("cic_image_images", "cic_products_images") and dep_table == "cic_image":
                possible_cols.append("record_id")
            # Direct check for record_id FK to cic_image
            if "record_id" in row_dict and dep_table == "cic_image":
                possible_cols.append("record_id")
            # Explicit overrides for known heuristic misses (see FK_COLUMN_OVERRIDES)
            possible_cols.extend(FK_COLUMN_OVERRIDES.get((table_name, dep_table), []))
            
            for col in possible_cols:
                if col in row_dict:
                    # Validate FK against valid_ids (only if it's an integer)
                    if row_dict.get(col) != "NULL":
                        try:
                            fk_val = int(row_dict[col])
                            
                            # Track FK statistics
                            fk_key = (table_name, col, dep_table)
                            if fk_key not in fk_tracking:
                                fk_tracking[fk_key] = {"total": set(), "matched": set(), "stub": set()}
                            fk_tracking[fk_key]["total"].add(fk_val)
                            
                            # Debug logging
                            if table_name == "cic_image_images" and col == "record_id":
                                log.debug("Checking FK %s.%s=%s -> %s, dep_table in valid_ids: %s", 
                                          table_name, col, fk_val, dep_table, dep_table in valid_ids)
                            # 0 nghia la "khong chon" -> luon cho NULL,
                            # PHAI kiem tra truoc khi doi chieu voi valid_ids,
                            # vi 0 khong bao gio la mot ID hop le nen se bi
                            # bat nham thanh "FK khong ton tai" neu kiem tra sau.
                            if fk_val == 0:
                                row_dict[col] = "NULL"
                            # Check if FK is valid
                            # Only validate if dep_table is in valid_ids (already exported)
                            # If dep_table not in valid_ids, we can't validate yet - assume it's OK
                            # because it will be exported later in correct order
                            elif dep_table in valid_ids and fk_val not in valid_ids[dep_table]:
                                # Mo coi - giu dong, se tao stub placeholder cho dep_table thay vi skip
                                log.info(
                                    "Orphan FK %s.%s=%s -> %s (se tao stub thay vi skip)",
                                    table_name, col, fk_val, dep_table
                                )
                                stub_needed.setdefault(dep_table, set()).add(fk_val)
                                fk_tracking[fk_key]["stub"].add(fk_val)
                            else:
                                # FK matched
                                fk_tracking[fk_key]["matched"].add(fk_val)
                        except (ValueError, TypeError):
                            # Not an integer, skip validation
                            pass
                # Don't break - check all possible FK columns
            if skip_row:
                break
        
        if skip_row:
            skipped_rows += 1
            continue

        # Handle self-reference columns (defer to UPDATE)
        if self_ref_cols:
            deferred = {c: row_dict[c] for c in self_ref_cols if row_dict.get(c) != "NULL"}
            if deferred:
                self_ref_updates.append((str(row_id), deferred))
                for c in deferred:
                    row_dict[c] = "NULL"

        values = [row_dict[col] for col in pg_col_names]
        values_str = ", ".join(values)
        rows.append(f"  ({values_str})")
        
        # Track exported IDs
        if row_id is not None:
            exported_ids.add(row_id)

    my_cur.close()
    my_cnx.close()

    total_stubbed = 0
    for dep_table, missing_ids in stub_needed.items():
        n_stub = generate_stub_rows(sql_file, dep_table, missing_ids, manifest, valid_ids)
        total_stubbed += n_stub
    if total_stubbed:
        log.info("Da tao %d dong stub (placeholder) cho FK mo coi cua bang %s", total_stubbed, table_name)

    if rows:
        sql_file.write(f"-- Table: {table_name}\n")
        sql_file.write(f"INSERT INTO \"{table_name}\" ({col_quoted}) OVERRIDING SYSTEM VALUE VALUES\n")
        sql_file.write(",\n".join(rows))
        # MySQL/MyISAM goc khong co UNIQUE constraint nao, nen du lieu that co
        # the trung nhau o cac cot gio duoc gan UNIQUE trong Postgres (vd
        # cic_config_en.name). Khong co ON CONFLICT thi 1 dong trung se lam
        # ROLLBACK toan bo cau INSERT nhieu dong nay (mat luon cac dong hop le
        # khac trong cung batch). DO NOTHING = bo qua rieng dong trung, giu
        # lai ban ghi insert dau tien.
        sql_file.write("\nON CONFLICT DO NOTHING;\n\n")

    if self_ref_updates:
        for row_id, deferred in self_ref_updates:
            set_clause = ", ".join(f'"{c}" = {deferred[c]}' for c in sorted(deferred.keys()))
            sql_file.write(f"UPDATE \"{table_name}\" SET {set_clause} WHERE \"id\" = {row_id};\n")
        sql_file.write("\n")
    
    # Update valid_ids with actually exported IDs
    valid_ids[table_name] = exported_ids
    
    if skipped_rows > 0:
        log.info("Skipped %d rows from %s due to invalid FKs", skipped_rows, table_name)
    
    # Update FK statistics
    for fk_key, stats in fk_tracking.items():
        table_name, col_name, dep_table = fk_key
        total = len(stats["total"])
        matched = len(stats["matched"])
        stub = len(stats["stub"])
        coverage = (matched / total * 100) if total > 0 else 0
        fk_stats.append({
            "table": table_name,
            "column": col_name,
            "ref_table": dep_table,
            "total": total,
            "matched": matched,
            "stub": stub,
            "coverage": round(coverage, 1)
        })

    return len(rows)


def export_products_categories_rel(sql_file, valid_product_ids, valid_category_ids,
                                    mysql_table="fs_products", pg_table="cic_products_categories_rel"):
    """Export N-N relationship table from CSV category_id in fs_products (or fs_products_en).

    [FIX Dot 7] Ham nay truoc day hard-code "fs_products" / "cic_products_categories_rel",
    nen ban EN (cic_products_categories_rel_en, cung sinh ra tu Dot 7 khi tach bang trung
    gian theo tung locale) khong bao gio duoc goi -> bi bo qua vinh vien. Them tham so
    mysql_table/pg_table de dung chung cho ca 2 ban VI/EN.
    """
    my_cnx = mysql_connect(mysql_table)
    my_cur = my_cnx.cursor()
    
    # Đọc dữ liệu từ bảng MySQL tương ứng (VI: fs_products, EN: fs_products_en)
    my_cur.execute(f"SELECT id, category_id FROM `{mysql_table}` WHERE category_id IS NOT NULL")
    rows = my_cur.fetchall()
    
    sql_rows = []
    for product_id, category_csv in rows:
        if not category_csv:
            continue
        
        # Skip if product_id is not in valid_product_ids
        if product_id not in valid_product_ids:
            continue
        
        # Parse CSV: ví dụ ",62,63," -> [62, 63]
        category_ids = []
        for part in category_csv.split(','):
            part = part.strip()
            if part and part.isdigit():
                category_ids.append(int(part))
        
        # Tạo các dòng N-N
        for category_id in category_ids:
            # Skip if category_id is not in valid_category_ids
            if category_id not in valid_category_ids:
                log.warning(
                    "Invalid category_id=%s in %s (ID not found in category table), skipping",
                    category_id, pg_table
                )
                continue
            sql_rows.append(f"  ({product_id}, {category_id})")
    
    my_cur.close()
    my_cnx.close()
    
    if sql_rows:
        sql_file.write(f"-- Table: {pg_table} (N-N relationship)\n")
        sql_file.write(f'INSERT INTO "{pg_table}" (product_id, category_id) VALUES\n')
        sql_file.write(",\n".join(sql_rows))
        sql_file.write("\nON CONFLICT DO NOTHING;\n\n")
    
    return len(sql_rows)


def export_translation_table(sql_file, table_name, info, valid_ids, manifest):
    """Export a translation table to SQL INSERT statements."""
    source_table = info["source_table"]
    source_table_en = info.get("source_table_en")
    if not source_table:
        log.warning("Bo qua bang %s: khong xac dinh duoc bang nguon", table_name)
        return 0

    data_cols = [c for c in info["columns"] if not c.get("synthetic")]

    # Get the base table name for FK validation
    depends_on = info.get("depends_on", [])
    base_table = depends_on[0] if depends_on else None
    
    # Collect missing entity_ids for stub generation
    missing_entity_ids = set()

    def fetch_locale_rows(src_table, source_index):
        cols_for_locale = [
            c for c in data_cols if len(c["sources"]) > source_index
        ]
        if not cols_for_locale and data_cols:
            return [], []
        while True:
            my_col_names = [c["sources"][source_index]["col"] for c in cols_for_locale]
            col_list_sql = ", ".join(f"`{c}`" for c in ["id"] + my_col_names)
            my_cnx = mysql_connect(src_table)
            my_cur = my_cnx.cursor()
            try:
                my_cur.execute(f"SELECT {col_list_sql} FROM `{src_table}`")
                rows = list(my_cur)
                my_cur.close()
                my_cnx.close()
                return rows, cols_for_locale
            except mysql.connector.Error as e:
                my_cur.close()
                my_cnx.close()
                if getattr(e, "errno", None) == 1054 and cols_for_locale:
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
                        "ton tai o bang MySQL '%s' - bo qua cot nay.",
                        table_name, bad_col["col"], src_table,
                    )
                    cols_for_locale = [c for c in cols_for_locale if c is not bad_col]
                    if not cols_for_locale:
                        return [], []
                    continue
                raise

    total = 0
    
    # First pass: collect all rows and missing entity_ids
    all_locale_data = []
    
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
        col_quoted = ", ".join(f'"{c}"' for c in pg_col_names)

        sql_rows = []
        for row in rows:
            entity_id = row[0]
            # Validate entity_id against base table
            # If base_table is in valid_ids, check if entity_id exists
            # If base_table is not in valid_ids yet, we need to check MySQL directly
            if base_table:
                if base_table in valid_ids:
                    if entity_id not in valid_ids[base_table]:
                        log.info(
                            "Orphan entity_id=%s in %s referencing %s (se tao stub thay vi skip)",
                            entity_id, table_name, base_table
                        )
                        missing_entity_ids.add(entity_id)
                else:
                    # Base table not exported yet, check MySQL directly
                    base_info = manifest.get(base_table, {})
                    base_source = base_info.get("source_table")
                    if base_source and base_source not in EXCLUDED_TABLES:
                        try:
                            my_cnx = mysql_connect(base_source)
                            my_cur = my_cnx.cursor()
                            my_cur.execute(f"SELECT id FROM `{base_source}` WHERE id = {entity_id}")
                            if not my_cur.fetchone():
                                log.info(
                                    "Orphan entity_id=%s in %s referencing %s (se tao stub thay vi skip)",
                                    entity_id, table_name, base_table
                                )
                                missing_entity_ids.add(entity_id)
                            my_cur.close()
                            my_cnx.close()
                        except Exception:
                            # If we can't check MySQL, assume it's OK and let stub generation handle it
                            log.warning("Could not validate entity_id=%s against %s", entity_id, base_table)
                            missing_entity_ids.add(entity_id)
            values = [str(entity_id), f"'{locale}'"]
            for val, col_def in zip(row[1:], cols_for_locale):
                val = fix_mislabeled_text(val, src_table)
                val = coerce_value(val, col_def["pg_type"], col_def["col"], table_name)
                values.append(val)
            sql_rows.append(f"  ({', '.join(values)})")
        
        all_locale_data.append((locale, col_quoted, sql_rows))

    # Generate stub rows for missing entity_ids BEFORE writing translation data
    # This ensures stubs are available when FK validation happens
    if missing_entity_ids and base_table:
        stub_count = generate_stub_rows(sql_file, base_table, missing_entity_ids, manifest, valid_ids)
        log.info("Generated %d stub rows for %s (orphan translations)", stub_count, base_table)

    # Now write all translation data after stubs are generated
    for locale, col_quoted, sql_rows in all_locale_data:
        if sql_rows:
            sql_file.write(f"-- Table: {table_name} (locale={locale})\n")
            sql_file.write(f"INSERT INTO \"{table_name}\" ({col_quoted}) VALUES\n")
            sql_file.write(",\n".join(sql_rows))
            sql_file.write("\nON CONFLICT DO NOTHING;\n\n")
            total += len(sql_rows)

    return total


def main():
    manifest = load_manifest(config.MANIFEST_PATH)

    base_tables_raw = [t for t, i in manifest.items() if not i["is_translation"]]
    translation_tables = [t for t, i in manifest.items() if i["is_translation"]]

    no_pk_tables = [t for t in base_tables_raw if manifest[t].get("no_pk")]
    base_tables = [t for t in base_tables_raw if t not in no_pk_tables]

    for t in no_pk_tables:
        log.warning("BO QUA bang %s: khong co cot 'id', can ETL rieng", t)

    base_tables = toposort_base_tables(manifest, base_tables)

    output_file = "export_data.sql"
    with open(output_file, "w", encoding="utf-8") as sql_file:
        sql_file.write("-- PostgreSQL Data Export from MySQL\n")
        sql_file.write(f"-- Generated: {datetime.now().isoformat()}\n")
        sql_file.write("-- Run this file in PostgreSQL after creating the schema\n\n")

        report = {}
        for t in no_pk_tables:
            report[t] = "SKIPPED_NO_PK"

        # Collect valid IDs from base tables for FK validation
        valid_ids = {}
        for table_name in base_tables:
            info = manifest[table_name]
            source_table = info["source_table"]
            if not source_table or source_table in EXCLUDED_TABLES:
                continue
            try:
                my_cnx = mysql_connect(source_table)
                my_cur = my_cnx.cursor()
                my_cur.execute(f"SELECT id FROM `{source_table}`")
                valid_ids[table_name] = set(row[0] for row in my_cur)
                my_cur.close()
                my_cnx.close()
            except Exception:
                log.warning("Khong the doc ID tu bang %s", table_name)
                valid_ids[table_name] = set()

        # Export base tables first (to update valid_ids with actually exported IDs)
        fk_stats = []  # Track FK statistics for all tables
        for table_name in base_tables:
            info = manifest[table_name]
            self_ref_cols = set(info.get("self_ref_cols", []))
            depends_on = info.get("depends_on", [])
            try:
                n = export_base_table(sql_file, table_name, info, self_ref_cols, depends_on, valid_ids, manifest, fk_stats)
                report[table_name] = n
                log.info("OK  %-35s %6d dong", table_name, n)
            except Exception:
                log.exception("LOI khi export bang %s", table_name)
                report[table_name] = "ERROR"
        
        # Second pass: validate and fix orphan FKs in base tables
        # This handles cases where parent tables were exported after child tables
        for table_name in base_tables:
            info = manifest[table_name]
            depends_on = info.get("depends_on", [])
            if not depends_on:
                continue
            # Check if this table has any FK columns that might have orphan values
            source_table = info.get("source_table")
            if not source_table or source_table in EXCLUDED_TABLES:
                continue
            try:
                my_cnx = mysql_connect(source_table)
                my_cur = my_cnx.cursor()
                my_cur.execute(f"SELECT * FROM `{source_table}`")
                rows = my_cur.fetchall()
                my_cur.close()
                my_cnx.close()
                
                # Check for orphan FKs and generate UPDATE statements
                for row in rows:
                    row_dict = {}
                    for i, col_def in enumerate(info["columns"]):
                        col_name = col_def["col"]
                        pg_type = col_def["pg_type"]
                        value = row[i]
                        row_dict[col_name] = coerce_value(value, pg_type, col_name, table_name)
                    
                    # Validate FKs
                    for dep_table in depends_on:
                        if dep_table not in valid_ids:
                            continue
                        dep_short = dep_table.replace("cic_", "")
                        possible_cols = [f"{dep_short}_id", f"{dep_short}"]
                        if dep_short.endswith('s'):
                            possible_cols.append(f"{dep_short[:-1]}_id")
                            possible_cols.append(dep_short[:-1])
                        possible_cols.append(f"{dep_short}s_id")
                        # Special cases
                        if dep_table == "cic_image":
                            possible_cols.append("record_id")
                        if dep_table == "cic_users":
                            possible_cols.extend(["user_id", "author_id", "author_last_id"])
                        if table_name in ("cic_image_images", "cic_products_images") and dep_table == "cic_image":
                            possible_cols.append("record_id")
                        if "record_id" in row_dict and dep_table == "cic_image":
                            possible_cols.append("record_id")
                        possible_cols.extend(FK_COLUMN_OVERRIDES.get((table_name, dep_table), []))
                        
                        for col in possible_cols:
                            if col in row_dict and row_dict.get(col) != "NULL":
                                try:
                                    fk_val = int(row_dict[col])
                                    if fk_val not in valid_ids[dep_table]:
                                        # Orphan FK - generate UPDATE to set to NULL
                                        id_val = row_dict.get("id")
                                        if id_val and id_val != "NULL":
                                            sql_file.write(f'UPDATE "{table_name}" SET "{col}" = NULL WHERE id = {id_val};\n')
                                            log.info("Fixed orphan FK %s.%s=%s -> %s by setting to NULL", table_name, col, fk_val, dep_table)
                                except (ValueError, TypeError):
                                    pass
            except Exception:
                log.warning("Could not validate FKs for table %s", table_name)

        # Export N-N relationship table(s) (special case) - AFTER base tables to use updated valid_ids
        # [FIX Dot 7] Truoc day chi export ban VI ("cic_products_categories_rel"). Ban EN
        # ("cic_products_categories_rel_en"), sinh ra tu chinh Dot 7, chua bao gio duoc export
        # va se bi SKIPPED_NO_PK vinh vien neu khong co nhanh nay.
        rel_variants = [
            ("cic_products_categories_rel", "fs_products", "cic_products", "cic_products_categories"),
            ("cic_products_categories_rel_en", "fs_products_en", "cic_products_en", "cic_products_categories_en"),
        ]
        for pg_table, mysql_table, product_key, category_key in rel_variants:
            if pg_table in no_pk_tables:
                try:
                    valid_product_ids = valid_ids.get(product_key, set())
                    valid_category_ids = valid_ids.get(category_key, set())
                    n = export_products_categories_rel(
                        sql_file, valid_product_ids, valid_category_ids,
                        mysql_table=mysql_table, pg_table=pg_table,
                    )
                    report[pg_table] = n
                    log.info("OK  %-35s %6d dong", pg_table, n)
                    no_pk_tables.remove(pg_table)
                except Exception:
                    log.exception("LOI khi export bang %s", pg_table)
                    report[pg_table] = "ERROR"

        # Export translation tables
        for table_name in translation_tables:
            info = manifest[table_name]
            try:
                n = export_translation_table(sql_file, table_name, info, valid_ids, manifest)
                report[table_name] = n
                log.info("OK  %-35s %6d dong", table_name, n)
            except Exception:
                log.exception("LOI khi export bang %s", table_name)
                report[table_name] = "ERROR"

    log.info("=" * 60)
    log.info("XONG. File SQL da duoc xuat: %s", output_file)
    log.info("Tong so bang: %d", len(report))
    errors = [t for t, v in report.items() if v == "ERROR"]
    if errors:
        log.warning("Cac bang LOI: %s", errors)
    if no_pk_tables:
        log.warning("Cac bang bi BO QUA: %s", no_pk_tables)

    with open("export_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=1)
    
    # Print FK statistics
    log.info("=" * 60)
    log.info("THONG KE FOREIGN KEY")
    log.info("=" * 60)
    
    # Group FK stats by table for better readability
    fk_stats_by_table = {}
    for stat in fk_stats:
        table = stat["table"]
        if table not in fk_stats_by_table:
            fk_stats_by_table[table] = []
        fk_stats_by_table[table].append(stat)
    
    for table in sorted(fk_stats_by_table.keys()):
        log.info("Bang: %s", table)
        for stat in fk_stats_by_table[table]:
            log.info("  FK %s.%s -> %s.%s", 
                      stat["table"], stat["column"], 
                      stat["ref_table"], "id")
            log.info("    distinct values: %d", stat["total"])
            log.info("    matched: %d", stat["matched"])
            log.info("    stub: %d", stat["stub"])
            log.info("    coverage: %.1f%%", stat["coverage"])
            
            # Add warning for low coverage
            if stat["coverage"] < 50:
                log.warning("    ⚠️  WARNING: Coverage < 50%% - FK nay co the bi doan sai!")
            elif stat["coverage"] < 80:
                log.warning("    ⚠️  WARNING: Coverage < 80%% - FK nay can kiem tra lai!")
    
    # Save FK statistics to JSON
    with open("fk_statistics.json", "w", encoding="utf-8") as f:
        json.dump(fk_stats, f, ensure_ascii=False, indent=2)
    
    log.info("=" * 60)
    log.info("Thong ke FK da duoc luu vao fk_statistics.json")


if __name__ == "__main__":
    sys.exit(main())
