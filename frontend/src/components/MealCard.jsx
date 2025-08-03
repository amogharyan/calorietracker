import React from "react";

const MealCard = ({ meal }) =>
{
  return (
    <div className="MealCard">
      <h2>{meal.name}</h2>
      <p>{meal.description}</p>
      <p>calories: {meal.calories ?? "N/A"}</p>
    </div>
  );
};

export default MealCard;