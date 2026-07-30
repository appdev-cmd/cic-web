# Sua lai thong tin ket noi that cua ban o day truoc khi chay migrate.py
# KHONG commit file nay len git sau khi dien mat khau that
# (nen doc tu bien moi truong trong thuc te, day chi la ban mau don gian).

MYSQL = {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "123456",
    "database": "cic14005_cic_fs",
}

# POSTGRES = {
#     "host": "aws-1-ap-northeast-2.pooler.supabase.com",
#     "port": 5432,
#     "user": "postgres.iuaiwpvlfjnmskwyaley",
#     "password": "7zw65CWYB8epgiZv",
#     "dbname": "postgres",
# }

# Config localhost PostgreSQL (để test local, tạm comment lại)
POSTGRES = {
    "host": "localhost",
    "port": 5432,
    "user": "postgres",
    "password": "postgres",
    "dbname": "mydb",
}

MANIFEST_PATH = "manifest.json"
