/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import DishCard from '../../app/components/DishCard';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('DishCard', () => {
  const mockDish = {
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
  };

  const mockOnAddToLog = jest.fn();

  beforeEach(() => {
    mockOnAddToLog.mockClear();
  });

  it('should render dish card with basic information', () => {
    render(<DishCard dish={mockDish} onAddToLog={mockOnAddToLog} />);

    expect(screen.getByText('Grilled Chicken Breast')).toBeInTheDocument();
    expect(screen.getByText('Main Course')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
    expect(screen.getByText('cal')).toBeInTheDocument();
    expect(screen.getByText('6 oz')).toBeInTheDocument();
    expect(screen.getByText('Tender grilled chicken breast seasoned with herbs')).toBeInTheDocument();
  });

  it('should display nutrition information correctly', () => {
    render(<DishCard dish={mockDish} onAddToLog={mockOnAddToLog} />);

    expect(screen.getByText('30g')).toBeInTheDocument(); // protein
    expect(screen.getByText('0g')).toBeInTheDocument(); // carbs
    expect(screen.getByText('12g')).toBeInTheDocument(); // fat
    expect(screen.getByText('150mg')).toBeInTheDocument(); // sodium
  });

  it('should show dietary restrictions when present', () => {
    render(<DishCard dish={mockDish} onAddToLog={mockOnAddToLog} />);

    expect(screen.getByText('gluten-free')).toBeInTheDocument();
  });

  it('should show allergen information when present', () => {
    const dishWithAllergens = {
      ...mockDish,
      allergens: ['dairy', 'eggs'],
    };

    render(<DishCard dish={dishWithAllergens} onAddToLog={mockOnAddToLog} />);

    expect(screen.getByText('Contains: dairy, eggs')).toBeInTheDocument();
  });

  it('should not show allergen section when no allergens', () => {
    render(<DishCard dish={mockDish} onAddToLog={mockOnAddToLog} />);

    expect(screen.queryByText(/Contains:/)).not.toBeInTheDocument();
  });

  it('should display "Add to Log" button', () => {
    render(<DishCard dish={mockDish} onAddToLog={mockOnAddToLog} />);

    const addButton = screen.getByRole('button', { name: /add to log/i });
    expect(addButton).toBeInTheDocument();
  });

  it('should call onAddToLog when button is clicked', () => {
    render(<DishCard dish={mockDish} onAddToLog={mockOnAddToLog} />);

    const addButton = screen.getByRole('button', { name: /add to log/i });
    fireEvent.click(addButton);

    expect(mockOnAddToLog).toHaveBeenCalledWith(mockDish);
  });

  it('should handle missing optional fields gracefully', () => {
    const minimalDish = {
      id: 'simple-dish',
      name: 'Simple Dish',
      category: 'Other',
      calories: 100,
      protein: 5,
      carbs: 10,
      fat: 3,
      fiber: 1,
      sodium: 50,
      dietaryRestrictions: [],
      allergens: [],
      servingSize: '1 serving',
      description: '',
    };

    render(<DishCard dish={minimalDish} onAddToLog={mockOnAddToLog} />);

    expect(screen.getByText('Simple Dish')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('cal')).toBeInTheDocument();
    expect(screen.queryByText(/Contains:/)).not.toBeInTheDocument();
  });

  it('should display fiber information when present', () => {
    const dishWithFiber = {
      ...mockDish,
      fiber: 5,
    };

    render(<DishCard dish={dishWithFiber} onAddToLog={mockOnAddToLog} />);

    expect(screen.getByText('5g')).toBeInTheDocument(); // fiber
  });

  it('should apply appropriate styling classes', () => {
    const { container } = render(<DishCard dish={mockDish} onAddToLog={mockOnAddToLog} />);

    // Check for glassmorphism and card styling
    const card = container.firstChild;
    expect(card).toHaveClass('bg-white/10');
    expect(card).toHaveClass('backdrop-blur-md');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('rounded-xl');
  });

  it('should show multiple dietary restrictions', () => {
    const dishWithMultipleRestrictions = {
      ...mockDish,
      dietaryRestrictions: ['vegan', 'gluten-free', 'nut-free'],
    };

    render(<DishCard dish={dishWithMultipleRestrictions} onAddToLog={mockOnAddToLog} />);

    expect(screen.getByText('vegan')).toBeInTheDocument();
    expect(screen.getByText('gluten-free')).toBeInTheDocument();
    expect(screen.getByText('nut-free')).toBeInTheDocument();
  });

  it('should handle very long dish names gracefully', () => {
    const dishWithLongName = {
      ...mockDish,
      name: 'This is a very long dish name that should be handled gracefully in the UI without breaking the layout',
    };

    render(<DishCard dish={dishWithLongName} onAddToLog={mockOnAddToLog} />);

    expect(screen.getByText(dishWithLongName.name)).toBeInTheDocument();
  });

  it('should display zero values correctly', () => {
    const dishWithZeroValues = {
      ...mockDish,
      carbs: 0,
      fiber: 0,
    };

    render(<DishCard dish={dishWithZeroValues} onAddToLog={mockOnAddToLog} />);

    // Should still show 0g for zero values
    expect(screen.getByText('0g')).toBeInTheDocument();
  });
});
