import { ITask, TaskPriority } from '../models/Task';

export interface SmartScoreResult {
  score: number;
  urgencyLevel: 'OVERDUE' | 'CRITICAL' | 'NEAR_DEADLINE' | 'UPCOMING' | 'ON_TRACK' | 'COMPLETED';
  urgencyLabel: string;
  hoursRemaining: number | null;
  overdue: boolean;
}

/**
 * Calculates a dynamic multi-factor priority score for a task.
 * Higher score = higher priority in the list.
 *
 * Algorithm Factors:
 * 1. Base Priority Weight (urgent=45, high=30, medium=18, low=8)
 * 2. Deadline Urgency Factor (Time decay function + exponential penalty for overdue tasks)
 * 3. Starvation Prevention (Older pending tasks get a slight continuous score boost)
 * 4. Completion Penalty (Completed tasks sink to the bottom with score -1000)
 */
export function calculateSmartScore(task: Partial<ITask>, referenceTime: Date = new Date()): SmartScoreResult {
  if (task.isCompleted) {
    return {
      score: -1000,
      urgencyLevel: 'COMPLETED',
      urgencyLabel: 'Completed',
      hoursRemaining: null,
      overdue: false,
    };
  }

  // 1. Base Priority Points
  const priorityWeights: Record<TaskPriority, number> = {
    urgent: 45,
    high: 30,
    medium: 18,
    low: 8,
  };
  const baseWeight = priorityWeights[task.priority || 'medium'] || 18;

  let deadlineFactor = 0;
  let urgencyLevel: SmartScoreResult['urgencyLevel'] = 'ON_TRACK';
  let urgencyLabel = 'On Track';
  let hoursRemaining: number | null = null;
  let isOverdue = false;

  // 2. Deadline Urgency Factor
  if (task.deadline) {
    const deadlineTime = new Date(task.deadline).getTime();
    const nowTime = referenceTime.getTime();
    const diffMs = deadlineTime - nowTime;
    hoursRemaining = Math.round(diffMs / (1000 * 60 * 60));

    if (diffMs < 0) {
      // Overdue: Heavy penalty scaling with how many hours/days overdue
      isOverdue = true;
      const hoursOverdue = Math.abs(diffMs) / (1000 * 60 * 60);
      deadlineFactor = 55 + Math.min(35, hoursOverdue * 1.5);
      urgencyLevel = 'OVERDUE';
      urgencyLabel = `Overdue by ${formatDuration(Math.abs(diffMs))}`;
    } else {
      const hoursLeft = diffMs / (1000 * 60 * 60);

      if (hoursLeft <= 6) {
        // Less than 6 hours
        deadlineFactor = 42 * (1 - hoursLeft / 6) + 15;
        urgencyLevel = 'CRITICAL';
        urgencyLabel = `Due in ${formatDuration(diffMs)}`;
      } else if (hoursLeft <= 24) {
        // Less than 24 hours (Today)
        deadlineFactor = 32 * (1 - hoursLeft / 24) + 10;
        urgencyLevel = 'CRITICAL';
        urgencyLabel = `Due in ${Math.ceil(hoursLeft)}h`;
      } else if (hoursLeft <= 72) {
        // Within 3 days
        deadlineFactor = 20 * (1 - hoursLeft / 72) + 5;
        urgencyLevel = 'NEAR_DEADLINE';
        urgencyLabel = `Due in ${Math.ceil(hoursLeft / 24)} days`;
      } else if (hoursLeft <= 168) {
        // Within 7 days
        deadlineFactor = 10 * (1 - hoursLeft / 168);
        urgencyLevel = 'UPCOMING';
        urgencyLabel = `Due this week`;
      } else {
        deadlineFactor = 2;
        urgencyLevel = 'ON_TRACK';
        urgencyLabel = 'Later';
      }
    }
  }

  // 3. Task Age / Starvation Factor
  let ageFactor = 0;
  if (task.createdAt) {
    const createdTime = new Date(task.createdAt).getTime();
    const ageDays = (referenceTime.getTime() - createdTime) / (1000 * 60 * 60 * 24);
    ageFactor = Math.min(8, ageDays * 1.2);
  }

  // 4. Subtask Progress Factor (Bonus nudge if partially done)
  let subtaskFactor = 0;
  if (task.subtasks && task.subtasks.length > 0) {
    const doneCount = task.subtasks.filter((s) => s.isCompleted).length;
    const progress = doneCount / task.subtasks.length;
    if (progress > 0 && progress < 1) {
      subtaskFactor = 5; // Near completion bonus
    }
  }

  const totalScore = Math.round(baseWeight + deadlineFactor + ageFactor + subtaskFactor);

  return {
    score: totalScore,
    urgencyLevel,
    urgencyLabel,
    hoursRemaining,
    overdue: isOverdue,
  };
}

/**
 * Helper to format duration into human-readable string
 */
function formatDuration(ms: number): string {
  const mins = Math.floor(ms / (1000 * 60));
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ${mins % 60}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

/**
 * Sorts an array of tasks using the Smart Mix Algorithm
 */
export function sortTasksSmartly<T extends Partial<ITask>>(tasks: T[], referenceTime: Date = new Date()): (T & { smartScoreMeta: SmartScoreResult })[] {
  return tasks
    .map((task) => ({
      ...task,
      smartScoreMeta: calculateSmartScore(task, referenceTime),
    }))
    .sort((a, b) => b.smartScoreMeta.score - a.smartScoreMeta.score);
}
