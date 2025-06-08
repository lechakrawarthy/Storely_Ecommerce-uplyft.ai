import uuid
from datetime import datetime
from models import SessionLocal, User
import sys
import os
sys.path.append('api')


def add_test_user():
    """Add a test user directly to database"""
    db = SessionLocal()
    try:
        # Create a test user
        test_user = User(
            id=str(uuid.uuid4()),
            name="Direct Test User",
            email="directtest@example.com",
            password_hash="test_hash",
            is_email_verified=False,
            created_at=datetime.utcnow()
        )

        db.add(test_user)
        db.commit()
        print(f"✅ Test user created successfully: {test_user.name}")

        # Verify it was added
        all_users = db.query(User).all()
        print(f"Total users now: {len(all_users)}")

        for user in all_users:
            print(f"- {user.name} ({user.email}) - Created: {user.created_at}")

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    add_test_user()
