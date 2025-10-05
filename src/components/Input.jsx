import React from 'react';

const Input = ({
  label = "Name",
  type = "text",
  name = "name",
  id = "name",
  placeholder = "Name",
  value,
  onChange,
  required = false,
  ...props
}) => {
  return (
    <div className="relative">
      {/* Blue border/indicator on the left */}
      <div className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-l-md"></div>

      {/* Input field */}
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full pl-4 pr-3 py-3 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out placeholder-gray-500"
        style={{ paddingLeft: 'calc(1rem + 8px)' }} /* Adjust padding to account for the blue bar */
        {...props}
      />
    </div>
  );
};

export default Input;