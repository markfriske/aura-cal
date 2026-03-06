export type UserRole = 'household-admin' | 'member';

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  calendarName: string;
  color: string;
  isAllDay: boolean;
  isSystem?: boolean;
}

export interface FamilyNote {
  id: string;
  content: string;
  author: string;
  color: string;
  created_at: Date; 
  assigned_to?: string; 
  category?: 'general' | 'meal' | 'task';
}

export interface ShoppingListItem {
  id: string;
  text: string;
  completed: boolean;
  added_by: string;
}

export enum ViewMode {
  AUTH = 'auth',
  ONBOARDING = 'onboarding',
  CALENDAR = 'calendar',
  WEEK = 'week',
  LIST = 'list',
  BOARD = 'board',
  AI_ASSISTANT = 'ai_assistant',
  CONNECTIONS = 'connections',
  SETTINGS = 'settings',
  LEGAL = 'legal',
  AMBIENT = 'ambient',
  ADMIN = 'admin',
  DIAGNOSTICS = 'diagnostics',
  DOCS = 'docs'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface CalendarSource {
  id: string;
  name: string;
  url: string;
  color: string;
  provider: 'icloud' | 'google' | 'outlook' | 'other';
  lastSynced?: string;
}

export interface AppSettings {
  familyDisplayName: string;
  onboardingComplete: boolean;
  ambientModeEnabled: boolean;
  members: string[];
  isPro?: boolean;
  activeTheme?: string;
  lowPowerMode: boolean;
  calendars: CalendarSource[];
  betaUser?: boolean;
}