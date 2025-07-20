# Use an official OpenJDK 22 runtime as a base image
FROM eclipse-temurin:22-jdk AS build

# Set environment variables
ENV APP_HOME=/usr/src/app

# Set the working directory in the container
WORKDIR $APP_HOME

# Copy Gradle wrapper and the build configuration files
COPY gradlew $APP_HOME/
COPY gradle $APP_HOME/gradle
COPY build.gradle $APP_HOME/
COPY settings.gradle $APP_HOME/

# Copy the application source code
COPY src $APP_HOME/src

# Grant execution rights to the Gradle wrapper
RUN chmod +x gradlew

# Build the application
COPY .gradle $APP_HOME/.gradle

RUN ./gradlew build

# Use a lightweight JRE runtime image for the application
FROM eclipse-temurin:22-jre
ARG APP_VERSION=1.0.0
# Set the working directory in the runtime container
WORKDIR /app

# Copy the built jar file from the build stage
COPY --from=build /usr/src/app/build/libs/enderbrary-${APP_VERSION}.jar app.jar

# Expose the application port (update as per your application settings)
EXPOSE 8080

# Command to run the application
CMD java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} app.jar
