import React, { useState, useEffect } from 'react';
import { api } from '../config/Url';
import { useCookies } from 'react-cookie';

export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  
  // Form states
  const [reviewerName, setReviewerName] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [rating, setRating] = useState(5);

  const [cookies] = useCookies();

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/testimonials');
      if (response.data && response.data.success) {
        setTestimonials(response.data.data);
      } else {
        setError('Failed to load testimonials');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch testimonials. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAddModal = () => {
    setEditingTestimonial(null);
    setReviewerName('');
    setQuoteText('');
    setRating(5);
    setIsModalOpen(true);
  };

  const openEditModal = (testimonial) => {
    setEditingTestimonial(testimonial);
    setReviewerName(testimonial.reviewerName);
    setQuoteText(testimonial.quoteText);
    setRating(testimonial.rating || 5);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this story?')) {
      return;
    }
    try {
      const headers = { Authorization: `Bearer ${cookies.sessionToken}` };
      const response = await api.delete(`/testimonials/${id}`, { headers });
      if (response.data && response.data.success) {
        setTestimonials(prev => prev.filter(item => item._id !== id));
      } else {
        alert('Failed to delete story');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while deleting story');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reviewerName.trim() || !quoteText.trim()) {
      alert('Reviewer name and story quote text are required.');
      return;
    }

    const payload = {
      reviewerName: reviewerName.trim(),
      quoteText: quoteText.trim(),
      rating: Number(rating),
    };

    try {
      const headers = { Authorization: `Bearer ${cookies.sessionToken}` };
      
      if (editingTestimonial) {
        // Update
        const response = await api.put(`/testimonials/${editingTestimonial._id}`, payload, { headers });
        if (response.data && response.data.success) {
          setTestimonials(prev =>
            prev.map(item => (item._id === editingTestimonial._id ? response.data.data : item))
          );
          setIsModalOpen(false);
        } else {
          alert(response.data.message || 'Failed to update story');
        }
      } else {
        // Create
        const response = await api.post('/testimonials', payload, { headers });
        if (response.data && response.data.success) {
          setTestimonials(prev => [response.data.data, ...prev]);
          setIsModalOpen(false);
        } else {
          alert(response.data.message || 'Failed to create story');
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error occurred while saving story');
    }
  };

  const commonInputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#153F76] focus:border-[#153F76]";

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Stories of Hope Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage dynamic testimonials displayed in the website's Stories of Hope section.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#153F76] hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg shadow transition duration-200 flex items-center space-x-2 animate-fadeIn"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Add Story</span>
        </button>
      </div>

      {loading && (
        <div className="text-center p-10">
          <div className="w-12 h-12 border-4 border-[#153F76] border-dashed rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading stories...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-lg font-semibold text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Table for larger screens */}
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full bg-white">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">Reviewer Name</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/12">Rating</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/2">Quote / Story</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {testimonials.length > 0 ? (
                  testimonials.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50">
                      <td className="p-4 whitespace-normal text-sm font-semibold text-slate-800">
                        {item.reviewerName}
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                        {Array.from({ length: item.rating || 5 }).map((_, i) => '★').join('')}
                      </td>
                      <td className="p-4 text-sm text-gray-600 italic">
                        "{item.quoteText}"
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
                    <td colSpan="4" className="text-center p-8 text-gray-500">
                      No stories created yet. Default static list is active on the homepage.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Cards for mobile */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {testimonials.length > 0 ? (
              testimonials.map((item) => (
                <div key={item._id} className="bg-slate-50 p-4 rounded-lg shadow-sm border border-gray-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-800 text-base">{item.reviewerName}</h3>
                    <span className="text-yellow-500">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => '★').join('')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{item.quoteText}"</p>
                  <div className="flex justify-end space-x-4 pt-2 border-t border-gray-200">
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
                No stories created yet. Default static list is active.
              </div>
            )}
          </div>
        </>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl my-8">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-slate-800">
                {editingTestimonial ? 'Edit Story of Hope' : 'Add Story of Hope'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer / Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rabika, Prema V"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className={commonInputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Star Rating (1 to 5) *</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className={commonInputClasses}
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quote / Story *</label>
                <textarea
                  required
                  rows="5"
                  placeholder="e.g. Thank you so much, Crescent Blood Donors saved my life during surgery!"
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  className={commonInputClasses}
                ></textarea>
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
                  {editingTestimonial ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
