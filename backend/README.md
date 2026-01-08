# FlowCast Backend API

Backend server for FlowCast financial management application built with Express.js and MongoDB.

## Features

- ✅ User Authentication (Signup, Login, Logout)
- ✅ JWT Token-based Authentication
- ✅ Expense Management (CRUD operations)
- ✅ MongoDB Database Integration
- ✅ Secure Password Hashing with bcrypt
- ✅ Cookie-based Session Management

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/flowcast
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flowcast?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 3. Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### Expenses

- `GET /api/expenses` - Get all expenses (Protected)
- `POST /api/expenses` - Create new expense (Protected)
- `DELETE /api/expenses/:id` - Delete expense (Protected)

## MongoDB Setup

### Option 1: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/flowcast`

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env` file

## Project Structure

```
backend/
├── config/
│   ├── database.js      # MongoDB connection
│   └── jwt.js           # JWT utilities
├── controllers/
│   ├── authController.js
│   └── expenseController.js
├── middleware/
│   ├── auth.js          # Authentication middleware
│   └── errorHandler.js  # Error handling
├── models/
│   ├── User.js
│   └── Expense.js
├── routes/
│   ├── authRoutes.js
│   └── expenseRoutes.js
├── .env.example
├── package.json
├── server.js
└── README.md
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies
- CORS configuration
- Input validation
- User data isolation

## Development

The server uses ES6 modules. Make sure your Node.js version supports ES modules (Node 14+).
