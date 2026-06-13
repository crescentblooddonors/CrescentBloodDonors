import React, { useEffect, useState } from 'react';
import { api } from '../config/Url';
import { useCookies } from 'react-cookie';

// --- Polished SVG Icons ---
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LocationIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HeartIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ShieldCheckIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const PhoneIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const CalendarIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 7V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// --- Main Component ---
function BloodNeedDetails({ needData, handleBack, onUpdateRecipient }) {
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [cookie] = useCookies();
  const [donorSuccess, setDonorSuccess] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setIsVerified(needData.verification);
  }, [needData.verification]);

  const handleConfirmClick = (donor) => {
    setSelectedDonor(donor);
  };

  const handleConfirmAction = async () => {
    if (selectedDonor) {
      setActionLoading(true);
      try {
        console.log("Confirming donor:", selectedDonor.donorId, needData);

        await api.post("/recipients/confirm-donor", {
          recipientId: needData._id,
          donorId: selectedDonor.donorId
        }, {
          headers: {
            Authorization: `Bearer ${cookie.sessionToken}`
          }
        });

        setDonorSuccess(true);
        
        // Update local array structure to reflect the confirmation
        const updatedDonors = needData.interestedDonors.map(d =>
          d.donorId === selectedDonor.donorId ? { ...d, confirmed: true } : d
        );

        if (onUpdateRecipient) {
          onUpdateRecipient(needData._id, {
            status: "Donors Confirmed",
            interestedDonors: updatedDonors
          });
        }

        setSelectedDonor(null); // Close modal
      } catch (err) {
        console.error("Error confirming donor:", err);
        alert("Failed to confirm donor. Please try again.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleCloseNeed = async () => {
    setActionLoading(true);
    try {
      console.log("Closing need with ID:", needData._id);

      await api.post('/recipients/complete', {
        recipientId: needData._id
      }, {
        headers: {
          Authorization: `Bearer ${cookie.sessionToken}`
        }
      });

      if (onUpdateRecipient) {
        onUpdateRecipient(needData._id, { status: 'Completed' });
      }
      alert("This need has been marked as completed.");
    } catch (err) {
      console.error("Failed to close need:", err);
      alert("Could not mark need as completed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerify = async (id) => {
    setActionLoading(true);
    try {
      await api.put(`/recipients/verify-recipient-request/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${cookie.sessionToken}`
        }
      });

      setIsVerified(true);
      if (onUpdateRecipient) {
        onUpdateRecipient(id, { verification: true, status: 'Verified' });
      }
      alert("Recipient request has been verified successfully.");
    } catch (err) {
      console.error("Failed to verify recipient:", err);
      alert("Could not verify the entry. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to determine severity color
  const getSeverityColor = (severity) => {
    const s = parseInt(severity, 10) || 0;
    if (s > 75) return 'from-[#d93b4e] to-orange-500';
    if (s > 50) return 'from-orange-500 to-yellow-500';
    return 'from-yellow-500 to-emerald-500';
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100/60 min-h-screen font-sans py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* --- Back Button Badge --- */}
        <button 
          onClick={handleBack} 
          className="group mb-6 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:text-[#164476] bg-white border border-slate-100 hover:border-slate-200 rounded-full shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
        >
          <BackIcon />
          Back to Listings
        </button>

        {/* --- Main Dashboard Container --- */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40 overflow-hidden">
          <div className="p-6 md:p-10">

            {/* --- Patient Header Redesign --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-8 mb-8">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md">
                  Blood Requirement Ticket
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#164476] tracking-tight mt-2.5">
                  {needData.name}
                </h1>
                <p className="text-slate-500 text-xs mt-1 flex items-center gap-1.5 font-medium">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" /> Patient Request Details
                </p>
              </div>
              <div className="flex items-center gap-3 bg-[#d93b4e]/10 border border-[#d93b4e]/20 px-5 py-2.5 rounded-2xl">
                <HeartIcon className="w-6 h-6 text-[#d93b4e] animate-pulse" />
                <span className="font-mono text-[#d93b4e] font-black text-2xl tracking-wider">
                  {needData.bloodGroup}
                </span>
              </div>
            </div>

            {/* --- Grid Layout: Left Details vs Right Donors --- */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              {/* Left Side: Detail Cards */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Need Details Card */}
                <DetailCard icon={<HeartIcon className="w-5 h-5 text-[#d93b4e]" />} title="Need Details">
                  <InfoRow label="Cause of Need" value={needData.causeOfNeed} />
                  <InfoRow label="Required Units" value={`${needData.bloodGroupUnits} Units`} />
                  <InfoRow 
                    label="Urgency Level" 
                    value={needData.urgency} 
                    highlight={needData.urgency === 'Immediate' || needData.urgency === 'Urgent'} 
                  />
                  
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Status</span>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      needData.status === 'Completed' 
                        ? 'bg-slate-100 text-slate-600 border border-slate-200' 
                        : needData.status === 'Donors Confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : isVerified
                        ? 'bg-[#164476]/10 text-[#164476] border border-[#164476]/20'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {needData.status || 'Pending'}
                    </span>
                  </div>

                  <div className="pt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient Severity</span>
                      <span className="text-sm font-extrabold text-slate-700">{needData.severity}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-50">
                      <div 
                        className={`bg-gradient-to-r ${getSeverityColor(needData.severity)} h-full rounded-full transition-all duration-500`} 
                        style={{ width: `${needData.severity}%` }}
                      ></div>
                    </div>
                  </div>
                </DetailCard>

                {/* Location Details Card */}
                <DetailCard icon={<LocationIcon className="w-5 h-5 text-[#164476]" />} title="Location & Attender Contacts">
                  <InfoRow label="Hospital Facility" value={needData.hospitalName} />
                  <InfoRow label="City & State" value={`${needData.city}, ${needData.state}`} />
                  <InfoRow label="Attender Name" value={needData.attenderName} />
                  <InfoRow label="Attender Phone" value={needData.contact} isMono={true} />
                </DetailCard>

              </div>

              {/* Right Side: Interested Donors Card */}
              <div className="lg:col-span-2">
                <DetailCard icon={<ShieldCheckIcon className="w-5 h-5 text-emerald-600" />} title="Interested Donors">
                  <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
                    {needData.interestedDonors && needData.interestedDonors.length > 0 ? (
                      needData.interestedDonors.map(donor => (
                        <DonorDetail 
                          key={donor._id || donor.donorId} 
                          donor={donor} 
                          handleConfirmClick={handleConfirmClick} 
                          cookieToken={cookie.sessionToken}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                        <UserIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <p className="text-xs text-slate-400 font-semibold">No interested donors registered yet.</p>
                      </div>
                    )}
                  </div>
                </DetailCard>
              </div>

            </div>

            {/* --- Action Footer Redesign --- */}
            <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end gap-3">
              {isVerified ? (
                <button
                  onClick={handleCloseNeed}
                  disabled={needData.status === 'Completed' || actionLoading}
                  className="px-8 py-3.5 rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-gradient-to-r from-[#d93b4e] to-[#c02f41] hover:from-[#c02f41] hover:to-[#a82535] focus:outline-none focus:ring-2 focus:ring-[#d93b4e] focus:ring-offset-2 flex items-center justify-center gap-2"
                >
                  {actionLoading && <div className="w-4 h-4 border-2 border-white border-dashed rounded-full animate-spin"></div>}
                  {needData.status === 'Completed' ? 'Need Already Completed' : 'Mark Request as Completed'}
                </button>
              ) : (
                <button
                  onClick={() => handleVerify(needData._id)}
                  disabled={needData.status === 'Completed' || actionLoading}
                  className="px-8 py-3.5 rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-gradient-to-r from-[#164476] to-[#0f2d54] hover:from-[#0f2d54] hover:to-[#0a1e38] focus:outline-none focus:ring-2 focus:ring-[#164476] focus:ring-offset-2 flex items-center justify-center gap-2"
                >
                  {actionLoading && <div className="w-4 h-4 border-2 border-white border-dashed rounded-full animate-spin"></div>}
                  Verify & Alert Local Donors
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* --- Confirmation Dialog Modal --- */}
      {selectedDonor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-4">
              <ShieldCheckIcon className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-800">Confirm Selected Donor?</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Confirming <strong className="text-slate-700">{selectedDonor.donorName}</strong> will assign them as the designated donor and change ticket status to <strong className="text-[#164476]">Donors Confirmed</strong>.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedDonor(null)}
                disabled={actionLoading}
                className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={actionLoading}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-colors active:scale-[0.98] disabled:scale-100 flex items-center justify-center gap-1.5"
              >
                {actionLoading && <div className="w-3.5 h-3.5 border-2 border-white border-dashed rounded-full animate-spin"></div>}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Detail Card Helper ---
const DetailCard = ({ icon, title, children }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm">
    <div className="flex items-center gap-3 border-b border-slate-50 pb-3.5 mb-4">
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
        {icon}
      </div>
      <h2 className="text-md font-bold text-[#164476]">{title}</h2>
    </div>
    <div className="space-y-1">{children}</div>
  </div>
);

// --- Info Row Helper ---
const InfoRow = ({ label, value, highlight = false, isMono = false }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-b-0">
    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
    <span className={`text-xs font-bold ${
      highlight ? 'text-[#d93b4e]' : 'text-slate-700'
    } ${isMono ? 'font-mono' : ''}`}>
      {value || 'N/A'}
    </span>
  </div>
);

// --- Subcomponent: Donor Detail Row ---
function DonorDetail({ donor, handleConfirmClick, cookieToken }) {
  const [donorDetails, setDonorDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [donorConfirmation, setDonorConfirmation] = useState(false);

  useEffect(() => {
    setDonorConfirmation(donor.confirmed);

    if (!donorDetails && donor.donorId) {
      const getDonorDetails = async () => {
        try {
          setIsLoading(true);
          const response = await api.get(`/donors/${donor.donorId}`, {
            headers: { Authorization: `Bearer ${cookieToken}` }
          });
          setDonorDetails(response.data.data);
        } catch (err) {
          console.error("Failed to load donor details:", err);
        } finally {
          setIsLoading(false);
        }
      };
      getDonorDetails();
    }
  }, [donor, cookieToken]);

  return (
    <div className="bg-slate-50/50 hover:bg-slate-50/80 border border-slate-100 p-4 rounded-2xl transition-all duration-150 relative overflow-hidden flex flex-col justify-between">
      {/* Left indicator accent color */}
      <div className={`absolute left-0 top-0 h-full w-1 ${
        donorConfirmation ? 'bg-emerald-500' : 'bg-[#164476]'
      }`}></div>

      <div className="pl-2.5">
        <div className="flex justify-between items-start">
          <p className="text-xs font-bold text-slate-800">{donor.donorName}</p>
          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#164476]/5 text-[#164476] border border-[#164476]/10 font-mono">
            {donorDetails?.bloodGroup || 'Interested'}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">{donor.donorEmail}</p>

        {isLoading ? (
          <div className="space-y-1.5 mt-2">
            <div className="h-2 bg-slate-200/60 rounded animate-pulse w-3/4"></div>
            <div className="h-2 bg-slate-200/60 rounded animate-pulse w-1/2"></div>
          </div>
        ) : (
          <div className="text-[10px] text-slate-500 space-y-1 mt-2.5 pt-2 border-t border-slate-100">
            {donorDetails?.mobileNumber && (
              <p className="flex items-center gap-1.5 font-mono">
                <PhoneIcon className="w-3 h-3 text-slate-400" /> {donorDetails.mobileNumber}
              </p>
            )}
            {donorDetails?.dateOfBirth && (
              <p className="flex items-center gap-1.5">
                <CalendarIcon className="w-3 h-3 text-slate-400" /> DOB: {formatDate(donorDetails.dateOfBirth)}
              </p>
            )}
            <p className="text-[9px] text-slate-400 italic">
              Responded: {formatDate(donor.respondedAt)}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => {
          handleConfirmClick(donor);
        }}
        disabled={donorConfirmation}
        className={`w-full mt-4 py-2 px-3 text-[10px] font-extrabold rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] disabled:scale-100 cursor-pointer ${
          donorConfirmation
            ? "bg-emerald-500 text-white cursor-default shadow-none border border-emerald-400"
            : "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
        }`}
      >
        {donorConfirmation ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Donor Confirmed
          </>
        ) : (
          'Confirm Donor Selection'
        )}
      </button>
    </div>
  );
}

export default BloodNeedDetails;
