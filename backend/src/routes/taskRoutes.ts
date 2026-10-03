import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
  getTaskStats,
} from '../controllers/taskController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createTaskSchema,
  updateTaskSchema,
  queryTasksSchema,
} from '../validations/task.validation';

const router = Router();

// All task routes require authentication
router.use(protect);

// Analytics & Stats summary
router.get('/stats/summary', getTaskStats);

// Tasks collection routes
router.route('/')
  .get(validate(queryTasksSchema, 'query'), getTasks)
  .post(validate(createTaskSchema, 'body'), createTask);

// Single task routes
router.route('/:id')
  .get(getTaskById)
  .patch(validate(updateTaskSchema, 'body'), updateTask)
  .delete(deleteTask);

// Fast toggle completion status
router.patch('/:id/toggle', toggleTaskStatus);

export default router;
