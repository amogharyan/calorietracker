// src/components/MealCard.test.jsx
import '@testing-library/jest-dom';
import React from "react";
import { render, screen } from "@testing-library/react";
import MealCard from "./MealCard";


const mockMeal = {
  name: "Grilled Chicken Salad",
  description: "Fresh greens with grilled chicken, cherry tomatoes, and vinaigrette",
  calories: 350
};

test("renders MealCard with correct info", () =>
{
  render(<MealCard meal={mockMeal} />);
  
  expect(screen.getByText(/grilled chicken salad/i)).toBeInTheDocument();
  expect(screen.getByText(/fresh greens with grilled chicken/i)).toBeInTheDocument();
  expect(screen.getByText(/calories: 350/i)).toBeInTheDocument();
});
