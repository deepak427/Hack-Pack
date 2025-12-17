export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum Status {
  PLANNED = 'PLANNED',
  REGISTERED = 'REGISTERED',
  SUBMITTED = 'SUBMITTED',
  WON = 'WON',
  LOST = 'LOST',
  EXPIRED = 'EXPIRED',
  ABANDONED = 'ABANDONED',
}

export interface Hackathon {
  id: string;
  title: string;
  url: string;
  deadline: string; // ISO Date String
  priority: Priority;
  status: Status;
  notes?: string;
  aiIdeas?: string; // Markdown content from Gemini
  createdAt: string;
}

export type SortOption = 'DEADLINE_ASC' | 'DEADLINE_DESC' | 'PRIORITY_HIGH' | 'PRIORITY_LOW';

export interface HackathonStats {
  total: number;
  upcoming: number;
  won: number;
  expired: number;
}