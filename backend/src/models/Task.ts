import mongoose, { Document, Model, Schema } from 'mongoose';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'work' | 'personal' | 'study' | 'health' | 'finance' | 'project' | 'other';

export interface ISubtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dateTime?: Date;
  deadline?: Date;
  priority: TaskPriority;
  category: TaskCategory;
  tags: string[];
  isCompleted: boolean;
  completedAt?: Date;
  subtasks: ISubtask[];
  reminderEnabled: boolean;
  color?: string;
  smartScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubtaskSchema = new Schema<ISubtask>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    isCompleted: { type: Boolean, default: false },
  },
  { _id: false }
);

const TaskSchema = new Schema<ITask>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    dateTime: {
      type: Date,
      default: null,
    },
    deadline: {
      type: Date,
      default: null,
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: 'Priority must be low, medium, high, or urgent',
      },
      default: 'medium',
      index: true,
    },
    category: {
      type: String,
      enum: {
        values: ['work', 'personal', 'study', 'health', 'finance', 'project', 'other'],
        message: 'Category must be a valid category',
      },
      default: 'personal',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    subtasks: {
      type: [SubtaskSchema],
      default: [],
    },
    reminderEnabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '#6366F1', // Default Indigo accent
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for fast queries by user and completion status
TaskSchema.index({ user: 1, isCompleted: 1, deadline: 1 });
TaskSchema.index({ user: 1, priority: 1 });

export const Task: Model<ITask> = mongoose.model<ITask>('Task', TaskSchema);
