"""
URL routes for accounts authentication and user profile.
"""
from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    CustomTokenRefreshView,
    LogoutView,
    UserProfileView,
)

app_name = "accounts"

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="token-refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", UserProfileView.as_view(), name="user-profile"),
]
