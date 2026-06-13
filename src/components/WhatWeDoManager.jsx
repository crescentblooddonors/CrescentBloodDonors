import React, { useState, useEffect } from 'react';
import { api } from '../config/Url';
import { useCookies } from 'react-cookie';

const COMMON_ICONS = [
  { value: 'fa-heart', label: 'Heart / Care' },
  { value: 'fa-hands-helping', label: 'Hands Helping' },
  { value: 'fa-users', label: 'Community / Users' },
  { value: 'fa-utensils', label: 'Food / Utensils' },
  { value: 'fa-car', label: 'Car / Traffic' },
  { value: 'fa-child', label: 'Child / Youth' },
  { value: 'fa-trophy', label: 'Trophy' },
  { value: 'fa-star', label: 'Star / Special' },
  { value: 'fa-award', label: 'Award' },
  { value: 'custom', label: 'Custom Icon...' },
];

const COMMON_COLORS = [
  { value: 'text-blue-600', label: 'Blue' },
  { value: 'text-green-500', label: 'Green' },
  { value: 'text-red-600', label: 'Red' },
  { value: 'text-orange-500', label: 'Orange' },
  { value: 'text-purple-500', label: 'Purple' },
  { value: 'text-teal-500', label: 'Teal' },
  { value: 'text-slate-600', label: 'Slate' },
  { value: 'custom', label: 'Custom Tailwind Color Class...' },
];

