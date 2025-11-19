# ---- Build stage ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy everything inside backend
COPY . .

# Restore only the WebAPI project
RUN dotnet restore ./Boardtschek.WebAPI/Boardtschek.WebAPI.csproj

# Publish WebAPI
RUN dotnet publish ./Boardtschek.WebAPI/Boardtschek.WebAPI.csproj \
    -c Release -o /app/publish


# ---- Runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0

RUN apt-get update \
    && apt-get install -y libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Boardtschek.WebAPI.dll"]
