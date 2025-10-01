'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaUtensils, FaChartPie, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import { getDiningHalls } from '../api/diningHalls';
import { getDailySummary } from '../api/log';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [caloriesSummary, setCaloriesSummary] = useState({
    consumed: 0,
    goal: 2000,
    remaining: 2000,
  });
  const [macros, setMacros] = useState({
    carbs: { grams: 0, goal: 250 },
    protein: { grams: 0, goal: 100 },
    fat: { grams: 0, goal: 67 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [diningHalls, setDiningHalls] = useState([]);
  const [isDiningHallsLoading, setIsDiningHallsLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    // Load daily summary data
    const loadDailySummary = async () => {
      try {
        const summaryData = await getDailySummary();
        setCaloriesSummary({
          consumed: summaryData.calories.consumed,
          goal: summaryData.calories.goal,
          remaining: summaryData.calories.remaining
        });
        setMacros(summaryData.macros);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading daily summary:', error);
        setIsLoading(false);
      }
    };

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

    loadDailySummary();
    loadDiningHalls();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality in later tasks
    console.log('Searching for:', searchQuery);
  };

  const progressPercentage = (caloriesSummary.consumed / caloriesSummary.goal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 md:p-8 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-10 px-4"
        >
          <div className="relative inline-block">
            <motion.div 
              className="absolute -inset-1 rounded-lg bg-gradient-to-r from-darkgreen-500 to-darkgreen-700 opacity-70 blur-lg"
              animate={{ 
                opacity: [0.5, 0.8, 0.5], 
                scale: [0.98, 1.01, 0.98] 
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-darkgreen-300 to-darkgreen-500 bg-clip-text text-transparent mb-2 relative py-2">
              Welcome to CalorieTracker
            </h1>
          </div>
          <motion.p 
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Track your daily nutrition with ease and discover dining hall options
          </motion.p>
          
          {/* Main Navigation Buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link href="/menu">
              <motion.button 
                className="px-6 py-3 bg-gradient-to-r from-darkgreen-600 to-darkgreen-800 text-white rounded-xl hover:from-darkgreen-500 hover:to-darkgreen-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-darkgreen-800/30 flex items-center font-medium border border-darkgreen-400"
                whileHover={{ scale: 1.05, boxShadow: "0 8px 20px -4px rgba(11, 50, 30, 0.35)" }}
                whileTap={{ scale: 0.98 }}
              >
                <FaUtensils className="mr-2 text-darkgreen-300" /> 
                Browse Menus
              </motion.button>
            </Link>
            <Link href="/log">
              <motion.button 
                className="px-6 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-darkgreen-900/20 flex items-center font-medium border border-darkgreen-700"
                whileHover={{ scale: 1.05, boxShadow: "0 8px 20px -4px rgba(0, 0, 0, 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                <FaChartPie className="mr-2 text-darkgreen-400" />
                View Daily Log
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mb-8 md:mb-10 px-4 sm:px-6"
        >
          <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto">
            <div className="relative">
              <motion.span
                className="absolute left-3 sm:left-6 top-1/2 transform -translate-y-1/2 text-darkgreen-400 text-lg sm:text-xl"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <FaSearch />
              </motion.span>
              <input
                type="text"
                placeholder="Search for dining halls, meals, or foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-16 pr-4 sm:pr-6 py-3 sm:py-5 text-base sm:text-lg border-2 border-darkgreen-900 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg focus:outline-none focus:ring-3 focus:ring-darkgreen-700 focus:border-darkgreen-600 bg-gray-900/90 text-white backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-darkgreen-800"
              />
              <motion.div 
                className="absolute inset-0 -z-10 rounded-xl sm:rounded-2xl bg-gradient-to-r from-darkgreen-800/20 to-darkgreen-900/20 opacity-0"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>
          </form>
        </motion.div>

        {/* Today's Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="bg-gradient-to-br from-gray-900 to-black backdrop-blur-sm rounded-xl md:rounded-2xl shadow-2xl border-2 border-darkgreen-900/70 p-4 sm:p-6 md:p-8 mb-6 md:mb-10 mx-4 sm:mx-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
            <motion.h2 
              className="text-2xl font-bold text-white flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.div 
                className="p-2 bg-darkgreen-900 rounded-lg mr-3 shadow-lg border border-darkgreen-700"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FaChartPie className="text-darkgreen-300 text-xl" />
              </motion.div>
              Today's Progress
            </motion.h2>
            <motion.div 
              className="text-sm text-gray-300 flex items-center bg-gradient-to-r from-gray-800 to-gray-900 px-3 py-2 rounded-lg border border-darkgreen-800 shadow-md"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)" }}
            >
              <FaCalendarAlt className="mr-2 text-darkgreen-400" />
              {new Date().toLocaleDateString()}
            </motion.div>
          </div>

          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="flex space-x-4 mb-8">
                <div className="h-16 bg-gray-700 rounded flex-1"></div>
                <div className="h-16 bg-gray-700 rounded flex-1"></div>
                <div className="h-16 bg-gray-700 rounded flex-1"></div>
              </div>
              <div className="border-t border-gray-700 pt-6">
                <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                    </div>
                    <div className="h-2 bg-gray-700 rounded w-full"></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                    </div>
                    <div className="h-2 bg-gray-700 rounded w-full"></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                    </div>
                    <div className="h-2 bg-gray-700 rounded w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Progress Bar */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span className="font-medium">Calories Consumed</span>
                  <span className="bg-gradient-to-r from-darkgreen-400 to-darkgreen-600 bg-clip-text text-transparent font-bold">
                    {caloriesSummary.consumed} / {caloriesSummary.goal}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-4 shadow-inner border border-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                    className="bg-gradient-to-r from-darkgreen-900 via-darkgreen-600 to-darkgreen-400 h-4 rounded-full shadow-lg relative overflow-hidden"
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-darkgreen-300/30 to-transparent"
                      animate={{ 
                        x: ["-100%", "200%"] 
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut" 
                      }}
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8">
                <motion.div 
                  className="text-center p-6 bg-gradient-to-br from-darkgreen-900 to-darkgreen-800 rounded-xl border-2 border-darkgreen-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-darkgreen-600"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                >
                  <motion.div 
                    className="text-3xl font-bold text-darkgreen-300 mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    {caloriesSummary.consumed}
                  </motion.div>
                  <div className="text-sm font-medium text-gray-200">Consumed</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-2 border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-darkgreen-800"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                >
                  <motion.div 
                    className="text-3xl font-bold text-gray-200 mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                  >
                    {caloriesSummary.goal}
                  </motion.div>
                  <div className="text-sm font-medium text-gray-400">Goal</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-6 bg-gradient-to-br from-gray-800 to-black rounded-xl border-2 border-darkgreen-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-darkgreen-600"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                >
                  <motion.div 
                    className="text-3xl font-bold text-darkgreen-300 mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  >
                    {caloriesSummary.remaining}
                  </motion.div>
                  <div className="text-sm font-medium text-gray-200">Remaining</div>
                </motion.div>
              </div>
              
              {/* Macros Section */}
              <motion.div 
                className="border-t border-gray-700 pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <h3 className="text-lg font-semibold text-white mb-5 flex items-center">
                  <span className="bg-gradient-to-r from-darkgreen-400 to-darkgreen-600 bg-clip-text text-transparent">Macro Nutrients</span>
                  <span className="ml-2 px-2 py-1 text-xs bg-darkgreen-900 rounded-md text-darkgreen-300 font-normal">Daily Goals</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
                  {/* Carbs */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-darkgreen-300 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-darkgreen-500 mr-2"></div>
                        Carbs
                      </span>
                      <span className="text-gray-300 font-semibold">{macros.carbs.grams}g / {Math.round(macros.carbs.goal)}g</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 shadow-inner border border-gray-700/50">
                      <motion.div 
                        className="bg-gradient-to-r from-darkgreen-600 to-darkgreen-400 h-2 rounded-full relative overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((macros.carbs.grams / macros.carbs.goal) * 100, 100)}%` }}
                        transition={{ duration: 1, delay: 1.5 }}
                      >
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  {/* Protein */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-darkgreen-300 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-darkgreen-400 mr-2"></div>
                        Protein
                      </span>
                      <span className="text-gray-300 font-semibold">{macros.protein.grams}g / {Math.round(macros.protein.goal)}g</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 shadow-inner border border-gray-700/50">
                      <motion.div 
                        className="bg-gradient-to-r from-darkgreen-500 to-darkgreen-300 h-2 rounded-full relative overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((macros.protein.grams / macros.protein.goal) * 100, 100)}%` }}
                        transition={{ duration: 1, delay: 1.6 }}
                      >
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  {/* Fat */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6, duration: 0.5 }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-darkgreen-300 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-darkgreen-300 mr-2"></div>
                        Fat
                      </span>
                      <span className="text-gray-300 font-semibold">{macros.fat.grams}g / {Math.round(macros.fat.goal)}g</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 shadow-inner border border-gray-700/50">
                      <motion.div 
                        className="bg-gradient-to-r from-darkgreen-400 to-darkgreen-200 h-2 rounded-full relative overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((macros.fat.grams / macros.fat.goal) * 100, 100)}%` }}
                        transition={{ duration: 1, delay: 1.7 }}
                      >
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 0.4 }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
                
                {/* View Details Button */}
                <motion.div 
                  className="mt-8 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                >
                  <Link href="/log">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 8px 20px -4px rgba(11, 50, 30, 0.35)" }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-darkgreen-800 to-darkgreen-900 text-darkgreen-200 rounded-xl hover:from-darkgreen-700 hover:to-darkgreen-800 transition-all duration-300 shadow-md border border-darkgreen-600 hover:shadow-lg hover:border-darkgreen-500 flex items-center mx-auto font-medium"
                    >
                      View Full Details <FaArrowRight className="ml-2" />
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Dining Hall Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="bg-gradient-to-br from-gray-900 to-black backdrop-blur-sm rounded-xl md:rounded-2xl shadow-2xl border-2 border-darkgreen-900/70 p-4 sm:p-6 md:p-8 mx-4 sm:mx-6"
        >
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="absolute -inset-3 bg-darkgreen-900/20 rounded-3xl blur-xl"
              animate={{ 
                opacity: [0.2, 0.4, 0.2],
                scale: [0.98, 1.02, 0.98]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center relative">
              <motion.div 
                className="p-3 bg-gradient-to-br from-darkgreen-800 to-darkgreen-900 rounded-lg mr-3 shadow-lg border border-darkgreen-700"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FaUtensils className="text-darkgreen-300 text-xl" />
              </motion.div>
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Available Dining Halls
              </span>
            </h2>
          </motion.div>

          {isDiningHallsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl h-48 mb-3 border border-gray-800 shadow-lg"></div>
                  <div className="h-5 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg w-3/4 mb-3"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
              {diningHalls.map((hall, index) => (
                <motion.div
                  key={hall.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.7 + (index * 0.15),
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href={`/menu?hall=${hall.id}`}>
                    <div className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-2xl ${
                      hall.isOpen 
                        ? 'border-darkgreen-700 hover:border-darkgreen-500 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 shadow-lg' 
                        : 'border-gray-800 hover:border-gray-700 bg-gradient-to-br from-gray-900 to-black opacity-75 shadow-md'
                    }`}>
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <motion.h3 
                            className="font-bold text-white text-xl mb-2 relative"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 + (index * 0.15) }}
                          >
                            <span className={hall.isOpen ? "bg-gradient-to-r from-darkgreen-300 to-darkgreen-500 bg-clip-text text-transparent" : ""}>
                              {hall.name}
                            </span>
                            {hall.isOpen && (
                              <motion.span
                                className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-darkgreen-400"
                                animate={{ 
                                  scale: [1, 1.5, 1],
                                  opacity: [0.7, 1, 0.7]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatType: "reverse"
                                }}
                              />
                            )}
                          </motion.h3>
                          <div className="flex items-center text-sm text-gray-300">
                            <div className={`p-1 ${hall.isOpen ? 'bg-darkgreen-900' : 'bg-gray-800'} rounded mr-2 shadow-sm border ${hall.isOpen ? 'border-darkgreen-700' : 'border-gray-700'}`}>
                              <FaClock className={`text-xs ${hall.isOpen ? 'text-darkgreen-300' : 'text-gray-500'}`} />
                            </div>
                            <span className="font-medium">{hall.hours}</span>
                          </div>
                        </div>
                        <motion.div 
                          className={`px-3 py-2 rounded-full text-xs font-bold shadow-sm ${
                            hall.isOpen 
                              ? 'bg-gradient-to-r from-darkgreen-900 to-darkgreen-800 text-darkgreen-300 border border-darkgreen-600' 
                              : 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-400 border border-gray-700'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          animate={hall.isOpen ? {
                            boxShadow: ["0 0 0 rgba(0, 128, 0, 0)", "0 0 8px rgba(0, 128, 0, 0.3)", "0 0 0 rgba(0, 128, 0, 0)"]
                          } : {}}
                          transition={hall.isOpen ? { 
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                          } : {}}
                        >
                          {hall.isOpen ? '🟢 Open' : '🔴 Closed'}
                        </motion.div>
                      </div>

                      {/* Description */}
                      <motion.p 
                        className="text-gray-400 text-sm mb-4 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 + (index * 0.15) }}
                      >
                        {hall.description}
                      </motion.p>

                      {/* Popular Items */}
                      {hall.isOpen && (
                        <motion.div 
                          className="mb-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 + (index * 0.15) }}
                        >
                          <div className="text-xs font-semibold text-darkgreen-300 mb-2 flex items-center">
                            <span className="mr-1">🔥</span> Popular now:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {hall.popularItems.slice(0, 3).map((item, itemIndex) => (
                              <motion.span 
                                key={itemIndex}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.1 + (index * 0.1) + (itemIndex * 0.1) }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="bg-gradient-to-r from-darkgreen-900 to-darkgreen-800 text-darkgreen-300 px-3 py-1 rounded-full text-xs font-medium shadow-md border border-darkgreen-700"
                              >
                                {item}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Action */}
                      <motion.div 
                        className="flex items-center justify-between pt-2 border-t border-gray-800"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 + (index * 0.15) }}
                      >
                        <div className="text-xs text-gray-400 font-medium">
                          Current: <span className="text-darkgreen-300 font-semibold">{hall.currentMeal}</span>
                        </div>
                        <motion.div 
                          className="flex items-center text-darkgreen-400 text-sm font-bold hover:text-darkgreen-200 transition-colors"
                          whileHover={{ x: 3 }}
                        >
                          View Menu
                          <motion.div
                            animate={{ x: [0, 3, 0] }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          >
                            <FaArrowRight className="ml-2 text-sm" />
                          </motion.div>
                        </motion.div>
                      </motion.div>
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
              className="mt-8 pt-6 border-t border-gray-800"
            >
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="flex items-center px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-darkgreen-400 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 text-sm font-bold shadow-sm border border-darkgreen-800 hover:shadow-md">
                  <FaMapMarkerAlt className="mr-2" />
                  View All Locations
                </button>
                <button className="flex items-center px-6 py-3 bg-gradient-to-r from-darkgreen-900 to-darkgreen-800 text-darkgreen-300 rounded-xl hover:from-darkgreen-800 hover:to-darkgreen-700 transition-all duration-300 text-sm font-bold shadow-sm border border-darkgreen-700 hover:shadow-md">
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
