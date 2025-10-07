import React, { useState, useMemo, useEffect } from 'react';
import { api } from '../config/Url';
import { useCookies } from 'react-cookie';
import BloodNeedDetails from '../components/BloodDetails';


const SortIcon = ({ direction }) => {
    if (!direction) {
        return <svg className="w-4 h-4 inline-block text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>;
    }
    return direction === 'ascending' ? (
        <svg className="w-4 h-4 inline-block text-blue-600 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
    ) : (
        <svg className="w-4 h-4 inline-block text-blue-600 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
    );
};


const useTableManager = (initialData) => {
    const [filters, setFilters] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    const sortedAndFilteredData = useMemo(() => {
        // Ensure initialData is an array before processing
        let filteredData = Array.isArray(initialData) ? [...initialData] : [];

        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                filteredData = filteredData.filter(item => {
                    if (key === 'location') {
                        return `${item.city}, ${item.state}`.toLowerCase().includes(value.toLowerCase());
                    }
                     if (key === 'verification') {
                        return String(item.verification) === value;
                    }
                    return String(item[key]).toLowerCase() === value.toLowerCase();
                });
            }
        });
        
        if (sortConfig.key) {
            filteredData.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return filteredData;
    }, [initialData, filters, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            key = null;
            direction = null;
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return { sortedAndFilteredData, requestSort, handleFilterChange, sortConfig };
};

