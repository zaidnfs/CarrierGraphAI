"""
Views for accounts app.
Provides endpoints for registration, login, logout, token refresh, and user profile.
"""
from rest_framework import status
from rest_framework.generics import GenericAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import User
from .serializers import (
    CustomTokenObtainPairSerializer,
    LogoutSerializer,
    RegisterSerializer,
    UserSerializer,
)


class RegisterView(GenericAPIView):
    """
    Register a new user account.
    Returns access & refresh tokens along with user details upon successful registration.
    """
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens for immediate authentication
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "User registered successfully.",
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    """
    Authenticate user with email and password.
    Returns JWT access and refresh tokens plus user profile.
    """
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    """
    Refresh an expired access token using a valid refresh token.
    """
    permission_classes = [AllowAny]


class LogoutView(GenericAPIView):
    """
    Log out the user by blacklisting their refresh token.
    Requires authentication.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = LogoutSerializer

    def post(self, request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Successfully logged out. Refresh token blacklisted."},
            status=status.HTTP_200_OK,
        )


class UserProfileView(RetrieveUpdateAPIView):
    """
    Retrieve or update profile details for the currently authenticated user.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self) -> User:
        return self.request.user
