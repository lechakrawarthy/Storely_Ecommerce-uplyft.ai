#!/usr/bin/env python3
"""
Display the contents of the users_db.pickle file
"""

import pickle
import sys
import json
from datetime import datetime
import os

# Set up pretty printing


class Colors:
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BLUE = "\033[94m"
    PURPLE = "\033[95m"
    BOLD = "\033[1m"
    END = "\033[0m"


def print_header(title):
    print(f"\n{Colors.BOLD}{Colors.BLUE}====== {title} ======{Colors.END}\n")


# Check if the file exists
DB_FILE = "users_db.pickle"

if not os.path.exists(DB_FILE):
    print(f"{Colors.RED}Error: {DB_FILE} not found{Colors.END}")
    sys.exit(1)

# Read the pickle file
try:
    print_header(f"READING DATABASE: {DB_FILE}")
    with open(DB_FILE, 'rb') as f:
        users_db = pickle.load(f)

    print(f"Found {len(users_db)} users in database.\n")

    # Display each user
    for i, (email, user_data) in enumerate(users_db.items(), 1):
        print(f"{Colors.BOLD}{Colors.PURPLE}User {i}: {email}{Colors.END}")

        # Copy the user data to avoid modifying the original
        user_copy = user_data.copy()

        # Replace the password hash with a placeholder for security
        if 'password_hash' in user_copy:
            hash_value = user_copy['password_hash']
            # Show just part of the hash
            user_copy['password_hash'] = f"{hash_value[:5]}...{hash_value[-5:]}"

        # Convert to pretty JSON
        user_json = json.dumps(user_copy, indent=2)
        print(f"{Colors.GREEN}{user_json}{Colors.END}")
        print("-" * 50)

except Exception as e:
    print(f"{Colors.RED}Error reading database: {e}{Colors.END}")
    sys.exit(1)

print(f"\n{Colors.BOLD}✅ Database contents displayed successfully!{Colors.END}")
