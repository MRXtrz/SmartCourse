export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://smartcourse-backend.onrender.com/';

export const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    registerAdmin: `${API_BASE_URL}/admin/create-admin`,
  },
  courses: {
    list: `${API_BASE_URL}/courses`,
    detail: (id: number) => `${API_BASE_URL}/courses/${id}`,
    create: `${API_BASE_URL}/courses`,
    update: (id: number) => `${API_BASE_URL}/courses/${id}`,
    delete: (id: number) => `${API_BASE_URL}/courses/${id}`,
  },
  lessons: {
    byCourse: (courseId: number) => `${API_BASE_URL}/lessons/courses/${courseId}/lessons`,
    detail: (id: number) => `${API_BASE_URL}/lessons/${id}`,
    create: `${API_BASE_URL}/lessons`,
    update: (id: number) => `${API_BASE_URL}/lessons/${id}`,
    delete: (id: number) => `${API_BASE_URL}/lessons/${id}`,
  },
  progress: {
    complete: `${API_BASE_URL}/progress/complete`,
    my: `${API_BASE_URL}/progress/my`,
    recommended: `${API_BASE_URL}/progress/recommended`,
  },
  ai: {
    chat: `${API_BASE_URL}/api/ai/chat`,
    assignmentCheck: `${API_BASE_URL}/api/ai/assignment/check`,
  },
  assignments: {
    byLesson: (lessonId: number) => `${API_BASE_URL}/assignments/lessons/${lessonId}/assignments`,
    detail: (id: number) => `${API_BASE_URL}/assignments/${id}`,
    submit: (id: number) => `${API_BASE_URL}/assignments/${id}/submit`,
    create: `${API_BASE_URL}/assignments`,
    update: (id: number) => `${API_BASE_URL}/assignments/${id}`,
    delete: (id: number) => `${API_BASE_URL}/assignments/${id}`,
  },
};