// --- Recipients View Component ---
const RecipientsView = ({ data, onVerify }) => {
    const { sortedAndFilteredData, requestSort, handleFilterChange, sortConfig } = useTableManager(data);

    const commonSelectClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#153F76] focus:border-[#153F76]";
    const [showDetail,setShowDetail] = useState(false)
    const [selectedNeed,setSelectedNeed] = useState(null)
    const VerifyButton = ({ item }) => (
         <button
            onClick={() => onVerify(item._id)} // Using _id assuming MongoDB
            disabled={item.verification}
            className={`w-full md:w-auto px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                item.verification
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-[#153F76] text-white hover:bg-red-700 focus:ring-[#153F76]'
            }`}
        >
            {item.verification ? 'Verified' : 'Verify'}
        </button>
    );

    const StatusBadge = ({ verified }) => (
        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
            verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
            {verified ? 'Verified' : 'Not Verified'}
        </span>
    );
    
    const sortableHeader = (label, key) => (
        <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <button onClick={() => requestSort(key)} className="flex items-center space-x-1 hover:text-gray-900">
                <span>{label}</span>
                <SortIcon direction={sortConfig.key === key ? sortConfig.direction : null} />
            </button>
        </th>
    );

    return (
        <>
        {showDetail?<BloodNeedDetails needData={selectedNeed} handleBack={()=>{
            setSelectedNeed(null)
            setShowDetail(false)
        }}/>:<div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Recipient Requests</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <input type="text" placeholder="Filter by City/State..." onChange={e => handleFilterChange('location', e.target.value)} className={commonSelectClasses} />
                <select onChange={e => handleFilterChange('urgency', e.target.value)} className={commonSelectClasses}>
                    <option value="">All Urgencies</option>
                    <option value="Immediate">Immediate</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Routine">Routine</option>
                </select>
                <select onChange={e => handleFilterChange('bloodGroup', e.target.value)} className={commonSelectClasses}>
                    <option value="">All Blood Groups</option>
                    <option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
                </select>
                <select onChange={e => handleFilterChange('verification', e.target.value)} className={commonSelectClasses}>
                    <option value="">All Statuses</option>
                    <option value="true">Verified</option>
                    <option value="false">Not Verified</option>
                </select>
            </div>
            
            {/* Table for Medium and larger screens */}
            <div className="overflow-x-auto hidden md:block">
                <table className="min-w-full bg-white">
                    <thead className="bg-slate-50">
                        <tr>
                            {sortableHeader('Name', 'name')}
                            {sortableHeader('Blood Group', 'bloodGroup')}
                            {sortableHeader('Location', 'city')}
                            {sortableHeader('Urgency', 'urgency')}
                            {sortableHeader('Severity', 'severity')}
                            {sortableHeader('Status', 'verified')}
                            <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sortedAndFilteredData.length > 0 ? sortedAndFilteredData.map((item) => (
                            <tr key={item._id} className="hover:bg-slate-50" onClick={()=>{
                                setSelectedNeed(item);
                                setShowDetail(true)
                            }}>
                                <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-medium">{item.name}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-gray-700"><span className="font-mono text-[#153F76] font-bold">{item.bloodGroup}</span></td>
                                <td className="p-4 whitespace-nowrap text-sm text-gray-700">{`${item.city}, ${item.state}`}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-gray-700">{item.urgency}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-gray-700">{`${item.severity}%`}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-gray-700"><StatusBadge verified={item.verification} /></td>
                                <td className="p-4 whitespace-nowrap text-sm text-gray-700"><VerifyButton item={item} /></td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" className="text-center p-6 text-gray-500">No records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

             {/* Cards for small screens */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {sortedAndFilteredData.length > 0 ? sortedAndFilteredData.map(item => (
                    <div key={item._id} className="bg-slate-50 p-4 rounded-lg shadow-md border border-gray-200 space-y-3">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                            <span className="font-mono text-xl text-[#153F76] font-bold">{item.bloodGroup}</span>
                        </div>
                        <div className="text-sm text-slate-600">
                            <p><span className="font-semibold">Location:</span> {`${item.city}, ${item.state}`}</p>
                            <p><span className="font-semibold">Urgency:</span> {item.urgency}</p>
                            <p><span className="font-semibold">Severity:</span> {item.severity}%</p>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                           <StatusBadge verified={item.verification} />
                           <VerifyButton item={item} />
                        </div>
                    </div>
                )) : (
                    <div className="text-center p-6 text-gray-500">No records found.</div>
                )}
            </div>
        </div>}
        </>
    );
};

// --- Donors View Component ---
const DonorsView = ({ data, onVerify }) => {
    const { sortedAndFilteredData, requestSort, handleFilterChange, sortConfig } = useTableManager(data);
    const commonSelectClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#153F76] focus:border-[#153F76]";

    const VerifyButton = ({ item }) => (
         <button
            onClick={() => onVerify(item._id)} // Using _id assuming MongoDB
            disabled={item.verified}
            className={`w-full md:w-auto px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                item.verification
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-[#153F76] text-white hover:bg-red-700 focus:ring-[#153F76]'
            }`}
        >
            {item.verification ? 'Verified' : 'Verify'}
        </button>
    );

    const StatusBadge = ({ verified }) => (
        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
            verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
            {verified ? 'Verified' : 'Not Verified'}
        </span>
    );

    const sortableHeader = (label, key) => (
        <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <button onClick={() => requestSort(key)} className="flex items-center space-x-1 hover:text-gray-900">
                <span>{label}</span>
                <SortIcon direction={sortConfig.key === key ? sortConfig.direction : null} />
            </button>
        </th>
    );

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Available Donors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <input type="text" placeholder="Filter by City/State..." onChange={e => handleFilterChange('location', e.target.value)} className={commonSelectClasses} />
                <select onChange={e => handleFilterChange('bloodGroup', e.target.value)} className={commonSelectClasses}>
                   <option value="">All Blood Groups</option>
                    <option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
                </select>
                <select onChange={e => handleFilterChange('verified', e.target.value)} className={commonSelectClasses}>
                    <option value="">All Statuses</option>
                    <option value="true">Verified</option>
                    <option value="false">Not Verified</option>
                </select>
            </div>

            {/* Table for Medium and larger screens */}
            <div className="overflow-x-auto hidden md:block">
                <table className="min-w-full bg-white">
                    <thead className="bg-slate-50">
                        <tr>
                            {sortableHeader('Name', 'name')}
                            {sortableHeader('Blood Group', 'bloodGroup')}
                            {sortableHeader('Location', 'city')}
                            {sortableHeader('Last Donated', 'lastDonated')}
                            {sortableHeader('Status', 'verified')}
                            <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                         {sortedAndFilteredData.length > 0 ? sortedAndFilteredData.map(item => (
                            <tr key={item._id} className="hover:bg-slate-50">
                                <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-medium">{item.name}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-gray-700"><span className="font-mono text-[#153F76] font-bold">{item.bloodGroup}</span></td>
                                <td className="p-4 whitespace-nowrap text-sm text-gray-700">{`${item.city}, ${item.state}`}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-gray-700">{new Date(item.lastDonated).toLocaleDateString()}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-gray-700"><StatusBadge verified={item.verified} /></td>
                                <td className="p-4 whitespace-nowrap text-sm text-gray-700"><VerifyButton item={item} /></td>
                            </tr>
                        )) : (
                             <tr><td colSpan="6" className="text-center p-6 text-gray-500">No records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

             {/* Cards for small screens */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {sortedAndFilteredData.length > 0 ? sortedAndFilteredData.map(item => (
                    <div key={item._id} className="bg-slate-50 p-4 rounded-lg shadow-md border border-gray-200 space-y-3">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                            <span className="font-mono text-xl text-[#153F76] font-bold">{item.bloodGroup}</span>
                        </div>
                        <div className="text-sm text-slate-600">
                            <p><span className="font-semibold">Location:</span> {`${item.city}, ${item.state}`}</p>
                            <p><span className="font-semibold">Last Donated:</span> {new Date(item.lastDonated).toLocaleDateString()}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                           <StatusBadge verified={item.verification} />
                           <VerifyButton item={item} />
                        </div>
                    </div>
                )) : (
                     <div className="text-center p-6 text-gray-500">No records found.</div>
                )}
            </div>
        </div>
    );
};


export default function VerificationTable() {
    const [activeTab, setActiveTab] = useState('recipients');
    const [recipients, setRecipients] = useState([]);
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [cookies] = useCookies() 
  


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const headers = { Authorization: `Bearer ${cookies.sessionToken}` };

                // Fetch both datasets in parallel
                const [recipientsResponse, donorsResponse] = await Promise.all([
                    api.get('/recipients/get-recipient', { headers }),
                    api.get('/donors/get-donor', { headers }) // Assuming this endpoint exists
                ]);

                setRecipients(recipientsResponse.data.data);
                setDonors(donorsResponse.data.data);

            } catch (err) {
                setError("Failed to fetch data. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    const handleVerify = async (id, type) => {
        if (type === 'recipient') {
          try {
            await api.put(`/recipients/verify-recipient-request/${id}`, {}, {
              headers: { Authorization: `Bearer ${cookies.sessionToken}` }
            });
            
                setRecipients(prev =>
                    prev.map(r => (r._id === id ? { ...r, verified: true } : r))
                );
          } catch (err) {
            console.error("Failed to verify recipient:", err);
            alert("Could not verify the entry. Please try again.");
          }
        }

        // Handle donor verification similarly
    };

    return (
            <div className="max-w-7xl mx-auto">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4 sm:space-x-8 px-2 sm:px-0">
                        <button
                            onClick={() => setActiveTab('recipients')}
                            className={`py-4 px-1 border-b-4 font-bold text-lg whitespace-nowrap focus:outline-none transition-colors duration-200 ${
                                activeTab === 'recipients'
                                    ? 'border-[#153F76] text-[#153F76]'
                                    : 'border-transparent text-gray-500 hover:text-[#153F76] hover:border-[#153F76]'
                            }`}
                        >
                            Recipients
                        </button>
                        <button
                            onClick={() => setActiveTab('donors')}
                            className={`py-4 px-1 border-b-4 font-bold text-lg whitespace-nowrap focus:outline-none transition-colors duration-200 ${
                                activeTab === 'donors'
                                    ? 'border-[#153F76] text-[#153F76]'
                                    : 'border-transparent text-gray-500 hover:text-[#153F76] hover:border-[#153F76]'
                            }`}
                        >
                            Donors
                        </button>
                    </nav>
                </div>

                <main className="mt-6">
                    {loading && (
                        <div className="text-center p-10">
                            <div className="w-12 h-12 border-4 border-[#153F76] border-dashed rounded-full animate-spin mx-auto"></div>
                            <p className="mt-4 text-lg text-slate-600">Loading Data...</p>
                        </div>
                    )}
                    {error && (
                        <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-lg font-semibold text-red-700">{error}</p>
                        </div>
                    )}
                    {!loading && !error && (
                        <>
                            {activeTab === 'recipients' && <RecipientsView data={recipients} onVerify={(id) => handleVerify(id, 'recipient')} />}
                            {activeTab === 'donors' && <DonorsView data={donors} onVerify={(id) => handleVerify(id, 'donor')} />}
                        </>
                    )}
                </main>
            </div>
      
    );
}

