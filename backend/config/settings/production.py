"""
Production settings for SkillBridge AI.
"""
from .base import *  # noqa: F403

DEBUG = False

# Allowed hosts strictly configured
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=[])

# CORS Configuration for production frontend
frontend_url = env("FRONTEND_URL", default=None)
if frontend_url:
    CORS_ALLOWED_ORIGINS = [frontend_url]
CORS_ALLOW_CREDENTIALS = True

# Security Headers & SSL
SECURE_SSL_REDIRECT = env.bool("DJANGO_SECURE_SSL_REDIRECT", default=True)
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
