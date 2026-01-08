import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
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
      default: 'other-expense',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    receipt: {
      type: String, // URL or path to receipt image
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ExpenseSchema.index({ user: 1, date: -1 });

const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);

export default Expense;
