import { z } from 'zod';

const subtaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Subtask title cannot be empty'),
  isCompleted: z.boolean().default(false),
});

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Task title is required' })
    .min(1, 'Title cannot be empty')
    .max(120, 'Title cannot exceed 120 characters')
    .trim(),
  description: z.string().max(1000).optional().default(''),
  dateTime: z.string().datetime({ offset: true }).or(z.string()).optional().nullable(),
  deadline: z.string().datetime({ offset: true }).or(z.string()).optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  category: z.enum(['work', 'personal', 'study', 'health', 'finance', 'project', 'other']).default('personal'),
  tags: z.array(z.string()).optional().default([]),
  subtasks: z.array(subtaskSchema).optional().default([]),
  reminderEnabled: z.boolean().optional().default(false),
  color: z.string().optional().default('#6366F1'),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(120).trim().optional(),
  description: z.string().max(1000).optional(),
  dateTime: z.string().datetime({ offset: true }).or(z.string()).optional().nullable(),
  deadline: z.string().datetime({ offset: true }).or(z.string()).optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z.enum(['work', 'personal', 'study', 'health', 'finance', 'project', 'other']).optional(),
  tags: z.array(z.string()).optional(),
  isCompleted: z.boolean().optional(),
  subtasks: z.array(subtaskSchema).optional(),
  reminderEnabled: z.boolean().optional(),
  color: z.string().optional(),
});

export const queryTasksSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['all', 'pending', 'completed']).optional().default('all'),
  priority: z.enum(['all', 'low', 'medium', 'high', 'urgent']).optional().default('all'),
  category: z.string().optional().default('all'),
  tag: z.string().optional(),
  sort: z
    .enum(['smart', 'deadline_asc', 'deadline_desc', 'priority_desc', 'created_desc', 'title_asc'])
    .optional()
    .default('smart'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(50),
});
