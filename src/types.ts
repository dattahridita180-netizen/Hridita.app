export interface UserProfile {
  name: string;
  level: number;
  points: number;
  studyHours: number;
  status: string; // 'lazy', 'active', etc.
  avatar: string;
}

export interface StudySession {
  id: string;
  subject: string;
  chapter: string;
  duration: number; // minutes
  date: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  chapter: string;
  date: string;
}

export interface Flashcard {
  question: string;
  answer: string;
}
