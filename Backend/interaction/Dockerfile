FROM maven:3.9.9-amazoncorretto-21 AS build

WORKDIR /app

COPY ../.. .

RUN mvn clean package -pl interaction -am -DskipTests

FROM amazoncorretto:21-alpine-jdk

WORKDIR /app

COPY --from=build /app/interaction/target/interaction-*.jar interaction.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "interaction.jar"]
