"""
Development settings for SkillBridge AI.
"""
from .base import *  # noqa: F403

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "[::1]"]

# CORS Configuration for React/Vite development server
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ALLOW_CREDENTIALS = True

# In-memory or console email backend for local development
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
