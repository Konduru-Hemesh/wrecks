# Quick Setup Guide 🚀

Follow these simple steps to get the AI Receipt Reader running:

## Step 1: Install Node.js

If you don't have Node.js installed:
1. Go to https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer
4. Verify installation by opening terminal/command prompt and typing:
   ```bash
   node --version
   ```

## Step 2: Download/Clone the Project

```bash
git clone https://github.com/vistanoop/genAi_receipt.git
cd genAi_receipt
```

Or download the ZIP file from GitHub and extract it.

## Step 3: Install Dependencies

Open terminal in the project folder and run:
```bash
npm install
```

Wait for all packages to download (this may take 2-3 minutes).

## Step 4: Get Your Free API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click the "Create API Key" button
4. Copy the key that appears

## Step 5: Configure the API Key

1. Create a new file called `.env.local` in the project root folder
2. Open it in a text editor
3. Add this line:
   ```
   GEMINI_API_KEY=paste_your_actual_key_here
   ```
4. Replace `paste_your_actual_key_here` with the key you copied
5. Save the file

## Step 6: Run the Application

In the terminal, run:
```bash
npm run dev
```

You should see a message like:
```
  ▲ Next.js 15.0.5
  - Local:        http://localhost:3000
```

## Step 7: Use the App

1. Open your web browser
2. Go to: http://localhost:3000
3. Click "Scan Receipt with AI"
4. Choose a receipt image from your device
5. Wait a few seconds for the AI to process
6. See the extracted information!

## Common Issues & Solutions

### "Command not found: npm"
- Node.js is not installed or not in your PATH
- Reinstall Node.js and restart your terminal

### "Failed to scan receipt"
- Check your `.env.local` file has the correct API key
- Make sure the API key is valid (no extra spaces)
- Verify you're connected to the internet

### "Port 3000 is already in use"
Run on a different port:
```bash
npm run dev -- -p 3001
```
Then open http://localhost:3001

### Build errors after updating dependencies
Try clearing cache and reinstalling:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Testing with Sample Images

For best results:
- Use clear, well-lit receipt photos
- Ensure text is readable
- Keep image under 5MB
- Supported formats: JPG, PNG, HEIC

## Need More Help?

- Check the main [README.md](README.md) for detailed documentation
- Open an issue on GitHub
- Visit Google AI documentation: https://ai.google.dev/docs

---

**That's it! You're ready to use the AI Receipt Reader! 🎉**
