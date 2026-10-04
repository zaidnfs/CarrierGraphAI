"""
DRF Serializers for the interviews app (TASK-052).
Validates session creation, answer submissions, and serializes question/session state.
"""
from typing import Any
from rest_framework import serializers

from apps.interviews.models import InterviewSession, InterviewQuestion


class CreateSessionSerializer(serializers.Serializer):
    """
    Validates payload to initiate a new AI mock interview session.
    """

    role_title = serializers.CharField(
        max_length=150,
        min_length=2,
        required=True,
        trim_whitespace=True,
        help_text="Target role (e.g. 'Backend Developer', 'Frontend Developer')",
    )
    target_skills = serializers.ListField(
        child=serializers.CharField(max_length=100, trim_whitespace=True),
        required=False,
        default=list,
        help_text="Optional custom or gap skills to focus on during the interview",
    )
    num_questions = serializers.IntegerField(
        min_value=1,
        max_value=5,
        default=3,
        required=False,
        help_text="Number of questions in the interview session (1 to 5)",
    )
    difficulty = serializers.ChoiceField(
        choices=["beginner", "intermediate", "advanced"],
        default="intermediate",
        required=False,
        help_text="Target difficulty tier",
    )


class SubmitAnswerSerializer(serializers.Serializer):
    """
    Validates candidate's submitted answer for an active interview question.
    """

    question_id = serializers.UUIDField(
        required=True,
        help_text="UUID of the question being answered",
    )
    answer = serializers.CharField(
        min_length=10,
        max_length=5000,
        required=True,
        trim_whitespace=True,
        help_text="Candidate's technical response text (min 10 characters)",
    )


class InterviewQuestionPublicSerializer(serializers.ModelSerializer):
    """
    Serializes an interview question.
    Enforces security by concealing expected rubric criteria until the question is answered.
    """

    class Meta:
        model = InterviewQuestion
        fields = [
            "id",
            "order",
            "skill_focus",
            "difficulty",
            "question_text",
            "expected_points",
            "user_answer",
            "answered_at",
            "score",
            "evaluation",
            "created_at",
        ]
        read_only_fields = fields

    def to_representation(self, instance: InterviewQuestion) -> dict[str, Any]:
        data = super().to_representation(instance)
        # Redact expected criteria if not yet answered to prevent answer leakage
        if not instance.answered_at:
            data["expected_points"] = []
        return data


class InterviewSessionDetailSerializer(serializers.ModelSerializer):
    """
    Full session detail serializer with nested questions.
    """

    questions = InterviewQuestionPublicSerializer(many=True, read_only=True)

    class Meta:
        model = InterviewSession
        fields = [
            "id",
            "role_title",
            "target_skills",
            "status",
            "total_questions",
            "current_question_index",
            "overall_score",
            "summary_feedback",
            "questions",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class InterviewSessionListSerializer(serializers.ModelSerializer):
    """
    Lightweight summary serializer for listing candidate's past interview sessions.
    """

    questions_answered = serializers.SerializerMethodField()

    class Meta:
        model = InterviewSession
        fields = [
            "id",
            "role_title",
            "target_skills",
            "status",
            "total_questions",
            "current_question_index",
            "questions_answered",
            "overall_score",
            "summary_feedback",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    def get_questions_answered(self, obj: InterviewSession) -> int:
        return obj.questions.filter(score__isnull=False).count()
