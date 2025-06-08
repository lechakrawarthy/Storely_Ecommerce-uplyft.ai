#!/usr/bin/env python3
"""
Enhanced User Database Viewer 
Shows all users in the database with details
"""

import os
import sys
import json
import pickle
import textwrap
from datetime import datetime

# Check if the database file exists
DB_FILE = "users_db.pickle"
if not os.path.exists(DB_FILE):
    print(f"Error: Database file '{DB_FILE}' not found!")
    sys.exit(1)

# Set up colors for terminal output


class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'


def print_header(text):
    """Print a formatted header"""
    width = min(80, os.get_terminal_size().columns) - 10
    print('\n' + '=' * width)
    print(f"{Colors.BOLD}{Colors.BLUE}{text}{Colors.END}")
    print('=' * width)


def print_user(email, user_data, index=None):
    """Print user information in a formatted way"""
    prefix = f"USER {index}: " if index is not None else "USER: "

    # Format created_at date
    created_at = user_data.get('created_at', 'Unknown')
    last_login = user_data.get('last_login', 'Never logged in')

    print(f"\n{Colors.BOLD}{Colors.PURPLE}{prefix}{email}{Colors.END}")
    print(f"{Colors.CYAN}{'=' * len(prefix)}{email.replace('@', '=')}{'=' * 5}{Colors.END}")
    print(f"  {Colors.BOLD}ID:{Colors.END}          {user_data.get('id', 'N/A')}")
    print(f"  {Colors.BOLD}Name:{Colors.END}        {user_data.get('name', 'N/A')}")
    print(f"  {Colors.BOLD}Created:{Colors.END}     {created_at}")
    print(f"  {Colors.BOLD}Last login:{Colors.END}  {last_login}")
    print(f"  {Colors.BOLD}Status:{Colors.END}      {'Active' if user_data.get('is_active', False) else 'Inactive'}")

    # Show password hash (first 5 chars only)
    hash_value = user_data.get('password_hash', 'N/A')
    if len(hash_value) > 10:
        hash_value = f"{hash_value[:5]}...{hash_value[-5:]}"
    print(f"  {Colors.BOLD}Password:{Colors.END}    {hash_value}")

    # Show other fields if present
    other_fields = [k for k in user_data.keys() if k not in [
        'id', 'name', 'email', 'password_hash', 'created_at', 'last_login', 'is_active']]
    if other_fields:
        print(f"  {Colors.BOLD}Other info:{Colors.END}")
        for field in other_fields:
            value = str(user_data[field])
            if len(value) > 50:
                value = f"{value[:47]}..."
            print(f"    - {field}: {value}")


def main():
    print_header("USER DATABASE CONTENTS")

    try:
        # Load the database
        with open(DB_FILE, 'rb') as f:
            users_db = pickle.load(f)

        if not users_db:
            print(f"{Colors.RED}Database is empty! No users found.{Colors.END}")
            return

        # Print summary
        print(
            f"Found {Colors.BOLD}{len(users_db)}{Colors.END} users in the database.\n")
        print(f"{Colors.GREEN}Last modified:{Colors.END} {datetime.fromtimestamp(os.path.getmtime(DB_FILE))}\n")

        # Print each user
        for i, (email, user_data) in enumerate(users_db.items(), 1):
            print_user(email, user_data, i)

            # Add separator between users
            if i < len(users_db):
                print(f"\n{Colors.YELLOW}{'-' * 50}{Colors.END}")

        # Print instructions for adding users
        print(f"\n{Colors.GREEN}To add more users:{Colors.END}")
        print("1. Visit http://localhost:8080/signup")
        print("2. Create an account with your desired credentials")
        print("3. Verify the account was added in the database")

    except Exception as e:
        print(f"{Colors.RED}Error reading database: {str(e)}{Colors.END}")
        sys.exit(1)


if __name__ == "__main__":
    main()
