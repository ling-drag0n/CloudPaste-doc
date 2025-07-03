# Docker Deployment

Docker deployment is suitable for users with servers, providing complete containerized solutions with local storage and full autonomous control.

## Deployment Advantages

- ✅ **One-click Deployment**: Docker Compose one-click startup
- ✅ **Complete Control**: Full autonomous control of servers
- ✅ **Local Storage**: Support for local file storage
- ✅ **Easy Backup**: Data persistence and backup
- ✅ **Cluster Support**: Support for multi-instance deployment

## System Requirements

- **Operating System**: Linux, Windows, macOS
- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Memory**: Minimum 512MB, recommended 1GB
- **Storage**: Minimum 1GB available space

## Quick Start

### Method 1: Docker Compose (Recommended)

1. **Download configuration file**

   ```bash
   curl -O https://raw.githubusercontent.com/ling-drag0n/CloudPaste/main/docker-compose.yml
   ```

2. **Modify configuration**

   ```bash
   nano docker-compose.yml
   ```

3. **Start services**
   ```bash
   docker-compose up -d
   ```

### Method 2: Separate Frontend and Backend Deployment

#### Deploy Backend

```bash
# Create data directory
mkdir -p sql_data

# Run backend container
docker run -d --name cloudpaste-backend \
  -p 8787:8787 \
  -v $(pwd)/sql_data:/data \
  -e ENCRYPTION_SECRET=your-secret-key \
  -e NODE_ENV=production \
  -e RUNTIME_ENV=docker \
  -e LOG_LEVEL=2 \
  dragon730/cloudpaste-backend:latest
```

#### Deploy Frontend

```bash
# Run frontend container
docker run -d --name cloudpaste-frontend \
  -p 80:80 \
  -e BACKEND_URL=http://your-server-ip:8787 \
  dragon730/cloudpaste-frontend:latest
```

## Detailed Configuration

### Docker Compose Configuration

Create `docker-compose.yml` file:

```yaml
version: "3.8"

services:
  frontend:
    # context: .
    #   dockerfile: docker/frontend/Dockerfile
    #   args:
    #     - VITE_BACKEND_URL= #Can be empty during build, will be overridden by entrypoint.sh
    image: dragon730/cloudpaste-frontend:latest
    environment:
      - BACKEND_URL=https://xxx.com # Fill in backend service address, can be controlled through nginx reverse proxy. #Runtime environment variable, will be used by entrypoint.sh
    ports:
      - "8080:80" #"127.0.0.1:8080:80"
    depends_on:
      - backend # Depends on backend service, frontend service can only start after backend service starts
    networks:
      - cloudpaste-network
    restart: unless-stopped

  backend:
    # build:
    #   context: .
    #   dockerfile: docker/backend/Dockerfile
    image: dragon730/cloudpaste-backend:latest
    environment:
      - NODE_ENV=production # Production environment mode
      - RUNTIME_ENV=docker # Runtime environment identifier
      - PORT=8787 # Application listening port
      - LOG_LEVEL=2 # Log level
      # Important: Please change to your own security key for data encryption
      - ENCRYPTION_SECRET=xxxxxxx
    volumes:
      - ./sql_data:/data # Map sql_data in current directory to /data directory in container
    ports:
      - "8787:8787" #"127.0.0.1:8787:8787"
    networks:
      - cloudpaste-network
    restart: unless-stopped # Automatically restart when container exits abnormally

networks:
  cloudpaste-network:
    driver: bridge
```

### Environment Variable Configuration

| Variable            | Description                 | Default Value | Required |
| ------------------- | --------------------------- | ------------- | -------- |
| `NODE_ENV`          | Runtime environment         | `production`  | No       |
| `RUNTIME_ENV`       | Runtime platform identifier | `docker`      | No       |
| `PORT`              | Backend service port        | `8787`        | No       |
| `LOG_LEVEL`         | Log output level            | `2`           | No       |
| `ENCRYPTION_SECRET` | Data encryption key         | -             | **Yes**  |
| `BACKEND_URL`       | Backend service address     | -             | **Yes**  |

### Port Configuration

- **Frontend**: Default port `80`, can be modified to `8080:80`
- **Backend**: Default port `8787`, can be modified to `8787:8787`
- **Database**: Uses SQLite, data stored in `/data` directory

### Volume Mount

- `./sql_data:/data` - Database file storage directory
- Ensure the directory has proper read/write permissions

## Access and Testing

### 1. Check Service Status

```bash
# View running containers
docker ps

# Check service logs
docker-compose logs
```

### 2. Access Application

- **Frontend**: http://your-server-ip:8080 (or port 80)
- **Backend API**: http://your-server-ip:8787

### 3. Default Login

- **Username**: `admin`
- **Password**: `admin123`

::: warning Security Notice
Please change the default admin password immediately after first login
:::

## Update and Maintenance

### Update to Latest Version

```bash
# Pull latest images
docker-compose pull

# Recreate containers
docker-compose up -d --force-recreate
```

### View Logs

```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs frontend
docker-compose logs backend

# View logs in real-time
docker-compose logs -f
```

### Monitor Service Status

```bash
# View service status
docker-compose ps

# View resource usage
docker stats
```

## Custom Docker Build

If you want to customize Docker images or perform development debugging, you can manually build following these steps:

1. **Build Backend Image**

   ```bash
   # Execute in project root directory
   docker build -t cloudpaste-backend:custom -f docker/backend/Dockerfile .

   # Run custom built image
   docker run -d --name cloudpaste-backend \
     -p 8787:8787 \
     -v $(pwd)/sql_data:/data \
     -e ENCRYPTION_SECRET=development-test-key \
     cloudpaste-backend:custom
   ```

2. **Build Frontend Image**

   ```bash
   # Execute in project root directory
   docker build -t cloudpaste-frontend:custom -f docker/frontend/Dockerfile .

   # Run custom built image
   docker run -d --name cloudpaste-frontend \
     -p 80:80 \
     -e BACKEND_URL=http://localhost:8787 \
     cloudpaste-frontend:custom
   ```

3. **Development Environment Docker Compose**

   Create `docker-compose.dev.yml` file:

   ```yaml
   version: "3.8"

   services:
     frontend:
       build:
         context: .
         dockerfile: docker/frontend/Dockerfile
       environment:
         - BACKEND_URL=http://backend:8787
       ports:
         - "80:80"
       depends_on:
         - backend

     backend:
       build:
         context: .
         dockerfile: docker/backend/Dockerfile
       environment:
         - NODE_ENV=development
         - RUNTIME_ENV=docker
         - PORT=8787
         - ENCRYPTION_SECRET=dev_secret_key
       volumes:
         - ./sql_data:/data
       ports:
         - "8787:8787"
   ```

   Start development environment:

   ```bash
   docker-compose -f docker-compose.yml up --build
   ```

## Troubleshooting

### Common Issues

1. **Container startup failure**

   - Check if ports are occupied
   - Confirm environment variables are configured correctly
   - View container logs

2. **Frontend cannot connect to backend**

   - Confirm `BACKEND_URL` is configured correctly
   - Check network connection
   - Confirm backend service is running normally

3. **Data loss**
   - Confirm data volume is mounted correctly
   - Check file permissions
   - Regular data backup

## Next Steps

- [Configure S3 Storage](/en/guide/s3-config)
- [Setup WebDAV](/en/guide/webdav)
- [View API Documentation](/en/api/)
- [Learn Development Guide](/en/development/)
