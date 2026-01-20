# Scalable URL Shortener – Full Project Specification

## PROJECT GOAL
Build a production-ready, scalable URL shortener with authentication, caching, analytics, and a modern minimal UI.
This project must be suitable for inclusion in a software engineering resume and demonstrate real-world system design principles.

---

## TECH STACK

Frontend:
- Next.js (App Router)
- Tailwind CSS
- shadcn/ui
- Auth.js (NextAuth) for authentication

Backend:
- Node.js
- Express.js
- REST APIs
- JWT-based auth verification

Database:
- PostgreSQL (Neon – serverless Postgres)

Caching:
- Redis (cache-aside pattern)

Infrastructure:
- Docker
- Docker Compose
- Environment-based configuration

---

## AUTHENTICATION (EASY + RESUME FRIENDLY)

Use **Auth.js (NextAuth)** with:
- GitHub OAuth (primary, easiest)
- Optional Email magic-link (secondary)

Why:
- Minimal setup
- No password handling
- Industry standard
- Easy to explain in interviews

Auth Flow:
- User logs in via GitHub
- Frontend receives session
- Backend verifies JWT on protected routes
- Each shortened URL is linked to a user_id

---

## CORE FEATURES

### 1. Authentication
- Login / Logout
- Protected dashboard routes
- Each user manages their own URLs

### 2. URL Shortening
- Accept long URL
- Generate unique short code
- Use Base62 encoding
- Collision-free generation using DB auto-increment ID

### 3. URL Redirection
- GET /:shortCode
- Cache-first lookup (Redis)
- DB fallback
- HTTP 302 redirect

### 4. Persistence
- Store URL mappings in PostgreSQL
- Indexed lookups for performance

---

## SCALABILITY & PERFORMANCE FEATURES

### 5. Redis Caching
- Cache hot URLs
- Reduce database reads
- TTL-based eviction

Cache format:
short_code -> long_url

Pattern:
- Cache-aside

---

### 6. Database Design (Neon PostgreSQL)

Tables:

users
- id (UUID, PK)
- email
- name
- created_at

urls
- id (BIGSERIAL, PK)
- user_id (FK -> users.id)
- short_code (VARCHAR, UNIQUE, INDEXED)
- long_url (TEXT)
- click_count (INT DEFAULT 0)
- created_at (TIMESTAMP)
- expires_at (TIMESTAMP, NULL)

Indexes:
- UNIQUE INDEX on short_code
- INDEX on user_id

---

## RELIABILITY & ABUSE PROTECTION

### 7. Rate Limiting
- IP-based rate limiting
- Implemented using Redis
- Prevent API abuse

Example:
- Max 10 shorten requests per minute per IP

---

### 8. URL Expiration
- Optional expiration time
- Expired URLs return HTTP 410 Gone
- No redirect if expired

---

## ANALYTICS

### 9. Click Tracking
- Increment click count on redirect
- Non-blocking update
- Stored in PostgreSQL

### 10. Dashboard Analytics
- Show total URLs created
- Show click counts
- Show expiration status

---

## FRONTEND REQUIREMENTS

### Pages

1. Home Page
- URL input
- Shorten button
- Copy-to-clipboard
- Toast notifications

2. Dashboard (Authenticated)
- List of user’s URLs
- Click count per URL
- Expiry indicator

3. Auth Pages
- Login via GitHub
- Logout

4. Error Pages
- Invalid URL
- Expired URL
- Rate limit exceeded

---

### UI GUIDELINES
- Minimal
- Clean
- Developer-focused
- Responsive
- Use shadcn components:
  - Button
  - Input
  - Card
  - Table
  - Toast

---

## BACKEND REQUIREMENTS

### API ENDPOINTS

Public:
- GET /:shortCode

Protected:
- POST /api/shorten
- GET /api/stats
- GET /api/stats/:shortCode

---

### BACKEND ARCHITECTURE

Folder structure:

routes/
controllers/
services/
repositories/
middlewares/
utils/
config/

Responsibilities:
- Controllers: request/response
- Services: business logic
- Repositories: DB access
- Middlewares: auth, rate limit
- Utils: Base62 encoder

---

## SHORT CODE GENERATION STRATEGY

- Use DB auto-increment ID
- Convert ID to Base62
- Guarantees uniqueness
- No collision handling required

---

## DOCKER REQUIREMENTS

### Docker Services
- backend
- redis
- postgres (local dev only)

### Docker Expectations
- Dockerfile for backend
- docker-compose.yml for local setup
- One-command startup

