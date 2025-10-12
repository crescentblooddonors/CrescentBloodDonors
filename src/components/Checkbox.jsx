import React from 'react';

const Checkbox = ({ label, id, name, checked, onChange, required, ...props }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        required={required}
        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        {...props}
      />
      <label htmlFor={id} className="ml-2 text-gray-700 text-sm cursor-pointer">
        <a href='https://cbd-backend.onrender.com/uploads/admin-1759988783235.jpg' target='blank'>
          {label}
        </a>
      </label>
    </div>
  );
};

export default Checkbox;