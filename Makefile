# Makefile
.PHONY: setup dev test clean

setup:
	cd backend && dotnet restore
	cd frontend && npm install
	docker-compose up -d mongodb

dev:
	docker-compose up -d mongodb
	# Ejecutar en terminales separadas
	cd backend && dotnet run --project src/RealEstate.API &
	cd frontend && npm run dev

test:
	cd backend && dotnet test
	cd frontend && npm test

clean:
	docker-compose down
	cd backend && dotnet clean
	cd frontend && rm -rf .next node_modules