FROM mysql:8.0

# Add a database initialization script
COPY ./init.sql /docker-entrypoint-initdb.d/

# Set environment variables (optional, can also be set in docker-compose.yml)
# ENV MYSQL_ROOT_PASSWORD=rootpassword
# ENV MYSQL_DATABASE=seasoning_management_db
# ENV MYSQL_USER=user
# ENV MYSQL_PASSWORD=password
