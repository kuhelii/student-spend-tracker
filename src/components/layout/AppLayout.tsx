
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ChartBar, 
  Wallet, 
  CalendarDays, 
  Settings as SettingsIcon 
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <h1 className="text-xl font-bold text-purple-500">ExpenseTracker</h1>
          </div>
          
          <nav className="mt-6 px-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className={`flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700 transition-colors ${
                    isActivePath('/') ? 'bg-purple-50 text-purple-700 font-medium' : ''
                  }`}
                >
                  <Wallet className="h-5 w-5 mr-3" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/history"
                  className={`flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700 transition-colors ${
                    isActivePath('/history') ? 'bg-purple-50 text-purple-700 font-medium' : ''
                  }`}
                >
                  <CalendarDays className="h-5 w-5 mr-3" />
                  <span>Expense History</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/analytics"
                  className={`flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700 transition-colors ${
                    isActivePath('/analytics') ? 'bg-purple-50 text-purple-700 font-medium' : ''
                  }`}
                >
                  <ChartBar className="h-5 w-5 mr-3" />
                  <span>Analytics</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className={`flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700 transition-colors ${
                    isActivePath('/settings') ? 'bg-purple-50 text-purple-700 font-medium' : ''
                  }`}
                >
                  <SettingsIcon className="h-5 w-5 mr-3" />
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
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
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around">
            <Link to="/" className={`flex flex-col items-center p-2 ${isActivePath('/') ? 'text-purple-600' : 'text-gray-500'}`}>
              <Wallet className="h-6 w-6" />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
            <Link to="/history" className={`flex flex-col items-center p-2 ${isActivePath('/history') ? 'text-purple-600' : 'text-gray-500'}`}>
              <CalendarDays className="h-6 w-6" />
              <span className="text-xs mt-1">History</span>
            </Link>
            <Link to="/analytics" className={`flex flex-col items-center p-2 ${isActivePath('/analytics') ? 'text-purple-600' : 'text-gray-500'}`}>
              <ChartBar className="h-6 w-6" />
              <span className="text-xs mt-1">Analytics</span>
            </Link>
            <Link to="/settings" className={`flex flex-col items-center p-2 ${isActivePath('/settings') ? 'text-purple-600' : 'text-gray-500'}`}>
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
