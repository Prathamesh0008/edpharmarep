// app/components/QuantitySelector.jsx
"use client";

import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  minQuantity = 100,
  incrementStep = 10,
  showUnitLabel = false,
  className = "",
  size = "default", // 'sm', 'default', 'lg'
}) {
  const [inputValue, setInputValue] = useState(quantity.toString());

  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleIncrement = () => {
    const newQty = quantity + incrementStep;
    onQuantityChange(newQty);
  };

  const handleDecrement = () => {
    const newQty = Math.max(minQuantity, quantity - incrementStep);
    onQuantityChange(newQty);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    let newQty = parseInt(inputValue, 10);
    if (isNaN(newQty) || newQty < minQuantity) {
      newQty = minQuantity;
    } else {
      // Round to nearest incrementStep
      newQty = Math.round(newQty / incrementStep) * incrementStep;
      newQty = Math.max(minQuantity, newQty);
    }
    onQuantityChange(newQty);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: {
      button: "w-6 h-6",
      icon: 12,
      input: "w-12 text-xs",
      container: "gap-1",
      text: "text-[10px]",
    },
    default: {
      button: "w-7 h-7 sm:w-8 sm:h-8",
      icon: 14,
      input: "w-16 text-sm",
      container: "gap-2",
      text: "text-xs",
    },
    lg: {
      button: "w-8 h-8 sm:w-9 sm:h-9",
      icon: 16,
      input: "w-20 text-base",
      container: "gap-2",
      text: "text-sm",
    },
  };

  const currentSize = sizeClasses[size] || sizeClasses.default;

  return (
    <div className={`space-y-0.5 ${className}`}>
      <div className={`text-${currentSize.text === 'text-[10px]' ? '[10px]' : 'xs'} text-gray-500 flex items-center gap-1`}>
        <span>Min: {minQuantity}</span>
        <span className="text-gray-400">•</span>
        <span>+{incrementStep}</span>
      </div>
      <div className={`inline-flex items-center rounded-full bg-slate-50 border border-slate-200 p-1 ${currentSize.container}`}>
        <button
          onClick={handleDecrement}
          className={`${currentSize.button} rounded-full flex items-center justify-center text-gray-600 hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Decrease quantity"
          disabled={quantity <= minQuantity}
        >
          <Minus size={currentSize.icon} />
        </button>

        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyPress={handleKeyPress}
          min={minQuantity}
          step={incrementStep}
          className={`${currentSize.input} text-center font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          aria-label="Quantity"
        />

        <button
          onClick={handleIncrement}
          className={`${currentSize.button} rounded-full flex items-center justify-center text-gray-600 hover:bg-slate-200 transition`}
          aria-label="Increase quantity"
        >
          <Plus size={currentSize.icon} />
        </button>
      </div>
      {showUnitLabel && (
        <div className={`text-${currentSize.text} text-gray-500`}>units</div>
      )}
    </div>
  );
}