---

## ENVIRONMENT VARIABLES

- DATABASE_URL (Neon)
- REDIS_URL
- AUTH_SECRET
- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET
- BASE_URL
- RATE_LIMIT_MAX
- RATE_LIMIT_WINDOW

---

## SCALABILITY DESIGN NOTES

- Stateless backend (horizontal scaling ready)
- Redis handles read-heavy traffic
- Indexed DB queries
- Cache-aside strategy
- Easy to add load balancer later

---

## QUALITY REQUIREMENTS

- Clean code
- Modular architecture
- Centralized error handling
- Input validation
- Logging
- Production-ready structure

---

## IMPLEMENTATION ORDER

1. Authentication setup
2. Database schema
3. Backend APIs
4. Base62 encoding
5. Redis caching
6. Rate limiting
7. Frontend UI
8. Dashboard analytics
9. Dockerization

---

## FINAL EXPECTATION

Deliver a scalable, authenticated URL shortener with modern UI, caching, analytics, and cloud-ready infrastructure,
suitable for professional resume and system design interviews.



<!-- INSTRUCTIONS FOR AGENT TO WRITE CLEAN CODE -->


# CODE QUALITY & STYLE INSTRUCTIONS (MANDATORY)

The goal is to produce clean, readable, interview-ready code that follows real-world backend and frontend engineering standards.
Avoid over-engineering. Favor clarity over cleverness.

---

## GENERAL PRINCIPLES

- Write simple, explicit, and readable code
- Prefer clarity over micro-optimizations
- Follow single-responsibility principle
- Avoid deeply nested logic
- Keep functions small and focused
- Use meaningful names (no abbreviations)

---

## PROJECT STRUCTURE RULES

### Backend (Node.js + Express)

Follow this exact layered structure:

routes/
- Only define routes and attach controllers

controllers/
- Handle HTTP request and response
- No business logic
- No database queries

services/
- Contain business logic
- Orchestrate workflows
- Call repositories and utilities

repositories/
- Only database queries
- No business logic
- Return raw or mapped data

middlewares/
- Authentication
- Rate limiting
- Error handling

utils/
- Base62 encoder
- Validation helpers

config/
- Environment config
- DB & Redis clients

---

### Frontend (Next.js)

Structure:
- app/
- components/
- lib/
- styles/

Rules:
- UI components must be reusable
- Business logic must not live inside UI components
- Use server actions or API calls cleanly
- Keep components small

---

## NAMING CONVENTIONS

- Use camelCase for variables and functions
- Use PascalCase for components and classes
- Use kebab-case for file names (frontend)
- Use singular nouns for services and repositories

Examples:
- createShortUrl()
- urlService
- urlRepository
- base62Encode()

---

## FUNCTION DESIGN RULES

- Each function should do **one thing**
- Max 30–40 lines per function
- Prefer early returns over nested if-else
- Explicit input parameters
- Explicit return values

BAD:
- One function doing validation + DB + response

GOOD:
- validateInput()
- generateShortCode()
- saveUrlMapping()

---

## ERROR HANDLING

- Use centralized error handler middleware
- Never expose internal error messages to client
- Return proper HTTP status codes

Examples:
- 400 → invalid input
- 401 → unauthorized
- 404 → not found
- 410 → expired URL
- 429 → rate limit exceeded
- 500 → internal server error

---

## AUTHENTICATION RULES

- Use Auth.js (NextAuth) on frontend
- Backend must verify JWT/session
- Auth logic must be in middleware
- Protected routes must never trust client input

---

## DATABASE RULES

- Use parameterized queries only
- No raw SQL strings in controllers
- Index critical fields
- Do not embed DB logic in services

---

## REDIS & CACHING RULES

- Use cache-aside pattern only
- Cache only read-heavy data
- Never treat cache as source of truth
- Gracefully handle Redis failures

---

## COMMENTING GUIDELINES

- Write comments only where logic is non-obvious
- Avoid obvious comments
- Explain “why”, not “what”

GOOD:
- Why cache TTL is chosen
- Why a fallback exists

BAD:
- // increment counter
- // return response

---

## API DESIGN RULES

- RESTful routes
- Predictable responses
- Consistent error format

Example response:
{
  success: true,
  data: {...}
}

Error response:
{
  success: false,
  message: "Readable error message"
}

---

## FRONTEND UI RULES

- Minimal UI
- No unnecessary animations
- Use shadcn components consistently
- Handle loading and error states explicitly

