# Quick Start Guide - AI Receipt Reader

## 🎯 What This Does

Upload a receipt photo → AI extracts the data → View the results

That's it! No login, no database, no complexity.

---

## 📦 What You Need

1. **Node.js 18+** - Download from https://nodejs.org/
2. **A Gemini API Key** - Free from https://makersuite.google.com/app/apikey

---

## 🚀 How to Run (5 Steps)

### Step 1: Get the Code
```bash
git clone https://github.com/vistanoop/genAi_receipt.git
cd genAi_receipt
```

### Step 2: Install Dependencies
```bash
npm install
```
⏱️ Takes about 1-2 minutes

### Step 3: Get Your API Key
1. Visit https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

### Step 4: Add Your API Key
Create a file called `.env.local` and add:
```
GEMINI_API_KEY=paste_your_key_here
```

### Step 5: Run It!
```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

---

## ✅ You'll See This:

1. A page with "AI Receipt Reader" title
2. A button "Scan Receipt with AI"
3. Click it, select a receipt image
4. Wait 2-5 seconds
5. See the extracted data!

---

## 📸 What Gets Extracted

- **Amount**: The total cost
- **Date**: When the purchase was made
- **Merchant**: Store/restaurant name
- **Category**: Type of purchase (groceries, food, etc.)
- **Description**: What was purchased

---

## 🛠️ Troubleshooting

**"npm: command not found"**
→ Install Node.js from https://nodejs.org/

**"Failed to scan receipt"**
→ Check your API key in `.env.local`

**"Port 3000 already in use"**
→ Run: `npm run dev -- -p 3001`

---

## 📚 More Info

- Full documentation: [README.md](README.md)
- Detailed setup: [SETUP.md](SETUP.md)
- What changed: [CHANGES.md](CHANGES.md)

---

## 🎉 That's All!

You now have a working AI receipt reader. No accounts, no database, no complexity - just AI-powered receipt scanning!
