# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy everything first
COPY . .

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application with production profile if SPRING_DATASOURCE_URL is set
ENTRYPOINT ["sh", "-c", "java -jar app.jar ${SPRING_PROFILES_ACTIVE:+--spring.profiles.active=$SPRING_PROFILES_ACTIVE}"]
