import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a goal name'],
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, 'Please provide a target amount'],
      min: [0, 'Target amount must be positive'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current amount must be positive'],
    },
    monthlyContribution: {
      type: Number,
      required: [true, 'Please provide a monthly contribution'],
      min: [0, 'Monthly contribution must be positive'],
    },
    targetDate: {
      type: Date,
      required: [true, 'Please provide a target date'],
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
GoalSchema.index({ user: 1, createdAt: -1 });

const Goal = mongoose.models.Goal || mongoose.model('Goal', GoalSchema);

export default Goal;
