import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0, 'Amount must be positive'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'housing',
        'transportation',
        'groceries',
        'utilities',
        'entertainment',
        'food',
        'shopping',
        'healthcare',
        'education',
        'personal',
        'travel',
        'insurance',
        'gifts',
        'bills',
        'other-expense',
      ],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ExpenseSchema.index({ userId: 1, date: -1 });

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