---

## DOCKER & ENV RULES

- No hard-coded secrets
- Use environment variables
- Clear README instructions
- One-command startup

---

## TESTABILITY & MAINTAINABILITY

- Code must be easy to read without context
- Avoid magic numbers
- Prefer constants
- Keep configuration centralized

---

## FINAL EXPECTATION

The resulting codebase should be:
- Readable by another engineer without explanation
- Easy to explain in interviews
- Production-style, not tutorial-style
- Clean, modular, and scalable


# UI THEME & DESIGN SYSTEM SPECIFICATION

## THEME GOAL
Create a modern, minimal, developer-focused **dark theme UI** that feels calm, professional, and scalable.
The UI must be readable for long sessions and visually consistent across all pages.

---

## COLOR PALETTE (PRIMARY SOURCE OF TRUTH)

Use the following palette exactly:

- Background (Base): #1B211A
- Primary Accent: #628141
- Secondary Accent: #8BAE66
- Surface / Highlight: #EBD5AB

---

## COLOR ROLE MAPPING (IMPORTANT)

Dark Theme Roles:

- background:
  - base background → #1B211A
  - card background → #1F261E (slightly lighter than base)

- primary:
  - primary buttons → #628141
  - primary hover → #6F9150

- secondary:
  - secondary buttons / highlights → #8BAE66

- accent:
  - subtle highlights / borders → #EBD5AB

- text:
  - primary text → #EBD5AB
  - secondary text → #B9C7A3
  - muted text → #8F9B83

- borders:
  - default border → rgba(235, 213, 171, 0.15)

---

## ACCESSIBILITY RULES

- Maintain sufficient contrast between text and background
- Never use pure white text
- Avoid overly saturated colors
- UI should feel calm, not flashy

---

## TYPOGRAPHY (GOOGLE FONTS)

### Primary Font (UI & Body)
**Inter**
- Clean
- Modern
- Highly readable
- Industry standard

Usage:
- Body text
- Buttons
- Tables
- Forms

---

### Secondary Font (Headings)
**Space Grotesk**
- Modern
- Slight personality
- Great for product-style UIs

Usage:
- Page titles
- Section headers
- Hero text

---

## FONT CONFIGURATION

- Base font size: 14px–16px
- Line height: relaxed (1.5–1.6)
- Avoid overly bold weights
- Prefer Medium (500) and Semibold (600)

---

## TAILWIND THEME EXTENSION

Extend Tailwind theme with semantic tokens:

colors:
- bg-base: #1B211A
- bg-card: #1F261E
- primary: #628141
- primary-hover: #6F9150
- secondary: #8BAE66
- accent: #EBD5AB
- text-primary: #EBD5AB
- text-secondary: #B9C7A3
- text-muted: #8F9B83

fonts:
- sans: Inter
- heading: Space Grotesk

---

## SHADCN / UI COMPONENT RULES

- Use shadcn components as base
- Override colors using Tailwind tokens
- Do not introduce custom component styles unless required

Component Guidelines:

Button:
- Primary: bg-primary text-bg-base
- Secondary: bg-secondary text-bg-base
- Ghost: transparent with accent border

Input:
- Background: bg-card
- Border: subtle accent
- Focus ring: secondary color

Card:
- Background: bg-card
- Border: soft accent border
- Rounded corners: medium (not sharp)

Toast:
- Background: bg-card
- Text: text-primary
- Success: secondary accent
- Error: muted red (minimal)

---

## UI STYLE RULES

- Minimal spacing, no clutter
- Avoid gradients
- Avoid shadows or use very soft shadows only
- Prefer borders over shadows
- Use consistent spacing scale
- Avoid animations unless subtle (fade, hover)

---

## PAGE-SPECIFIC GUIDELINES

Home Page:
- Centered layout
- Single input focus
- Calm call-to-action
- No distractions

Dashboard:
- Table-based layout
- Clear data hierarchy
- Muted secondary information
- Primary action clearly visible

Auth Pages:
- Minimal UI
- Focus on clarity
- No unnecessary elements

---

## DO NOT DO

- Do not use bright or neon colors
- Do not mix multiple font families
- Do not use default Tailwind blue/gray
- Do not over-style components

---

## FINAL EXPECTATION

The UI should feel:
- Calm
- Professional
- Modern
- Scalable
- Interview-ready

It should look like a real internal tool or developer product, not a demo or toy project.



FINAL Must have points

- must be fully responsive
- Dont generate any md file to explain me just work on creating project