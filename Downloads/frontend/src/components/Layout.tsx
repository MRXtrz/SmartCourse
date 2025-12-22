import type { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Home, 
  Settings, 
  LogOut, 
  User
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
      
      <nav className="relative z-50 bg-gradient-to-r from-gray-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-xl shadow-2xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="flex items-center space-x-3 group">
                <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 p-3 rounded-2xl shadow-lg glow-effect group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-7 h-7 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent neon-text">
                  Smart Course
                </span>
              </Link>

              <div className="flex space-x-2">
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-5 py-3 rounded-xl transition-all duration-300 ${
                    isActive('/dashboard')
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg glow-effect'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-purple-500/50'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-2 px-5 py-3 rounded-xl transition-all duration-300 ${
                      isActive('/admin')
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg glow-effect'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-purple-500/50'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Admin</span>
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gray-800/50 px-4 py-2 rounded-xl border border-purple-500/30">
                <div className="relative w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-5 py-3 text-gray-300 hover:text-white bg-gray-800/50 hover:bg-red-600/20 rounded-xl transition-all duration-300 border border-transparent hover:border-red-500/50"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

