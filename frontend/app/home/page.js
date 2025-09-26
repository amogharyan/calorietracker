'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaUtensils, FaChartPie, FaCalendarAlt } from 'react-icons/fa';
import Link from 'next/link';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [caloriesSummary, setCaloriesSummary] = useState({
    consumed: 0,
    goal: 2000,
    remaining: 2000,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mock data loading effect
  useEffect(() => {
    // Simulate API call to get daily summary
    setTimeout(() => {
      setCaloriesSummary({
        consumed: 650,
        goal: 2000,
        remaining: 1350,
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality in later tasks
    console.log('Searching for:', searchQuery);
  };

  const progressPercentage = (caloriesSummary.consumed / caloriesSummary.goal) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to CalorieTracker
          </h1>
          <p className="text-gray-600">
            Track your daily nutrition with ease
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search for dining halls, meals, or foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
          </form>
        </motion.div>

        {/* Today's Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaChartPie className="mr-2 text-blue-500" />
              Today's Progress
            </h2>
            <div className="text-sm text-gray-500 flex items-center">
              <FaCalendarAlt className="mr-1" />
              {new Date().toLocaleDateString()}
            </div>
          </div>

          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="flex space-x-4">
                <div className="h-16 bg-gray-200 rounded flex-1"></div>
                <div className="h-16 bg-gray-200 rounded flex-1"></div>
                <div className="h-16 bg-gray-200 rounded flex-1"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Calories Consumed</span>
                  <span>{caloriesSummary.consumed} / {caloriesSummary.goal}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {caloriesSummary.consumed}
                  </div>
                  <div className="text-sm text-green-700">Consumed</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {caloriesSummary.goal}
                  </div>
                  <div className="text-sm text-blue-700">Goal</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {caloriesSummary.remaining}
                  </div>
                  <div className="text-sm text-orange-700">Remaining</div>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Placeholder for dining hall quick links - will be implemented in task 1.2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaUtensils className="mr-2 text-green-500" />
            Quick Access
          </h2>
          <div className="text-gray-500 text-center py-8">
            Dining hall quick links will be added in the next step
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
