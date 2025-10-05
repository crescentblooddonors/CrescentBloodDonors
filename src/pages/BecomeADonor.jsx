import React, { useState } from 'react';
import Input from '../components/Input.jsx';
import Select from '../components/Select.jsx';
import Checkbox from '../components/Checkbox.jsx';
import Slider from '../components/Slider.jsx'

const BecomeADonor = () => {
  const [isDonor,setIsDonor] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    age: '',
    bloodGroup: '',
    lastDonationDate: '',
    mobileNo: '',
    emailId: '',
    agreeTerms: false,
    cause:'',
    hospitalName:'',
    state:'',
    city:'',
    pincode:'',
    urgency:'',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Donor Form Data:', formData);
    alert('Form submitted! Check the console for the data.');
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const bloodGroupOptions = [
    { value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-poppins">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-2xl flex flex-col lg:flex-row">
        
        {/* Left Side: Decorative Panel */}
        <div className="w-full lg:w-2/5 bg-blue-600 text-white p-8 sm:p-12 flex flex-col justify-center items-center text-center rounded-t-xl lg:rounded-l-xl lg:rounded-r-none">
          <img src="/assets/cbd-logo.png" alt="Logo" className="h-16 w-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Save lives. Start here. Register to <span className="text-yellow-300">DONATE BLOOD</span>.
          </h2>
          <img 
            src="/assets/Blood donation-ill.png" 
            alt="Blood Donation Illustration" 
            className="w-full max-w-xs sm:max-w-sm mt-6"
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-3/5 p-8 sm:p-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-blue">Become a Donor!</h1>
            <div className="flex border border-gray-300 rounded-md p-1" onClick={()=>setIsDonor(prev=>!prev)}>
              <button className={`px-4 py-1.5 text-sm font-semibold ${isDonor? 'bg-blue-600 text-white': 'text-gray-600'} rounded`}>Donor</button>
              <button className={`px-4 py-1.5 text-sm font-semibold ${!isDonor? 'bg-blue-600 text-white': 'text-gray-600'} rounded`}>Recipient</button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isDonor?<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              <Input name="dateOfBirth" type="date" placeholder="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} required />
              <Select name="gender" label="Gender" options={genderOptions} value={formData.gender} onChange={handleChange} required />
              <Input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} required />
              <Select name="bloodGroup" id="Blood Group" label='Blood Group' placeholder="Blood Group" options={bloodGroupOptions} value={formData.bloodGroup} onChange={handleChange} required />
              <Input name="lastDonationDate" type="date" placeholder="Last Donation Date" value={formData.lastDonationDate} onChange={handleChange} />
              <Input name="mobileNo" type="tel" placeholder="Mobile No" value={formData.mobileNo} onChange={handleChange} required />
              <Input name="emailId" type="email" placeholder="Email ID" value={formData.emailId} onChange={handleChange} required />
            </div>:
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className='grid grid-cols-1 gap-6'>
                        <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                        <Input name="dateOfBirth" type="date" placeholder="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} required />
                        <Select name="gender" label="Gender" options={genderOptions} value={formData.gender} onChange={handleChange} required />
                        <Input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} required />
                        <Select name="bloodGroup" id="Blood Group" label='Blood Group' placeholder="Blood Group" options={bloodGroupOptions} value={formData.bloodGroup} onChange={handleChange} required />
                        <Input name="lastDonationDate" type="date" placeholder="Last Donation Date" value={formData.lastDonationDate} onChange={handleChange} />
                        <Input name="mobileNo" type="tel" placeholder="Mobile No" value={formData.mobileNo} onChange={handleChange} required />
                        <Input name="emailId" type="email" placeholder="Email ID" value={formData.emailId} onChange={handleChange} required />
                    </div>
                    <div className='h-fit grid grid-cols-1 gap-6'>
                        <Input name="cause" placeholder="cause of need" value={formData.cause} onChange={handleChange} required />
                        <Input name="hospitalName" type="text" placeholder="Hospital Name" value={formData.hospitalName} onChange={handleChange} required />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
                            <Input name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                        </div>
                         <Input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required />
                         <Slider label="Urgency" id='urgency' value={formData.urgency} onChange={handleChange}/>
                    </div>
                </div>
            
            }

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
              <Checkbox name="agreeTerms" label="I agree to Terms & Conditions" checked={formData.agreeTerms} onChange={handleChange} required />
              <button
                type="submit"
                className="w-full sm:w-auto px-10 py-3 bg-blue-800 text-white font-bold rounded-md shadow-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeADonor;

