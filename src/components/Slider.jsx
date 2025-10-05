import React from 'react';

const Slider = ({ label, id, name, value, onChange, min = 0, max = 100, step = 1, ...props }) => {
  return (
    <div className="relative pt-4"> {/* Added pt-4 for space for the label */}
      <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-1">
        {label}
        {/* Dynamic label showing current value */}
        {label.includes("Urgency") && (
            <span className="ml-2 text-blue-600 font-semibold">
                {value <= 33 ? 'Low' : value <= 66 ? 'Medium' : 'High'}
            </span>
        )}
      </label>
      <input
        type="range"
        id={id}
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  );
};

export default Slider;