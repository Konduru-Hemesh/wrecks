import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Expense from '@/models/Expense';
import { requireAuth } from '@/lib/auth';

// DELETE an expense
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth; // Return error response
    }

    await connectDB();

    const { id } = params;

    // Find expense and verify ownership
    const expense = await Expense.findById(id);

    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    // Verify that the expense belongs to the authenticated user
    if (expense.userId.toString() !== auth.userId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this expense' },
        { status: 403 }
      );
    }

    // Delete the expense
    await Expense.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: 'Expense deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete expense error:', error);
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    );
  }
}
