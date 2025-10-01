/**
 * Menu API utilities for fetching dining hall menu data
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Fetch menu data for a specific dining hall and meal time
 * @param {string} diningHallId - The dining hall identifier
 * @param {string} mealTime - The meal time (breakfast, lunch, dinner)
 * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
 */
export async function fetchMenuData(diningHallId, mealTime) {
  try {
    // Validate inputs
    if (!diningHallId || !mealTime) {
      return {
        success: false,
        error: 'Missing required parameters: diningHallId and mealTime',
      };
    }

    const url = `${API_BASE_URL}/api/menus/${diningHallId}?meal=${mealTime}`;
    
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

    // Validate the response structure
    if (!Array.isArray(data.menuItems)) {
      return {
        success: false,
        error: 'Invalid response format: expected menuItems array',
      };
    }

    // Validate each menu item has required fields
    const validatedItems = data.menuItems.map(item => ({
      id: item.id || `item-${Date.now()}-${Math.random()}`,
      name: item.name || 'Unknown Item',
      category: item.category || 'Other',
      calories: typeof item.calories === 'number' ? item.calories : 0,
      protein: typeof item.protein === 'number' ? item.protein : 0,
      carbs: typeof item.carbs === 'number' ? item.carbs : 0,
      fat: typeof item.fat === 'number' ? item.fat : 0,
      fiber: typeof item.fiber === 'number' ? item.fiber : 0,
      sodium: typeof item.sodium === 'number' ? item.sodium : 0,
      dietaryRestrictions: Array.isArray(item.dietaryRestrictions) ? item.dietaryRestrictions : [],
      allergens: Array.isArray(item.allergens) ? item.allergens : [],
      servingSize: item.servingSize || '1 serving',
      description: item.description || '',
    }));

    return {
      success: true,
      data: validatedItems,
    };

  } catch (error) {
    console.error('Error fetching menu data:', error);
    
    // Return mock data for development if API is not available
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock data - API not available');
      return {
        success: true,
        data: getMockMenuData(diningHallId, mealTime),
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to fetch menu data',
    };
  }
}

/**
 * Get mock menu data for development
 * @param {string} diningHallId 
 * @param {string} mealTime 
 * @returns {Array} Mock menu items
 */
function getMockMenuData(diningHallId, mealTime) {
  const baseItems = [
    {
      id: 'grilled-chicken',
      name: 'Grilled Chicken Breast',
      category: 'Main Course',
      calories: 250,
      protein: 30,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sodium: 150,
      dietaryRestrictions: ['gluten-free'],
      allergens: [],
      servingSize: '6 oz',
      description: 'Tender grilled chicken breast seasoned with herbs',
    },
    {
      id: 'quinoa-salad',
      name: 'Quinoa Salad',
      category: 'Salads',
      calories: 180,
      protein: 8,
      carbs: 32,
      fat: 4,
      fiber: 5,
      sodium: 200,
      dietaryRestrictions: ['vegan', 'gluten-free'],
      allergens: [],
      servingSize: '1 cup',
      description: 'Fresh quinoa with mixed vegetables and herbs',
    },
    {
      id: 'beef-burger',
      name: 'Classic Beef Burger',
      category: 'Main Course',
      calories: 450,
      protein: 25,
      carbs: 35,
      fat: 22,
      fiber: 3,
      sodium: 800,
      dietaryRestrictions: [],
      allergens: ['gluten', 'dairy'],
      servingSize: '1 burger',
      description: 'Juicy beef patty with lettuce, tomato, and cheese',
    },
    {
      id: 'veggie-stir-fry',
      name: 'Vegetable Stir Fry',
      category: 'Main Course',
      calories: 220,
      protein: 12,
      carbs: 28,
      fat: 8,
      fiber: 6,
      sodium: 350,
      dietaryRestrictions: ['vegetarian', 'vegan'],
      allergens: ['soy'],
      servingSize: '1.5 cups',
      description: 'Fresh seasonal vegetables stir-fried with tofu',
    },
    {
      id: 'chocolate-cake',
      name: 'Chocolate Cake',
      category: 'Desserts',
      calories: 320,
      protein: 4,
      carbs: 45,
      fat: 14,
      fiber: 2,
      sodium: 280,
      dietaryRestrictions: ['vegetarian'],
      allergens: ['gluten', 'dairy', 'eggs'],
      servingSize: '1 slice',
      description: 'Rich chocolate cake with chocolate frosting',
    },
  ];

  // Filter items based on meal time
  let filteredItems = baseItems;
  
  if (mealTime === 'breakfast') {
    filteredItems = [
      {
        id: 'scrambled-eggs',
        name: 'Scrambled Eggs',
        category: 'Main Course',
        calories: 140,
        protein: 12,
        carbs: 2,
        fat: 10,
        fiber: 0,
        sodium: 180,
        dietaryRestrictions: ['vegetarian', 'gluten-free'],
        allergens: ['eggs'],
        servingSize: '2 eggs',
        description: 'Fluffy scrambled eggs cooked to perfection',
      },
      {
        id: 'oatmeal',
        name: 'Steel Cut Oatmeal',
        category: 'Main Course',
        calories: 150,
        protein: 6,
        carbs: 27,
        fat: 3,
        fiber: 4,
        sodium: 5,
        dietaryRestrictions: ['vegetarian', 'vegan'],
        allergens: [],
        servingSize: '1 cup',
        description: 'Hearty steel cut oats with cinnamon',
      },
      ...baseItems.slice(0, 2), // Add some general items
    ];
  } else if (mealTime === 'lunch') {
    filteredItems = baseItems.slice(0, 4); // Skip dessert for lunch
  }

  return filteredItems;
}

/**
 * Refresh menu data - useful for manual refresh
 * @param {string} diningHallId 
 * @param {string} mealTime 
 * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
 */
export async function refreshMenuData(diningHallId, mealTime) {
  // For now, this is the same as fetchMenuData
  // In the future, this might clear cache or force refresh
  return fetchMenuData(diningHallId, mealTime);
}
