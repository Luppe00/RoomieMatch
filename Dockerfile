# Stage 1: Build the Angular Frontend
FROM node:20 AS frontend-build
WORKDIR /app/frontend
# Copy only package.json first for better caching
COPY Frontend/RoomieMatch-SPA/package.json Frontend/RoomieMatch-SPA/package-lock.json ./
RUN npm ci
# Copy the rest of the frontend source
COPY Frontend/RoomieMatch-SPA/ ./
# Build (output goes to /app/frontend/dist or wherever angular.json says, 
# BUT we configured angular.json to output to ../../Backend/... 
# In Docker, we need to respect the file structure or adjust the build command.
# Let's override the output path in the build command to be safe and explicit.
RUN npx ng build --output-path=dist/out

# Stage 2: Build the .NET Backend
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build
WORKDIR /app/backend
# Copy project file
COPY Backend/RoomieMatch.API/RoomieMatch.API.csproj ./RoomieMatch.API/
COPY Backend/RoomieMatch.Model/RoomieMatch.Model.csproj ./RoomieMatch.Model/
RUN dotnet restore ./RoomieMatch.API/RoomieMatch.API.csproj

# Copy everything else
COPY Backend/ ./
# Copy database scripts so they are included in the build context if needed, 
COPY schema.sql seed.sql ./

# Publish
RUN dotnet publish ./RoomieMatch.API/RoomieMatch.API.csproj -c Release -o /app/publish

# Copy SQL files to publish folder so they are available at runtime
COPY schema.sql seed.sql /app/publish/

# Copy frontend build to the publish wwwroot
# We copy from dist/out/browser because the new Angular builder creates that subfolder
COPY --from=frontend-build /app/frontend/dist/out/browser /app/publish/wwwroot

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=backend-build /app/publish .
# This variable is crucial for Railway to listen on the right port
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "RoomieMatch.API.dll"]
