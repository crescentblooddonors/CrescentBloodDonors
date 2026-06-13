import React, { useState } from 'react';

const DateInputWithPlaceholder = ({ placeholder, value, onChange, name }) => {
  // State to manage the input's type ('text' or 'date')
  const [inputType, setInputType] = useState('text');

  // When the user clicks on the input, change its type to 'date'
  const handleFocus = () => {
    setInputType('date');
  };

  // When the user clicks away, if the input is empty,
  // change it back to 'text' to show the placeholder again.
  const handleBlur = (e) => {
    if (e.target.value === '') {
      setInputType('text');
    }
  };

  return (
    <div className="relative">
      {/* Blue border/indicator on the left to match inputs */}
      <div className="absolute left-0 top-0 h-full w-1 bg-[#164476] rounded-l-md"></div>

      <input
        name={name}
        type={inputType}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full pl-4 pr-3 py-3 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#164476] focus:border-transparent transition duration-200 ease-in-out placeholder-gray-500"
        style={{ paddingLeft: 'calc(1rem + 8px)' }}
      />
    </div>
  );
};

export default DateInputWithPlaceholder;