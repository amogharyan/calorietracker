'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Home from './home/page';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // If not authenticated, show landing page or redirect to login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="relative overflow-hidden">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Track Your
                <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                  {" "}Nutrition
                </span>
                <br />
                Effortlessly
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Monitor your daily calorie intake, track macronutrients, and discover healthy dining options 
                across campus with our comprehensive nutrition tracking platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/register')}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-lg"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="px-8 py-3 border-2 border-green-500 text-green-600 font-medium rounded-lg hover:bg-green-50 transform hover:scale-105 transition-all"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍽️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Menu Tracking</h3>
                <p className="text-gray-600">
                  Browse and track meals from your favorite dining halls with detailed nutrition information.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
                <p className="text-gray-600">
                  Get insights into your eating habits with comprehensive charts and progress tracking.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Goal Setting</h3>
                <p className="text-gray-600">
                  Set personalized nutrition goals and track your progress towards a healthier lifestyle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, show the main home dashboard
  return <Home />;
}
