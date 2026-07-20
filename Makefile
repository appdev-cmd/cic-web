.PHONY: up down logs migrate admin test
up:
	docker compose up --build -d
down:
	docker compose down
logs:
	docker compose logs -f
migrate:
	docker compose run --rm backend alembic upgrade head
admin:
	docker compose run --rm backend python -m app.cli.create_admin
test:
	docker compose run --rm backend pytest && docker compose run --rm frontend npm test
