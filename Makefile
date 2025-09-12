# Makefile
.PHONY: setup dev test clean

setup:
	cd backend && dotnet restore
	cd frontend && pnpm install
	docker-compose up -d mongodb

dev:
	docker-compose up -d mongodb
	
	# Exe in separate terminal tabs
	cd backend && dotnet run --project src/RealEstate.API &
	cd frontend && pnpm run dev

test:
	cd backend && dotnet test
	cd frontend && pnpm test

clean:
	docker-compose down -v
	cd backend && dotnet clean
	cd frontend && rm -rf .next node_modules