import React, { useState } from 'react';
import Logo from '../assets/images.png'
import { api } from '../config/Url';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const AdminAuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cookie,setCookie] = useCookies()
  let navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await api.post('/admin/login',{
          email,password
        })

        setCookie('sessionToken',response.data.data.token)
        navigate('/admin')
    } catch (err) {
      setError(err.response.data.message)  
    }
    // --- Mock Authentication Logic ---
    // // In a real application, you would make an API call to your backend here.
    // if (email === 'admin@crescentblooddonors.org' && password === 'password') {
    //   setError('');
    //   alert('Login successful!');
    //   // Here you would typically redirect the user to the dashboard,
    //   // for example, using React Router: history.push('/admin/dashboard')
    // } else {
    //   setError('Invalid email or password. Please try again.');
    // }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center font-poppins p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            {/* You can replace this with your actual logo component or image */}
            <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <img src={Logo} className='rounded-full' alt="" />
            </div>
            <h1 className="text-3xl font-bold text-dark-blue">Admin Login</h1>
            <p className="text-gray-500 mt-2">Crescent Blood Donors Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
                <p>{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthPage;
