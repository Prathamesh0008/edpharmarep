// app/components/TableOfContents.jsx
'use client';

import React from 'react';

const TableOfContents = ({ headings }) => {
  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        Table of Contents
      </h3>
      <nav className="space-y-2 max-h-96 overflow-y-auto">
        {headings.map((heading, index) => (
          <a
            key={index}
            href={`#${heading.id}`}
            className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-1.5 border-l-2 border-gray-200 hover:border-blue-500 pl-3"
            onClick={(e) => handleClick(e, heading.id)}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents;