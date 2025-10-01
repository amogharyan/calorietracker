// API functions for logging meals and retrieving daily summary
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Get daily summary for the current day or a specified date
export const getDailySummary = async (date = new Date()) => {
  // Format date as YYYY-MM-DD
  const formattedDate = date.toISOString().split('T')[0];
  
  try {
    // In a real implementation, this would be a fetch request:
    // const response = await fetch(`${API_BASE_URL}/log/summary?date=${formattedDate}`);
    // if (!response.ok) throw new Error('Failed to fetch daily summary');
    // const data = await response.json();
    // return data;
    
    // For development, simulate API response
    return simulateDailySummaryResponse(date);
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    throw error;
  }
};

// Add a meal to the log
export const logMeal = async (mealData) => {
  try {
    // In a real implementation:
    // const response = await fetch(`${API_BASE_URL}/log/meal`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(mealData),
    // });
    // if (!response.ok) throw new Error('Failed to log meal');
    // const data = await response.json();
    // return data;
    
    // For development, simulate API response
    return simulateLogMealResponse(mealData);
  } catch (error) {
    console.error('Error logging meal:', error);
    throw error;
  }
};

// Delete a logged meal
export const deleteMeal = async (mealId) => {
  try {
    // In a real implementation:
    // const response = await fetch(`${API_BASE_URL}/log/meal/${mealId}`, {
    //   method: 'DELETE',
    // });
    // if (!response.ok) throw new Error('Failed to delete meal');
    // const data = await response.json();
    // return data;
    
    // For development, simulate API response
    return { success: true, message: 'Meal deleted successfully' };
  } catch (error) {
    console.error('Error deleting meal:', error);
    throw error;
  }
};

// Update a logged meal
export const updateMeal = async (mealId, mealData) => {
  try {
    // In a real implementation:
    // const response = await fetch(`${API_BASE_URL}/log/meal/${mealId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(mealData),
    // });
    // if (!response.ok) throw new Error('Failed to update meal');
    // const data = await response.json();
    // return data;
    
    // For development, simulate API response
    return { success: true, message: 'Meal updated successfully', meal: { ...mealData, id: mealId } };
  } catch (error) {
    console.error('Error updating meal:', error);
    throw error;
  }
};

// Get all meals for a specific date
export const getMealsByDate = async (date = new Date()) => {
  // Format date as YYYY-MM-DD
  const formattedDate = date.toISOString().split('T')[0];
  
  try {
    // In a real implementation:
    // const response = await fetch(`${API_BASE_URL}/log/meals?date=${formattedDate}`);
    // if (!response.ok) throw new Error('Failed to fetch meals');
    // const data = await response.json();
    // return data;
    
    // For development, simulate API response
    return simulateMealsByDateResponse(date);
  } catch (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
};

// Helper functions to simulate API responses for development

// Simulate daily summary response
function simulateDailySummaryResponse(date) {
  // Generate a realistic but random daily summary based on time of day
  const now = new Date();
  const hours = now.getHours();
  const goal = 2000; // Default calorie goal
  
  // Determine consumed calories based on time of day
  let consumed;
  if (hours < 10) {
    // Morning: 0-30% of goal
    consumed = Math.floor(Math.random() * (goal * 0.3));
  } else if (hours < 14) {
    // Lunch time: 30-50% of goal
    consumed = Math.floor(goal * 0.3 + Math.random() * (goal * 0.2));
  } else if (hours < 19) {
    // Afternoon/early evening: 50-70% of goal
    consumed = Math.floor(goal * 0.5 + Math.random() * (goal * 0.2));
  } else {
    // Evening: 70-90% of goal
    consumed = Math.floor(goal * 0.7 + Math.random() * (goal * 0.2));
  }
  
  // Calculate remaining calories
  const remaining = Math.max(0, goal - consumed);
  
  // Calculate macros based on consumed calories
  // Typical macro distribution: 50% carbs, 30% fat, 20% protein
  const carbs = Math.round(consumed * 0.5 / 4); // 4 calories per gram of carbs
  const protein = Math.round(consumed * 0.2 / 4); // 4 calories per gram of protein
  const fat = Math.round(consumed * 0.3 / 9); // 9 calories per gram of fat
  
  return {
    date: date.toISOString().split('T')[0],
    calories: {
      consumed,
      goal,
      remaining
    },
    macros: {
      carbs: { grams: carbs, goal: goal * 0.5 / 4 },
      protein: { grams: protein, goal: goal * 0.2 / 4 },
      fat: { grams: fat, goal: goal * 0.3 / 9 }
    }
  };
}

// Simulate log meal response
function simulateLogMealResponse(mealData) {
  return {
    success: true,
    meal: {
      ...mealData,
      id: 'meal_' + Math.random().toString(36).substr(2, 9),
      loggedAt: new Date().toISOString()
    }
  };
}

// Simulate meals by date response
function simulateMealsByDateResponse(date) {
  const hours = new Date().getHours();
  
  // Create array of meals based on time of day
  const meals = [];
  
  // Breakfast (if after 7 AM)
  if (hours >= 7) {
    meals.push({
      id: 'meal_breakfast',
      name: 'Breakfast',
      description: 'Oatmeal with fruits',
      calories: 350,
      macros: {
        carbs: 55,
        protein: 15,
        fat: 8
      },
      time: '07:30',
      diningHall: 'North Campus Dining'
    });
  }
  
  // Lunch (if after 12 PM)
  if (hours >= 12) {
    meals.push({
      id: 'meal_lunch',
      name: 'Lunch',
      description: 'Grilled chicken sandwich with salad',
      calories: 580,
      macros: {
        carbs: 45,
        protein: 38,
        fat: 22
      },
      time: '12:15',
      diningHall: 'South Campus Dining'
    });
  }
  
  // Snack (if after 3 PM)
  if (hours >= 15) {
    meals.push({
      id: 'meal_snack',
      name: 'Afternoon Snack',
      description: 'Greek yogurt with honey',
      calories: 180,
      macros: {
        carbs: 20,
        protein: 15,
        fat: 5
      },
      time: '15:30',
      diningHall: 'West Village Café'
    });
  }
  
  // Dinner (if after 6 PM)
  if (hours >= 18) {
    meals.push({
      id: 'meal_dinner',
      name: 'Dinner',
      description: 'Pasta with marinara sauce and vegetables',
      calories: 620,
      macros: {
        carbs: 90,
        protein: 22,
        fat: 18
      },
      time: '18:30',
      diningHall: 'North Campus Dining'
    });
  }
  
  return meals;
}

export default {
  getDailySummary,
  logMeal,
  deleteMeal,
  updateMeal,
  getMealsByDate
};
