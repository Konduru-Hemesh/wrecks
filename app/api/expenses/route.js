import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Expense from '@/models/Expense';
import { requireAuth } from '@/lib/auth';

// GET all expenses for the logged-in user
export async function GET(request) {
  try {
    // Check authentication
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth; // Return error response
    }

    await connectDB();

    // Get expenses for this user, sorted by date (newest first)
    const expenses = await Expense.find({ userId: auth.userId })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        expenses: expenses.map(expense => ({
          id: expense._id.toString(),
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          date: expense.date,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get expenses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

// POST create a new expense
export async function POST(request) {
  try {
    // Check authentication
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth; // Return error response
    }

    await connectDB();

    const { amount, category, description, date } = await request.json();

    // Validate input
    if (!amount || !category || !description) {
      return NextResponse.json(
        { error: 'Please provide amount, category, and description' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Create expense
    const expense = await Expense.create({
      userId: auth.userId,
      amount: parseFloat(amount),
      category,
      description,
      date: date ? new Date(date) : new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Expense added successfully',
        expense: {
          id: expense._id.toString(),
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          date: expense.date,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create expense error:', error);
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}
