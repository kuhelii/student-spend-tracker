
import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ChartBar, 
  Wallet, 
  CalendarDays, 
  Settings as SettingsIcon,
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { signOut, user } = useAuth();
  
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  // Security check: Redirect to auth page if no user is found
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700 shadow-lg">
          <div className="flex items-center justify-center h-16 border-b border-gray-700">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">BudgetBuddy</h1>
          </div>
          
          <nav className="mt-6 px-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  className={`flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition-colors ${
                    isActivePath('/dashboard') ? 'bg-gray-700 text-white font-medium' : 'text-gray-300'
                  }`}
                >
                  <Wallet className="h-5 w-5 mr-3" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/history"
                  className={`flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition-colors ${
                    isActivePath('/history') ? 'bg-gray-700 text-white font-medium' : 'text-gray-300'
                  }`}
                >
                  <CalendarDays className="h-5 w-5 mr-3" />
                  <span>Expense History</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/analytics"
                  className={`flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition-colors ${
                    isActivePath('/analytics') ? 'bg-gray-700 text-white font-medium' : 'text-gray-300'
                  }`}
                >
                  <ChartBar className="h-5 w-5 mr-3" />
                  <span>Analytics</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className={`flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition-colors ${
                    isActivePath('/settings') ? 'bg-gray-700 text-white font-medium' : 'text-gray-300'
                  }`}
                >
                  <SettingsIcon className="h-5 w-5 mr-3" />
                  <span>Settings</span>
                </Link>
              </li>
            </ul>

            {user && (
              <div className="absolute bottom-8 left-0 right-0 px-4">
                <div className="px-4 py-2 text-sm text-gray-300 mb-2 truncate">
                  {user.email}
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex w-full items-center px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
      
      {/* Main content */}
      <div className={`${!isMobile ? 'ml-64' : ''} min-h-screen`}>
        {/* Content area */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
        
        {/* Mobile bottom navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 flex justify-around shadow-lg">
            <Link to="/dashboard" className={`flex flex-col items-center p-2 ${isActivePath('/dashboard') ? 'text-blue-400' : 'text-gray-400'}`}>
              <Wallet className="h-6 w-6" />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
            <Link to="/history" className={`flex flex-col items-center p-2 ${isActivePath('/history') ? 'text-purple-400' : 'text-gray-400'}`}>
              <CalendarDays className="h-6 w-6" />
              <span className="text-xs mt-1">History</span>
            </Link>
            <Link to="/analytics" className={`flex flex-col items-center p-2 ${isActivePath('/analytics') ? 'text-pink-400' : 'text-gray-400'}`}>
              <ChartBar className="h-6 w-6" />
              <span className="text-xs mt-1">Analytics</span>
            </Link>
            <Link to="/settings" className={`flex flex-col items-center p-2 ${isActivePath('/settings') ? 'text-green-400' : 'text-gray-400'}`}>
              <SettingsIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Settings</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppLayout;
