import { Task, TaskPriority, SmartScoreMeta } from '../types/task.types';

/**
 * Client-side Smart Urgency & Priority Mix Algorithm
 * Evaluates dynamic score based on Priority level, Deadline proximity, and Age.
 */
export function calculateClientSmartScore(task: Partial<Task>, referenceTime: Date = new Date()): SmartScoreMeta {
  if (task.isCompleted) {
    return {
      score: -1000,
      urgencyLevel: 'COMPLETED',
      urgencyLabel: 'Completed',
      hoursRemaining: null,
      overdue: false,
    };
  }

  const priorityWeights: Record<TaskPriority, number> = {
    urgent: 45,
    high: 30,
    medium: 18,
    low: 8,
  };
  const baseWeight = priorityWeights[task.priority || 'medium'] || 18;

  let deadlineFactor = 0;
  let urgencyLevel: SmartScoreMeta['urgencyLevel'] = 'ON_TRACK';
  let urgencyLabel = 'On Track';
  let hoursRemaining: number | null = null;
  let isOverdue = false;

  if (task.deadline) {
    const deadlineTime = new Date(task.deadline).getTime();
    const nowTime = referenceTime.getTime();
    const diffMs = deadlineTime - nowTime;
    hoursRemaining = Math.round(diffMs / (1000 * 60 * 60));

    if (diffMs < 0) {
      isOverdue = true;
      const hoursOverdue = Math.abs(diffMs) / (1000 * 60 * 60);
      deadlineFactor = 55 + Math.min(35, hoursOverdue * 1.5);
      urgencyLevel = 'OVERDUE';
      urgencyLabel = `Overdue by ${formatDuration(Math.abs(diffMs))}`;
    } else {
      const hoursLeft = diffMs / (1000 * 60 * 60);

      if (hoursLeft <= 6) {
        deadlineFactor = 42 * (1 - hoursLeft / 6) + 15;
        urgencyLevel = 'CRITICAL';
        urgencyLabel = `Due in ${formatDuration(diffMs)}`;
      } else if (hoursLeft <= 24) {
        deadlineFactor = 32 * (1 - hoursLeft / 24) + 10;
        urgencyLevel = 'CRITICAL';
        urgencyLabel = `Due in ${Math.ceil(hoursLeft)}h`;
      } else if (hoursLeft <= 72) {
        deadlineFactor = 20 * (1 - hoursLeft / 72) + 5;
        urgencyLevel = 'NEAR_DEADLINE';
        urgencyLabel = `Due in ${Math.ceil(hoursLeft / 24)} days`;
      } else if (hoursLeft <= 168) {
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

  let ageFactor = 0;
  if (task.createdAt) {
    const createdTime = new Date(task.createdAt).getTime();
    const ageDays = (referenceTime.getTime() - createdTime) / (1000 * 60 * 60 * 24);
    ageFactor = Math.min(8, ageDays * 1.2);
  }

  let subtaskFactor = 0;
  if (task.subtasks && task.subtasks.length > 0) {
    const doneCount = task.subtasks.filter((s) => s.isCompleted).length;
    const progress = doneCount / task.subtasks.length;
    if (progress > 0 && progress < 1) {
      subtaskFactor = 5;
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

function formatDuration(ms: number): string {
  const mins = Math.floor(ms / (1000 * 60));
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ${mins % 60}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}
