import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Expense from "@/models/Expense";
import { requireAuth } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    // Check authentication
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth; // Return error response
    }

    await connectDB();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Convert ArrayBuffer to Base64
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If it's not a receipt, return an empty object
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);
      
      // Validate extracted amount
      const amount = parseFloat(data.amount);
      if (isNaN(amount) || amount <= 0) {
        return NextResponse.json(
          { error: "Invalid amount extracted from receipt" },
          { status: 400 }
        );
      }
      
      // Create expense in database
      const expense = await Expense.create({
        userId: auth.userId,
        amount: amount,
        category: data.category || "other-expense",
        description: data.description || data.merchantName || "Receipt expense",
        date: data.date ? new Date(data.date) : new Date(),
      });

      return NextResponse.json({
        success: true,
        message: "Receipt scanned and expense added",
        expense: {
          id: expense._id.toString(),
          amount: expense.amount,
          date: expense.date,
          description: expense.description,
          category: expense.category,
          merchantName: data.merchantName || "",
        },
      });
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      return NextResponse.json(
        { error: "Invalid response format from AI" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error scanning receipt:", error);
    return NextResponse.json(
      { error: "Failed to scan receipt: " + error.message },
      { status: 500 }
    );
  }
}