export default function WhatWeDoManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [descriptionRaw, setDescriptionRaw] = useState('');
  const [iconSelect, setIconSelect] = useState('fa-heart');
  const [customIcon, setCustomIcon] = useState('');
  const [colorSelect, setColorSelect] = useState('text-blue-600');
  const [customColor, setCustomColor] = useState('');

  const [cookies] = useCookies();

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/what-we-do');
      if (response.data && response.data.success) {
        setServices(response.data.data);
      } else {
        setError('Failed to load what we do services');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch services. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // --- Drag and Drop Handlers for Reordering ---
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    // Live fluid reordering in states list
    const reordered = [...services];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setServices(reordered);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    
    // Save current order to database
    try {
      const orderIds = services.map(s => s._id);
      const headers = { Authorization: `Bearer ${cookies.sessionToken}` };
      await api.put('/what-we-do/reorder', { orderIds }, { headers });
    } catch (err) {
      console.error('Failed to save reordered What We Do list:', err);
      alert('Failed to save reordered list to database. Make sure backend is running.');
    }
  };

  const handleMobileMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const reordered = [...services];
    const [movedItem] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, movedItem);
    setServices(reordered);

    try {
      const orderIds = reordered.map(s => s._id);
      const headers = { Authorization: `Bearer ${cookies.sessionToken}` };
      await api.put('/what-we-do/reorder', { orderIds }, { headers });
    } catch (err) {
      console.error('Failed to save reordered What We Do list:', err);
      alert('Failed to save reordered list to database.');
    }
  };

  const openAddModal = () => {
    setEditingService(null);
    setTitle('');
    descriptionRaw || setDescriptionRaw('');
    setIconSelect('fa-heart');
    setCustomIcon('');
    setColorSelect('text-blue-600');
    setCustomColor('');
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setTitle(service.title);
    setDescriptionRaw(service.description.join('\n'));
    
    // Check if the icon is in common list
    const iconMatch = COMMON_ICONS.find(i => i.value === service.icon);
    if (iconMatch && iconMatch.value !== 'custom') {
      setIconSelect(service.icon);
      setCustomIcon('');
    } else {
      setIconSelect('custom');
      setCustomIcon(service.icon);
    }

    // Check if the color is in common list
    const colorMatch = COMMON_COLORS.find(c => c.value === service.color);
    if (colorMatch && colorMatch.value !== 'custom') {
      setColorSelect(service.color);
      setCustomColor('');
    } else {
      setColorSelect('custom');
      setCustomColor(service.color);
    }

    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }
    try {
      const headers = { Authorization: `Bearer ${cookies.sessionToken}` };
      const response = await api.delete(`/what-we-do/${id}`, { headers });
      if (response.data && response.data.success) {
        setServices(prev => prev.filter(item => item._id !== id));
      } else {
        alert('Failed to delete service');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while deleting service');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !descriptionRaw.trim()) {
      alert('Title and description are required.');
      return;
    }

    // Process description
    const descriptionArray = descriptionRaw
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    if (descriptionArray.length === 0) {
      alert('Description must contain at least one point.');
      return;
    }

    const finalIcon = iconSelect === 'custom' ? customIcon.trim() : iconSelect;
    const finalColor = colorSelect === 'custom' ? customColor.trim() : colorSelect;

    const payload = {
      title: title.trim(),
      description: descriptionArray,
      icon: finalIcon || 'fa-heart',
      color: finalColor || 'text-blue-600',
    };

    try {
      const headers = { Authorization: `Bearer ${cookies.sessionToken}` };
      
      if (editingService) {
        // Update
        const response = await api.put(`/what-we-do/${editingService._id}`, payload, { headers });
        if (response.data && response.data.success) {
          setServices(prev =>
            prev.map(item => (item._id === editingService._id ? response.data.data : item))
          );
          setIsModalOpen(false);
        } else {
          alert(response.data.message || 'Failed to update service');
        }
      } else {
        // Create
        const response = await api.post('/what-we-do', payload, { headers });
        if (response.data && response.data.success) {
          setServices(prev => [response.data.data, ...prev]);
          setIsModalOpen(false);
        } else {
          alert(response.data.message || 'Failed to create service');
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error occurred while saving service');
    }
  };

  const commonInputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#153F76] focus:border-[#153F76]";

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">"What We Do" Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage core services and activities displayed on the homepage.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#153F76] hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg shadow transition duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Add Service</span>
        </button>
      </div>

      {loading && (
        <div className="text-center p-10">
          <div className="w-12 h-12 border-4 border-[#153F76] border-dashed rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading services...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-lg font-semibold text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full bg-white">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">Move</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">Title</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/12">Icon</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/12">Color</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-2/5">Points / Description</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.length > 0 ? (
                  services.map((item, index) => (
                    <tr 
                      key={item._id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`transition-all duration-150 ${
                        draggedIndex === index 
                          ? 'opacity-30 bg-slate-100 border-2 border-dashed border-red-200 shadow-inner' 
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-4 text-center cursor-grab active:cursor-grabbing text-slate-400 select-none">
                        <i className="fas fa-grip-vertical"></i>
                      </td>
                      <td className="p-4 whitespace-normal text-sm font-semibold text-slate-800">
                        {item.title}
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm text-gray-700">
                        <span className={`text-xl ${item.color}`}>
                          <i className={`fas ${item.icon}`}></i>
                        </span>
                        <span className="ml-2 font-mono text-xs text-gray-500">{item.icon}</span>
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm text-gray-700 font-mono text-xs">
                        {item.color}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <ul className="list-disc list-inside space-y-1">
                          {item.description.map((pt, i) => (
                            <li key={i} className="text-xs truncate max-w-md">{pt}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm space-x-3">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-blue-600 hover:text-blue-900 font-medium transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-900 font-medium transition duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-8 text-gray-500">
                      No dynamic services created yet. Default static list is active on the homepage.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 md:hidden">
            {services.length > 0 ? (
              services.map((item, index) => (
                <div key={item._id} className="bg-slate-50 p-4 rounded-lg shadow-sm border border-gray-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-slate-800">{item.title}</h3>
                    <span className={`text-2xl ${item.color}`}>
                      <i className={`fas ${item.icon}`}></i>
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    <p className="font-semibold mb-1">Details:</p>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      {item.description.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end space-x-4 pt-2 border-t border-gray-200 items-center">
                    <div className="flex space-x-1 mr-auto">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMobileMove(index, -1)}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        title="Move Up"
                      >
                        <i className="fas fa-chevron-up"></i>
                      </button>
                      <button
                        type="button"
                        disabled={index === services.length - 1}
                        onClick={() => handleMobileMove(index, 1)}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        title="Move Down"
                      >
                        <i className="fas fa-chevron-down"></i>
                      </button>
                    </div>
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-semibold transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-950 text-sm font-semibold transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-6 text-gray-500 bg-slate-50 rounded-lg">
                No dynamic services created yet. Default static list is active.
              </div>
            )}
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-slate-800">
                {editingService ? 'Edit Service' : 'Add Service'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Food Donation Drives"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={commonInputClasses}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Icon *</label>
                  <select
                    value={iconSelect}
                    onChange={(e) => setIconSelect(e.target.value)}
                    className={commonInputClasses}
                  >
                    {COMMON_ICONS.map((icon) => (
                      <option key={icon.value} value={icon.value}>{icon.label}</option>
                    ))}
                  </select>
                </div>
                {iconSelect === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom FontAwesome Class *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. fa-hands-helping"
                      value={customIcon}
                      onChange={(e) => setCustomIcon(e.target.value)}
                      className={commonInputClasses}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Theme Color *</label>
                  <select
                    value={colorSelect}
                    onChange={(e) => setColorSelect(e.target.value)}
                    className={commonInputClasses}
                  >
                    {COMMON_COLORS.map((color) => (
                      <option key={color.value} value={color.value}>{color.label}</option>
                    ))}
                  </select>
                </div>
                {colorSelect === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Tailwind Color Class *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. text-[#153F76]"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className={commonInputClasses}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bullet Points / Details (One point per line) *
                </label>
                <textarea
                  required
                  rows="5"
                  placeholder="Enter details here...&#10;Press enter to start a new bullet point for the service description."
                  value={descriptionRaw}
                  onChange={(e) => setDescriptionRaw(e.target.value)}
                  className={commonInputClasses}
                ></textarea>
                <p className="text-xs text-gray-400 mt-1">Each line is formatted as a distinct bullet point in the list.</p>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#153F76] hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow transition"
                >
                  {editingService ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
