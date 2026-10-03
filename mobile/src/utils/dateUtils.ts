import { format, isToday, isTomorrow, isYesterday, formatDistanceToNow, parseISO } from 'date-fns';

export function formatDateSafe(dateInput?: string | Date | null, formatStr: string = 'MMM d, yyyy'): string {
  if (!dateInput) return '';
  try {
    const d = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (isNaN(d.getTime())) return '';
    return format(d, formatStr);
  } catch {
    return '';
  }
}

export function formatDateTimeSafe(dateInput?: string | Date | null): string {
  if (!dateInput) return '';
  try {
    const d = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (isNaN(d.getTime())) return '';
    if (isToday(d)) return `Today at ${format(d, 'h:mm a')}`;
    if (isTomorrow(d)) return `Tomorrow at ${format(d, 'h:mm a')}`;
    if (isYesterday(d)) return `Yesterday at ${format(d, 'h:mm a')}`;
    return format(d, 'MMM d, h:mm a');
  } catch {
    return '';
  }
}

export function formatDeadlineRelative(deadlineInput?: string | Date | null): { text: string; isOverdue: boolean } {
  if (!deadlineInput) return { text: 'No deadline', isOverdue: false };
  try {
    const d = typeof deadlineInput === 'string' ? parseISO(deadlineInput) : deadlineInput;
    const now = new Date();
    const isOverdue = d.getTime() < now.getTime();

    if (isOverdue) {
      return {
        text: `Overdue (${formatDistanceToNow(d)} ago)`,
        isOverdue: true,
      };
    }

    if (isToday(d)) {
      return {
        text: `Due today at ${format(d, 'h:mm a')}`,
        isOverdue: false,
      };
    }

    if (isTomorrow(d)) {
      return {
        text: `Due tomorrow at ${format(d, 'h:mm a')}`,
        isOverdue: false,
      };
    }

    return {
      text: `Due ${format(d, 'MMM d, h:mm a')}`,
      isOverdue: false,
    };
  } catch {
    return { text: 'Invalid date', isOverdue: false };
  }
}
