import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import type {
  LessonWithProgress,
  AssignmentWithSubmission,
  AIAssignmentCheckResponse,
} from '../types';
import AITutor from '../components/AITutor';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  ArrowLeft,
  MessageCircle,
  FileText,
  Send,
  Check
} from 'lucide-react';

const CoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [course, setCourse] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonWithProgress | null>(null);
  const [showAITutor, setShowAITutor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<AssignmentWithSubmission[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentWithSubmission | null>(null);
  const [assignmentAnswer, setAssignmentAnswer] = useState('');
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [checkingAssignment, setCheckingAssignment] = useState(false);
  const [assignmentCheckResult, setAssignmentCheckResult] = useState<AIAssignmentCheckResponse | null>(null);

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        api.get(API_ENDPOINTS.courses.detail(Number(id))),
        api.get(API_ENDPOINTS.lessons.byCourse(Number(id))),
      ]);

      setCourse(courseRes.data);
      setLessons(lessonsRes.data);
      if (lessonsRes.data.length > 0) {
        setSelectedLesson(lessonsRes.data[0]);
        fetchAssignments(lessonsRes.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async (lessonId: number) => {
    try {
      const res = await api.get(API_ENDPOINTS.assignments.byLesson(lessonId));
      setAssignments(res.data);
      if (res.data.length > 0) {
        setSelectedAssignment(res.data[0]);
        if (res.data[0].submission) {
          setAssignmentAnswer(res.data[0].submission.answer);
        }
      }
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      setAssignments([]);
    }
  };

  const handleCompleteLesson = async (lessonId: number) => {
    try {
      await api.post(API_ENDPOINTS.progress.complete, { lesson_id: lessonId });
      fetchCourseData();
    } catch (error) {
      console.error('Failed to complete lesson:', error);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment || !assignmentAnswer.trim()) {
      alert('Пожалуйста, введите ответ на задание');
      return;
    }

    setSubmittingAssignment(true);
    try {
      await api.post(API_ENDPOINTS.assignments.submit(selectedAssignment.id), {
        answer: assignmentAnswer
      });
      await fetchAssignments(selectedLesson!.id);
      alert('Задание успешно отправлено!');
    } catch (error) {
      console.error('Failed to submit assignment:', error);
      alert('Ошибка при отправке задания');
    } finally {
      setSubmittingAssignment(false);
    }
  };

  const handleCheckAssignmentWithAI = async (mode: 'check' | 'help') => {
    if (!selectedLesson || !selectedAssignment) return;

    const answerToSend =
      mode === 'help'
        ? assignmentAnswer.trim() || 'не знаю'
        : assignmentAnswer.trim();

    if (!answerToSend) {
      alert('Введите ответ или нажмите "Помоги решить", если вы не знаете ответ');
      return;
    }

    setCheckingAssignment(true);
    setAssignmentCheckResult(null);

    try {
      const res = await api.post<AIAssignmentCheckResponse>(API_ENDPOINTS.ai.assignmentCheck, {
        course_title: course?.title || '',
        lesson_title: selectedLesson.title,
        assignment_title: selectedAssignment.title,
        assignment_instructions: selectedAssignment.instructions,
        user_answer: answerToSend,
      });

      setAssignmentCheckResult(res.data);
    } catch (error) {
      console.error('Failed to check assignment with AI:', error);
      alert('Ошибка при проверке задания ИИ');
    } finally {
      setCheckingAssignment(false);
    }
  };

  const completedLessons = lessons.filter(l => l.completed).length;
  const progressPercentage = lessons.length > 0 
    ? (completedLessons / lessons.length) * 100 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
          <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-cyan-500/30 border-t-cyan-500" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 px-5 py-3 rounded-xl transition-all duration-300 border border-purple-500/30 hover:border-cyan-400/50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 rounded-3xl p-8 md:p-10 text-white shadow-2xl overflow-hidden glow-effect">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-400 opacity-10 rounded-full -ml-36 -mb-36 blur-3xl"></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 floating">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-2xl neon-text">{course?.title}</h1>
                    <p className="text-cyan-100 text-lg">{course?.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-100 font-semibold text-lg">Course Progress</span>
                    <span className="font-bold text-3xl neon-text">
                      {progressPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="progress-bar bg-white/20 backdrop-blur-sm h-5 rounded-full">
                    <div 
                      className="progress-fill h-full rounded-full" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-cyan-100 text-sm font-medium">
                    {completedLessons} of {lessons.length} lessons completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Lessons</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={async () => {
                      setSelectedLesson(lesson);
                      setShowAITutor(false);
                      await fetchAssignments(lesson.id);
                    }}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      selectedLesson?.id === lesson.id
                        ? 'bg-gradient-to-r from-purple-600/50 to-pink-600/50 border-2 border-cyan-400 shadow-lg glow-effect'
                        : 'bg-gray-800/50 hover:bg-gray-700/50 border-2 border-transparent hover:border-purple-500/50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {lesson.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-semibold">
                            Lesson {index + 1}
                          </span>
                        </div>
                        <p className={`font-semibold mt-1 ${
                          selectedLesson?.id === lesson.id ? 'text-white' : 'text-gray-300'
                        }`}>
                          {lesson.title}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {selectedLesson ? (
              <>
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      {selectedLesson.title}
                    </h2>
                    {selectedLesson.completed && (
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg glow-effect">
                        Completed
                      </span>
                    )}
                  </div>

                  <div className="prose max-w-none mb-6">
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
                      {selectedLesson.content}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 pt-4 border-t border-purple-500/30">
                    {!selectedLesson.completed && (
                      <button
                        onClick={() => handleCompleteLesson(selectedLesson.id)}
                        className="btn-primary"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-2 inline" />
                        Mark as Completed
                      </button>
                    )}
                    <button
                      onClick={() => setShowAITutor(!showAITutor)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{showAITutor ? 'Hide' : 'Ask'} AI Tutor</span>
                    </button>
                  </div>
                </div>

                {showAITutor && course && (
                  <AITutor
                    courseTitle={course.title}
                    lessonTitle={selectedLesson.title}
                  />
                )}

                {assignments.length > 0 && (
                  <div className="card">
                    <div className="flex items-center space-x-2 mb-4">
                      <FileText className="w-6 h-6 text-cyan-400" />
                      <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Задания</h2>
                    </div>

                    <div className="space-y-4">
                      {assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className={`border-2 rounded-xl p-4 transition-all duration-300 ${
                            selectedAssignment?.id === assignment.id
                              ? 'border-cyan-400 bg-gradient-to-br from-purple-600/30 to-pink-600/30 shadow-lg glow-effect'
                              : 'border-purple-500/30 hover:border-cyan-400/50 bg-gray-800/30'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white mb-1">
                                {assignment.title}
                              </h3>
                              <p className="text-gray-300 text-sm mb-2">
                                {assignment.description}
                              </p>
                              {assignment.submission && (
                                <div className="flex items-center space-x-2 text-green-400 mb-2">
                                  <Check className="w-5 h-5" />
                                  <span className="text-sm font-semibold">Выполнено</span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                setSelectedAssignment(assignment);
                                setAssignmentAnswer(assignment.submission?.answer || '');
                              }}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                selectedAssignment?.id === assignment.id
                                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              {selectedAssignment?.id === assignment.id ? 'Выбрано' : 'Выбрать'}
                            </button>
                          </div>

                          {selectedAssignment?.id === assignment.id && (
                            <div className="mt-4 pt-4 border-t border-purple-500/30">
                              <div className="mb-3">
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                  Инструкции:
                                </label>
                                <div className="bg-gray-800/50 p-4 rounded-lg text-sm text-gray-300 whitespace-pre-wrap border border-purple-500/20">
                                  {assignment.instructions}
                                </div>
                              </div>

                              <div className="mb-3">
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                  Ваш ответ:
                                </label>
                                <textarea
                                  value={assignmentAnswer}
                                  onChange={(e) => setAssignmentAnswer(e.target.value)}
                                  disabled={!!assignment.submission}
                                  rows={6}
                                  className="input-field disabled:bg-gray-800/30 disabled:cursor-not-allowed"
                                  placeholder="Введите ваш ответ здесь..."
                                />
                              </div>

                              {!assignment.submission && (
                                <div className="flex flex-wrap gap-3 items-center">
                                  <button
                                    onClick={handleSubmitAssignment}
                                    disabled={submittingAssignment || !assignmentAnswer.trim()}
                                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Send className="w-5 h-5" />
                                    <span>{submittingAssignment ? 'Отправка...' : 'Отправить задание'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleCheckAssignmentWithAI('check')}
                                    disabled={checkingAssignment || !assignmentAnswer.trim()}
                                    className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <MessageCircle className="w-5 h-5" />
                                    <span>
                                      {checkingAssignment ? 'Проверка...' : 'Проверить ответ с ИИ'}
                                    </span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleCheckAssignmentWithAI('help')}
                                    disabled={checkingAssignment}
                                    className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <MessageCircle className="w-5 h-5" />
                                    <span>
                                      {checkingAssignment ? 'ИИ думает...' : 'Помоги решить'}
                                    </span>
                                  </button>
                                </div>
                              )}

                              {assignmentCheckResult && selectedAssignment?.id === assignment.id && (
                                <div
                                  className={`mt-4 p-4 rounded-xl border-2 ${
                                    assignmentCheckResult.is_correct
                                      ? 'bg-green-900/30 border-green-500/50'
                                      : 'bg-yellow-900/30 border-yellow-500/50'
                                  }`}
                                >
                                  <div className="flex items-center mb-2 space-x-2">
                                    <Check
                                      className={`w-5 h-5 ${
                                        assignmentCheckResult.is_correct
                                          ? 'text-green-400'
                                          : 'text-yellow-400'
                                      }`}
                                    />
                                    <span
                                      className={`font-semibold text-sm ${
                                        assignmentCheckResult.is_correct
                                          ? 'text-green-300'
                                          : 'text-yellow-300'
                                      }`}
                                    >
                                      {assignmentCheckResult.is_correct
                                        ? 'Ответ выглядит правильным по мнению ИИ'
                                        : 'ИИ считает, что ответ можно улучшить'}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-300 whitespace-pre-wrap">
                                    {assignmentCheckResult.explanation}
                                  </p>
                                </div>
                              )}

                              {assignment.submission && (
                                <div className="mt-3 p-4 bg-green-900/30 border-2 border-green-500/50 rounded-lg">
                                  <p className="text-sm text-green-300 font-semibold mb-1">
                                    Ваш ответ (отправлен {new Date(assignment.submission.completed_at || assignment.submission.created_at).toLocaleDateString('ru-RU')}):
                                  </p>
                                  <p className="text-sm text-gray-300 whitespace-pre-wrap">
                                    {assignment.submission.answer}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="card text-center py-12">
                <BookOpen className="w-20 h-20 text-gray-400 mx-auto mb-4 opacity-50" />
                <p className="text-gray-300 text-lg">Select a lesson to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default CoursePage;

