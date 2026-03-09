'use client'

import React from "react";

const InteractiveFAQ = ({ faqItems }) => {
  const [openItems, setOpenItems] = React.useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="space-y-3 my-6">
      {faqItems.map((item, index) => (
        <div 
          key={index} 
          className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-4 sm:px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-expanded={openItems[index]}
          >
            <span className="font-semibold text-gray-800 text-sm sm:text-base pr-4">
              {item.question}
            </span>
            <svg
              className={`w-5 h-5 text-blue-600 transform transition-transform duration-300 flex-shrink-0 ${openItems[index] ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${openItems[index] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="px-4 sm:px-6 pb-4 text-gray-600 text-sm sm:text-base border-t border-gray-100 pt-3">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InteractiveFAQ;