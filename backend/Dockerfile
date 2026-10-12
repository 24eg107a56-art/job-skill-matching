# -----------------------------------------------------------------------------
# Stage 1: Build the Maven application
# -----------------------------------------------------------------------------
FROM eclipse-temurin:17-jdk-jammy AS builder

WORKDIR /app

# Copy Maven Wrapper and POM first to leverage Docker layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline -B

# Copy source code and build production jar
COPY src/ ./src/
RUN ./mvnw clean package -DskipTests -B

# -----------------------------------------------------------------------------
# Stage 2: Runtime environment
# -----------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Create unprivileged application user
RUN addgroup --system spring && adduser --system spring --ingroup spring
USER spring:spring

# Copy built JAR artifact from builder stage
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose standard application port
EXPOSE 8080

# Configure JVM memory limits for container environments
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
