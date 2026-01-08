import Goal from '../models/Goal.js';

// @desc    Get all goals for logged in user
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      goals: goals.map(goal => ({
        id: goal._id.toString(),
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        monthlyContribution: goal.monthlyContribution,
        targetDate: goal.targetDate.toISOString().split('T')[0],
        priority: goal.priority,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch goals',
    });
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, monthlyContribution, targetDate, priority } = req.body;

    // Validate input
    if (!name || !targetAmount || !monthlyContribution || !targetDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, targetAmount, monthlyContribution, and targetDate',
      });
    }

    const goal = await Goal.create({
      user: req.userId,
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      monthlyContribution: parseFloat(monthlyContribution),
      targetDate: new Date(targetDate),
      priority: priority || 'medium',
    });

    res.status(201).json({
      success: true,
      goal: {
        id: goal._id.toString(),
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        monthlyContribution: goal.monthlyContribution,
        targetDate: goal.targetDate.toISOString().split('T')[0],
        priority: goal.priority,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create goal',
    });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, monthlyContribution, targetDate, priority } = req.body;

    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found',
      });
    }

    // Make sure goal belongs to user
    if (goal.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this goal',
      });
    }

    // Update fields
    if (name !== undefined) goal.name = name;
    if (targetAmount !== undefined) goal.targetAmount = parseFloat(targetAmount);
    if (currentAmount !== undefined) goal.currentAmount = parseFloat(currentAmount);
    if (monthlyContribution !== undefined) goal.monthlyContribution = parseFloat(monthlyContribution);
    if (targetDate !== undefined) goal.targetDate = new Date(targetDate);
    if (priority !== undefined) goal.priority = priority;

    await goal.save();

    res.status(200).json({
      success: true,
      goal: {
        id: goal._id.toString(),
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        monthlyContribution: goal.monthlyContribution,
        targetDate: goal.targetDate.toISOString().split('T')[0],
        priority: goal.priority,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update goal',
    });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found',
      });
    }

    // Make sure goal belongs to user
    if (goal.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this goal',
      });
    }

    await goal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete goal',
    });
  }
};
