/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';

// Mock mealApi
jest.mock('../../lib/api/mealApi', () => ({
  logMeal: jest.fn(),
}));

const { logMeal: mockLogMeal } = require('../../lib/api/mealApi');

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock console methods
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});

// Import component after mocks
import AddToLogModal from '../../app/components/AddToLogModal';

describe('AddToLogModal', () => {
  const mockDish = {
    id: 'grilled-chicken',
    name: 'Grilled Chicken Breast',
    category: 'Main Course',
    diningHall: 'Crossroads',
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
  };

  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    mockLogMeal.mockClear();
    mockOnClose.mockClear();
    mockOnSuccess.mockClear();
    console.error.mockClear();
    console.warn.mockClear();
  });

  it('should render modal with dish information', () => {
    render(
      <AddToLogModal 
        dish={mockDish} 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByRole('heading', { name: 'Add to Log' })).toBeInTheDocument();
    expect(screen.getByText('Grilled Chicken Breast')).toBeInTheDocument();
    expect(screen.getByText('Crossroads')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(
      <AddToLogModal 
        dish={mockDish} 
        isOpen={false} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.queryByText('Add to Log')).not.toBeInTheDocument();
  });

  it('should display portion size selector with default value', () => {
    render(
      <AddToLogModal 
        dish={mockDish} 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const portionInput = screen.getByRole('spinbutton', { name: /portion size/i });
    expect(portionInput).toBeInTheDocument();
    expect(portionInput.value).toBe('1.0');
  });

  it('should display calculated nutrition values based on portion size', () => {
    render(
      <AddToLogModal 
        dish={mockDish} 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Default portion (1x)
    expect(screen.getByText('250')).toBeInTheDocument(); // calories
    expect(screen.getByText('30g')).toBeInTheDocument(); // protein
  });

  it('should recalculate nutrition when portion size changes', async () => {
    render(
      <AddToLogModal
        isOpen={true}
        onClose={mockOnClose}
        dish={mockDish}
        onSuccess={mockOnSuccess}
      />
    );

    const portionInput = screen.getByTestId('portion-input');
    
    // Change portion to 2 and trigger blur to update state
    fireEvent.change(portionInput, { target: { value: '2' } });
    fireEvent.blur(portionInput);

    await waitFor(() => {
      expect(screen.getByText('500')).toBeInTheDocument(); // 250 * 2 calories
      expect(screen.getByText('60g')).toBeInTheDocument(); // 30 * 2 protein
    });
  });

  it('should handle decimal portion sizes', async () => {
    render(
      <AddToLogModal
        isOpen={true}
        onClose={mockOnClose}
        dish={mockDish}
        onSuccess={mockOnSuccess}
      />
    );

    const portionInput = screen.getByTestId('portion-input');
    
    // Change portion to 0.5 and trigger blur to update state
    fireEvent.change(portionInput, { target: { value: '0.5' } });
    fireEvent.blur(portionInput);

    await waitFor(() => {
      expect(screen.getByText('125')).toBeInTheDocument(); // 250 * 0.5 calories
      expect(screen.getByText('15g')).toBeInTheDocument(); // 30 * 0.5 protein
    });
  });  it('should provide quick portion buttons', () => {
    render(
      <AddToLogModal 
        dish={mockDish} 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByRole('button', { name: '0.5x' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1x' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1.5x' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2x' })).toBeInTheDocument();
  });

  it('should update portion when quick buttons are clicked', () => {
    render(
      <AddToLogModal 
        dish={mockDish} 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const halfButton = screen.getByRole('button', { name: '0.5x' });
    fireEvent.click(halfButton);

    const portionInput = screen.getByRole('spinbutton', { name: /portion size/i });
    expect(portionInput.value).toBe('0.5');
    expect(screen.getByText('125')).toBeInTheDocument(); // 250 * 0.5 calories
  });

  it('should have Cancel and Add to Log buttons', () => {
    render(
      <AddToLogModal 
        dish={mockDish} 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to log/i })).toBeInTheDocument();
  });

  it('should close modal when Cancel is clicked', () => {
    render(
      <AddToLogModal 
        dish={mockDish} 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should close modal when clicking outside', () => {
    render(
      <AddToLogModal 
        dish={mockDish} 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call logMeal API when Add to Log is clicked', async () => {
    mockLogMeal.mockResolvedValueOnce({ success: true, data: { id: 'log-123' } });

    render(
      <AddToLogModal 
        dish={mockDish} 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const addButton = screen.getByRole('button', { name: /add to log/i });
    
    await act(async () => {
      fireEvent.click(addButton);
    });

    expect(mockLogMeal).toHaveBeenCalledWith({
      dishId: 'grilled-chicken',
      name: 'Grilled Chicken Breast',
      portion: 1,
      calories: 250,
      protein: 30,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sodium: 150
    });
  });

  it('should call logMeal with correct portion calculations', async () => {
    mockLogMeal.mockResolvedValueOnce({ success: true, data: { id: 'log-123' } });

    render(
      <AddToLogModal 
        dish={mockDish} 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Change to 1.5 portions
    const portionInput = screen.getByTestId('portion-input');
    fireEvent.change(portionInput, { target: { value: '1.5' } });
    fireEvent.blur(portionInput);

    const addButton = screen.getByRole('button', { name: /add to log/i });
    
    await act(async () => {
      fireEvent.click(addButton);
    });

    expect(mockLogMeal).toHaveBeenCalledWith({
      dishId: 'grilled-chicken',
      name: 'Grilled Chicken Breast',
      portion: 1.5,
      calories: 375, // 250 * 1.5
      protein: 45,   // 30 * 1.5
      carbs: 0,      // 0 * 1.5
      fat: 18,       // 12 * 1.5
      fiber: 0,      // 0 * 1.5
      sodium: 225,   // 150 * 1.5
    });
  });

  it('should show loading state while logging meal', async () => {
    // Make the API call hang
    const hangingPromise = new Promise(() => {}); 
    mockLogMeal.mockReturnValueOnce(hangingPromise);

    render(
      <AddToLogModal 
        dish={mockDish} 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const addButton = screen.getByRole('button', { name: /add to log/i });
    
    await act(async () => {
      fireEvent.click(addButton);
    });

    expect(screen.getByText(/adding/i)).toBeInTheDocument();
    expect(addButton).toBeDisabled();
  });

  it('should call onSuccess and close modal when logging succeeds', async () => {
    const mockResponse = { success: true, meal: { id: 'log-123' } };
    mockLogMeal.mockResolvedValueOnce(mockResponse);

    render(
      <AddToLogModal 
        dish={mockDish} 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const addButton = screen.getByRole('button', { name: /add to log/i });
    
    await act(async () => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(mockResponse.meal);
    });

    // Wait for the timeout to call onClose
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('should display error message when logging fails', async () => {
    mockLogMeal.mockResolvedValueOnce({ 
      success: false, 
      error: 'Failed to log meal' 
    });

    render(
      <AddToLogModal 
        dish={mockDish} 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const addButton = screen.getByRole('button', { name: /add to log/i });
    
    await act(async () => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to log meal');
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should handle network errors gracefully', async () => {
    mockLogMeal.mockRejectedValueOnce(new Error('Network error'));

    render(
      <AddToLogModal 
        dish={mockDish} 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const addButton = screen.getByRole('button', { name: /add to log/i });
    
    await act(async () => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Network error');
    });
  });

  it('should validate minimum portion size', () => {
    render(
      <AddToLogModal 
        dish={mockDish} 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const portionInput = screen.getByTestId('portion-input');
    
    // Try to set negative value
    fireEvent.change(portionInput, { target: { value: '-1' } });
    
    // Value should be clamped to minimum (0.1)
    fireEvent.blur(portionInput);
    
    expect(portionInput.value).toBe('0.1');
  });

  it('should validate maximum portion size', () => {
    render(
      <AddToLogModal 
        dish={mockDish} 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const portionInput = screen.getByTestId('portion-input');
    
    // Try to set very large value
    fireEvent.change(portionInput, { target: { value: '100' } });
    
    // Value should be clamped to maximum (10)
    fireEvent.blur(portionInput);
    
    expect(portionInput.value).toBe('10');
  });

  it('should round nutrition values to appropriate precision', () => {
    const dishWithDecimals = {
      ...mockDish,
      calories: 123.456,
      protein: 15.789,
      fat: 8.123,
    };

    render(
      <AddToLogModal 
        dish={dishWithDecimals} 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Should round calories to whole numbers, macros to 1 decimal
    expect(screen.getByText('123')).toBeInTheDocument(); // calories
    expect(screen.getByText('15.8g')).toBeInTheDocument(); // protein
    expect(screen.getByText('8.1g')).toBeInTheDocument(); // fat
  });
});
