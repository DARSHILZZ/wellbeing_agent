from sqlalchemy import Column, Integer, String, Enum
import enum
from app.db.database import Base

class UserRole(str, enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.STUDENT, nullable=False)
