# URL Shortener - Production-Ready Scalable Application

A modern, scalable URL shortener built with Next.js, Express, PostgreSQL, and Redis. Features authentication, caching, analytics, and rate limiting.

## 🚀 Features

- **URL Shortening** - Convert long URLs to short, shareable links using Base62 encoding
- **Authentication** - GitHub OAuth via Auth.js (NextAuth)
- **Redis Caching** - Cache-aside pattern for lightning-fast redirects
- **Analytics** - Track click counts and view URL statistics
- **Rate Limiting** - IP-based rate limiting to prevent abuse
- **Expiration** - Optional URL expiration with automatic handling
- **Responsive UI** - Modern, minimal dark theme built with Tailwind CSS
- **Docker Ready** - Complete Docker Compose setup for easy deployment

## 🏗️ Architecture

### Backend (Express.js)
- **Layered Architecture**: Routes → Controllers → Services → Repositories
- **PostgreSQL**: Database with indexed queries for performance
- **Redis**: Caching layer with graceful fallback
- **Rate Limiting**: Redis-based IP rate limiting
- **Error Handling**: Centralized error handling with proper HTTP status codes

### Frontend (Next.js)
- **App Router**: Next.js 14 with React Server Components
- **Auth.js**: GitHub OAuth authentication
- **shadcn/ui**: Accessible, customizable UI components
- **Tailwind CSS**: Custom dark theme with responsive design

## 📋 Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for local development)
- GitHub OAuth App (for authentication)

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
cd url-shortner
```

### 2. Set Up GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: URL Shortener (or any name)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

### 3. Configure Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your settings (Docker defaults should work locally)
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Edit .env and add your GitHub OAuth credentials
```

Required frontend environment variables:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-random-secret-here
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Start with Docker Compose (Recommended)

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Initialize the database (first time only)
cd backend
npm install
npm run init-db
```

### 5. Run Backend

```bash
cd backend
npm install
npm run dev
```

Backend will start on `http://localhost:5000`

### 6. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on `http://localhost:3000`

## 🎯 Usage

### Shorten a URL

1. Navigate to `http://localhost:3000`
2. Sign in with GitHub
3. Enter a long URL in the input field
4. Click "Shorten URL"
5. Copy the generated short URL

### View Analytics

1. Click "Dashboard" in the header
2. View all your shortened URLs
3. See click counts and creation dates
4. Check expiration status

### Test Redirection

Visit any shortened URL (e.g., `http://localhost:5000/abc123`) and you'll be redirected to the original URL.

## 🔌 API Endpoints

### Public Routes

- `GET /:shortCode` - Redirect to the original URL

### Protected Routes (Require Authentication)

- `POST /api/shorten` - Create a shortened URL
  ```json
  {
    "longUrl": "https://example.com/very/long/url",
    "expiresAt": "2024-12-31T23:59:59Z" // optional
  }
  ```

- `GET /api/stats` - Get all URLs for authenticated user
- `GET /api/stats/:shortCode` - Get statistics for a specific URL

## 🗄️ Database Schema

### users table
- `id` - VARCHAR(255), Primary Key
- `email` - VARCHAR(255), Unique
- `name` - VARCHAR(255)
- `created_at` - TIMESTAMP

### urls table
- `id` - BIGSERIAL, Primary Key
- `user_id` - VARCHAR(255), Foreign Key
- `short_code` - VARCHAR(20), Unique, Indexed
- `long_url` - TEXT
- `click_count` - INTEGER
- `created_at` - TIMESTAMP
- `expires_at` - TIMESTAMP (nullable)

## 🎨 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- Auth.js (NextAuth)
- Tailwind CSS
- shadcn/ui
- Lucide Icons

**Backend:**
- Node.js
- Express.js
- PostgreSQL (with pg)
- Redis (with redis client)

**DevOps:**
- Docker
- Docker Compose

## 🚦 Rate Limiting

- Maximum 10 requests per minute per IP address (configurable)
- Implemented using Redis
- Returns HTTP 429 if limit exceeded

## 💾 Caching Strategy

**Cache-Aside Pattern:**
1. Check Redis cache for short code
2. If found (cache hit), return immediately
3. If not found (cache miss), query database
4. Store result in cache with TTL (default 1 hour)
5. Return result

## 📊 Scalability Features

- **Stateless Backend** - Ready for horizontal scaling
- **Redis Caching** - Reduces database load
- **Indexed Queries** - Fast database lookups
- **Connection Pooling** - Efficient database connections
- **Graceful Degradation** - Works even if Redis is down

## 🔒 Security

- GitHub OAuth authentication
- Rate limiting to prevent abuse
- Parameterized SQL queries (prevents SQL injection)
- Environment-based configuration
- CORS enabled with origin whitelist

## 📝 Development

**Backend Commands:**
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run init-db  # Initialize database schema
```

**Frontend Commands:**
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run ESLint
```

## 🐳 Production Deployment

### Option 1: Docker Compose

```bash
docker-compose up -d
```

### Option 2: Cloud Deployment

#### Backend (Render, Railway, Fly.io)
1. Connect GitHub repository
2. Set environment variables
3. Use PostgreSQL add-on (or Neon)
4. Use Redis add-on (Upstash, Redis Cloud)
5. Deploy

#### Frontend (Vercel, Netlify)
1. Connect GitHub repository
2. Set environment variables
3. Set build output directory to `.next`
4. Deploy

#### Database (Neon, Supabase)
Use Neon serverless PostgreSQL for production:
1. Create a Neon project
2. Copy connection string
3. Update `DATABASE_URL` in backend environment

## 🧪 Testing

**Test Base62 Encoding:**
```bash
cd backend
node -e "const {encode,decode} = require('./utils/base62.js'); console.log('Encode 12345:', encode(12345)); console.log('Decode dnh:', decode('dnh'));"
```

**Test Database Connection:**
```bash
cd backend
node -e "require('./config/database.js').query('SELECT NOW()').then(r => console.log(r.rows))"
```

**Test Redis Connection:**
```bash
docker exec -it url-shortner-redis redis-cli ping
```

## 🤝 Contributing

This is a portfolio project showcasing production-ready system design and architecture.

## 📄 License

MIT

## 👨‍💻 Author

Built as a demonstration of modern full-stack development practices, suitable for technical interviews and portfolio presentation.

## 🎓 Learning Resources

This project demonstrates:
- RESTful API design
- Database schema design with indexes
- Caching strategies (cache-aside pattern)
- Authentication and authorization
- Rate limiting and abuse prevention
- Docker containerization
- Modern frontend development
- Responsive UI design
- Clean code architecture

Perfect for discussing in technical interviews! 🚀
