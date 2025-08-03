import React from "react";
import MealCard from "./components/MealCard";
import UserProfile from "./components/UserProfile";

const mockMeal = {
  name: "grilled chicken salad",
  description: "fresh greens with grilled chicken, cherry tomatoes, and vinaigrette",
  calories: 350,
};

const mockUser = {
  name: "Ishrith Gowda",
  email: "ishrith@example.com",
  joinedDate: "2025-06-01",
};

const App = () => {
  return (
    <div>
      <MealCard meal={mockMeal} />
      <UserProfile user={mockUser} />
    </div>
  );
};

export default App