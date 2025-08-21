up:
	cd ./environnements && docker-compose up --build -d

down:
	cd ./environnements && docker-compose down

logs:
	cd ./environnements && docker-compose logs -f

ps:
	cd ./environnements && docker-compose ps

restart:
	cd ./environnements && docker-compose restart

clean:
	cd ./environnements && docker-compose down -v --rmi all --remove-orphans
	docker system prune -f