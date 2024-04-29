.PHONY: dev

d: dev

dev: 
	make stop
	docker compose -f ./docker-compose.yaml up

dev-detach: 
	make stop
	docker compose -f ./docker-compose.yaml up -d

build: 
	@docker compose -f ./docker-compose.yaml up --build --force-recreate -d

down:
	@docker compose -f ./docker-compose.yaml down --remove-orphans --volumes

stop:
	@docker compose -f ./docker-compose.yaml stop

bash:
	@docker exec -it yggdrasil /bin/bash
