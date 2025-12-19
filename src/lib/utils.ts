import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getDaysUntilDeadline(deadline: string): number {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    // Normalize to start of day to avoid timezone issues
    deadlineDate.setHours(23, 59, 59, 999);
    now.setHours(0, 0, 0, 0);
    return Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function isExpired(deadline: string): boolean {
    return getDaysUntilDeadline(deadline) < 0;
}

export function isUrgent(deadline: string): boolean {
    const days = getDaysUntilDeadline(deadline);
    return days < 3 && days > 0;
}