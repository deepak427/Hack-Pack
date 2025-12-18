export interface Hackathon {
  id: string;
  title: string;
  url: string;
  deadline: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PLANNED' | 'REGISTERED' | 'IN_PROGRESS' | 'SUBMITTED' | 'WON' | 'LOST' | 'EXPIRED' | 'ABANDONED';
  notes?: string;
  theme?: string;
  prize_pool?: string;
  created_at: string;
  updated_at: string;
}
