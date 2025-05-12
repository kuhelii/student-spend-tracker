
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wallet, ChartBar, CalendarDays, Settings } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-24">
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 mb-6 bg-purple-600 rounded-full flex items-center justify-center">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6V18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 10L12 6L16 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 18H19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4 21H20C21.1046 21 22 20.1046 22 19V5C22 3.89543 21.1046 3 20 3H4C2.89543 3 2 3.89543 2 5V19C2 20.1046 2.89543 21 4 21Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-center text-gray-900 mb-4">StudentSpend</h1>
          <p className="text-xl text-center text-gray-600 max-w-2xl">
            Track, analyze, and optimize your expenses with our student-friendly budget tracker
          </p>
        </div>

        <div className="flex justify-center">
          <Link to="/dashboard">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6">
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Students Love StudentSpend</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-lg bg-white border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Wallet className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Budget Tracking</h3>
              <p className="text-gray-600">Set budgets and track your spending to stay on top of your finances</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-lg bg-white border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <ChartBar className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visual Analytics</h3>
              <p className="text-gray-600">Visualize your spending patterns with intuitive charts and graphs</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-lg bg-white border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <CalendarDays className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Time Frame Views</h3>
              <p className="text-gray-600">View your expenses daily, weekly, monthly, or yearly for better planning</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-lg bg-white border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Optimization Tips</h3>
              <p className="text-gray-600">Get smart suggestions to optimize your spending habits</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Managing Your Finances Today</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are taking control of their expenses and saving more
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
