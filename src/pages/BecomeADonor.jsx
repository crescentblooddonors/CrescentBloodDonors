import React, { useState } from 'react';
import Input from '../components/Input.jsx';
import Select from '../components/Select.jsx';
import Checkbox from '../components/Checkbox.jsx';
import Slider from '../components/Slider.jsx'
import { api } from '../config/Url.js';
import DateInputWithPlaceholder from '../components/DateInput.jsx';
import SuccessModal from '../components/SuccessModal.jsx';
import Confirmation from '../assets/confirmation.png'
import Donor from '../assets/donor.png'

const BecomeADonor = () => {
  const [isDonor,setIsDonor] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    age: '',
    bloodGroup: '',
    lastDonationDate: '',
    mobileNumber: '',
    email: '',
    termsAccepted: false,
    cause:'',
    hospitalName:'',
    state:'',
    city:'',
    pincode:'',
    urgency:'',
    addressLine:''
  });

  const [needData,setNeedData] = useState({
    "name": "",
    "age": '',
    "contact": "",
    "causeOfNeed": "",
    "severity": "",
    "bloodGroup": "",
    "attenderName": "",
    "bloodGroupUnits": '',
    "dateOfBirth": "",
    "hospitalName": "",
    "city": "",
    "state": "",
    "zipCode": '',
    "urgency": "Immediate"
    })

    const [err,setErr] = useState('')
  const [isLoading,setIsLoading] = useState(false)
  const [isSuccessModal,setIsSuccessModal] = useState(false)
  const resetForm = ()=>{
    setFormData({
        name: '',
        dateOfBirth: '',
        gender: '',
        age: '',
        bloodGroup: '',
        lastDonationDate: '',
        mobileNumber: '',
        email: '',
        termsAccepted: false,
        cause:'',
        hospitalName:'',
        state:'',
        city:'',
        pincode:'',
        urgency:'',
    })
    setNeedData({
        "name": "",
        "age": '',
        "contact": "",
        "causeOfNeed": "",
        "severity": "",
        "bloodGroup": "",
        "attenderName": "",
        "bloodGroupUnits": '',
        "dateOfBirth": "",
        "hospitalName": "",
        "city": "",
        "state": "",
        "zipCode": '',
        "urgency": "Immediate"
    })
  }
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if(isDonor){
            setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
            }));
    }else{
              setNeedData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
            }));
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isDonor){
        try {
            setIsLoading(true)
            const response = await api.post('/donors/create-donor',formData)
            setIsSuccessModal(true)
        } catch (error) {
            console.log(error.response);
            setErr(error.response.data.message)
        }
    }else{
        try {
            setIsLoading(true)
            const response = await api.post('/recipients/create-recipient',needData)
            setIsSuccessModal(true)
            
        } catch (error) {
            console.log(error);
            setErr(error.response.data.message)
        }
    }
    setIsLoading(false)
    
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const bloodGroupOptions = [
    { value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' },
    { value: 'A1+', label: 'A1+' }, { value: 'A1-', label: 'A1-' },
    { value: 'A1B+', label: 'A1B+' }, { value: 'A1B-', label: 'A1B-' },
    { value: 'A2+', label: 'A2+' }, { value: 'A2-', label: 'A2-' },
    { value: 'A2B+', label: 'A2B+' }, { value: 'A2B-', label: 'A2B-' },
    { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' },
    { value: 'Bombay Blood', label: 'Bombay Blood' }, { value: 'INRA', label: 'INRA' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-poppins">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl flex flex-col lg:flex-row overflow-hidden border border-slate-100">
        <SuccessModal
          isOpen={isSuccessModal}
          onClose={() => {
            setIsSuccessModal(false);
            resetForm();
          }}
          image={isDonor ? Donor : Confirmation}
          title={isDonor ? "" : "Request Submitted!"}
          message={isDonor ? 'You are such a hero!' : "Your blood request has been successfully submitted. Our team will contact you in few minutes."}
        />
        
        {/* Left Side: Decorative Panel with Premium Gradient */}
        <div className="w-full lg:w-2/5 bg-gradient-to-br from-[#164476] via-[#153F76] to-[#0f2d54] text-white p-8 sm:p-12 flex flex-col justify-between items-center text-center rounded-t-2xl lg:rounded-l-2xl lg:rounded-r-none relative overflow-hidden">
          {/* Decorative backdrop shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full -ml-20 -mb-20 blur-2xl pointer-events-none"></div>
          
          <div className="my-auto space-y-6 z-10 flex flex-col items-center">
            <img src="/assets/cbd-logo.png" alt="Logo" className="h-20 w-auto filter drop-shadow-md mb-2 hover:scale-105 transition-transform duration-300" />
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Save lives. <br/>Start here. <br/>Register to <span className="text-red-400 block mt-2 drop-shadow-sm font-black">DONATE BLOOD</span>.
            </h2>
            <p className="text-sm text-slate-200/90 max-w-xs leading-relaxed">
              Every donor is a lifesaver. Join our community-backed network and bridge the gap when every second counts.
            </p>
            <img 
              src="/assets/Blood donation-ill.png" 
              alt="Blood Donation Illustration" 
              className="w-full max-w-xs sm:max-w-sm mt-6 filter drop-shadow-xl hover:translate-y-1 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-3/5 p-8 sm:p-12">
          {/* Form Header Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-100">
            <div>
              <h1 className="text-3xl font-black text-[#164476] tracking-tight">{isDonor ? 'Become a Donor' : 'Request Blood'}</h1>
              <p className="text-xs text-slate-400 mt-1 font-medium">{isDonor ? 'Join as a lifesaver and get verified today' : 'Submit recipient details for urgent fulfillment'}</p>
            </div>
            <div className="flex bg-slate-100/80 p-1 rounded-full shadow-inner border border-slate-200/50 cursor-pointer self-stretch sm:self-auto" onClick={() => setIsDonor(prev => !prev)}>
              <button className={`flex-1 sm:flex-none px-6 py-2 text-xs font-bold transition-all duration-300 rounded-full ${isDonor ? 'bg-[#164476] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
                Donor
              </button>
              <button className={`flex-1 sm:flex-none px-6 py-2 text-xs font-bold transition-all duration-300 rounded-full ${!isDonor ? 'bg-[#164476] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
                Recipient
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <p className='text-red-500 text-sm font-semibold'>{err}</p>
            
            {isDonor ? (
              <div className="space-y-6">
                {/* Section 1: Personal Profile */}
                <div className="bg-slate-50/40 border border-slate-100 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-[#164476] tracking-wider uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Personal Profile
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                    <DateInputWithPlaceholder name="dateOfBirth" type="date" placeholder="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} required />
                    <Select name="gender" label="Gender" options={genderOptions} value={formData.gender} onChange={handleChange} required />
                    <Input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} required />
                  </div>
                </div>

                {/* Section 2: Medical & Blood Registry */}
                <div className="bg-slate-50/40 border border-slate-100 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-[#164476] tracking-wider uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Medical & Blood Registry
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select name="bloodGroup" id="Blood Group" label='Blood Group' placeholder="Blood Group" options={bloodGroupOptions} value={formData.bloodGroup} onChange={handleChange} required />
                    <DateInputWithPlaceholder name="lastDonationDate" type="date" placeholder="Last Donation Date" value={formData.lastDonationDate} onChange={handleChange} />
                  </div>
                </div>

                {/* Section 3: Contact & Location */}
                <div className="bg-slate-50/40 border border-slate-100 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-[#164476] tracking-wider uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Contact & Location Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="mobileNumber" type="tel" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} required />
                    <Input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                    <div className="md:col-span-2">
                      <Input name="addressLine" placeholder="Full Address" value={formData.addressLine} onChange={handleChange} required />
                    </div>
                    <Input name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
                    <Input name="city" placeholder="City" value={formData.city} onChange={handleChange} required />            
                    <Input name="pincode" placeholder="Pincode / ZIP" value={formData.pincode} onChange={handleChange} required />          
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Section 1: Patient Profile */}
                <div className="bg-slate-50/40 border border-slate-100 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-[#164476] tracking-wider uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Patient Profile
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="name" placeholder="Patient Name" value={needData.name} onChange={handleChange} required />
                    <DateInputWithPlaceholder name="dateOfBirth" type="date" placeholder="Date of Birth" value={needData.dateOfBirth} onChange={handleChange} required />
                    <Select name="gender" label="Gender" options={genderOptions} value={needData.gender} onChange={handleChange} required />  
                    <Input name="age" type="number" placeholder="Age" value={needData.age} onChange={handleChange} required />
                    <Input name="contact" type="tel" placeholder="Patient Contact No" value={needData.contact} onChange={handleChange} required />
                    <Input name="email" type="email" placeholder="Patient Email ID" value={needData.email} onChange={handleChange} required />
                  </div>
                </div>

                {/* Section 2: Attender & Blood Requirement */}
                <div className="bg-slate-50/40 border border-slate-100 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-[#164476] tracking-wider uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Attender & Requirement Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="attenderName" type="text" placeholder="Attender Name" value={needData.attenderName} onChange={handleChange} required />
                    <Select name="bloodGroup" id="Blood Group" label='Required Blood Group' placeholder="Blood Group" options={bloodGroupOptions} value={needData.bloodGroup} onChange={handleChange} required />
                    <Input name="bloodGroupUnits" type="number" placeholder="Required Units (Bags)" value={needData.bloodGroupUnits} onChange={handleChange} required />
                    <Select name="urgency" id="Urgency" label='Urgency Level' placeholder="Urgency" options={[
                      {value:'Slow',label:'More than 2 days'},
                      {value:'Emergency',label:'Emergency'},
                      {value:'Immediate',label:'Immediate'},
                    ]} value={needData.urgency} onChange={handleChange} required />
                    <div className="md:col-span-2">
                      <Input name="causeOfNeed" placeholder="Cause of Need / Diagnosis" value={needData.causeOfNeed} onChange={handleChange} required />
                    </div>
                    <div className="md:col-span-2 px-1">
                      <Slider label="Urgency Severity" id='severity' name='severity' value={needData.severity} onChange={handleChange}/>
                    </div>
                  </div>
                </div>

                {/* Section 3: Hospital & Location details */}
                <div className="bg-slate-50/40 border border-slate-100 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-[#164476] tracking-wider uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Hospital & Delivery Location
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input name="hospitalName" type="text" placeholder="Hospital Name & Branch" value={needData.hospitalName} onChange={handleChange} required />
                    </div>
                    <Input name="state" placeholder="State" value={needData.state} onChange={handleChange} required />
                    <Input name="city" placeholder="City" value={needData.city} onChange={handleChange} required />
                    <div className="md:col-span-2">
                      <Input name="zipCode" placeholder="Pincode / ZIP" value={needData.zipCode} onChange={handleChange} required />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit & Terms Button panel */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100">
              <Checkbox name="termsAccepted" label="I agree to the terms & volunteer conditions" checked={isDonor ? formData.termsAccepted : needData.termsAccepted} onChange={handleChange} required />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-10 py-3.5 bg-[#164476] hover:bg-[#1f5ca0] active:scale-[0.98] text-white font-bold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#164476] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-dashed rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Request</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeADonor;

