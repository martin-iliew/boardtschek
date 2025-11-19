FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src


COPY ../Boardtschek.sln ./
COPY ../Boardtschek.Common ./Boardtschek.Common
COPY ../Boardtschek.Data ./Boardtschek.Data
COPY ../Boardtschek.Data.Models ./Boardtschek.Data.Models
COPY ../Boardtschek.Services.Data ./Boardtschek.Services.Data
COPY . ./Boardtschek.WebAPI
COPY ../Boardtschek.WebAPI.ViewModels ./Boardtschek.WebAPI.ViewModels
COPY ../Boardtschek.WebAPI.Infrastructure ./Boardtschek.WebAPI.Infrastructure


RUN dotnet restore ./Boardtschek.WebAPI/Boardtschek.WebAPI.csproj


RUN dotnet publish ./Boardtschek.WebAPI/Boardtschek.WebAPI.csproj \
    -c Release \
    -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0


RUN apt-get update \
    && apt-get install -y libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Boardtschek.WebAPI.dll"]
