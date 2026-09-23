"""
Custom User model for SkillBridge AI.
"""
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from .managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model where email is the unique identifier.
    Includes first and last name, timestamps, and staff/active flags.
    """
    email = models.EmailField(
        verbose_name="email address",
        unique=True,
        max_length=255,
        db_index=True,
    )
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)

    is_active = models.BooleanField(
        default=True,
        help_text="Designates whether this user should be treated as active.",
    )
    is_staff = models.BooleanField(
        default=False,
        help_text="Designates whether the user can log into this admin site.",
    )

    date_joined = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.email

    @property
    def full_name(self) -> str:
        """Return user's full name or email if empty."""
        name = f"{self.first_name} {self.last_name}".strip()
        return name if name else self.email

    def get_full_name(self) -> str:
        return self.full_name

    def get_short_name(self) -> str:
        return self.first_name if self.first_name else self.email.split("@")[0]
