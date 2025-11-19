FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Boardtschek.sln ./
COPY Boardtschek.Common/Boardtschek.Common.csproj Boardtschek.Common/
COPY Boardtschek.Data/Boardtschek.Data.csproj Boardtschek.Data/
COPY Boardtschek.Data.Models/Boardtschek.Data.Models.csproj Boardtschek.Data.Models/
COPY Boardtschek.Services.Data/Boardtschek.Services.Data.csproj Boardtschek.Services.Data/
COPY Boardtschek.WebAPI/Boardtschek.WebAPI.csproj Boardtschek.WebAPI/
COPY Boardtschek.WebAPI.Infrastructure/Boardtschek.WebAPI.Infrastructure.csproj Boardtschek.WebAPI.Infrastructure/
COPY Boardtschek.WebAPI.ViewModels/Boardtschek.WebAPI.ViewModels.csproj Boardtschek.WebAPI.ViewModels/


RUN dotnet restore


COPY . .


RUN dotnet publish Boardtschek.WebAPI/Boardtschek.WebAPI.csproj -c Release -o /app/publish


FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app


COPY --from=build /app/publish .


EXPOSE 10000

ENTRYPOINT ["dotnet", "Boardtschek.WebAPI.dll"]
