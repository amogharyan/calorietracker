// src/components/MealCard.test.jsx
import '@testing-library/jest-dom';
import React from "react";
import { render, screen } from "@testing-library/react";
import MealCard from "./MealCard";


const mockMeal = {
  name: "sample name",
  description: "sample description",
  calories: 1
};

test("renders MealCard with correct info", () =>
{
  render(<MealCard meal={mockMeal} />);
  
  expect(screen.getByText(/same name/i)).toBeInTheDocument();
  expect(screen.getByText(/sample description/i)).toBeInTheDocument();
  expect(screen.getByText(/calories: 1/i)).toBeInTheDocument();
});