import React from 'react';

import Logo from '../assets/images.png'

const SuccessModal = ({ isOpen, onClose, title, message, image }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center font-poppins p-4"
      onClick={onClose} // Close modal on backdrop click
    >
      {/* Modal Content */}
      <div 
        className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-sm text-center transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <img className='rounded-full' src={Logo} alt="" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <img src={image} alt="" />
        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;

