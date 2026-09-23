"""
Django management command to run job ingestion manually from CLI.
"""
from django.core.management.base import BaseCommand
from tasks.ingestion import fetch_and_store_jobs


class Command(BaseCommand):
    help = "Fetch job postings from configured providers and store them in PostgreSQL"

    def add_arguments(self, parser):
        parser.add_argument(
            "--keywords",
            type=str,
            help="Role keywords (comma-separated, e.g. 'Python Developer,Backend Developer')",
        )
        parser.add_argument(
            "--locations",
            type=str,
            help="Locations (comma-separated, e.g. 'Bengaluru,Hyderabad')",
        )
        parser.add_argument(
            "--country",
            type=str,
            default="in",
            help="ISO country code (default 'in')",
        )
        parser.add_argument(
            "--pages",
            type=int,
            default=1,
            help="Number of pages to fetch per query (default 1)",
        )
        parser.add_argument(
            "--no-process",
            action="store_true",
            help="Do not trigger background NER/embedding processing",
        )

    def handle(self, *args, **options):
        keywords = options.get("keywords")
        locations = options.get("locations")
        country = options.get("country", "in")
        pages = options.get("pages", 1)
        auto_process = not options.get("no_process", False)

        keywords_list = (
            [k.strip() for k in keywords.split(",") if k.strip()] if keywords else None
        )
        locations_list = (
            [loc.strip() for loc in locations.split(",") if loc.strip()]
            if locations
            else None
        )

        self.stdout.write(
            self.style.NOTICE(
                f"Starting ingestion: keywords={keywords_list or 'DEFAULT'}, "
                f"locations={locations_list or 'DEFAULT'}, country={country}, pages={pages}"
            )
        )

        summary = fetch_and_store_jobs(
            keywords=keywords_list,
            locations=locations_list,
            country=country,
            max_pages_per_query=pages,
            auto_trigger_processing=auto_process,
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Ingestion completed successfully!\n"
                f"  Total Fetched:    {summary['total_fetched']}\n"
                f"  New Jobs Created: {summary['total_created']}\n"
                f"  Duplicates:       {summary['total_duplicates']}\n"
                f"  Errors:           {summary['errors_count']}"
            )
        )
