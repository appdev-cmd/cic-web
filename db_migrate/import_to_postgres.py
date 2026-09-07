#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Import file schema .sql va file data .sql (sinh boi export_sql.py) truc tiep
vao PostgreSQL, dung thong so ket noi tu config.py (doc DB_MIGRATE_POSTGRES_*
trong .env.local).

Vi sao dung `psql` (subprocess) thay vi psycopg2:
- Ca 2 file deu dung dollar-quoting ($etl$...$etl$, $$...$$ trong DO block/
  function), co the chua ky tu ";" ngay trong noi dung du lieu (html/text).
  `psql` la trinh phan tich cu phap SQL client-side DA DUOC KIEM CHUNG xu ly
  dung nhung truong hop nay (da test thu cong o buoc truoc). Tu viet lai
  logic tach cau lenh bang tay (split theo ";") se de vo tinh cat sai giua
  chung du lieu, rat rui ro voi file 51MB nhu export_data.sql.

Kiem soat loi:
1. Kiem tra psql co trong PATH, file schema/data co ton tai va khong rong
   TRUOC khi ket noi DB.
2. Test ket noi (SELECT 1) truoc, that bai thi dung ngay, khong dam vao
   file lon roi moi bao loi ket noi.
3. Chay tung file trong DUY NHAT 1 transaction (`--single-transaction`)
   + `-v ON_ERROR_STOP=1`: bat ky loi SQL nao cung lam ROLLBACK toan bo
   file dang chay (khong de lai trang thai import do dang), va psql thoat
   voi returncode != 0 ngay tai cau lenh loi dau tien.
   (CHI dung script nay cho file schema/data KHONG tu co BEGIN/COMMIT rieng.
   Neu tro vao file da co BEGIN/COMMIT (vd cac file migration 202609xx_*.sql),
   dung co "--no-single-transaction" - xem docstring o run_sql_file.)
4. Sau khi psql chay xong, kiem tra CA returncode LAN quet chuoi
   "ERROR"/"FATAL" trong stdout+stderr - phong truong hop mot so canh bao
   khong lam thay doi exit code nhung van la loi thuc su can bao.
5. Import file DATA chi chay khi import SCHEMA da thanh cong (dung ngay
   giua chung neu schema loi).
6. Ghi toan bo log (co timestamp) ra 1 file rieng cho moi lan chay, de doi
   chieu khi co su co - khong bao gio ghi/in password ra log hay console.

Cach dung:
    python import_to_postgres.py --schema schema.sql --data export_data.sql

    # Chi chay schema, chua co file data (vd luc dev schema):
    python import_to_postgres.py --schema schema.sql --skip-data

    # Chi kiem tra ket noi, khong chay file nao:
    python import_to_postgres.py --schema schema.sql --check-only
