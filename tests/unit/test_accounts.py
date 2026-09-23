"""
Unit tests for accounts authentication and user management (TASK-003, TASK-004, TASK-009).
"""
import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status

User = get_user_model()


@pytest.mark.django_db
class TestUserRegistration:
    """Tests for user signup endpoint /api/auth/register/ (U-01, U-02, U-03)."""

    url = reverse("accounts:register")

    def test_signup_valid(self, api_client, user_data):
        """U-01: Signup with valid email and password returns 201 and JWT tokens."""
        response = api_client.post(self.url, user_data, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert "access" in response.data
        assert "refresh" in response.data
        assert response.data["user"]["email"] == user_data["email"].lower()
        assert response.data["user"]["first_name"] == user_data["first_name"]
        assert response.data["user"]["last_name"] == user_data["last_name"]
        assert User.objects.filter(email=user_data["email"]).exists()

    def test_signup_duplicate_email(self, api_client, create_user, user_data):
        """U-02: Signup with duplicate email returns 400 error."""
        create_user(email=user_data["email"])
        response = api_client.post(self.url, user_data, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data

    def test_signup_weak_password(self, api_client, user_data):
        """U-03: Signup with weak password returns 400 error."""
        user_data["password"] = "123"
        user_data["password_confirm"] = "123"
        response = api_client.post(self.url, user_data, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "password" in response.data

    def test_signup_password_mismatch(self, api_client, user_data):
        """Signup with mismatched password confirmation returns 400 error."""
        user_data["password_confirm"] = "DifferentPassword123!"
        response = api_client.post(self.url, user_data, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "password_confirm" in response.data


@pytest.mark.django_db
class TestUserAuthentication:
    """Tests for user login, refresh, logout, and profile endpoints (U-04 through U-07)."""

    login_url = reverse("accounts:login")
    me_url = reverse("accounts:user-profile")
    refresh_url = reverse("accounts:token-refresh")
    logout_url = reverse("accounts:logout")

    def test_login_valid(self, api_client, create_user, default_password):
        """U-04: Login with valid credentials returns tokens and 200 response."""
        user = create_user(email="loginuser@example.com", password=default_password)
        payload = {"email": user.email, "password": default_password}
        response = api_client.post(self.login_url, payload, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data
        assert "refresh" in response.data
        assert response.data["user"]["email"] == user.email

    def test_login_invalid(self, api_client, create_user):
        """U-05: Login with invalid credentials returns 401 error."""
        create_user(email="loginuser@example.com")
        payload = {"email": "loginuser@example.com", "password": "WrongPassword123!"}
        response = api_client.post(self.login_url, payload, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_access_protected_without_token(self, api_client):
        """U-06: Access protected endpoint without token returns 401 error."""
        response = api_client.get(self.me_url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_access_protected_with_valid_token(self, auth_client, test_user):
        """U-07: Access protected endpoint with valid JWT token returns 200 and user profile."""
        response = auth_client.get(self.me_url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["email"] == test_user.email
        assert response.data["first_name"] == test_user.first_name
        assert response.data["last_name"] == test_user.last_name

    def test_token_refresh(self, api_client, create_user, default_password):
        """Token refresh endpoint returns a new access token."""
        user = create_user(email="refreshuser@example.com", password=default_password)
        login_resp = api_client.post(
            self.login_url,
            {"email": user.email, "password": default_password},
            format="json",
        )
        refresh_token = login_resp.data["refresh"]

        refresh_resp = api_client.post(
            self.refresh_url,
            {"refresh": refresh_token},
            format="json",
        )
        assert refresh_resp.status_code == status.HTTP_200_OK
        assert "access" in refresh_resp.data

    def test_logout_blacklists_refresh_token(self, auth_client, api_client, test_user, default_password):
        """Logout blacklists the refresh token so it cannot be refreshed anymore."""
        login_resp = api_client.post(
            self.login_url,
            {"email": test_user.email, "password": default_password},
            format="json",
        )
        refresh_token = login_resp.data["refresh"]

        # Logout with refresh token
        logout_resp = auth_client.post(
            self.logout_url,
            {"refresh": refresh_token},
            format="json",
        )
        assert logout_resp.status_code == status.HTTP_200_OK

        # Trying to use the blacklisted refresh token must fail
        reuse_resp = api_client.post(
            self.refresh_url,
            {"refresh": refresh_token},
            format="json",
        )
        assert reuse_resp.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestHealthCheck:
    """Test the public health check endpoint."""

    def test_health_check_endpoint(self, api_client):
        url = reverse("health-check")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["status"] == "ok"
