'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiMinus, HiPlus, HiCheck } from 'react-icons/hi';
import { logMeal } from '../../lib/api/mealApi';

export default function AddToLogModal({ 
  isOpen, 
  onClose, 
  dish,
  onSuccess = () => {}
}) {
  const [portion, setPortion] = useState(1.0);
  const [portionInput, setPortionInput] = useState('1.0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPortion(1.0);
      setPortionInput('1.0');
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  // Validate and update portion size
  const handlePortionChange = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0.1 || numValue > 10) {
      return;
    }
    setPortion(numValue);
    setPortionInput(value);
  };

  // Quick portion buttons
  const handleQuickPortion = (multiplier) => {
    const newPortion = parseFloat((1.0 * multiplier).toFixed(1));
    setPortion(newPortion);
    setPortionInput(newPortion.toString());
  };

  // Calculate adjusted nutrition values
  const calculateNutrition = () => {
    if (!dish) return {};
    
    return {
      calories: Math.round(dish.calories * portion),
      protein: Math.round((dish.protein || 0) * portion * 10) / 10,
      carbs: Math.round((dish.carbs || 0) * portion * 10) / 10,
      fat: Math.round((dish.fat || 0) * portion * 10) / 10,
      fiber: Math.round((dish.fiber || 0) * portion * 10) / 10,
      sodium: Math.round((dish.sodium || 0) * portion)
    };
  };

  // Handle meal logging
  const handleAddToLog = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const adjustedNutrition = calculateNutrition();
      
      const mealData = {
        dishId: dish.id,
        name: dish.name,
        portion: portion,
        ...adjustedNutrition
      };

      const result = await logMeal(mealData);
      
      if (result.success) {
        setSuccess(true);
        onSuccess(result.meal);
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        throw new Error(result.error || 'Failed to log meal');
      }
    } catch (err) {
      setError(err.message || 'Failed to add meal to log');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input blur validation
  const handleInputBlur = () => {
    const numValue = parseFloat(portionInput);
    if (isNaN(numValue) || numValue < 0.1) {
      setPortion(0.1);
      setPortionInput('0.1');
    } else if (numValue > 10) {
      setPortion(10);
      setPortionInput('10');
    } else {
      setPortion(numValue);
      setPortionInput(numValue.toString());
    }
  };

  if (!dish) return null;

  const adjustedNutrition = calculateNutrition();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            data-testid="modal-backdrop"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto"
              data-testid="add-to-log-modal"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Add to Log</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  data-testid="close-button"
                >
                  <HiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Dish Info */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">{dish.name}</h3>
                  <p className="text-sm text-gray-600">{dish.diningHall}</p>
                </div>

                {/* Portion Size Controls */}
                <div>
                  <label htmlFor="portion-input" className="block text-sm font-medium text-gray-700 mb-3">
                    Portion Size
                  </label>
                  
                  {/* Manual Input */}
                  <div className="flex items-center space-x-3 mb-4">
                    <button
                      onClick={() => handlePortionChange((portion - 0.1).toFixed(1))}
                      disabled={portion <= 0.1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="decrease-portion"
                      aria-label="Decrease portion size"
                    >
                      <HiMinus className="w-4 h-4" />
                    </button>
                    
                    <input
                      id="portion-input"
                      type="number"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={portionInput}
                      onChange={(e) => setPortionInput(e.target.value)}
                      onBlur={handleInputBlur}
                      className="w-20 px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      data-testid="portion-input"
                      aria-label="Portion size"
                    />
                    
                    <button
                      onClick={() => handlePortionChange((portion + 0.1).toFixed(1))}
                      disabled={portion >= 10}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="increase-portion"
                      aria-label="Increase portion size"
                    >
                      <HiPlus className="w-4 h-4" />
                    </button>
                    
                    <span className="text-sm text-gray-600">servings</span>
                  </div>

                  {/* Quick Portion Buttons */}
                  <div className="flex space-x-2">
                    {[
                      { label: '0.5x', value: 0.5 },
                      { label: '1x', value: 1.0 },
                      { label: '1.5x', value: 1.5 },
                      { label: '2x', value: 2.0 }
                    ].map(({ label, value }) => (
                      <button
                        key={label}
                        onClick={() => handleQuickPortion(value)}
                        className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                          Math.abs(portion - value) < 0.01
                            ? 'bg-green-100 border-green-300 text-green-700'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        data-testid={`quick-portion-${label}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Adjusted Nutrition */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Nutrition (adjusted for {portion} serving{portion !== 1 ? 's' : ''})
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-gray-900">{adjustedNutrition.calories}</div>
                      <div className="text-gray-600">Calories</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-gray-900">{adjustedNutrition.protein}g</div>
                      <div className="text-gray-600">Protein</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-gray-900">{adjustedNutrition.carbs}g</div>
                      <div className="text-gray-600">Carbs</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-gray-900">{adjustedNutrition.fat}g</div>
                      <div className="text-gray-600">Fat</div>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600" data-testid="error-message">
                      {error}
                    </p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <HiCheck className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-sm text-green-600" data-testid="success-message">
                      Added to meal log successfully!
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  data-testid="cancel-button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToLog}
                  disabled={isLoading || success}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  data-testid="add-to-log-button"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Adding...
                    </>
                  ) : success ? (
                    'Added!'
                  ) : (
                    'Add to Log'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
