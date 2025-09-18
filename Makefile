# Makefile for Docker and Local Development
.PHONY: setup start stop build clean logs test

# Installs dependencies and sets up the database container
setup:
	cd backend && dotnet restore
	cd frontend && pnpm install
	docker-compose up -d mongodb

# Starts all services, builds images, and opens the browser
start:
	docker-compose up -d --build
	cmd /c start http://localhost:3000

# Stops and removes all services and volumes
stop:
	docker-compose down -v --remove-orphans

# Builds the images for all services
build:
	docker-compose build

# Cleans up Docker resources completely
clean:
	docker-compose down -v --rmi all --remove-orphans

# Shows logs for all services
logs:
	docker-compose logs -f

# Runs tests for backend and frontend
test:
	cd backend && dotnet test
	cd frontend && pnpm test:open