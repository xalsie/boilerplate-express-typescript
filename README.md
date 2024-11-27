# Boilerplate Express TypeScript

## Starting MongoDB

Use the script `docker compose up -d -f docker-compose.yml`

### Accessing a Container

- `docker exec -it ${CONTAINER_ID|NAME} sh`

### Connecting to MongoDB Container

- `mongodb://MONGODB_USERNAME:MONGODB_PASSWORD@localhost:27017/BASE`
