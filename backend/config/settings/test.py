"""
Test settings for SkillBridge AI.
Uses an in-memory SQLite database and eager Celery execution for fast, isolated tests.
"""
from .base import *  # noqa: F403

DEBUG = False

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

# Fast password hasher for tests
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]

# Run Celery tasks synchronously in tests
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

# In-memory email backend
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
