import React from 'react';

const Select = ({ label, id, name, options, value, onChange, required, placeholder, ...props }) => {
  return (
    <div className="relative">
      {/* Blue border/indicator on the left to match inputs */}
      <div className="absolute left-0 top-0 h-full w-1 bg-[#164476] rounded-l-md"></div>

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        defaultValue={placeholder}

        className="block w-full pl-4 pr-10 py-3 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#164476] focus:border-transparent transition duration-200 ease-in-out appearance-none"
        style={{ paddingLeft: 'calc(1rem + 8px)' }}
        {...props}
      >
        <option value="" disabled>{label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        {/* Simple SVG for dropdown arrow */}
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default Select;