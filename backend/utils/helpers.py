"""
Shared helper functions and utilities for SkillBridge AI.
"""
from typing import Any, Dict


def format_api_response(
    success: bool,
    data: Any = None,
    message: str = "",
    errors: Any = None,
) -> Dict[str, Any]:
    """
    Standardize API responses across endpoints.
    """
    return {
        "success": success,
        "message": message,
        "data": data,
        "errors": errors,
    }
