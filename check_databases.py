#!/usr/bin/env python3
"""
Database checker script for the e-commerce project
"""
import sqlite3
import os
import pickle


def check_sqlite_db(db_path, db_name):
    """Check SQLite database contents"""
    if os.path.exists(db_path):
        print(f"\n=== {db_name.upper()} ===")
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()

            # Get all tables
            cursor.execute(
                "SELECT name FROM sqlite_master WHERE type='table';")
            tables = cursor.fetchall()

            if tables:
                print(f"Tables found: {len(tables)}")
                for table in tables:
                    table_name = table[0]
                    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                    count = cursor.fetchone()[0]
                    print(f"  - {table_name}: {count} records")

                    # Show sample data for some key tables
                    if table_name in ['users', 'products', 'books'] and count > 0:
                        cursor.execute(f"SELECT * FROM {table_name} LIMIT 3")
                        sample_data = cursor.fetchall()
                        # Just first record
                        print(f"    Sample data: {sample_data[:1]}")
            else:
                print("  No tables found")

            conn.close()
        except Exception as e:
            print(f"  Error reading database: {e}")
    else:
        print(f"\n=== {db_name.upper()} ===")
        print(f"  Database not found at: {db_path}")


def check_pickle_file(pickle_path):
    """Check pickle file contents"""
    if os.path.exists(pickle_path):
        print(f"\n=== USERS_DB.PICKLE ===")
        try:
            with open(pickle_path, 'rb') as f:
                data = pickle.load(f)
                print(f"  Data type: {type(data)}")
                if isinstance(data, dict):
                    print(f"  Keys: {list(data.keys())}")
                    print(f"  Total entries: {len(data)}")
                    # Show sample user (without sensitive data)
                    if data:
                        sample_key = list(data.keys())[0]
                        sample_user = data[sample_key]
                        safe_user = {
                            k: v for k, v in sample_user.items() if k != 'password'}
                        print(f"  Sample user: {safe_user}")
                elif isinstance(data, list):
                    print(f"  List length: {len(data)}")
                    if data:
                        print(f"  Sample item: {data[0]}")
        except Exception as e:
            print(f"  Error reading pickle file: {e}")
    else:
        print(f"\n=== USERS_DB.PICKLE ===")
        print(f"  Pickle file not found")


def main():
    print("🔍 Checking databases in the e-commerce project...")

    # Check SQLite databases
    check_sqlite_db('api/store.db', 'store.db')
    check_sqlite_db('api/bookbuddy.db', 'bookbuddy.db')

    # Check pickle file
    check_pickle_file('users_db.pickle')

    print(f"\n✅ Database check complete!")


if __name__ == "__main__":
    main()
