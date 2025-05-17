
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/layout/ThemeToggle';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-background dark:to-purple-900/40 transition-colors">
      <header className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            BudgetBuddy
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Take Control of Your Finances
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Track expenses, set budgets, and gain insights into your spending habits with our intuitive expense tracker.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6" 
              onClick={() => navigate('/auth')}
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>

      <footer className="container mx-auto py-6 px-4 mt-auto">
        <div className="text-center text-gray-500 text-sm dark:text-gray-400">
          &copy; 2025 BudgetBuddy. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
