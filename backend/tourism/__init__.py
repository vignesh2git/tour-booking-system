import os

if os.environ.get("USE_MYSQL", "false").lower() in ("1", "true", "yes"):
    import pymysql

    pymysql.install_as_MySQLdb()
