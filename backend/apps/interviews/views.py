"""
API Views for the interviews app (TASK-052).
Enforces strict JWT authentication, user-scoped authorization (IDOR prevention),
and transactionally safe session question generation and evaluation.
"""
from typing import Any
from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.interviews.models import InterviewSession, InterviewQuestion
from apps.interviews.serializers import (
    CreateSessionSerializer,
    SubmitAnswerSerializer,
    InterviewQuestionPublicSerializer,
    InterviewSessionDetailSerializer,
    InterviewSessionListSerializer,
)
from services.interview_service import get_interview_service


class InterviewSessionListCreateView(APIView):
    """
    List user's interview sessions or initiate a new AI mock interview session.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        """
        List all interview sessions owned by the authenticated user.
        """
        sessions = InterviewSession.objects.filter(user=request.user).order_by("-created_at")
        serializer = InterviewSessionListSerializer(sessions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request) -> Response:
        """
        Create a new interview session and generate role-specific questions.
        """
        serializer = CreateSessionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        role_title = serializer.validated_data["role_title"]
        target_skills = serializer.validated_data.get("target_skills", [])
        num_questions = serializer.validated_data.get("num_questions", 3)
        difficulty = serializer.validated_data.get("difficulty", "intermediate")

        svc = get_interview_service()
        # Retrieve high-demand skills for this role from Knowledge Graph
        resolved_skills = svc.get_skills_for_role(role_title, candidate_skills=target_skills, limit=8)

        # Generate structured questions grounded in knowledge graph skills
        generated_questions = svc.generate_questions(
            role_title=role_title,
            target_skills=resolved_skills,
            num_questions=num_questions,
            difficulty=difficulty,
        )

        with transaction.atomic():
            session = InterviewSession.objects.create(
                user=request.user,
                role_title=role_title,
                target_skills=resolved_skills,
                total_questions=len(generated_questions),
                current_question_index=0,
                status="in_progress",
            )

            for q_data in generated_questions:
                InterviewQuestion.objects.create(
                    session=session,
                    order=q_data["order"],
                    skill_focus=q_data.get("skill_focus", ""),
                    difficulty=q_data.get("difficulty", difficulty),
                    question_text=q_data["question_text"],
                    expected_points=q_data.get("expected_points", []),
                )

        detail_serializer = InterviewSessionDetailSerializer(session)
        return Response(detail_serializer.data, status=status.HTTP_201_CREATED)


class InterviewSessionDetailView(APIView):
    """
    Retrieve or delete an individual interview session owned by the authenticated user.
    """

    permission_classes = [IsAuthenticated]

    def _get_session(self, session_id: str, user: Any) -> InterviewSession | None:
        try:
            return InterviewSession.objects.get(id=session_id, user=user)
        except (InterviewSession.DoesNotExist, ValueError):
            return None

    def get(self, request: Request, session_id: str) -> Response:
        session = self._get_session(session_id, request.user)
        if not session:
            return Response(
                {"detail": "Interview session not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = InterviewSessionDetailSerializer(session)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request: Request, session_id: str) -> Response:
        session = self._get_session(session_id, request.user)
        if not session:
            return Response(
                {"detail": "Interview session not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )
        session.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SubmitAnswerView(APIView):
    """
    Submit candidate answer for an active interview question and receive AI evaluation.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request: Request, session_id: str) -> Response:
        try:
            session = InterviewSession.objects.get(id=session_id, user=request.user)
        except (InterviewSession.DoesNotExist, ValueError):
            return Response(
                {"detail": "Interview session not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if session.status == "completed":
            return Response(
                {"detail": "This interview session has already been completed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = SubmitAnswerSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        question_id = serializer.validated_data["question_id"]
        answer_text = serializer.validated_data["answer"]

        try:
            question = session.questions.get(id=question_id)
        except (InterviewQuestion.DoesNotExist, ValueError):
            return Response(
                {"detail": "Interview question not found in this session."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if question.answered_at:
            return Response(
                {"detail": "This question has already been answered and evaluated."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Evaluate the answer via InterviewService
        svc = get_interview_service()
        evaluation = svc.evaluate_answer(
            role_title=session.role_title,
            question_text=question.question_text,
            skill_focus=question.skill_focus,
            expected_points=question.expected_points,
            user_answer=answer_text,
        )

        with transaction.atomic():
            question.user_answer = answer_text
            question.answered_at = timezone.now()
            question.score = evaluation.get("score", 50)
            question.evaluation = evaluation
            question.save(update_fields=["user_answer", "answered_at", "score", "evaluation", "updated_at"])

            # Advance current question index
            next_index = min(question.order, session.total_questions)
            session.current_question_index = next_index
            session.update_overall_score()

            # If all questions in session are answered, complete session and generate summary
            all_questions = list(session.questions.all())
            answered_count = sum(1 for q in all_questions if q.answered_at is not None)
            if answered_count >= session.total_questions:
                session.status = "completed"
                summary = svc.generate_session_summary(session.role_title, all_questions)
                session.summary_feedback = summary
                session.save(update_fields=["status", "summary_feedback", "current_question_index", "updated_at"])
            else:
                session.save(update_fields=["current_question_index", "updated_at"])

        session_serializer = InterviewSessionDetailSerializer(session)
        evaluated_q_serializer = InterviewQuestionPublicSerializer(question)

        return Response(
            {
                "session": session_serializer.data,
                "evaluated_question": evaluated_q_serializer.data,
                "is_completed": session.status == "completed",
            },
            status=status.HTTP_200_OK,
        )


class CompleteSessionView(APIView):
    """
    Finalize an interview session early or generate its final performance summary.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request: Request, session_id: str) -> Response:
        try:
            session = InterviewSession.objects.get(id=session_id, user=request.user)
        except (InterviewSession.DoesNotExist, ValueError):
            return Response(
                {"detail": "Interview session not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )

        all_questions = list(session.questions.all())
        svc = get_interview_service()
        summary = svc.generate_session_summary(session.role_title, all_questions)

        session.status = "completed"
        session.summary_feedback = summary
        session.update_overall_score()
        session.save(update_fields=["status", "summary_feedback", "updated_at"])

        serializer = InterviewSessionDetailSerializer(session)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SuggestedRolesView(APIView):
    """
    Return popular roles and skills fetched from the knowledge graph for autocomplete & setup.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        svc = get_interview_service()
        standard_roles = [
            "Backend Developer",
            "Frontend Developer",
            "Full Stack Developer",
            "Data Scientist",
            "DevOps Engineer",
            "Software Engineer",
        ]

        roles_payload = []
        for role in standard_roles:
            skills = svc.get_skills_for_role(role, limit=5)
            roles_payload.append({
                "role_title": role,
                "top_skills": skills,
            })

        return Response({"roles": roles_payload}, status=status.HTTP_200_OK)
