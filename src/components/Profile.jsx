import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { api } from '../config/Url';
import Kaasim from '../assets/kaasim.jpg'

// A simple camera icon component for the profile picture button
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

function ProfileEditPage() {
  // State for user profile data (pre-filled with dummy data)
  const [profileData, setProfileData] = useState({
    name: '',
    position: '',
    mobile: '',
    rrn: '',
    image: 'https://via.placeholder.com/150' // Default profile picture URL
  });

  const [cookie] = useCookies()
  const [err,setErr] = useState('')
  // State for password fields
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // State for profile picture preview
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  // Generic handler for text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Handler for password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };
  
  // Handler for file input change
  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create a URL for the selected file to use as a preview
      setProfilePicPreview(URL.createObjectURL(file));
      setProfileData(prev=>({...prev,new:e.target.files[0]}))
      // In a real app, you would also prepare this 'file' object for upload
    }
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add validation logic here (e.g., check if new passwords match)
    console.log("Submitting Profile Data:", profileData);
    const formData = new FormData();

    // 2. Append all your text data to it
    formData.append('name', profileData.name);
    formData.append('position', profileData.position);
    formData.append('mobile', profileData.mobile);
    formData.append('rrn', profileData.rrn);
    if(profileData.new) formData.append('image', profileData.new);
    
    const res = await api.put('/admin/update-admin',formData,{
      headers:{
        Authorization:`Bearer ${cookie.sessionToken}`
      }
    })
    if(res.status.success){
      alert("Profile saved successfully! (Check console for data)");
    }
    // In a real application, you would make API calls here to update the user's data
  };

  useEffect(()=>{
    const getData = async ()=>{
      const res = await api.get('/admin',{headers:{Authorization:`Bearer ${cookie.sessionToken}`}})
      setProfileData(prev=>({...prev,...res.data.data}))
    }

    getData()
  },[])

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">Edit Your Profile</h1>

          {/* --- Profile Picture Section --- */}
          <div className="flex flex-col items-center space-y-4 mb-10">
            <img 
              src={profilePicPreview || 'https://cbd-backend.onrender.com'+ profileData.image} 
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            <label htmlFor="profilePicInput" className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300">
              <CameraIcon />
              Change Photo
            </label>
            <input 
              id="profilePicInput" 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleProfilePicChange}
            />
          </div>

          {/* --- Personal Information Section --- */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <input type="text" name="name" id="name" value={profileData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-600 mb-1">Position</label>
                <input type="text" name="position" id="position" value={profileData.position} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-600 mb-1">Mobile No.</label>
                <input type="tel" name="mobile" id="mobile" value={profileData.mobile} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="rrn" className="block text-sm font-medium text-gray-600 mb-1">RRN</label>
                <input type="text" name="rrn" id="rrn" value={profileData.rrn} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
          </div>

          {/* --- Change Password Section --- */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Change Password</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
                  <input type="password" name="currentPassword" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                  <input type="password" name="newPassword" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" />
              </div>
              <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-1">Confirm New Password</label>
                  <input type="password" name="confirmPassword" id="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" />
              </div>
            </div> 
            {err&&<p className='text-red-500'>{err}</p>}
            <button 
              type='button'
              className="mt-2 px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-500  disabled:cursor-not-allowed" 
              disabled={!(passwordData.confirmPassword===passwordData.newPassword)} 
              onClick={async ()=>{
                try{
                  setErr('')
                  const res = await api.put('/admin/update-password',passwordData,{
                    headers:{
                      Authorization:`Bearer ${cookie.sessionToken}`
                    }
                  })
                  if(res.data.success){
                    alert("password updated successfully")
                  }
                }catch (e){
                  setErr(e.response.data.message)
                }
              }}
              >
              Update Password
            </button>
          </div>

          {/* --- Action Buttons --- */}
          <div className="flex justify-end space-x-4 mt-10 pt-6 border-t border-gray-200">
            <button type="button" className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileEditPage;