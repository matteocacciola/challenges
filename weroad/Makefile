PWD = $(shell pwd)

SHELL = sh
DOCKER_COMPOSE = docker compose
DOCKER_COMPOSE_SHELL = $(DOCKER_COMPOSE) exec -it app $(SHELL)
DOCKER_COMPOSE_EXEC = $(DOCKER_COMPOSE_SHELL) -c

DC_IMAGES :=
FURTHER_ARGS :=

# Add here commands that support being run for one or more containers
IMG_CMDS := up down logs destroy test
ifneq ($(filter $(firstword $(MAKECMDGOALS)),$(IMG_CMDS)),)
  DC_IMAGES := $(filter-out $(firstword $(MAKECMDGOALS)), $(MAKECMDGOALS))
  # The containers are not targets, let's make them silently fail
  $(eval $(DC_IMAGES):;@true)
  $(eval .PHONY: $(DC_IMAGES))
endif

# Add here commands that support additional arguments
CMDS_WITH_ARGS := test
ifneq ($(filter $(firstword $(MAKECMDGOALS)),$(CMDS_WITH_ARGS)),)
  FURTHER_ARGS := $(wordlist 2,999,$(MAKECMDGOALS))
  # The args are not targets, let's make them silently fail
  $(eval $(subst :,\:,$(subst %,\%, $(FURTHER_ARGS))):;@true)
  $(eval .PHONY: $(subst :,\:, $(subst ;,\;, $(FURTHER_ARGS))))
endif

# define standard colors
ifneq (,$(findstring xterm,${TERM}))
	BLACK        := $(shell tput -Txterm setaf 0)
	RED          := $(shell tput -Txterm setaf 1)
	GREEN        := $(shell tput -Txterm setaf 2)
	YELLOW       := $(shell tput -Txterm setaf 3)
	LIGHTPURPLE  := $(shell tput -Txterm setaf 4)
	PURPLE       := $(shell tput -Txterm setaf 5)
	BLUE         := $(shell tput -Txterm setaf 6)
	WHITE        := $(shell tput -Txterm setaf 7)
	RESET := $(shell tput -Txterm sgr0)
else
	BLACK        := ""
	RED          := ""
	GREEN        := ""
	YELLOW       := ""
	LIGHTPURPLE  := ""
	PURPLE       := ""
	BLUE         := ""
	WHITE        := ""
	RESET        := ""
endif

# set target color
NOTIFICATION_COLOR := $(BLUE)

.PHONY: all help
all: help
help:
	@echo "Here is a list of make commands with the corresponding description"
	@echo
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "$(NOTIFICATION_COLOR)%-30s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# ------------------------------
# Container(s) commands
# ------------------------------
.PHONY: up down logs shell destroy recreate test
up: ## Start the ecosystem or a single container. In the latter case, please use "make up app|postgres_db".
	@echo "$(NOTIFICATION_COLOR)Welcome to WeRoad's Full stack Javascript/Typescript hiring test.$(RESET)"
	@echo "$(NOTIFICATION_COLOR)We will perform several operations to get you started with the environment.$(RESET)"
	@npm install
	@$(DOCKER_COMPOSE) --compatibility up -d --remove-orphans $(DC_IMAGES)
	@$(DOCKER_COMPOSE_EXEC) "npm run typeorm:migration:migrate"
	@echo "$(PURPLE)The backend is exposed at localhost:3000, while the frontend can be reached at localhost:8080.$(RESET)"
	@echo "$(GREEN)All done. Enjoy working with WeRoad's Full stack Javascript/Typescript hiring test!$(RESET)"

down: ## Stop the ecosystem or a single container (in the latter case, please use "make down app|postgres_db").
	@$(DOCKER_COMPOSE) down $(DC_IMAGES)

logs: ## Show last 30 lines and follow logs for the entire ecosystem/single container. In case of logs for the single container, please use make logs app|postgres_db.
	@$(DOCKER_COMPOSE) logs -f --tail 100 $(DC_IMAGES)

shell: ## Enter container shell. Usage: make shell app.
	@$(DOCKER_COMPOSE_SHELL)

destroy: ## Destroy environment, removing all images, networks and volumes.
	@$(DOCKER_COMPOSE) --compatibility down --rmi all -v --remove-orphans
	@$(DOCKER_COMPOSE) --compatibility rm -f -v

recreate: ## Full destroy and recreate of the ecosystem without using any sort of cache.
	@$(MAKE) destroy
	@$(DOCKER_COMPOSE) build --pull
	@$(MAKE) up

test: ## Run tests
	@PGPASSWORD=postgres psql -U postgres -h localhost -c 'DROP DATABASE IF EXISTS weroad_test' && PGPASSWORD=postgres psql -U postgres -h localhost -c 'CREATE DATABASE weroad_test'
	@$(DOCKER_COMPOSE_EXEC) "npm run test $(FURTHER_ARGS)"
