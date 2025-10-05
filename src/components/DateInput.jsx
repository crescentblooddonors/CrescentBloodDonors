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
    <input
    name={name}
      type={inputType}
      value={value}
      onChange={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      // Add your Tailwind CSS classes here
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default DateInputWithPlaceholder;