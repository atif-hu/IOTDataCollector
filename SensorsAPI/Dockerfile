# Step 1: Use official .NET SDK image for building the project
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the project files for all projects
COPY ./SensorsAPI/SensorsAPI.csproj ./SensorsAPI/
COPY ./MonitoringStationAPI/IOTDataCollectorAPI.csproj ./MonitoringStationAPI/
COPY ./Sensors/Sensors.csproj ./Sensors/

# Restore dependencies for all projects
RUN dotnet restore ./SensorsAPI/SensorsAPI.csproj

# Copy the rest of the application files for each project
COPY ./SensorsAPI/ ./SensorsAPI/
COPY ./MonitoringStationAPI/ ./MonitoringStationAPI/
COPY ./Sensors/ ./Sensors/

# Build the application
RUN dotnet build ./SensorsAPI/SensorsAPI.csproj -c Release -o /app/build

# Publish each project to separate directories to avoid file conflicts
RUN dotnet publish ./MonitoringStationAPI/IOTDataCollectorAPI.csproj -c Release -o /app/publish/MonitoringStationAPI
RUN dotnet publish ./SensorsAPI/SensorsAPI.csproj -c Release -o /app/publish/SensorsAPI

# Step 2: Use a smaller runtime image for the final container
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime

# Set the working directory inside the container
WORKDIR /app

# Copy the published output from the build stage for each service
COPY --from=build /app/publish/SensorsAPI ./SensorsAPI/
COPY --from=build /app/publish/MonitoringStationAPI ./MonitoringStationAPI/

# Expose the port the application will run on
EXPOSE 80

# Start the application (using SensorsAPI as the entry point)
ENTRYPOINT ["dotnet", "SensorsAPI/SensorsAPI.dll"]
