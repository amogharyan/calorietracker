'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiClock, FiMapPin } from 'react-icons/fi';

export default function Menu() {
  const [selectedDiningHall, setSelectedDiningHall] = useState('');
  const [selectedMealTime, setSelectedMealTime] = useState('');
  const [isDiningHallOpen, setIsDiningHallOpen] = useState(false);
  const [isMealTimeOpen, setIsMealTimeOpen] = useState(false);

  // Mock data for dining halls
  const diningHalls = [
    { id: 'crossroads', name: 'Crossroads', location: 'Unit 3' },
    { id: 'cafe-3', name: 'Café 3', location: 'Unit 3' },
    { id: 'foothill', name: 'Foothill', location: 'Foothill' },
    { id: 'clark-kerr', name: 'Clark Kerr', location: 'Clark Kerr Campus' },
  ];

  const mealTimes = [
    { id: 'breakfast', name: 'Breakfast', time: '7:00 AM - 10:30 AM' },
    { id: 'lunch', name: 'Lunch', time: '11:00 AM - 4:00 PM' },
    { id: 'dinner', name: 'Dinner', time: '5:00 PM - 9:00 PM' },
  ];

  // Set default selections
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    
    // Auto-select meal time based on current time
    if (hour >= 7 && hour < 11) {
      setSelectedMealTime('breakfast');
    } else if (hour >= 11 && hour < 17) {
      setSelectedMealTime('lunch');
    } else {
      setSelectedMealTime('dinner');
    }

    // Auto-select first dining hall
    setSelectedDiningHall('crossroads');
  }, []);

  const selectedDiningHallData = diningHalls.find(hall => hall.id === selectedDiningHall);
  const selectedMealTimeData = mealTimes.find(meal => meal.id === selectedMealTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-darkgreen-900 text-white">
      {/* Header */}
      <div className="pt-8 pb-6 px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-darkgreen-300 to-green-400 bg-clip-text text-transparent">
            Dining Hall Menu
          </h1>
          <p className="text-gray-400 text-lg">
            Browse today's menu options and nutritional information
          </p>
        </motion.div>
      </div>

      {/* Selectors */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Dining Hall Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <label className="block text-sm font-medium text-darkgreen-300 mb-2">
                Select Dining Hall
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsDiningHallOpen(!isDiningHallOpen)}
                  className="w-full bg-black/40 backdrop-blur-md border border-darkgreen-800/50 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-darkgreen-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-darkgreen-500"
                >
                  <div className="flex items-center space-x-3">
                    <FiMapPin className="text-darkgreen-400" />
                    <div>
                      <div className="font-medium">
                        {selectedDiningHallData?.name || 'Select a dining hall'}
                      </div>
                      {selectedDiningHallData && (
                        <div className="text-sm text-gray-400">
                          {selectedDiningHallData.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isDiningHallOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiChevronDown className="text-darkgreen-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isDiningHallOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 z-20 mt-2 bg-black/80 backdrop-blur-md border border-darkgreen-800/50 rounded-xl overflow-hidden shadow-2xl"
                    >
                      {diningHalls.map((hall) => (
                        <button
                          key={hall.id}
                          onClick={() => {
                            setSelectedDiningHall(hall.id);
                            setIsDiningHallOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-darkgreen-900/50 transition-colors duration-150 border-b border-darkgreen-800/30 last:border-b-0"
                        >
                          <div className="font-medium">{hall.name}</div>
                          <div className="text-sm text-gray-400">{hall.location}</div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Meal Time Selector */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <label className="block text-sm font-medium text-darkgreen-300 mb-2">
                Select Meal Time
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsMealTimeOpen(!isMealTimeOpen)}
                  className="w-full bg-black/40 backdrop-blur-md border border-darkgreen-800/50 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-darkgreen-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-darkgreen-500"
                >
                  <div className="flex items-center space-x-3">
                    <FiClock className="text-darkgreen-400" />
                    <div>
                      <div className="font-medium">
                        {selectedMealTimeData?.name || 'Select meal time'}
                      </div>
                      {selectedMealTimeData && (
                        <div className="text-sm text-gray-400">
                          {selectedMealTimeData.time}
                        </div>
                      )}
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isMealTimeOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiChevronDown className="text-darkgreen-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isMealTimeOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 z-20 mt-2 bg-black/80 backdrop-blur-md border border-darkgreen-800/50 rounded-xl overflow-hidden shadow-2xl"
                    >
                      {mealTimes.map((meal) => (
                        <button
                          key={meal.id}
                          onClick={() => {
                            setSelectedMealTime(meal.id);
                            setIsMealTimeOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-darkgreen-900/50 transition-colors duration-150 border-b border-darkgreen-800/30 last:border-b-0"
                        >
                          <div className="font-medium">{meal.name}</div>
                          <div className="text-sm text-gray-400">{meal.time}</div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Selection Summary */}
          {selectedDiningHall && selectedMealTime && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 bg-black/30 backdrop-blur-md border border-darkgreen-800/50 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedMealTimeData?.name} at {selectedDiningHallData?.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {selectedDiningHallData?.location} • {selectedMealTimeData?.time}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400">Menu Available</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Menu Items Section Placeholder */}
      <div className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {selectedDiningHall && selectedMealTime ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-black/30 backdrop-blur-md border border-darkgreen-800/50 rounded-xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-darkgreen-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="text-2xl text-darkgreen-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Menu Items Coming Soon</h3>
              <p className="text-gray-400">
                Menu items for {selectedMealTimeData?.name} at {selectedDiningHallData?.name} will be displayed here.
              </p>
            </motion.div>
          ) : (
            <div className="bg-black/20 backdrop-blur-md border border-darkgreen-800/30 rounded-xl p-8 text-center">
              <p className="text-gray-500">
                Please select a dining hall and meal time to view the menu.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
