# Stage 1: Build the application
FROM maven:3.9.9-amazoncorretto-21 AS build

WORKDIR /app

# Copy the entire project
COPY ../.. .

# Build the specific module
RUN mvn clean package -pl postservice -am -DskipTests

# Stage 2: Run the application
FROM amazoncorretto:21-alpine-jdk

WORKDIR /app

# Copy the built jar from the previous stage
COPY --from=build /app/postservice/target/postservice-*.jar postservice.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "postservice.jar"]

