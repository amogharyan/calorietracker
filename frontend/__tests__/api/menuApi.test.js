/**
 * @jest-environment jsdom
 */

import { fetchMenuData, refreshMenuData } from '../../lib/api/menuApi';

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to avoid noise in tests
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});

describe('menuApi', () => {
  beforeEach(() => {
    fetch.mockClear();
    console.error.mockClear();
    console.warn.mockClear();
  });

  describe('fetchMenuData', () => {
    it('should fetch menu data successfully with valid parameters', async () => {
      const mockMenuData = {
        menuItems: [
          {
            id: 'item-1',
            name: 'Grilled Chicken',
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
            description: 'Delicious grilled chicken'
          }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockMenuData,
      });

      const result = await fetchMenuData('crossroads', 'lunch');

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Grilled Chicken');
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/menus/crossroads?meal=lunch',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return error for missing parameters', async () => {
      const result = await fetchMenuData('', 'lunch');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Missing required parameters: diningHallId and mealTime');
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await fetchMenuData('crossroads', 'lunch');

      expect(result.success).toBe(false);
      expect(result.error).toContain('HTTP error! status: 500');
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchMenuData('crossroads', 'lunch');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('should validate response format', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ invalid: 'format' }),
      });

      const result = await fetchMenuData('crossroads', 'lunch');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid response format: expected menuItems array');
    });

    it('should normalize menu item data', async () => {
      const mockMenuData = {
        menuItems: [
          {
            name: 'Test Item',
            // Missing some fields to test normalization
          }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockMenuData,
      });

      const result = await fetchMenuData('crossroads', 'lunch');

      expect(result.success).toBe(true);
      expect(result.data[0]).toHaveProperty('id');
      expect(result.data[0]).toHaveProperty('category', 'Other');
      expect(result.data[0]).toHaveProperty('calories', 0);
      expect(result.data[0]).toHaveProperty('dietaryRestrictions', []);
      expect(result.data[0]).toHaveProperty('allergens', []);
      expect(result.data[0]).toHaveProperty('servingSize', '1 serving');
    });

    it('should return mock data in development mode when API fails', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      fetch.mockRejectedValueOnce(new Error('API not available'));

      const result = await fetchMenuData('crossroads', 'lunch');

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      expect(console.warn).toHaveBeenCalledWith('Using mock data - API not available');

      process.env.NODE_ENV = originalEnv;
    });

    it('should filter mock data by meal time', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      fetch.mockRejectedValueOnce(new Error('API not available'));

      const breakfastResult = await fetchMenuData('crossroads', 'breakfast');
      const lunchResult = await fetchMenuData('crossroads', 'lunch');

      expect(breakfastResult.success).toBe(true);
      expect(lunchResult.success).toBe(true);
      
      // Breakfast should have different items than lunch
      const breakfastItemNames = breakfastResult.data.map(item => item.name);
      const lunchItemNames = lunchResult.data.map(item => item.name);
      
      expect(breakfastItemNames).toContain('Scrambled Eggs');
      expect(lunchItemNames).not.toContain('Scrambled Eggs');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('refreshMenuData', () => {
    it('should refresh menu data successfully', async () => {
      const mockMenuData = {
        menuItems: [
          {
            id: 'item-1',
            name: 'Fresh Item',
            category: 'Main Course',
            calories: 300,
            protein: 25,
            carbs: 10,
            fat: 15,
            fiber: 2,
            sodium: 200,
            dietaryRestrictions: [],
            allergens: [],
            servingSize: '1 serving',
            description: 'Refreshed menu item'
          }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockMenuData,
      });

      const result = await refreshMenuData('foothill', 'dinner');

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Fresh Item');
    });

    it('should handle refresh errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Refresh failed'));

      const result = await refreshMenuData('foothill', 'dinner');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Refresh failed');
    });
  });
});
