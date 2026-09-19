# Multi-stage Docker build for CareBridge AI Spring Boot 3 + Java 21

# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests -B

# Stage 2: Runtime stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
RUN addgroup --system medivault && adduser --system --ingroup medivault medivault
COPY --from=build /app/target/*.jar app.jar
USER medivault
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=local
ENTRYPOINT ["java", "-jar", "-Djava.security.egd=file:/dev/./urandom", "app.jar"]
