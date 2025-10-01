'use client';

import { motion } from 'framer-motion';
import { HiPlus } from 'react-icons/hi';

/**
 * DishCard component displaying individual menu item information
 * 
 * @param {Object} props - Component props
 * @param {Object} props.dish - Menu item data
 * @param {Function} props.onAddToLog - Callback function when adding to log
 */
export default function DishCard({ dish, onAddToLog }) {
  const {
    name,
    category,
    calories,
    protein,
    carbs,
    fat,
    fiber,
    sodium,
    dietaryRestrictions = [],
    allergens = [],
    servingSize,
    description,
  } = dish;

  const handleAddToLog = () => {
    onAddToLog(dish);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 shadow-lg"
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1 leading-tight">
            {name}
          </h3>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-emerald-300 font-medium">{category}</span>
            <span className="text-white/60">•</span>
            <span className="text-white/80">{servingSize}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-emerald-400">{calories}</span>
          <span className="text-sm text-white/60 ml-1">cal</span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-white/70 text-sm mb-4 leading-relaxed">
          {description}
        </p>
      )}

      {/* Nutrition Information */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-white">{protein}g</div>
          <div className="text-xs text-white/60 uppercase tracking-wide">Protein</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-white">{carbs}g</div>
          <div className="text-xs text-white/60 uppercase tracking-wide">Carbs</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-white">{fat}g</div>
          <div className="text-xs text-white/60 uppercase tracking-wide">Fat</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-white">{sodium}mg</div>
          <div className="text-xs text-white/60 uppercase tracking-wide">Sodium</div>
        </div>
      </div>

      {/* Fiber (if present) */}
      {fiber > 0 && (
        <div className="text-center mb-4">
          <div className="text-sm text-white/80">
            Fiber: <span className="font-semibold text-white">{fiber}g</span>
          </div>
        </div>
      )}

      {/* Dietary Restrictions */}
      {dietaryRestrictions.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {dietaryRestrictions.map((restriction, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full border border-emerald-500/30"
              >
                {restriction}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Allergens */}
      {allergens.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-orange-300">
            Contains: {allergens.join(', ')}
          </p>
        </div>
      )}

      {/* Add to Log Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAddToLog}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg"
      >
        <HiPlus size={16} />
        Add to Log
      </motion.button>
    </motion.div>
  );
}
