import React, { useState, useEffect } from 'react';

// --- Mock Data (replace with API calls in a real application) ---
const mockBloodRequests = [
  { id: 1, name: 'John Doe', bloodGroup: 'A+', location: 'Madurai', date: '2025-10-01', status: 'unverified', contact: '9876543210', units: 2 },
  { id: 2, name: 'Jane Smith', bloodGroup: 'B-', location: 'Chennai', date: '2025-10-02', status: 'verified', contact: '8765432109', units: 1 },
  { id: 3, name: 'Sam Wilson', bloodGroup: 'O+', location: 'Coimbatore', date: '2025-10-02', status: 'unverified', contact: '7654321098', units: 3 },
  { id: 4, name: 'Peter Parker', bloodGroup: 'AB+', location: 'Madurai', date: '2025-09-28', status: 'closed', contact: '6543210987', units: 1 },
  { id: 5, name: 'Mary Jane', bloodGroup: 'A+', location: 'Tirunelveli', date: '2025-10-03', status: 'verified', contact: '5432109876', units: 2 },
  { id: 6, name: 'Bruce Wayne', bloodGroup: 'O-', location: 'Chennai', date: '2025-10-04', status: 'unverified', contact: '4321098765', units: 4 },
];

const mockAdminProfile = {
  name: 'Admin User',
  email: 'admin@crescentblooddonors.org',
  role: 'Super Admin',
};
// --- End Mock Data ---

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filters, setFilters] = useState({ status: 'all', date: '', location: '' });
  const [adminProfile, setAdminProfile] = useState({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    setRequests(mockBloodRequests);
    setAdminProfile(mockAdminProfile);
    setProfileForm(mockAdminProfile);
  }, []);

  useEffect(() => {
    let result = requests;

    if (filters.status !== 'all') {
      result = result.filter(req => req.status === filters.status);
    }
    if (filters.date) {
      result = result.filter(req => req.date === filters.date);
    }
    if (filters.location) {
      result = result.filter(req => req.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    setFilteredRequests(result);
  }, [filters, requests]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleVerifyRequest = (id) => {
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === id ? { ...req, status: 'verified' } : req
      )
    );
  };

  const handleProfileFormChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setAdminProfile(profileForm);
    setIsEditingProfile(false);
    // Here you would typically make an API call to save the data
  };
  
  const statusBadge = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'unverified': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-poppins flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white shadow-lg md:min-h-screen">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-dark-blue">Admin Panel</h1>
        </div>
        <nav className="flex md:flex-col p-4 md:p-0">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center w-full px-6 py-3 text-left transition-colors duration-200 ${activeTab === 'requests' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <i className="fas fa-tint mr-3"></i> Blood Requests
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center w-full px-6 py-3 mt-0 md:mt-2 text-left transition-colors duration-200 ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <i className="fas fa-user-cog mr-3"></i> Admin Profile
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        {activeTab === 'requests' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Blood Requests</h2>
            
            {/* Filter Section */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Statuses</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                  <option value="closed">Closed</option>
                </select>
                <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="location" placeholder="Filter by Location..." value={filters.location} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Requests Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">{request.bloodGroup}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.status === 'unverified' && (
                          <button onClick={() => handleVerifyRequest(request.id)} className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200">Verify</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredRequests.length === 0 && <p className="text-center text-gray-500 mt-6">No requests match the current filters.</p>}
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Profile</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              {!isEditingProfile ? (
                <div className="space-y-4">
                  <div><strong className="text-gray-600">Name:</strong> {adminProfile.name}</div>
                  <div><strong className="text-gray-600">Email:</strong> {adminProfile.email}</div>
                  <div><strong className="text-gray-600">Role:</strong> {adminProfile.role}</div>
                  <button onClick={() => setIsEditingProfile(true)} className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" name="name" value={profileForm.name} onChange={handleProfileFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" value={profileForm.email} onChange={handleProfileFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <input type="text" name="role" value={profileForm.role} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" />
                  </div>
                  <div className="flex items-center space-x-4">
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75">
                      Save Changes
                    </button>
                    <button type="button" onClick={() => { setIsEditingProfile(false); setProfileForm(adminProfile); }} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
