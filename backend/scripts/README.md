# Backend Scripts

## Delete All Accounts

This script permanently deletes all user accounts and their associated expenses from the database.

### ⚠️ WARNING
This action cannot be undone. All user data will be permanently deleted.

### Usage

```bash
cd backend
npm run delete-all-accounts
```

Or directly:

```bash
node backend/scripts/deleteAllAccounts.js
```

### What it does:
1. Connects to MongoDB
2. Counts existing users and expenses
3. Deletes all expenses first
4. Deletes all users
5. Confirms deletion and closes connection

### Requirements
- MongoDB must be running
- `.env` file must be configured with `MONGODB_URI`
