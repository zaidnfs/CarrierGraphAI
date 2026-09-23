"""
Pytest configuration and shared fixtures for SkillBridge AI tests.
"""
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


@pytest.fixture
def api_client():
    """Return an unauthenticated DRF APIClient."""
    return APIClient()


@pytest.fixture
def default_password():
    return "SkillBridge2026!Secure"


@pytest.fixture
def user_data(default_password):
    """Sample registration/user payload."""
    return {
        "email": "student@example.com",
        "first_name": "Zaid",
        "last_name": "Alam",
        "password": default_password,
        "password_confirm": default_password,
    }


@pytest.fixture
def create_user(db, default_password):
    """Factory fixture for creating users."""
    def _create_user(
        email="testuser@example.com",
        password=default_password,
        first_name="Test",
        last_name="User",
        **extra_fields
    ):
        return User.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )
    return _create_user


@pytest.fixture
def test_user(create_user):
    """A standard test user."""
    return create_user()


@pytest.fixture
def auth_client(api_client, test_user):
    """Return a DRF APIClient authenticated with JWT Bearer token for test_user."""
    refresh = RefreshToken.for_user(test_user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}")
    return api_client
