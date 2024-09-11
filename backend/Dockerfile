# Step 1: Use official .NET SDK image for building the project
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the .csproj file and restore dependencies
COPY ./backend/backend.csproj ./
RUN dotnet restore

# Copy the remaining project files to the container
COPY ./backend/ ./

# Build the application in release mode
RUN dotnet build -c Release -o /app/build

# Publish the application (optimized and ready for production)
RUN dotnet publish -c Release -o /app/publish

# Step 2: Use a smaller runtime image for the final container
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime

# Set the working directory in the runtime container
WORKDIR /app

# Copy the published output from the build stage to the runtime stage
COPY --from=build /app/publish .

# Expose the port your app will run on
EXPOSE 80

# Define the entry point to run the application
ENTRYPOINT ["dotnet", "backend.dll"]
