import React, { useState } from 'react';

// --- SVG Icons (for a polished, self-contained component) ---
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);
const UserIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const LocationIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const HeartIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

// --- Main Component ---
function BloodNeedDetails({needData,handleBack}) {
  const [selectedDonor, setSelectedDonor] = useState(null);

  const handleConfirmClick = (donor) => {
    setSelectedDonor(donor);
  };
  
  const handleConfirmAction = () => {
    if (selectedDonor) {
      console.log("Confirming donor:", selectedDonor);
      // In a real app, you would make an API call here.
      // Upon success, you might want to update the status.
      //setNeedData(prevData => ({ ...prevData, status: `Confirmed: ${selectedDonor.donorName}` }));
      setSelectedDonor(null); // Close modal
    }
  };
  
  const handleCloseNeed = () => {
      console.log("Closing need with ID:", needData._id);
      // API call to update the need's status to 'Closed'
      alert("This need has been marked as closed.");
  }
  
  // Helper to format date strings
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // Helper to determine severity color
  const getSeverityColor = (severity) => {
      const s = parseInt(severity, 10);
      if (s > 75) return 'from-red-500 to-orange-500';
      if (s > 50) return 'from-orange-500 to-yellow-500';
      return 'from-yellow-500 to-green-500';
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 min-w-full">
        {/* --- Back Button --- */}
        <button className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4" onClick={handleBack}>
          <BackIcon />
          Back to List
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-w-full">
          <div className="p-6 md:p-8">

            {/* --- Patient Header --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{needData.name}</h1>
                <p className="text-gray-500 text-lg">Patient Details</p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center justify-center bg-red-100 rounded-full px-5 py-3 text-red-700 font-bold text-xl">
                <HeartIcon className="w-7 h-7 mr-3" /> {needData.bloodGroup}
              </div>
            </div>

            {/* --- Details Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {/* Left Column */}
              <div className="md:col-span-3 space-y-8">
                {/* Need Details */}
                <DetailCard icon={<HeartIcon />} title="Need Details">
                  <InfoRow label="Cause" value={needData.causeOfNeed} />
                  <InfoRow label="Units Required" value={needData.bloodGroupUnits} />
                  <InfoRow label="Urgency" value={needData.urgency} highlight={needData.urgency === 'Immediate'} />
                  <InfoRow label="Current Status" value={needData.status} />
                   <div>
                        <p className="text-sm font-medium text-gray-500">Severity</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                            <div 
                                className={`bg-gradient-to-r ${getSeverityColor(needData.severity)} h-2.5 rounded-full`} 
                                style={{ width: `${needData.severity}%` }}
                            ></div>
                        </div>
                        <p className="text-right text-sm font-semibold text-gray-700">{needData.severity}%</p>
                   </div>
                </DetailCard>
                
                {/* Location Details */}
                <DetailCard icon={<LocationIcon />} title="Location & Contact">
                  <InfoRow label="Hospital" value={needData.hospitalName} />
                  <InfoRow label="City / State" value={`${needData.city}, ${needData.state}`} />
                  <InfoRow label="Attender Name" value={needData.attenderName} />
                  <InfoRow label="Contact No" value={needData.contact} />
                </DetailCard>
              </div>
              
              {/* Right Column */}
              <div className="md:col-span-2">
                <DetailCard icon={<UserIcon />} title="Interested Donors">
                  <div className="space-y-4">
                    {needData.interestedDonors.length > 0 ? (
                      needData.interestedDonors.map(donor => (
                        <div key={donor._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="font-bold text-gray-800">{donor.donorName}</p>
                          <p className="text-sm text-gray-500">{donor.donorEmail}</p>
                          <p className="text-xs text-gray-400 mt-1">Responded: {formatDate(donor.respondedAt)}</p>
                          <button 
                            onClick={() => handleConfirmClick(donor)}
                            className="w-full mt-3 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Confirm Donor
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">No interested donors yet.</p>
                    )}
                  </div>
                </DetailCard>
              </div>
            </div>
            
            {/* --- Action Footer --- */}
            <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end">
                <button 
                    onClick={handleCloseNeed}
                    className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Close This Need
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Confirmation Modal --- */}
      {selectedDonor && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
            <UserIcon className="w-16 h-16 mx-auto text-green-500" />
            <h2 className="text-2xl font-bold mt-4">Confirm Donor?</h2>
            <p className="text-gray-600 my-2">
              Are you sure you want to confirm <strong className="text-gray-800">{selectedDonor.donorName}</strong> as the donor?
            </p>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => setSelectedDonor(null)}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Reusable Helper Components ---
const DetailCard = ({ icon, title, children }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6">
    <div className="flex items-center mb-4">
      <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-4">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-gray-700">{title}</h2>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

const InfoRow = ({ label, value, highlight = false }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className={`text-base font-semibold ${highlight ? 'text-red-600' : 'text-gray-800'}`}>
      {value}
    </p>
  </div>
);

export default BloodNeedDetails;
