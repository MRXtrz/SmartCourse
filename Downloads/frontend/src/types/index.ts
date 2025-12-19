export type UserRole = 'user' | 'admin';

export const UserRoleEnum = {
  USER: 'user' as const,
  ADMIN: 'admin' as const,
};

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseWithProgress extends Course {
  progress_percentage: number;
  total_lessons: number;
  completed_lessons: number;
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface LessonWithProgress extends Lesson {
  completed: boolean;
}

export interface Progress {
  id: number;
  user_id: number;
  lesson_id: number;
  course_id: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressSummary {
  course_id: number;
  course_title: string;
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
}

export interface AIChatRequest {
  course_title: string;
  lesson_title: string;
  question: string;
}

export interface AIChatResponse {
  answer: string;
}

export interface AIAssignmentCheckRequest {
  course_title: string;
  lesson_title: string;
  assignment_title: string;
  assignment_instructions: string;
  user_answer: string;
}

export interface AIAssignmentCheckResponse {
  is_correct: boolean;
  explanation: string;
  suggested_answer?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Assignment {
  id: number;
  lesson_id: number;
  title: string;
  description: string;
  instructions: string;
  created_at: string;
  updated_at: string;
}

export interface AssignmentSubmission {
  id: number;
  assignment_id: number;
  user_id: number;
  answer: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AssignmentWithSubmission extends Assignment {
  submission?: AssignmentSubmission;
}

