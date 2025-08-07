'use client';

import React from 'react';

const MealCard = ({ meal }) => {
  return (
    <div className="meal-card">
      <h2>{meal.name}</h2>
      <p>{meal.description}</p>
      <p>Calories: {meal.calories ?? 'N/A'}</p>
    </div>
  );
};

export default MealCard;
