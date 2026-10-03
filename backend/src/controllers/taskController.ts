import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Task, ITask } from '../models/Task';
import { calculateSmartScore, sortTasksSmartly } from '../utils/priorityAlgorithm';

/**
 * @desc    Get all tasks for authenticated user with search, filter, and smart sorting
 * @route   GET /api/tasks
 * @access  Private
 */
export const getTasks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;
    const {
      search,
      status = 'all',
      priority = 'all',
      category = 'all',
      tag,
      sort = 'smart',
      page = 1,
      limit = 50,
    } = req.query as any;

    // Build Mongoose filter query
    const filter: any = { user: userId };

    // Status filter
    if (status === 'pending') {
      filter.isCompleted = false;
    } else if (status === 'completed') {
      filter.isCompleted = true;
    }

    // Priority filter
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Tag filter
    if (tag) {
      filter.tags = tag;
    }

    // Search filter (regex across title and description)
    if (search && search.trim() !== '') {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { tags: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Fetch matching tasks
    let query = Task.find(filter);

    // Apply DB sorting if standard sort
    if (sort === 'deadline_asc') {
      query = query.sort({ deadline: 1, createdAt: -1 });
    } else if (sort === 'deadline_desc') {
      query = query.sort({ deadline: -1 });
    } else if (sort === 'priority_desc') {
      query = query.sort({ priority: 1, deadline: 1 });
    } else if (sort === 'created_desc') {
      query = query.sort({ createdAt: -1 });
    } else if (sort === 'title_asc') {
      query = query.sort({ title: 1 });
    }

    const tasks = await query.exec();

    // Map tasks and calculate smart scores
    let processedTasks = tasks.map((task) => {
      const taskObj = task.toObject();
      const smartScoreMeta = calculateSmartScore(taskObj);
      return {
        ...taskObj,
        smartScoreMeta,
      };
    });

    // If 'smart' sort requested, apply multi-factor urgency algorithm
    if (sort === 'smart') {
      processedTasks = processedTasks.sort(
        (a, b) => b.smartScoreMeta.score - a.smartScoreMeta.score
      );
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const totalCount = processedTasks.length;
    const paginatedTasks = processedTasks.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.status(200).json({
      success: true,
      count: paginatedTasks.length,
      total: totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum) || 1,
      data: paginatedTasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
export const getTaskById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    const taskObj = task.toObject();
    const smartScoreMeta = calculateSmartScore(taskObj);

    res.status(200).json({
      success: true,
      data: {
        ...taskObj,
        smartScoreMeta,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      description,
      dateTime,
      deadline,
      priority,
      category,
      tags,
      subtasks,
      reminderEnabled,
      color,
    } = req.body;

    const task = await Task.create({
      user: req.userId,
      title,
      description,
      dateTime: dateTime ? new Date(dateTime) : null,
      deadline: deadline ? new Date(deadline) : null,
      priority: priority || 'medium',
      category: category || 'personal',
      tags: tags || [],
      subtasks: subtasks || [],
      reminderEnabled: !!reminderEnabled,
      color: color || '#6366F1',
      isCompleted: false,
    });

    const taskObj = task.toObject();
    const smartScoreMeta = calculateSmartScore(taskObj);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: {
        ...taskObj,
        smartScoreMeta,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing task
 * @route   PATCH /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    const updates = req.body;

    // Handle completedAt timestamp
    if (updates.isCompleted !== undefined && updates.isCompleted !== task.isCompleted) {
      task.isCompleted = updates.isCompleted;
      task.completedAt = updates.isCompleted ? new Date() : undefined;
    }

    if (updates.title !== undefined) task.title = updates.title;
    if (updates.description !== undefined) task.description = updates.description;
    if (updates.dateTime !== undefined) task.dateTime = updates.dateTime ? new Date(updates.dateTime) : undefined;
    if (updates.deadline !== undefined) task.deadline = updates.deadline ? new Date(updates.deadline) : undefined;
    if (updates.priority !== undefined) task.priority = updates.priority;
    if (updates.category !== undefined) task.category = updates.category;
    if (updates.tags !== undefined) task.tags = updates.tags;
    if (updates.subtasks !== undefined) task.subtasks = updates.subtasks;
    if (updates.reminderEnabled !== undefined) task.reminderEnabled = updates.reminderEnabled;
    if (updates.color !== undefined) task.color = updates.color;

    await task.save();

    const taskObj = task.toObject();
    const smartScoreMeta = calculateSmartScore(taskObj);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: {
        ...taskObj,
        smartScoreMeta,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle task completed status
 * @route   PATCH /api/tasks/:id/toggle
 * @access  Private
 */
export const toggleTaskStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    task.isCompleted = !task.isCompleted;
    task.completedAt = task.isCompleted ? new Date() : undefined;

    await task.save();

    const taskObj = task.toObject();
    const smartScoreMeta = calculateSmartScore(taskObj);

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.isCompleted ? 'completed' : 'pending'}`,
      data: {
        ...taskObj,
        smartScoreMeta,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get aggregate task analytics & productivity statistics
 * @route   GET /api/tasks/stats/summary
 * @access  Private
 */
export const getTaskStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const allTasks = await Task.find({ user: userId });

    const total = allTasks.length;
    const completed = allTasks.filter((t) => t.isCompleted).length;
    const pending = total - completed;

    // Overdue tasks: pending and deadline < now
    const overdue = allTasks.filter(
      (t) => !t.isCompleted && t.deadline && new Date(t.deadline) < now
    ).length;

    // Due Today: pending and deadline between startOfToday and endOfToday
    const dueToday = allTasks.filter(
      (t) =>
        !t.isCompleted &&
        t.deadline &&
        new Date(t.deadline) >= startOfToday &&
        new Date(t.deadline) <= endOfToday
    ).length;

    // Priority breakdown
    const priorityCounts = {
      urgent: allTasks.filter((t) => !t.isCompleted && t.priority === 'urgent').length,
      high: allTasks.filter((t) => !t.isCompleted && t.priority === 'high').length,
      medium: allTasks.filter((t) => !t.isCompleted && t.priority === 'medium').length,
      low: allTasks.filter((t) => !t.isCompleted && t.priority === 'low').length,
    };

    // Category breakdown
    const categoryCounts: Record<string, number> = {};
    allTasks.forEach((t) => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        overdue,
        dueToday,
        completionRate,
        priorityCounts,
        categoryCounts,
      },
    });
  } catch (error) {
    next(error);
  }
};
