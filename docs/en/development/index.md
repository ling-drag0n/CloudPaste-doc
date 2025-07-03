# Development Guide

Welcome to CloudPaste development! This guide will help you set up a development environment and understand the project structure.

## Development Environment Requirements

### System Requirements

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (or pnpm, yarn)
- **Git**: Version control tool

### Recommended Tools

- **VS Code**: Code editor
- **Wrangler CLI**: Cloudflare Workers development tool
- **Docker**: Containerized development (optional)

## Quick Start

### 1. Clone Project

```bash
# Clone repository
git clone https://github.com/ling-drag0n/CloudPaste.git
cd CloudPaste
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install
```

### 3. Configure Environment

#### Backend Configuration

Create `backend/wrangler.toml` file:

```toml
name = "cloudpaste-backend-dev"
main = "worker.js"
compatibility_date = "2024-01-01"

[env.development]
vars = { NODE_ENV = "development" }

[[env.development.d1_databases]]
binding = "DB"
database_name = "cloudpaste-db-dev"
database_id = "your-database-id"

[env.development.vars]
ENCRYPTION_SECRET = "your-development-secret"
```

#### Frontend Configuration

Create `frontend/.env.development` file:

```bash
VITE_BACKEND_URL=http://localhost:8787
VITE_APP_ENV=development
VITE_ENABLE_DEVTOOLS=true
```

### 4. Initialize Database

```bash
# Create development database
cd backend
npx wrangler d1 create cloudpaste-db-dev

# Initialize database structure
npx wrangler d1 execute cloudpaste-db-dev --file=./schema.sql
```

### 5. Start Development Server

```bash
# Start backend development server
cd backend
npm run dev

# Start frontend development server in new terminal
cd frontend
npm run dev
```

Now you can access:

- Frontend: http://localhost:5173
- Backend: http://localhost:8787

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

## Development Workflow

### 1. Create Feature Branch

```bash
# Create new branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 2. Commit Code

```bash
# Add files
git add .

# Commit code (use standard commit messages)
git commit -m "feat: add new feature"

# Push to remote branch
git push origin feature/your-feature-name
```

### 4. Create Pull Request

1. Create Pull Request on GitHub
2. Fill in detailed description
3. Wait for code review
4. Modify code based on feedback

## Code Standards

### Commit Message Standards

Use [Conventional Commits](https://www.conventionalcommits.org/) standard:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `style`: Code formatting
- `refactor`: Code refactoring
- `test`: Test related
- `chore`: Build tools or auxiliary tool changes

Examples:

```
feat: add file upload progress indicator
fix: resolve authentication token expiration issue
docs: update API documentation
```

## Debugging Tips

### Frontend Debugging

1. **Vue DevTools**: Install Vue.js devtools browser extension
2. **Console Logs**: Use `console.log` for debugging
3. **Network Panel**: Check API requests and responses

### Backend Debugging

1. **Wrangler Logs**: Use `wrangler tail` to view real-time logs
2. **Local Debugging**: Debug Worker code in local environment
3. **D1 Queries**: Use `wrangler d1 execute` to query database

## Contribution Guide

### Report Bugs

1. Search existing Issues to confirm the problem hasn't been reported
2. Create new Issue with detailed information:
   - Problem description
   - Reproduction steps
   - Expected behavior
   - Actual behavior
   - Environment information

### Feature Requests

1. Discuss new features in GitHub Discussions
2. Create Feature Request Issue
3. Provide detailed feature description and use cases

### Code Contributions

1. Fork project repository
2. Create feature branch
3. Implement feature and add tests
4. Ensure all tests pass
5. Submit Pull Request

## Getting Help

- **GitHub Issues**: Report bugs and feature requests
- **GitHub Discussions**: Community discussions

## Next Steps

- [API Development Guide](/en/api/)
- [Deployment Guide](/en/guide/deploy-github-actions)
- [S3 Storage Configuration](/en/guide/s3-config)
- [WebDAV Configuration](/en/guide/webdav)
