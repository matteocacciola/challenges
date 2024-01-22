PWD = $(shell pwd)

SHELL = /bin/bash
LOCAL_DIR = $(PWD)/venv/bin
PYTHON = $(LOCAL_DIR)/python
PYTHON3 = python3.11
DOCKER_COMPOSE = docker-compose -f docker-compose.yml
DOCKER_COMPOSE_EXEC_BACKEND_COMMAND = $(DOCKER_COMPOSE) exec -it app $(SHELL) -c
PIP_SYNC = pip-sync --python-executable $(PYTHON)
PIP_COMPILE = pip-compile -q --strip-extras --no-upgrade

DC_IMAGES :=
FURTHER_ARGS :=

# Add here commands that support being run for one or more containers
IMG_CMDS := start stop logs shell destroy
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
.PHONY: init start stop logs shell destroy recreate sync-dependencies compile-and-sync-requirements
init: ## Complete installation. Please run this command only once. If you want to recreate the environment, please use "make recreate".
	@echo "$(NOTIFICATION_COLOR)Welcome to Employee Churn App.$(RESET)"
	@echo "$(NOTIFICATION_COLOR)We will perform several operations to get you started with the environment.$(RESET)"

# Creating the local virtual environment, for development purposes
	@echo "$(NOTIFICATION_COLOR)Creating the local virtual environment, for development purposes...$(RESET)"
	@$(PYTHON3) -m pip install --upgrade pip
	@$(PYTHON3) -m pip --version
	@$(PYTHON3) -m pip install virtualenv
	@$(PYTHON3) -m venv venv
	@$(PYTHON3) -m pip install pip-tools
	@$(PYTHON) -m pip install pre-commit
	$(LOCAL_DIR)/pre-commit install

# Compiling requirements
	@$(MAKE) compile-and-sync-requirements

# Build images
	@echo "$(NOTIFICATION_COLOR)Building images...$(RESET)"
	$(DOCKER_COMPOSE) --compatibility build
	@echo "$(GREEN)Images built.$(RESET)"

	@echo "$(GREEN)All done. Enjoy working with Employee Churn App!$(RESET)"

sync-dependencies: ## Update the local virtual environment and the docker container with the latest requirements.
	@echo "$(NOTIFICATION_COLOR)Updating local virtual environment.$(RESET)"
	@$(PIP_SYNC) requirements.txt
	@echo "$(GREEN)Local virtual environment updated.$(RESET)"

	@if [ `docker-compose ps -aq --status=running app` ]; then \
		$(DOCKER_COMPOSE_EXEC_BACKEND_COMMAND) "pip-sync requirements.txt"; \
		echo "$(GREEN)Docker libraries updated.$(RESET)"; \
	fi


compile-and-sync-requirements: ## compiles and sync requirements for the local virtual environment and docker container.
	@echo "$(NOTIFICATION_COLOR)Compiling the requirements.$(RESET)"
	@$(PIP_COMPILE) --output-file requirements.txt requirements.in
	@echo "$(GREEN)Requirements compiled.$(RESET)"
	@$(MAKE) sync-dependencies

start: ## Start the ecosystem or a single container. In the latter case, please use "make start app|db".
	@if [ ! `docker-compose ps -aq app` ]; then \
		echo "$(YELLOW)Containers do not exist: running \"make init\" first.$(RESET)"; \
		$(MAKE) init; \
	fi
	@COMPOSE_HTTP_TIMEOUT=200 $(DOCKER_COMPOSE) --compatibility up -d --remove-orphans $(DC_IMAGES)
	@$(MAKE) sync-dependencies

stop: ## Stop the ecosystem or a single container (in the latter case, please use "make stop app|db"). Also deletes unnamed volumes.
	@$(DOCKER_COMPOSE) stop $(DC_IMAGES)

logs: ## Show last 30 lines and follow logs for the entire ecosystem/single container. In case of logs for the single container, please use make logs app|db.
	@$(DOCKER_COMPOSE) logs -f --tail 100 $(DC_IMAGES)

shell: ## Enter container shell. Usage: make shell app.
	@$(DOCKER_COMPOSE) exec -it $(DC_IMAGES) $(SHELL)

destroy: ## Destroy environment, removing all images, networks and volumes.
	@$(DOCKER_COMPOSE) --compatibility down --rmi all -v --remove-orphans
	@$(DOCKER_COMPOSE) --compatibility rm -f -v

recreate: ## Full destroy and recreate of the ecosystem without using any sort of cache.
	@$(MAKE) destroy
	@rm -rvf */venv/**
	@$(DOCKER_COMPOSE) build --pull
	@$(MAKE) start

# ------------------------------
# Lint commands
# ------------------------------

.PHONY: lint
lint: ## Run linting on Python code. This will work on the local virtual environment.
	@echo "Running linting on Python backend..."
	@echo
	@PYTHONPATH=. $(LOCAL_DIR)/pylint ./ --rcfile=./.pylintrc -vvv --jobs=0

# ------------------------------
# Test commands
# ------------------------------

.PHONY: test test-coverage

test: ## Run Behave feature tests, in the docker containers. It is possible to run a single test or a single file by specifying the path. Usage: make test <path_to_test>. Example: make test tests/test_models.feature.
	@echo "Running feature tests..."
	@echo
	@$(DOCKER_COMPOSE_EXEC_BACKEND_COMMAND) "behave ${FURTHER_ARGS}"

test-coverage: ## Run tests with coverage, combining pytest and behave coverages
	@echo "Running tests with coverage..."
	@echo
	@$(DOCKER_COMPOSE_EXEC_BACKEND_COMMAND) "coverage run -m behave && coverage combine && coverage html"