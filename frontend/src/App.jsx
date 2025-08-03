import React from "react";
import MealCard from "./components/MealCard";
import UserProfile from "./components/UserProfile";

const mockMeal = {
  name: "sample name",
  description: "sample description",
  calories: 350,
};

const mockUser = {
  name: "name",
  email: "sample@email.com",
  joinedDate: "01-01-2001",
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