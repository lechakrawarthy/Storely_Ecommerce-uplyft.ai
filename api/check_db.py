import sqlite3
import os


def check_database(db_name):
    if os.path.exists(db_name):
        conn = sqlite3.connect(db_name)
        cur = conn.cursor()
        cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cur.fetchall()
        print(f"{db_name} tables: {tables}")

        if tables:
            for table in tables:
                table_name = table[0]
                cur.execute(f"SELECT COUNT(*) FROM {table_name}")
                count = cur.fetchone()[0]
                print(f"  {table_name}: {count} rows")
        conn.close()
    else:
        print(f"{db_name} does not exist")


print("Checking databases:")
check_database("store.db")
check_database("bookbuddy.db")
