# Docker Guide for HRM Application

## Quick Start

### Option 1: Docker Compose (Recommended)
Runs the complete application with PostgreSQL database:

```bash
# Start the complete application stack
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Option 2: Docker Build & Run
Build and run just the application (requires external database):

```bash
# Build the Docker image
docker build -t hrm-app .

# Run with environment file
docker run -p 5000:5000 --env-file .env hrm-app

# Or run with inline environment variables
docker run -p 5000:5000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e NODE_ENV=production \
  hrm-app
```

## Docker Files Explained

### Dockerfile
Multi-stage build optimized for production:
- **deps**: Installs production dependencies only
- **builder**: Builds the application
- **runner**: Final lightweight production image

### docker-compose.yml
Complete application stack:
- PostgreSQL database with persistent storage
- HRM application with health checks
- Automatic dependency management
- Network isolation

### .dockerignore
Excludes unnecessary files from Docker build context for faster builds.

## Environment Variables

Create a `.env` file for Docker:

```env
# Database Configuration
DATABASE_URL=postgresql://hrm_user:hrm_password@postgres:5432/hrm_database

# Server Configuration
NODE_ENV=production
PORT=5000

# PostgreSQL (for docker-compose)
POSTGRES_DB=hrm_database
POSTGRES_USER=hrm_user
POSTGRES_PASSWORD=hrm_password
```

## Development with Docker

### Development Mode
```bash
# Run in development mode with hot reloading
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Or build development image
docker build --target base -t hrm-app:dev .
docker run -v $(pwd):/app -p 5000:5000 hrm-app:dev npm run dev
```

### Database Migration
```bash
# Run database migrations in container
docker exec -it hrm-application npm run db:push

# Or run migrations during build (add to Dockerfile if needed)
```

## Production Deployment

### Docker Hub
```bash
# Tag and push to Docker Hub
docker build -t your-username/hrm-app .
docker push your-username/hrm-app

# Deploy on server
docker pull your-username/hrm-app
docker run -d -p 5000:5000 --env-file .env your-username/hrm-app
```

### Container Registry
```bash
# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t hrm-app .
```

## Kubernetes Deployment

### Basic Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hrm-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hrm-app
  template:
    metadata:
      labels:
        app: hrm-app
    spec:
      containers:
      - name: hrm-app
        image: hrm-app:latest
        ports:
        - containerPort: 5000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: hrm-secrets
              key: database-url
```

## Monitoring & Health Checks

### Health Check Endpoint
The application includes a health check endpoint at `/api/health`:

```bash
# Check application health
curl http://localhost:5000/api/health
```

### Docker Health Checks
Built-in Docker health checks monitor application status:

```bash
# View health status
docker ps
docker inspect hrm-application | grep Health -A 10
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check PostgreSQL container status
   docker-compose logs postgres
   
   # Verify connection
   docker exec -it hrm-postgres psql -U hrm_user -d hrm_database
   ```

2. **Port Already in Use**
   ```bash
   # Change ports in docker-compose.yml
   ports:
     - "5001:5000"  # Use different host port
   ```

3. **Build Failures**
   ```bash
   # Clean build cache
   docker system prune -a
   
   # Rebuild without cache
   docker build --no-cache -t hrm-app .
   ```

### Logs and Debugging
```bash
# View application logs
docker-compose logs -f hrm-app

# Access container shell
docker exec -it hrm-application sh

# View all container processes
docker-compose ps
```

## Performance Optimization

### Image Size Optimization
- Uses Alpine Linux base image
- Multi-stage build removes dev dependencies
- .dockerignore excludes unnecessary files

### Runtime Optimization
- Non-root user for security
- Health checks for reliability
- Resource limits can be added to docker-compose.yml

## Security Best Practices

1. **Non-root User**: Application runs as non-root user
2. **Environment Variables**: Secrets managed through environment
3. **Network Isolation**: Services communicate through Docker network
4. **Image Scanning**: Regularly scan images for vulnerabilities

```bash
# Scan image for vulnerabilities (if Docker Desktop is available)
docker scan hrm-app
```

Your HRM application is now fully containerized and ready for deployment!