"""

import argparse
import logging
import os
import shutil
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

log = logging.getLogger("import_to_postgres")


def setup_logging(log_path: Path) -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        handlers=[
            logging.FileHandler(log_path, encoding="utf-8"),
            logging.StreamHandler(sys.stdout),
        ],
    )


def check_psql_available() -> str:
    psql_path = shutil.which("psql")
    if not psql_path:
        raise RuntimeError(
            "Khong tim thay lenh 'psql' trong PATH. Can cai PostgreSQL "
            "client (vi du: tai PostgreSQL) truoc khi chay "
            "script nay."
        )
    return psql_path


def check_file(path: Path, label: str) -> None:
    if not path.is_file():
        raise RuntimeError(f"Khong tim thay file {label}: {path}")
    if path.stat().st_size == 0:
        raise RuntimeError(f"File {label} rong (0 byte): {path}")
    log.info("File %s: %s (%.2f MB)", label, path, path.stat().st_size / 1024 / 1024)


def build_env(pg: dict) -> dict:
    env = os.environ.copy()
    env["PGPASSWORD"] = pg["password"]  # khong bao gio in ra log/console
    return env


def base_psql_cmd(psql_path: str, pg: dict) -> list:
    return [
        psql_path,
        "-h", pg["host"],
        "-p", str(pg["port"]),
        "-U", pg["user"],
        "-d", pg["dbname"],
        "-v", "ON_ERROR_STOP=1",
    ]


def test_connection(psql_path: str, pg: dict) -> None:
    """Kiem tra ket noi + quyen truy cap DB truoc khi dam vao file lon,
    de bao loi (sai host/port/user/password/database, DB chua ton tai...)
    nhanh va ro rang, thay vi de loi lan trong output cua file 51MB."""
    log.info(
        "Kiem tra ket noi Postgres: host=%s port=%s db=%s user=%s ...",
        pg["host"], pg["port"], pg["dbname"], pg["user"],
    )
    cmd = base_psql_cmd(psql_path, pg) + ["-c", "SELECT 1;"]
    try:
        result = subprocess.run(
            cmd, env=build_env(pg), capture_output=True, text=True,
            encoding="utf-8", errors="replace", timeout=30,
        )
    except subprocess.TimeoutExpired as error:
        raise RuntimeError(
            "Ket noi Postgres qua 30s khong phan hoi (kiem tra host/port/"
            "firewall)."
        ) from error
    except FileNotFoundError as error:
        raise RuntimeError(f"Khong chay duoc psql: {error}") from error

    if result.returncode != 0:
        raise RuntimeError(
            "Khong ket noi duoc Postgres theo config hien tai. "
            f"Chi tiet psql: {result.stderr.strip()}"
        )
    log.info("Ket noi OK.")


def run_sql_file(
    psql_path: str,
    pg: dict,
    sql_file: Path,
    label: str,
    single_transaction: bool = True,
) -> None:
    """Chay 1 file SQL bang psql. Nem RuntimeError va KHONG tra ve gi neu
    that bai - goi noi (main) phai dung lai ngay khi gap loi, khong duoc
    chay tiep sang file ke tiep."""
    log.info("=" * 70)
    log.info(
        "BAT DAU: %s (%s, %.2f MB)%s",
        label, sql_file.name, sql_file.stat().st_size / 1024 / 1024,
        " [single-transaction]" if single_transaction else "",
    )

    cmd = base_psql_cmd(psql_path, pg)
    if single_transaction:
        cmd.append("--single-transaction")
    cmd += ["-f", str(sql_file)]

    started = time.time()
    try:
        result = subprocess.run(
            cmd, env=build_env(pg), capture_output=True, text=True,
            encoding="utf-8", errors="replace",
        )
    except FileNotFoundError as error:
        raise RuntimeError(f"Khong chay duoc psql: {error}") from error
    elapsed = time.time() - started

    # Ghi toan bo output ra log de doi chieu sau nay, kem dong nao la
    # INSERT/UPDATE/NOTICE (thong tin) va dong nao la ERROR/FATAL (loi that).
    combined = (result.stdout or "") + (result.stderr or "")
    error_lines = [
        line for line in combined.splitlines()
        if "ERROR" in line.upper() or "FATAL" in line.upper()
    ]

    if result.stdout:
        for line in result.stdout.splitlines():
            log.info("[psql] %s", line)
    if result.stderr:
        for line in result.stderr.splitlines():
            (log.error if line.upper().find("ERROR") >= 0 or line.upper().find("FATAL") >= 0
             else log.warning)("[psql] %s", line)

    if result.returncode != 0 or error_lines:
        log.error(
            "THAT BAI: %s sau %.1fs (returncode=%s, %d dong loi)",
            label, elapsed, result.returncode, len(error_lines),
        )
        for line in error_lines[:20]:
            log.error("  -> %s", line)
        if len(error_lines) > 20:
            log.error("  ... con %d dong loi khac, xem log day du.", len(error_lines) - 20)
        raise RuntimeError(
            f"{label} that bai (returncode={result.returncode}). "
            f"{'Da ROLLBACK toan bo file nay (single-transaction).' if single_transaction else 'CANH BAO: khong dung single-transaction nen DB co the o trang thai import do dang.'}"
        )

    log.info("OK: %s hoan tat sau %.1fs, khong loi.", label, elapsed)


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--schema", required=True, type=Path, help="Duong dan file schema .sql")
    parser.add_argument("--data", type=Path, help="Duong dan file data .sql")
    parser.add_argument("--skip-data", action="store_true", help="Chi chay schema, bo qua data")
    parser.add_argument(
        "--check-only", action="store_true",
        help="Chi kiem tra file + ket noi DB, KHONG chay SQL nao",
    )
    parser.add_argument(
        "--no-single-transaction", action="store_true",
        help="Tat che do 1-transaction-cho-ca-file (chi dung khi file SQL "
             "da tu co BEGIN/COMMIT rieng, vd file migration)",
    )
    args = parser.parse_args()

    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    log_path = log_dir / f"import_{datetime.now():%Y%m%d_%H%M%S}.log"
    setup_logging(log_path)

    log.info("Log file: %s", log_path.resolve())

    # QUAN TRONG: import config O DAY (trong try/except cua main), KHONG import
    # o dau file. config.py doc CA MYSQL lan POSTGRES ngay luc MODULE duoc
    # import (khong phai luc goi ham), nen neu import o top-level, thieu bien
    # .env.local se lam crash TOAN BO script bang traceback tho truoc khi kip
    # vao main() - khong con co hoi bat loi gon gang o day nua.
    try:
        import config
        pg = config.POSTGRES
    except RuntimeError as error:
        log.error("LOI CAU HINH (.env.local): %s", error)
        log.error(
            "Luu y: config.py doc ca DB_MIGRATE_MYSQL_* lan "
            "DB_MIGRATE_POSTGRES_*, nen can khai bao du CA HAI nhom bien "
            "trong .env.local du script nay chi dung Postgres."
        )
        return 1
    except ImportError as error:
        log.error(
            "Khong import duoc config.py: %s. Dam bao chay script nay tu "
            "cung thu muc voi config.py (hoac PYTHONPATH tro toi do), va da "
            "cai python-dotenv (pip install python-dotenv).", error,
        )
        return 1

    log.info(
        "Target Postgres: %s:%s/%s (user=%s)",
        pg["host"], pg["port"], pg["dbname"], pg["user"],
    )

    try:
        psql_path = check_psql_available()
        check_file(args.schema, "schema")
        if not args.skip_data and not args.check_only:
            if not args.data:
                raise RuntimeError(
                    "Thieu --data (hoac dung --skip-data neu chi muon chay schema)."
                )
            check_file(args.data, "data")

        test_connection(psql_path, pg)

        if args.check_only:
            log.info("--check-only: da kiem tra xong file + ket noi, khong chay SQL.")
            return 0

        single_txn = not args.no_single_transaction

        run_sql_file(psql_path, pg, args.schema, "SCHEMA", single_transaction=single_txn)

        if args.skip_data:
            log.info("Bo qua buoc import DATA theo yeu cau (--skip-data).")
        else:
            run_sql_file(psql_path, pg, args.data, "DATA", single_transaction=single_txn)

    except RuntimeError as error:
        log.error("DUNG LAI: %s", error)
        return 1
    except Exception:
        log.exception("LOI KHONG XAC DINH (xem traceback o tren)")
        return 1

    log.info("=" * 70)
    log.info("HOAN TAT TOAN BO, khong co loi.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
