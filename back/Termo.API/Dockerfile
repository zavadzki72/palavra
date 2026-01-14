FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Termo.API/Termo.API.csproj", "Termo.API/"]
COPY ["Termo.Infrastructure/Termo.Infrastructure.csproj", "Termo.Infrastructure/"]
COPY ["Termo.Models/Termo.Models.csproj", "Termo.Models/"]

RUN dotnet restore "Termo.API/Termo.API.csproj"

COPY . .

WORKDIR "/src/Termo.API"
RUN dotnet build "Termo.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Termo.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Termo.API.dll"]