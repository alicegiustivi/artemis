export interface Profile {
  id: string;
  last_period_date: string;
  average_cycle_length: number;
  birth_year: number;
  created_at: string;
  updated_at: string;
}

export interface PhaseContent {
  id: string;
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  energy: string;
  nutrition: string;
  movement: string;
  created_at: string;
  updated_at: string;
}

export interface CalendarDay {
  date: Date;
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  dayInCycle: number;
  isToday: boolean;
}
