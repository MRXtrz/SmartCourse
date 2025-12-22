import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import type { CourseWithProgress, ProgressSummary } from '../types';
import { 
  BookOpen, 
  TrendingUp, 
  Target, 
  Sparkles,
  ArrowRight,
  CheckCircle2 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [progress, setProgress] = useState<ProgressSummary[]>([]);
  const [recommendedCourse, setRecommendedCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, progressRes, recommendedRes] = await Promise.all([
        api.get<CourseWithProgress[]>(API_ENDPOINTS.courses.list),
        api.get<ProgressSummary[]>(API_ENDPOINTS.progress.my),
        api.get(API_ENDPOINTS.progress.recommended),
      ]);

      setCourses(coursesRes.data);
      setProgress(progressRes.data);
      if (recommendedRes.data.course_id) {
        setRecommendedCourse(recommendedRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const overallProgress = progress.reduce((acc, p) => acc + p.progress_percentage, 0) / (progress.length || 1);
  const totalCourses = courses.length;
  const completedCourses = progress.filter(p => p.progress_percentage === 100).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getCourseImage = (courseTitle: string) => {
    const images: { [key: string]: string } = {
      'Java': 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
      'Node.js': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
      'Django': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop',
      'FastAPI': 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop',
      'PHP': 'https://images.unsplash.com/photo-1555066931-ba19f4cdc3bf?w=800&h=400&fit=crop',
      'Bootstrap': 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=400&fit=crop',
      'Python': 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop'
    };
    for (const key in images) {
      if (courseTitle.includes(key)) {
        return images[key];
      }
    }
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop';
  };

  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 rounded-3xl p-8 md:p-12 text-white shadow-2xl overflow-hidden glow-effect">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-400 opacity-10 rounded-full -ml-36 -mb-36 blur-3xl"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-pink-100 neon-text">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-cyan-100 text-lg md:text-xl mb-4">
              Continue your personalized learning journey
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300">
                <span className="text-sm font-semibold">{totalCourses} Courses</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300">
                <span className="text-sm font-semibold">{completedCourses} Completed</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block floating">
            <div className="relative">
              <Sparkles className="w-32 h-32 text-white opacity-40 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full blur-3xl opacity-30"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-3xl p-6 text-white shadow-2xl overflow-hidden group hover:shadow-purple-500/50 transition-all duration-500 transform hover:scale-105 glow-effect">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-purple-100 text-sm font-semibold mb-2">Overall Progress</p>
                <p className="text-5xl font-bold neon-text">
                  {overallProgress.toFixed(0)}%
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-white/30">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
            <div className="progress-bar bg-white/20 backdrop-blur-sm h-4 rounded-full">
              <div 
                className="progress-fill h-full rounded-full" 
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-2xl overflow-hidden group hover:shadow-cyan-500/50 transition-all duration-500 transform hover:scale-105 glow-effect">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -ml-20 -mb-20 blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-cyan-100 text-sm font-semibold mb-2">Total Courses</p>
                <p className="text-5xl font-bold neon-text">{totalCourses}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-white/30">
                <BookOpen className="w-8 h-8" />
              </div>
            </div>
            <p className="text-cyan-100 text-sm mt-4 font-medium">
              {completedCourses} completed
            </p>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-pink-600 via-rose-600 to-purple-700 rounded-3xl p-6 text-white shadow-2xl overflow-hidden group hover:shadow-pink-500/50 transition-all duration-500 transform hover:scale-105 glow-effect">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -ml-20 -mt-20 blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-pink-100 text-sm font-semibold mb-2">Active Learning</p>
                <p className="text-5xl font-bold neon-text">
                  {totalCourses - completedCourses}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-white/30">
                <Target className="w-8 h-8" />
              </div>
            </div>
            <p className="text-pink-100 text-sm mt-4 font-medium">
              Courses in progress
            </p>
          </div>
        </div>
      </div>

      {recommendedCourse && (
        <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 rounded-3xl p-8 shadow-2xl overflow-hidden glow-effect">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400 opacity-10 rounded-full -ml-24 -mb-24 blur-3xl"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white/30 backdrop-blur-md p-3 rounded-2xl border border-white/40 floating">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-bold text-white uppercase tracking-wider neon-text">
                  Recommended for You
                </span>
              </div>
              <h3 className="text-4xl font-bold text-white mb-3 drop-shadow-2xl neon-text">
                {recommendedCourse.title}
              </h3>
              <p className="text-white text-lg mb-6 opacity-95">{recommendedCourse.description}</p>
              <Link
                to={`/course/${recommendedCourse.course_id}`}
                className="inline-flex items-center space-x-3 bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-2xl hover:shadow-white/50 transform hover:scale-110 border-2 border-transparent hover:border-orange-400"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="hidden md:block ml-8 floating">
              <div className="w-40 h-40 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30 shadow-2xl">
                <BookOpen className="w-20 h-20 text-white opacity-90" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent neon-text">
          My Courses
        </h2>
        {courses.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="w-20 h-20 text-gray-400 mx-auto mb-4 opacity-50" />
            <p className="text-gray-300 text-lg">No courses available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className="group relative card overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-500"
              >
                <div className="relative h-48 overflow-hidden rounded-t-3xl">
                  <img 
                    src={getCourseImage(course.title)} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-purple-900/40 to-transparent"></div>
                  {course.progress_percentage === 100 && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-2 shadow-2xl glow-effect">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white drop-shadow-2xl neon-text">
                      {course.title}
                    </h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2 min-h-[40px]">
                    {course.description || 'No description available'}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-semibold">Progress</span>
                      <span className="font-bold text-cyan-400 text-lg">
                        {course.progress_percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="progress-bar h-3 rounded-full">
                      <div 
                        className="progress-fill h-full rounded-full" 
                        style={{ width: `${course.progress_percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                      <span>{course.completed_lessons} of {course.total_lessons} lessons</span>
                      <span className="group-hover:text-cyan-400 transition-colors font-semibold">View →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

