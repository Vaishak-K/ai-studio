# AI Studio

A full-stack web application for AI-powered fashion image generation, built with Next.js 16, Node.js, and TypeScript.

## 🚀 Features

- 🔐 Secure JWT authentication (signup/login)
- 🖼️ Image upload with live preview (max 10MB, JPEG/PNG)
- ✨ Simulated AI generation with style options
- 🔄 Automatic retry logic with exponential backoff
- ⚡ Abort in-flight requests
- 📜 Generation history (last 5 items)
- ♿ Accessible and responsive UI
- 🎯 Comprehensive test coverage

## 📋 Prerequisites

- Node.js 18+
- npm or yarn

## 🛠️ Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd mini-ai-studio
```

### 2. Install dependencies

```bash

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Environment variables

````bash
backend/.env

```text

PORT=3001
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=development
````

```bash
frontend/.env.local


NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Run the application

```bash
Terminal 1 - Backend:

bash

cd backend
npm run dev
```

```bash
Terminal 2 - Frontend:

bash

cd frontend
npm run dev
```

Visit http://localhost:3000

## 🧪 Testing

### Backend tests

```bash

cd backend
npm test
npm run test:coverage
```

### Frontend tests

```bash

cd frontend
npm test
npm run test:coverage
```

E2E tests

```bash
cd tests
npx playwright test
```

📁 Project Structure

```text

mini-ai-studio/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── index.ts
│   └── tests/
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── studio/
│   │   └── layout.tsx
│   ├── components/
│   ├── hooks/
│   └── lib/
└── tests/e2e/
```

## 🎯 Key Features Implementation

### Authentication

    JWT-based auth with bcrypt password hashing
    Token stored in localStorage
    Protected routes with middleware

### Image Generation

    20% simulated error rate ("Model overloaded")
    Automatic retry up to 3 times with exponential backoff
    AbortController for canceling requests
    Image resizing to max 1920px width

### User Experience

    Real-time image preview
    Loading states and spinners
    Error messages with retry information
    Keyboard navigation
    Responsive design

## 📊 API Endpoints

See OPENAPI.yaml for complete API specification.

    POST /auth/signup - Create account
    POST /auth/login - Login
    POST /generations - Create generation
    GET /generations?limit=5 - Get recent generations

## 🔧 Tech Stack

### Frontend:

    Next.js 16 (App Router)
    TypeScript (strict mode)
    Tailwind CSS
    React Testing Library

### Backend:

    Node.js
    Express
    TypeScript (strict mode)
    SQLite/better-sqlite3
    JWT + bcrypt
    Zod validation
    Jest + Supertest

### DevOps:

    ESLint + Prettier
    GitHub Actions CI
    Playwright E2E tests

## 📝 TODO / Future Improvements

```test
o Add image CDN integration
o Implement dark mode
o Add pagination for history
o Real-time generation status with WebSockets
o Image compression before upload
o Add more style options
o Rate limiting
o Redis caching
```
