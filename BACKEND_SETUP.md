# Backend Setup Guide

## Quick Start

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File

Create a `.env` file in the `backend` directory with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/flowcast

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flowcast?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 4. Start the Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The backend will run on `http://localhost:5000`

## MongoDB Setup Options

### Option 1: Local MongoDB

1. **Install MongoDB:**
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Mac: `brew install mongodb-community`
   - Linux: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB:**
   - Windows: MongoDB should start as a service automatically
   - Mac/Linux: `mongod --dbpath ~/data/db`

3. **Use connection string:**
   ```
   MONGODB_URI=mongodb://localhost:27017/flowcast
   ```

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. **Create Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select your preferred region
   - Click "Create"

3. **Create Database User:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set privileges to "Atlas Admin"

4. **Whitelist IP Address:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `flowcast`

6. **Update .env file:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flowcast?retryWrites=true&w=majority
   ```

## Generate JWT Secret

You can generate a secure JWT secret using:

**Online:**
- Visit: https://randomkeygen.com/
- Use a "CodeIgniter Encryption Keys" or generate a random 64-character string

**Command Line:**
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Testing the Backend

### Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test1234"}'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

## Frontend Configuration

The frontend is already configured to use the backend. Make sure:

1. Backend is running on `http://localhost:5000`
2. Frontend is running on `http://localhost:3000`
3. Both servers are running simultaneously

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoServerError: Authentication failed"**
- Check your MongoDB username and password
- Make sure database user has proper permissions

**Error: "MongoNetworkError: connect ECONNREFUSED"**
- Make sure MongoDB is running
- Check if MongoDB is on the correct port (default: 27017)
- For Atlas: Check IP whitelist settings

### Port Already in Use

**Error: "Port 5000 already in use"**
- Change PORT in `.env` file to a different port (e.g., 5001)
- Update `FRONTEND_URL` if needed
- Update `API_BASE_URL` in frontend `lib/apiConfig.js` if you change the port

### CORS Issues

If you see CORS errors:
- Make sure `FRONTEND_URL` in `.env` matches your frontend URL
- Check that `credentials: 'include'` is set in frontend fetch calls

## Project Structure

```
backend/
├── config/
│   ├── database.js      # MongoDB connection
│   └── jwt.js           # JWT utilities
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── expenseController.js # Expense management
├── middleware/
│   ├── auth.js          # Authentication middleware
│   └── errorHandler.js  # Error handling
├── models/
│   ├── User.js          # User model
│   └── Expense.js       # Expense model
├── routes/
│   ├── authRoutes.js    # Auth endpoints
│   └── expenseRoutes.js # Expense endpoints
├── .env                 # Environment variables (create this)
├── .gitignore
├── package.json
├── server.js            # Main server file
└── README.md
```

## Next Steps

1. ✅ Backend is set up and running
2. ✅ Frontend is configured to use backend
3. ✅ Test login and signup functionality
4. ✅ Start using the application!

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify MongoDB connection
3. Check environment variables
4. Ensure both frontend and backend are running
