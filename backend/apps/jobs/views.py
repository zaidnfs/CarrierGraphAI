"""
DRF Views for JobPostings.
Provides public listing, searching, filtering, and retrieval endpoints.
"""
from rest_framework import generics, status, views
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import JobPosting
from .serializers import (
    JobPostingListSerializer,
    JobPostingDetailSerializer,
    JobMarketQuerySerializer,
    JobMarketQueryResponseSerializer,
)
from services import get_agent_service
import logging

logger = logging.getLogger(__name__)


class JobPostingListView(generics.ListAPIView):
    """
    Public endpoint to search and filter job postings.
    Query parameters:
    - `q`: Search keyword across title, company, description, or skills
    - `city`: Filter by city (e.g. "Bengaluru")
    - `remote`: Filter by remote status ("true"/"1")
    - `category`: Filter by category or extracted role
    """

    permission_classes = [AllowAny]
    serializer_class = JobPostingListSerializer

    def get_queryset(self):
        queryset = JobPosting.objects.all()

        q = self.request.query_params.get("q")
        if q:
            queryset = queryset.filter(
                Q(title__icontains=q)
                | Q(company__icontains=q)
                | Q(description__icontains=q)
                | Q(extracted_role__icontains=q)
            )

        city = self.request.query_params.get("city")
        if city:
            queryset = queryset.filter(location_city__icontains=city)

        remote = self.request.query_params.get("remote")
        if remote in ("true", "1", "True"):
            queryset = queryset.filter(is_remote=True)

        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(
                Q(category__icontains=category) | Q(extracted_role__icontains=category)
            )

        return queryset.order_by("-posted_date", "-created_at")


class JobPostingDetailView(generics.RetrieveAPIView):
    """
    Public endpoint to retrieve the full details of a specific job posting.
    """

    permission_classes = [AllowAny]
    serializer_class = JobPostingDetailSerializer
    queryset = JobPosting.objects.all()
    lookup_field = "id"


class JobMarketQueryView(views.APIView):
    """
    Protected endpoint to query the job market using the LangGraph agent.
    Requires JWT authentication.
    POST /api/v1/jobs/query/
    Body: {"query": "What are the most demanded skills for Python Backend Developer?"}
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = JobMarketQuerySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        query = serializer.validated_data["query"]
        agent = get_agent_service()

        try:
            result = agent.run_query(query=query)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as exc:
            logger.error("JobMarketQueryView error processing query '%s': %s", query, exc)
            return Response(
                {"error": "Agent query processing failed.", "details": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
