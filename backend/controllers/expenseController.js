import Expense from '../models/Expense.js';

// @desc    Get all expenses for logged in user
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId })
      .sort({ date: -1 })
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses: expenses.map(exp => ({
        id: exp._id,
        amount: exp.amount,
        description: exp.description,
        category: exp.category,
        date: exp.date,
        receipt: exp.receipt,
        createdAt: exp.createdAt,
        updatedAt: exp.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expenses',
    });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res) => {
  try {
    const { amount, description, category, date, receipt } = req.body;

    // Validate input
    if (!amount || !description) {
      return res.status(400).json({
        success: false,
        error: 'Please provide amount and description',
      });
    }

    const expense = await Expense.create({
      user: req.userId,
      amount,
      description,
      category: category || 'Other',
      date: date || new Date(),
      receipt: receipt || null,
    });

    res.status(201).json({
      success: true,
      expense: {
        id: expense._id,
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
        date: expense.date,
        receipt: expense.receipt,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create expense',
    });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found',
      });
    }

    // Make sure expense belongs to user
    if (expense.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this expense',
      });
    }

    // Update fields
    if (amount !== undefined) expense.amount = amount;
    if (description !== undefined) expense.description = description;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = date;

    await expense.save();

    res.status(200).json({
      success: true,
      expense: {
        id: expense._id,
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
        date: expense.date,
        receipt: expense.receipt,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update expense',
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found',
      });
    }

    // Make sure expense belongs to user
    if (expense.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this expense',
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete expense',
    });
  }
};
