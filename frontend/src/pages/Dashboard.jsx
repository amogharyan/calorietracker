import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaUtensils, FaChartPie, FaCalendarAlt, FaEllipsisV } from 'react-icons/fa';
import MealCard from '../components/MealCard';

const Dashboard = () => {
  const [meals, setMeals] = useState([]);
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    description: '',
    calories: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [activeTab, setActiveTab] = useState('today');
  const [caloriesSummary, setCaloriesSummary] = useState({
    consumed: 0,
    goal: 2000,
    remaining: 2000
  });

  // Simulate fetching meals from API
  useEffect(() => {
    // In a real app, you would fetch data from your API
    const mockMeals = [
      {
        id: 1,
        name: 'Breakfast Smoothie',
        description: 'Banana, berries, and protein powder',
        calories: 350,
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 2,
        name: 'Grilled Chicken Salad',
        description: 'Lettuce, tomatoes, cucumber, and grilled chicken',
        calories: 450,
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 3,
        name: 'Protein Bar',
        description: 'Chocolate flavored protein bar',
        calories: 200,
        date: new Date().toISOString().split('T')[0]
      }
    ];
    
    setTimeout(() => {
      setMeals(mockMeals);
      
      // Calculate total calories consumed
      const totalCalories = mockMeals.reduce((sum, meal) => sum + meal.calories, 0);
      setCaloriesSummary({
        consumed: totalCalories,
        goal: 2000,
        remaining: 2000 - totalCalories
      });
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeal({
      ...newMeal,
      [name]: name === 'calories' ? parseInt(value) || '' : value
    });
  };

  const handleAddMeal = (e) => {
    e.preventDefault();
    
    if (!newMeal.name || !newMeal.calories) return;
    
    const meal = {
      id: Date.now(),
      ...newMeal
    };
    
    setMeals([...meals, meal]);
    
    // Update calories summary
    setCaloriesSummary({
      ...caloriesSummary,
      consumed: caloriesSummary.consumed + meal.calories,
      remaining: caloriesSummary.goal - (caloriesSummary.consumed + meal.calories)
    });
    
    // Reset form
    setNewMeal({
      name: '',
      description: '',
      calories: '',
      date: new Date().toISOString().split('T')[0]
    });
    
    setIsAddingMeal(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="dashboard-page">
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Dashboard</h1>
        <motion.button 
          className="add-meal-button"
          onClick={() => setIsAddingMeal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Add Meal
        </motion.button>
      </motion.div>
      
      <div className="dashboard-content">
        <motion.div 
          className="dashboard-summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2>Today's Summary</h2>
          
          <div className="calorie-summary">
            <div className="calorie-chart">
              <svg width="150" height="150" viewBox="0 0 150 150">
                <circle
                  cx="75"
                  cy="75"
                  r="65"
                  fill="none"
                  stroke="#f0f0f0"
                  strokeWidth="10"
                />
                <motion.circle
                  cx="75"
                  cy="75"
                  r="65"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="10"
                  strokeDasharray="408"
                  strokeDashoffset="408"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 408 }}
                  animate={{
                    strokeDashoffset: 408 - (408 * caloriesSummary.consumed / caloriesSummary.goal)
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                  transform="rotate(-90 75 75)"
                />
                <text x="75" y="75" textAnchor="middle" dominantBaseline="middle" className="calorie-text">
                  <tspan x="75" y="70" className="calorie-value">{caloriesSummary.consumed}</tspan>
                  <tspan x="75" y="90" className="calorie-label">calories</tspan>
                </text>
              </svg>
            </div>
            
            <div className="calorie-details">
              <div className="calorie-item">
                <span className="label">Goal</span>
                <span className="value">{caloriesSummary.goal} cal</span>
              </div>
              <div className="calorie-item">
                <span className="label">Consumed</span>
                <span className="value">{caloriesSummary.consumed} cal</span>
              </div>
              <div className="calorie-item">
                <span className="label">Remaining</span>
                <span className="value">{caloriesSummary.remaining} cal</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="dashboard-meals"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="meals-header">
            <h2>Your Meals</h2>
            <div className="meal-tabs">
              <button 
                className={activeTab === 'today' ? 'active' : ''}
                onClick={() => setActiveTab('today')}
              >
                <FaUtensils /> Today
              </button>
              <button 
                className={activeTab === 'week' ? 'active' : ''}
                onClick={() => setActiveTab('week')}
              >
                <FaCalendarAlt /> This Week
              </button>
              <button 
                className={activeTab === 'stats' ? 'active' : ''}
                onClick={() => setActiveTab('stats')}
              >
                <FaChartPie /> Stats
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {meals.length > 0 ? (
              <motion.div className="meals-list" variants={containerVariants}>
                {meals.map((meal) => (
                  <motion.div 
                    key={meal.id} 
                    className="meal-item"
                    variants={itemVariants}
                    layout
                  >
                    <MealCard meal={meal} />
                    <button className="meal-options">
                      <FaEllipsisV />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="no-meals"
                variants={itemVariants}
              >
                <p>No meals added yet. Start tracking your nutrition by adding a meal.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Add Meal Modal */}
      <AnimatePresence>
        {isAddingMeal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <h2>Add New Meal</h2>
              
              <form onSubmit={handleAddMeal}>
                <div className="form-group">
                  <label htmlFor="name">Meal Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newMeal.name}
                    onChange={handleInputChange}
                    placeholder="Enter meal name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newMeal.description}
                    onChange={handleInputChange}
                    placeholder="Enter meal description"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="calories">Calories</label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    value={newMeal.calories}
                    onChange={handleInputChange}
                    placeholder="Enter calories"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newMeal.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="secondary-button"
                    onClick={() => setIsAddingMeal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    Add Meal
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;