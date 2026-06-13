import React, { useState, useEffect } from 'react';
import { api } from '../config/Url';
import { useCookies } from 'react-cookie';

export default function TeamManager() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  
  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');

  const [cookies] = useCookies();

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/team-members');
      if (response.data && response.data.success) {
        setMembers(response.data.data);
      } else {
        setError('Failed to load team members');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch team members. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setName('');
    setRole('');
    setBio('');
    setImageFile(null);
    setFacebook('');
    setTwitter('');
    setLinkedin('');
    setInstagram('');
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setBio(member.bio);
    setImageFile(null);
    setFacebook(member.social?.facebook || '');
    setTwitter(member.social?.twitter || '');
    setLinkedin(member.social?.linkedin || '');
    setInstagram(member.social?.instagram || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) {
      return;
    }
    try {
      const headers = { Authorization: `Bearer ${cookies.sessionToken}` };
      const response = await api.delete(`/team-members/${id}`, { headers });
      if (response.data && response.data.success) {
        setMembers(prev => prev.filter(item => item._id !== id));
      } else {
        alert('Failed to delete team member');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while deleting team member');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !role.trim() || !bio.trim()) {
      alert('Name, Role, and Bio are required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('role', role.trim());
    formData.append('bio', bio.trim());
    
    // Social links
    formData.append('facebook', facebook.trim());
    formData.append('twitter', twitter.trim());
    formData.append('linkedin', linkedin.trim());
    formData.append('instagram', instagram.trim());

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const headers = { 
        Authorization: `Bearer ${cookies.sessionToken}`,
        'Content-Type': 'multipart/form-data'
      };
      
      if (editingMember) {
        // Update
        const response = await api.put(`/team-members/${editingMember._id}`, formData, { headers });
        if (response.data && response.data.success) {
          setMembers(prev =>
            prev.map(item => (item._id === editingMember._id ? response.data.data : item))
          );
          setIsModalOpen(false);
        } else {
          alert(response.data.message || 'Failed to update team member');
        }
      } else {
        // Create
        const response = await api.post('/team-members', formData, { headers });
        if (response.data && response.data.success) {
          setMembers(prev => [...prev, response.data.data]);
          setIsModalOpen(false);
        } else {
          alert(response.data.message || 'Failed to add team member');
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error occurred while saving team member');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    if (imagePath.startsWith("http")) return imagePath;
    const serverUrl = api.defaults.baseURL.replace('/api', '');
    return `${serverUrl}${imagePath}`;
  };

  const commonInputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#153F76] focus:border-[#153F76]";

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Team Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage team members displayed in the "Meet Our Team" section.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#153F76] hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg shadow transition duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Add Member</span>
        </button>
      </div>

      {loading && (
        <div className="text-center p-10">
          <div className="w-12 h-12 border-4 border-[#153F76] border-dashed rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading team members...</p>
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
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/12">Photo</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/5">Name</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/6">Role</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/3">Bio</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.length > 0 ? (
                  members.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50">
                      <td className="p-4 whitespace-nowrap">
                        <img 
                          src={getImageUrl(item.image)} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
                          onError={(e) => {
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                          }}
                        />
                      </td>
                      <td className="p-4 whitespace-normal text-sm font-semibold text-slate-800">
                        {item.name}
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-full font-medium">{item.role}</span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <p className="line-clamp-2 text-xs truncate max-w-sm">{item.bio}</p>
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
                      No dynamic team members created yet. Default static list is active on the homepage.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 md:hidden">
            {members.length > 0 ? (
              members.map((item) => (
                <div key={item._id} className="bg-slate-50 p-4 rounded-lg shadow-sm border border-gray-200 space-y-3">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.name} 
                      className="w-14 h-14 rounded-full object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                      }}
                    />
                    <div>
                      <h3 className="font-bold text-slate-800">{item.name}</h3>
                      <p className="text-xs text-blue-600 font-semibold">{item.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">{item.bio}</p>
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
                No dynamic team members created yet. Default static list is active.
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
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
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

            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mohammed Kasim"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={commonInputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role / Position *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. President"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={commonInputClasses}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-400 mt-1">Leave empty to keep default placeholder photo or current photo.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biography *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="e.g. Oversees the club's vision and impact. Leads strategic partnerships..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={commonInputClasses}
                ></textarea>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Social Media Links (Optional)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Facebook URL</label>
                    <input
                      type="text"
                      placeholder="https://facebook.com/username"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      className={commonInputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Twitter URL</label>
                    <input
                      type="text"
                      placeholder="https://twitter.com/username"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className={commonInputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/username"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className={commonInputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Instagram URL</label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/username"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className={commonInputClasses}
                    />
                  </div>
                </div>
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
                  {editingMember ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
