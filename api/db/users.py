"""
User data access layer
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from db.base import User, get_db_session
from models.interfaces import UserRegistrationRequest, UserResponse, AuthenticationError
from models.common import hash_password
import logging

logger = logging.getLogger(__name__)


class UserRepository:
    """User data access operations"""

    def __init__(self, db_session: Session = None):
        self.db = db_session or get_db_session()

    def create_user(self, user_data: UserRegistrationRequest) -> User:
        """Create a new user"""
        try:
            # Check if user already exists
            existing = self.get_user_by_username(user_data.username)
            if existing:
                raise ValueError(
                    f"User with username '{user_data.username}' already exists")

            existing = self.get_user_by_email(user_data.email)
            if existing:
                raise ValueError(
                    f"User with email '{user_data.email}' already exists")

            # Create new user
            user = User(
                username=user_data.username,
                email=user_data.email,
                password_hash=hash_password(user_data.password),
                name=user_data.name,
                phone=user_data.phone
            )

            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)

            logger.info(f"Created user: {user.username}")
            return user

        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating user: {e}")
            raise

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        try:
            user = self.db.query(User).filter(User.id == user_id).first()
            if user:
                logger.info(f"Retrieved user by ID: {user.username}")
            return user

        except Exception as e:
            logger.error(f"Error retrieving user by ID {user_id}: {e}")
            raise

    def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        try:
            user = self.db.query(User).filter(
                User.username == username).first()
            if user:
                logger.info(f"Retrieved user by username: {username}")
            return user

        except Exception as e:
            logger.error(f"Error retrieving user by username {username}: {e}")
            raise

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        try:
            user = self.db.query(User).filter(User.email == email).first()
            if user:
                logger.info(f"Retrieved user by email: {email}")
            return user

        except Exception as e:
            logger.error(f"Error retrieving user by email {email}: {e}")
            raise

    def authenticate_user(self, username: str, password: str) -> Optional[User]:
        """Authenticate user with username/password"""
        try:
            user = self.get_user_by_username(username)
            if not user:
                logger.warning(
                    f"Authentication failed: user not found - {username}")
                return None

            if not user.is_active:
                logger.warning(
                    f"Authentication failed: user inactive - {username}")
                return None

            # Verify password
            hashed_password = hash_password(password)
            if user.password_hash != hashed_password:
                logger.warning(
                    f"Authentication failed: invalid password - {username}")
                return None

            logger.info(f"User authenticated successfully: {username}")
            return user

        except Exception as e:
            logger.error(f"Error authenticating user {username}: {e}")
            raise

    def update_user(self, user_id: int, update_data: dict) -> Optional[User]:
        """Update user information"""
        try:
            user = self.get_user_by_id(user_id)
            if not user:
                return None

            # Update allowed fields
            allowed_fields = ['name', 'phone', 'email']
            for field, value in update_data.items():
                if field in allowed_fields and hasattr(user, field):
                    setattr(user, field, value)

            self.db.commit()
            self.db.refresh(user)

            logger.info(f"Updated user: {user.username}")
            return user

        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating user {user_id}: {e}")
            raise

    def change_password(self, user_id: int, new_password: str) -> bool:
        """Change user password"""
        try:
            user = self.get_user_by_id(user_id)
            if not user:
                return False

            user.password_hash = hash_password(new_password)
            self.db.commit()

            logger.info(f"Password changed for user: {user.username}")
            return True

        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing password for user {user_id}: {e}")
            raise

    def deactivate_user(self, user_id: int) -> bool:
        """Deactivate a user account"""
        try:
            user = self.get_user_by_id(user_id)
            if not user:
                return False

            user.is_active = False
            self.db.commit()

            logger.info(f"Deactivated user: {user.username}")
            return True

        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deactivating user {user_id}: {e}")
            raise

    def get_all_users(self, limit: int = 100, offset: int = 0) -> List[User]:
        """Get all users (admin only)"""
        try:
            users = self.db.query(User).offset(offset).limit(limit).all()
            logger.info(f"Retrieved {len(users)} users")
            return users

        except Exception as e:
            logger.error(f"Error retrieving users: {e}")
            raise

    def get_user_count(self) -> int:
        """Get total number of users"""
        try:
            count = self.db.query(User).count()
            logger.info(f"Total users: {count}")
            return count

        except Exception as e:
            logger.error(f"Error counting users: {e}")
            raise

    def close(self):
        """Close the database session"""
        if self.db:
            self.db.close()

# Convenience functions for single operations


def create_new_user(user_data: UserRegistrationRequest) -> UserResponse:
    """Create a new user and return response format"""
    repo = UserRepository()
    try:
        user = repo.create_user(user_data)
        return UserResponse(**user.to_dict())
    finally:
        repo.close()


def authenticate_user_credentials(username: str, password: str) -> Optional[UserResponse]:
    """Authenticate user and return response format"""
    repo = UserRepository()
    try:
        user = repo.authenticate_user(username, password)
        return UserResponse(**user.to_dict()) if user else None
    finally:
        repo.close()


def get_user_by_id(user_id: int) -> Optional[UserResponse]:
    """Get user by ID in response format"""
    repo = UserRepository()
    try:
        user = repo.get_user_by_id(user_id)
        return UserResponse(**user.to_dict()) if user else None
    finally:
        repo.close()
