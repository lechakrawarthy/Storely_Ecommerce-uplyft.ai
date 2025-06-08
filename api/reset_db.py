#!/usr/bin/env python3
"""
Reset database script - drops all tables and recreates them with the updated schema
"""

import os
import sys
from models import Base, engine, SessionLocal
from seed import seed_database


def reset_database():
    """Drop all tables and recreate them"""
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)

    print("Creating all tables with updated schema...")
    Base.metadata.create_all(bind=engine)

    print("Seeding database with sample products...")
    seed_database()

    print("Database reset complete!")


if __name__ == "__main__":
    reset_database()
