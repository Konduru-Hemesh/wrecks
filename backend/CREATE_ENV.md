# Create .env File

Since `.env` files are protected, please create it manually:

## Steps:

1. **Create a new file** named `.env` in the `backend` folder

2. **Copy and paste this content:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# For local MongoDB (default):
MONGODB_URI=mongodb://localhost:27017/spendahead

# For MongoDB Atlas (cloud), uncomment and update:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spendahead?retryWrites=true&w=majority

# JWT Configuration
# This is a secure random key - keep it secret!
JWT_SECRET=ZwWuE0qfygOtcwVmDDWrpspeoyy4/LCzC9uFpbw2RjU=
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## About JWT_SECRET:

The JWT_SECRET is used to sign and verify JWT tokens. It should be:
- **Long and random** (at least 32 characters)
- **Kept secret** (never commit to git)
- **Unique** for each environment

The value provided above (`ZwWuE0qfygOtcwVmDDWrpspeoyy4/LCzC9uFpbw2RjU=`) is a secure random key generated for you.

### To generate your own JWT_SECRET:

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## MongoDB Setup:

### Option 1: Local MongoDB
If you have MongoDB installed locally, use:
```
MONGODB_URI=mongodb://localhost:27017/spendahead
```

### Option 2: MongoDB Atlas (Cloud)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace the MONGODB_URI in .env

Example:
```
MONGODB_URI=mongodb+srv://myusername:mypassword@cluster0.xxxxx.mongodb.net/spendahead?retryWrites=true&w=majority
```

## After creating .env:

1. Save the file
2. Restart your backend server
3. The error should be gone!
