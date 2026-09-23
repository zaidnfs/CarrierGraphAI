"""
Serializers for accounts app.
Handles registration, login (JWT), logout (token blacklist), and profile serialization.
"""
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User profile details."""
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "is_active",
            "date_joined",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "email", "full_name", "date_joined", "created_at", "updated_at")


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration with password confirmation and strength validation."""
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        validators=[validate_password],
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = ("email", "first_name", "last_name", "password", "password_confirm")

    def validate_email(self, value: str) -> str:
        """Ensure email is unique and normalized."""
        normalized_email = value.lower().strip()
        if User.objects.filter(email__iexact=normalized_email).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return normalized_email

    def validate(self, attrs: dict) -> dict:
        """Check that password and password_confirm match."""
        if attrs.get("password") != attrs.get("password_confirm"):
            raise serializers.ValidationError({"password_confirm": "Password fields do not match."})
        return attrs

    def create(self, validated_data: dict):
        """Create and return a new User."""
        validated_data.pop("password_confirm")
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT serializer that includes user details in the token response."""

    def validate(self, attrs: dict) -> dict:
        data = super().validate(attrs)
        # Add user profile data to the response payload
        data["user"] = UserSerializer(self.user).data
        return data


class LogoutSerializer(serializers.Serializer):
    """Serializer for logging out and blacklisting a refresh token."""
    refresh = serializers.CharField(required=True)

    def validate(self, attrs: dict) -> dict:
        self.token = attrs.get("refresh")
        return attrs

    def save(self, **kwargs):
        try:
            refresh_token = RefreshToken(self.token)
            refresh_token.blacklist()
        except TokenError as exc:
            raise serializers.ValidationError({"refresh": f"Invalid or expired token: {str(exc)}"})
