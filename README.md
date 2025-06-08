

---

## 📦 Deployment Guide – Storely E-commerce

### ⚙️ Development Environment Setup

#### ✅ Prerequisites

* **Node.js** (v18+)
* **Python** (v3.8+)
* **Git**

---

#### 🧩 Frontend Setup

```bash
# Clone the repository
git clone <repository-url>
cd storely_ecommerce

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

---

#### 🐍 Backend Setup

```bash
# Navigate to backend folder
cd api

# Create Python virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Start Flask development server
python working_auth_api.py
```

---

### 🚀 Production Deployment

#### 🐳 Docker Containerization

**Frontend Dockerfile (`Dockerfile.frontend`):**

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

---

#### 🧱 Docker Compose Configuration

**`docker-compose.yml`:**

```yaml
version: "3.8"

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "8080:80"
    depends_on:
      - backend

  backend:
    build:
      context: ./api
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/storely
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=storely
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

#### 🔐 Environment Configuration

Create a `.env` file in the `api/` folder for Flask backend configuration (optional but recommended):

**`.env`:**

```env
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/storely
CORS_ORIGINS=https://yourdomain.com
```

Make sure to use `python-dotenv` in your Flask app if you're loading `.env` files.

---

### 🧪 Deployment Commands

```bash
# Build and run all services in detached mode
docker-compose up --build -d

# Monitor logs
docker-compose logs -f

# Stop and remove all containers, networks, and volumes
docker-compose down
```

---


