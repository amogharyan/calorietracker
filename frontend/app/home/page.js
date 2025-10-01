'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaUtensils, FaChartPie, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import { getDiningHalls } from '../api/diningHalls';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [caloriesSummary, setCaloriesSummary] = useState({
    consumed: 0,
    goal: 2000,
    remaining: 2000,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [diningHalls, setDiningHalls] = useState([]);
  const [isDiningHallsLoading, setIsDiningHallsLoading] = useState(true);

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

    // Load dining halls
    const loadDiningHalls = async () => {
      try {
        const halls = await getDiningHalls();
        setDiningHalls(halls);
        setIsDiningHallsLoading(false);
      } catch (error) {
        console.error('Error loading dining halls:', error);
        setIsDiningHallsLoading(false);
      }
    };

    loadDiningHalls();
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

        {/* Dining Hall Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaUtensils className="mr-2 text-green-500" />
            Dining Halls
          </h2>

          {isDiningHallsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diningHalls.map((hall, index) => (
                <motion.div
                  key={hall.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href={`/menu?hall=${hall.id}`}>
                    <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      hall.isOpen 
                        ? 'border-green-200 hover:border-green-400 hover:shadow-md bg-gradient-to-br from-green-50 to-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50 opacity-75'
                    }`}>
                      {/* Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {hall.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <FaClock className="mr-1" />
                            <span>{hall.hours}</span>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          hall.isOpen 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {hall.isOpen ? 'Open' : 'Closed'}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-3">
                        {hall.description}
                      </p>

                      {/* Popular Items */}
                      {hall.isOpen && (
                        <div className="mb-3">
                          <div className="text-xs text-gray-500 mb-1">Popular now:</div>
                          <div className="flex flex-wrap gap-1">
                            {hall.popularItems.slice(0, 3).map((item, itemIndex) => (
                              <span 
                                key={itemIndex}
                                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action */}
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Current: {hall.currentMeal}
                        </div>
                        <div className="flex items-center text-blue-600 text-sm font-medium">
                          View Menu
                          <FaArrowRight className="ml-1 text-xs" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {!isDiningHallsLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-6 pt-4 border-t border-gray-100"
            >
              <div className="flex flex-wrap gap-3 justify-center">
                <button className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  <FaMapMarkerAlt className="mr-2" />
                  View All Locations
                </button>
                <button className="flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                  <FaClock className="mr-2" />
                  Hours & Info
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
