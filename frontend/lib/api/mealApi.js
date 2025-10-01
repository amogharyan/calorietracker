/**
 * Meal logging API utilities
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Log a meal to the user's daily log
 * @param {Object} mealData - The meal data to log
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function logMeal(mealData) {
  try {
    // Validate input
    if (!mealData.dishId || !mealData.dishName) {
      return {
        success: false,
        error: 'Missing required meal data: dishId and dishName',
      };
    }

    if (typeof mealData.portionSize !== 'number' || mealData.portionSize <= 0) {
      return {
        success: false,
        error: 'Invalid portion size: must be a positive number',
      };
    }

    const url = `${API_BASE_URL}/api/log/meals`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dishId: mealData.dishId,
        dishName: mealData.dishName,
        portionSize: mealData.portionSize,
        nutrition: {
          calories: Math.round(mealData.calories || 0),
          protein: Number((mealData.protein || 0).toFixed(1)),
          carbs: Number((mealData.carbs || 0).toFixed(1)),
          fat: Number((mealData.fat || 0).toFixed(1)),
          fiber: Number((mealData.fiber || 0).toFixed(1)),
          sodium: Math.round(mealData.sodium || 0),
        },
        mealType: mealData.mealType || getCurrentMealType(),
        loggedAt: mealData.loggedAt || new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };

  } catch (error) {
    console.error('Error logging meal:', error);
    
    // Return mock success for development if API is not available
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock meal logging - API not available');
      return {
        success: true,
        data: {
          id: `meal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...mealData,
          loggedAt: new Date().toISOString(),
        },
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to log meal',
    };
  }
}

/**
 * Get current meal type based on time of day
 * @returns {string} breakfast, lunch, or dinner
 */
function getCurrentMealType() {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 11) {
    return 'breakfast';
  } else if (hour >= 11 && hour < 17) {
    return 'lunch';  
  } else {
    return 'dinner';
  }
}

/**
 * Get user's meal log for a specific date
 * @param {string} date - ISO date string (YYYY-MM-DD)
 * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
 */
export async function getMealLog(date = new Date().toISOString().split('T')[0]) {
  try {
    const url = `${API_BASE_URL}/api/log/meals?date=${date}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data.meals || [],
    };

  } catch (error) {
    console.error('Error fetching meal log:', error);
    
    // Return mock data for development
    if (process.env.NODE_ENV === 'development') {
      return {
        success: true,
        data: getMockMealLog(date),
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to fetch meal log',
    };
  }
}

/**
 * Delete a meal from the log
 * @param {string} mealId - The meal ID to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteMeal(mealId) {
  try {
    const url = `${API_BASE_URL}/api/log/meals/${mealId}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
    };

  } catch (error) {
    console.error('Error deleting meal:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to delete meal',
    };
  }
}

/**
 * Get mock meal log data for development
 * @param {string} date 
 * @returns {Array} Mock meal log entries
 */
function getMockMealLog(date) {
  const today = new Date().toISOString().split('T')[0];
  
  if (date !== today) {
    return []; // No historical data in mock
  }

  return [
    {
      id: 'meal-1',
      dishId: 'oatmeal-bowl',
      dishName: 'Steel Cut Oatmeal',
      portionSize: 1,
      nutrition: {
        calories: 150,
        protein: 6,
        carbs: 27,
        fat: 3,
        fiber: 4,
        sodium: 5,
      },
      mealType: 'breakfast',
      loggedAt: `${date}T08:30:00.000Z`,
    },
    {
      id: 'meal-2',
      dishId: 'grilled-chicken',
      dishName: 'Grilled Chicken Breast',
      portionSize: 1,
      nutrition: {
        calories: 250,
        protein: 30,
        carbs: 0,
        fat: 12,
        fiber: 0,
        sodium: 150,
      },
      mealType: 'lunch',
      loggedAt: `${date}T12:45:00.000Z`,
    },
  ];
}
