import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import type { Course, Lesson, Assignment } from '../types';
import { Plus, Edit, Trash2, BookOpen, FileText, ClipboardList, UserPlus, Shield } from 'lucide-react';

const AdminPanel = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [courseForm, setCourseForm] = useState({ title: '', description: '' });
  const [lessonForm, setLessonForm] = useState({ title: '', content: '', course_id: 0 });
  const [assignmentForm, setAssignmentForm] = useState({ 
    title: '', 
    description: '', 
    instructions: '', 
    lesson_id: 0 
  });
  const [adminForm, setAdminForm] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchLessons(selectedCourseId);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedLessonId) {
      fetchAssignments(selectedLessonId);
    }
  }, [selectedLessonId]);

  const fetchCourses = async () => {
    try {
      const response = await api.get<Course[]>(API_ENDPOINTS.courses.list);
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async (courseId: number) => {
    try {
      const response = await api.get(API_ENDPOINTS.lessons.byCourse(courseId));
      setLessons(response.data);
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    }
  };

  const fetchAssignments = async (lessonId: number) => {
    try {
      const response = await api.get(API_ENDPOINTS.assignments.byLesson(lessonId));
      setAssignments(response.data);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    }
  };

  const handleCreateCourse = async () => {
    try {
      await api.post(API_ENDPOINTS.courses.create, courseForm);
      setShowCourseModal(false);
      setCourseForm({ title: '', description: '' });
      fetchCourses();
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;
    try {
      await api.put(API_ENDPOINTS.courses.update(editingCourse.id), courseForm);
      setShowCourseModal(false);
      setEditingCourse(null);
      setCourseForm({ title: '', description: '' });
      fetchCourses();
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(API_ENDPOINTS.courses.delete(id));
      fetchCourses();
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const handleCreateLesson = async () => {
    try {
      await api.post(API_ENDPOINTS.lessons.create, lessonForm);
      setShowLessonModal(false);
      setLessonForm({ title: '', content: '', course_id: selectedCourseId || 0 });
      if (selectedCourseId) fetchLessons(selectedCourseId);
    } catch (error) {
      console.error('Failed to create lesson:', error);
    }
  };

  const handleUpdateLesson = async () => {
    if (!editingLesson) return;
    try {
      await api.put(API_ENDPOINTS.lessons.update(editingLesson.id), {
        title: lessonForm.title,
        content: lessonForm.content,
      });
      setShowLessonModal(false);
      setEditingLesson(null);
      setLessonForm({ title: '', content: '', course_id: selectedCourseId || 0 });
      if (selectedCourseId) fetchLessons(selectedCourseId);
    } catch (error) {
      console.error('Failed to update lesson:', error);
    }
  };

  const handleDeleteLesson = async (id: number) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await api.delete(API_ENDPOINTS.lessons.delete(id));
      if (selectedCourseId) fetchLessons(selectedCourseId);
    } catch (error) {
      console.error('Failed to delete lesson:', error);
    }
  };

  const handleCreateAssignment = async () => {
    try {
      await api.post(API_ENDPOINTS.assignments.create, assignmentForm);
      setShowAssignmentModal(false);
      setAssignmentForm({ title: '', description: '', instructions: '', lesson_id: selectedLessonId || 0 });
      if (selectedLessonId) fetchAssignments(selectedLessonId);
    } catch (error) {
      console.error('Failed to create assignment:', error);
    }
  };

  const handleUpdateAssignment = async () => {
    if (!editingAssignment) return;
    try {
      await api.put(API_ENDPOINTS.assignments.update(editingAssignment.id), {
        title: assignmentForm.title,
        description: assignmentForm.description,
        instructions: assignmentForm.instructions,
      });
      setShowAssignmentModal(false);
      setEditingAssignment(null);
      setAssignmentForm({ title: '', description: '', instructions: '', lesson_id: selectedLessonId || 0 });
      if (selectedLessonId) fetchAssignments(selectedLessonId);
    } catch (error) {
      console.error('Failed to update assignment:', error);
    }
  };

  const handleDeleteAssignment = async (id: number) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await api.delete(API_ENDPOINTS.assignments.delete(id));
      if (selectedLessonId) fetchAssignments(selectedLessonId);
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
  };

  const openCourseModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({ title: course.title, description: course.description || '' });
    } else {
      setEditingCourse(null);
      setCourseForm({ title: '', description: '' });
    }
    setShowCourseModal(true);
  };

  const openLessonModal = (lesson?: Lesson) => {
    if (lesson) {
      setEditingLesson(lesson);
      setLessonForm({ title: lesson.title, content: lesson.content, course_id: lesson.course_id });
    } else {
      setEditingLesson(null);
      setLessonForm({ title: '', content: '', course_id: selectedCourseId || 0 });
    }
    setShowLessonModal(true);
  };

  const openAssignmentModal = (assignment?: Assignment) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setAssignmentForm({ 
        title: assignment.title, 
        description: assignment.description, 
        instructions: assignment.instructions,
        lesson_id: assignment.lesson_id 
      });
    } else {
      setEditingAssignment(null);
      setAssignmentForm({ title: '', description: '', instructions: '', lesson_id: selectedLessonId || 0 });
    }
    setShowAssignmentModal(true);
  };

  const handleCreateAdmin = async () => {
    try {
      await api.post(API_ENDPOINTS.auth.registerAdmin, adminForm);
      setShowAdminModal(false);
      setAdminForm({ name: '', email: '', password: '' });
      alert('Admin user created successfully!');
    } catch (error: any) {
      console.error('Failed to create admin:', error);
      alert(error.response?.data?.detail || 'Failed to create admin user');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <div className="flex space-x-3">
            <button onClick={() => setShowAdminModal(true)} className="btn-secondary">
              <Shield className="w-5 h-5 mr-2 inline" />
              Create Admin
            </button>
            <button onClick={() => openCourseModal()} className="btn-primary">
              <Plus className="w-5 h-5 mr-2 inline" />
              Create Course
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openCourseModal(course)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                <button
                  onClick={() => setSelectedCourseId(course.id)}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  Manage Lessons →
                </button>
              </div>
            ))}
          </div>
        </div>

        {selectedCourseId && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Lessons</h2>
              <button onClick={() => openLessonModal()} className="btn-primary">
                <Plus className="w-5 h-5 mr-2 inline" />
                Create Lesson
              </button>
            </div>
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <h3 className="text-lg font-bold text-gray-900">{lesson.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{lesson.content}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedLessonId(lesson.id);
                          fetchAssignments(lesson.id);
                        }}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                        title="Manage Assignments"
                      >
                        <ClipboardList className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openLessonModal(lesson)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedLessonId && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
              <button onClick={() => openAssignmentModal()} className="btn-primary">
                <Plus className="w-5 h-5 mr-2 inline" />
                Create Assignment
              </button>
            </div>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <ClipboardList className="w-5 h-5 text-purple-400" />
                        <h3 className="text-lg font-bold text-gray-900">{assignment.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{assignment.description}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => openAssignmentModal(assignment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showCourseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {editingCourse ? 'Edit Course' : 'Create Course'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="input-field"
                    rows={4}
                  />
                </div>
                <div className="flex space-x-4">
                  <button onClick={editingCourse ? handleUpdateCourse : handleCreateCourse} className="btn-primary flex-1">
                    {editingCourse ? 'Update' : 'Create'}
                  </button>
                  <button onClick={() => setShowCourseModal(false)} className="btn-secondary flex-1">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showLessonModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {editingLesson ? 'Edit Lesson' : 'Create Lesson'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={lessonForm.content}
                    onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                    className="input-field"
                    rows={10}
                  />
                </div>
                <div className="flex space-x-4">
                  <button onClick={editingLesson ? handleUpdateLesson : handleCreateLesson} className="btn-primary flex-1">
                    {editingLesson ? 'Update' : 'Create'}
                  </button>
                  <button onClick={() => setShowLessonModal(false)} className="btn-secondary flex-1">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAssignmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {editingAssignment ? 'Edit Assignment' : 'Create Assignment'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                    className="input-field"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions
                  </label>
                  <textarea
                    value={assignmentForm.instructions}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                    className="input-field"
                    rows={6}
                  />
                </div>
                <div className="flex space-x-4">
                  <button 
                    onClick={editingAssignment ? handleUpdateAssignment : handleCreateAssignment} 
                    className="btn-primary flex-1"
                  >
                    {editingAssignment ? 'Update' : 'Create'}
                  </button>
                  <button 
                    onClick={() => {
                      setShowAssignmentModal(false);
                      setEditingAssignment(null);
                    }} 
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAdminModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-purple-600" />
                <span>Create Admin User</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={adminForm.name}
                    onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                    className="input-field"
                    placeholder="Admin Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    className="input-field"
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    className="input-field"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  <strong>Note:</strong> First admin should be created via terminal script for security.
                </div>
                <div className="flex space-x-4">
                  <button onClick={handleCreateAdmin} className="btn-primary flex-1">
                    <UserPlus className="w-5 h-5 mr-2 inline" />
                    Create Admin
                  </button>
                  <button 
                    onClick={() => {
                      setShowAdminModal(false);
                      setAdminForm({ name: '', email: '', password: '' });
                    }} 
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminPanel;

