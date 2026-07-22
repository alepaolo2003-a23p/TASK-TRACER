# === STAGE 1: Build (compilar la aplicación) ===
# FROM: imagen base que contiene Maven y JDK 21 para compilar
FROM maven:3.9.8-eclipse-temurin-21-alpine AS build

# WORKDIR: establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# COPY pom.xml primero para aprovechar cache de Docker:
# si el pom.xml no cambia, Docker reusa esta capa y no descarga dependencias de nuevo
COPY pom.xml .
RUN mvn dependency:go-offline -B

# COPY del código fuente
COPY src ./src

# RUN: ejecuta Maven para compilar y empaquetar la aplicación en un .jar
RUN mvn clean package -DskipTests

# === STAGE 2: Run (imagen final mínima) ===
# Multi-stage build: la imagen final solo tiene JRE, no Maven ni el compilador
# Esto reduce drásticamente el tamaño de la imagen final
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# COPY --from=build: copia el .jar desde la etapa anterior (build)
COPY --from=build /app/target/*.jar app.jar

# EXPOSE: documenta que el contenedor usará el puerto 8080
EXPOSE 8080

# ENTRYPOINT: comando que se ejecuta cuando arranca el contenedor
ENTRYPOINT ["java", "-jar", "app.jar"]
