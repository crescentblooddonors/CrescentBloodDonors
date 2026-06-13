import React, { useState, useMemo, useEffect } from 'react';
import { api } from '../config/Url';
import { useCookies } from 'react-cookie';
import BloodNeedDetails from '../components/BloodDetails';


const SortIcon = ({ direction }) => {
    if (!direction) {
        return <svg className="w-3.5 h-3.5 inline-block text-slate-300 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>;
    }
    return direction === 'ascending' ? (
        <svg className="w-3.5 h-3.5 inline-block text-red-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
    ) : (
        <svg className="w-3.5 h-3.5 inline-block text-red-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
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




const VerifyButton = ({ item, onVerify }) => {
    const [isVerified, setIsVerified] = useState(false)
    const [cookies] = useCookies()
    useEffect(() => {
        setIsVerified(item.verification)
    }, [item.verification])


    const handleVerify = async (id) => {
        try {
            await api.put(`/recipients/verify-recipient-request/${id}`, {}, {
                headers: { Authorization: `Bearer ${cookies.sessionToken}` }
            });

            setIsVerified(true)
            if (onVerify) onVerify(id)
        } catch (err) {
            console.error("Failed to verify recipient:", err);
            alert("Could not verify the entry. Please try again.");
        }
        // Handle donor verification similarly
    };
    return <button
        onClick={() => handleVerify(item._id)} // Using _id assuming MongoDB
        disabled={isVerified}
        className={`w-full md:w-auto px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${isVerified
                ? 'bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed'
                : 'bg-slate-800 text-white hover:bg-slate-900 shadow-sm cursor-pointer'
            }`}
    >
        {isVerified ? 'Verified' : 'Verify'}
    </button>
};

// --- Recipients View Component ---
const RecipientsView = ({ data, onVerify, onUpdateRecipient }) => {
    const { sortedAndFilteredData, requestSort, handleFilterChange, sortConfig } = useTableManager(data);

    const commonSelectClasses = "w-full px-3 py-2 text-xs bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-slate-200 focus:border-red-200 focus:bg-white focus:outline-none rounded-lg transition-all duration-150";
    const [showDetail, setShowDetail] = useState(false)
    const [selectedNeed, setSelectedNeed] = useState(null)


    const StatusBadge = ({ verified, children }) => (
        <span className={`px-2.5 py-0.5 inline-flex text-[10px] leading-5 font-semibold rounded-md ${verified ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/30' : 'bg-amber-50 text-amber-700 border border-amber-100/30'
            }`}>
            {children}
        </span>
    );

    const sortableHeader = (label, key) => (
        <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <button onClick={() => requestSort(key)} className="flex items-center space-x-1 hover:text-slate-800 transition-colors">
                <span>{label}</span>
                <SortIcon direction={sortConfig.key === key ? sortConfig.direction : null} />
            </button>
        </th>
    );

    return (
        <>
            {showDetail ? (
                <BloodNeedDetails 
                    needData={data.find(r => r._id === selectedNeed?._id) || selectedNeed} 
                    handleBack={() => {
                        setSelectedNeed(null)
                        setShowDetail(false)
                    }} 
                    onUpdateRecipient={onUpdateRecipient} 
                />
            ) : (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Recipient Requests</h2>
                            <p className="text-xs text-slate-400">Filter and verify critical requests from recipients.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                        <input type="text" placeholder="Filter by City/State..." onChange={e => handleFilterChange('location', e.target.value)} className={commonSelectClasses} />
                        <select onChange={e => handleFilterChange('urgency', e.target.value)} className={commonSelectClasses}>
                            <option value="">All Urgencies</option>
                            <option value="Immediate">Immediate</option>
                            <option value="Urgent">Urgent</option>
                            <option value="Routine">Routine</option>
                        </select>
                        <select onChange={e => handleFilterChange('bloodGroup', e.target.value)} className={commonSelectClasses}>
                            <option value="">All Blood Groups</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="A1+">A1+</option>
                            <option value="A1-">A1-</option>
                            <option value="A2+">A2+</option>
                            <option value="A2-">A2-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="AB+">A1B+</option>
                            <option value="AB-">A1B-</option>
                            <option value="AB+">A2B+</option>
                            <option value="AB-">A2B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="INRA">INRA</option>
                            <option value="Bombay Blood Group">Bombay Blood</option>
                        </select>
                        <select onChange={e => handleFilterChange('verification', e.target.value)} className={commonSelectClasses}>
                            <option value="">All Statuses</option>
                            <option value="true">Verified</option>
                            <option value="false">Not Verified</option>
                        </select>
                    </div>

                    {/* Table for Medium and larger screens */}
                    <div className="overflow-x-auto hidden md:block">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-slate-100 text-left">
                                    {sortableHeader('Name', 'name')}
                                    {sortableHeader('Blood Group', 'bloodGroup')}
                                    {sortableHeader('Location', 'city')}
                                    {sortableHeader('Urgency', 'urgency')}
                                    {sortableHeader('Severity', 'severity')}
                                    {sortableHeader('Status', 'verified')}
                                    <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-xs text-slate-600">
                                {sortedAndFilteredData.length > 0 ? sortedAndFilteredData.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 whitespace-nowrap font-medium text-slate-800">
                                            <button
                                                onClick={() => {
                                                    setSelectedNeed(item);
                                                    setShowDetail(true);
                                                }}
                                                className="hover:text-red-500 font-bold transition-colors text-left"
                                            >
                                                {item.name}
                                            </button>
                                        </td>
                                        <td className="p-4 whitespace-nowrap"><span className="font-mono text-red-500 font-bold text-sm">{item.bloodGroup}</span></td>
                                        <td className="p-4 whitespace-nowrap text-slate-500">{`${item.city}, ${item.state}`}</td>
                                        <td className="p-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${item.urgency === 'Immediate' || item.urgency === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {item.urgency}
                                            </span>
                                        </td>
                                        <td className="p-4 whitespace-nowrap font-medium">{`${item.severity}%`}</td>
                                        <td className="p-4 whitespace-nowrap"><StatusBadge verified={item.verification}>{item.status}</StatusBadge></td>
                                        <td className="p-4 whitespace-nowrap"><VerifyButton item={item} onVerify={onVerify} /></td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="7" className="text-center p-8 text-slate-400 font-medium">No records found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Cards for small screens */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {sortedAndFilteredData.length > 0 ? sortedAndFilteredData.map(item => (
                            <div key={item._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                                <div className="flex justify-between items-start">
                                    <button
                                        onClick={() => {
                                            setSelectedNeed(item);
                                            setShowDetail(true);
                                        }}
                                        className="font-bold text-slate-800 text-left hover:text-red-500"
                                    >
                                        {item.name}
                                    </button>
                                    <span className="font-mono text-red-500 font-bold text-base">{item.bloodGroup}</span>
                                </div>
                                <div className="text-xs text-slate-500 space-y-1">
                                    <p><span className="font-semibold text-slate-700">Location:</span> {`${item.city}, ${item.state}`}</p>
                                    <p><span className="font-semibold text-slate-700">Urgency:</span> {item.urgency}</p>
                                    <p><span className="font-semibold text-slate-700">Severity:</span> {item.severity}%</p>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                    <StatusBadge verified={item.verification}>{item.status}</StatusBadge>
                                    <VerifyButton item={item} onVerify={onVerify} />
                                </div>
                            </div>
                        )) : (
                            <div className="text-center p-8 text-slate-400 font-medium">No records found.</div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

// --- Donors View Component ---
const DonorsView = ({ data, onVerify }) => {
    const { sortedAndFilteredData, requestSort, handleFilterChange, sortConfig } = useTableManager(data);
    const commonSelectClasses = "w-full px-3 py-2 text-xs bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-slate-200 focus:border-red-200 focus:bg-white focus:outline-none rounded-lg transition-all duration-150";

    const sortableHeader = (label, key) => (
        <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <button onClick={() => requestSort(key)} className="flex items-center space-x-1 hover:text-slate-800 transition-colors">
                <span>{label}</span>
                <SortIcon direction={sortConfig.key === key ? sortConfig.direction : null} />
            </button>
        </th>
    );

    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-800">Available Donors</h2>
                <p className="text-xs text-slate-400">View and manage registered donor records.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                <input type="text" placeholder="Filter by City/State..." onChange={e => handleFilterChange('location', e.target.value)} className={commonSelectClasses} />
                <select onChange={e => handleFilterChange('bloodGroup', e.target.value)} className={commonSelectClasses}>
                    <option value="">All Blood Groups</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="A1+">A1+</option>
                    <option value="A1-">A1-</option>
                    <option value="A2+">A2+</option>
                    <option value="A2-">A2-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="AB+">A1B+</option>
                    <option value="AB-">A1B-</option>
                    <option value="AB+">A2B+</option>
                    <option value="AB-">A2B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="INRA">INRA</option>
                    <option value="Bombay Blood Group">Bombay Blood</option>
                </select>
            </div>

            {/* Table for Medium and larger screens */}
            <div className="overflow-x-auto hidden md:block">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-slate-100 text-left">
                            {sortableHeader('Name', 'name')}
                            {sortableHeader('Blood Group', 'bloodGroup')}
                            {sortableHeader('Location', 'city')}
                            {sortableHeader('Last Donated', 'lastDonated')}
                            <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Gender</th>
                            <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Mobile</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs text-slate-600">
                        {sortedAndFilteredData.length > 0 ? sortedAndFilteredData.map(item => (
                            <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 whitespace-nowrap font-medium text-slate-800">{item.name}</td>
                                <td className="p-4 whitespace-nowrap"><span className="font-mono text-red-500 font-bold text-sm">{item.bloodGroup}</span></td>
                                <td className="p-4 whitespace-nowrap text-slate-500">{`${item.city}, ${item.state}`}</td>
                                <td className="p-4 whitespace-nowrap text-slate-500">{new Date(item.lastDonationDate).toLocaleDateString()}</td>
                                <td className="p-4 whitespace-nowrap">{item.gender}</td>
                                <td className="p-4 whitespace-nowrap font-mono">{item.mobileNumber}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" className="text-center p-8 text-slate-400 font-medium">No records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Cards for small screens */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {sortedAndFilteredData.length > 0 ? sortedAndFilteredData.map(item => (
                    <div key={item._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-slate-800 text-sm">{item.name}</h3>
                            <span className="font-mono text-red-500 font-bold text-sm">{item.bloodGroup}</span>
                        </div>
                        <div className="text-xs text-slate-500 space-y-1">
                            <p><span className="font-semibold text-slate-700">Location:</span> {`${item.city}, ${item.state}`}</p>
                            <p><span className="font-semibold text-slate-700">Last Donated:</span> {new Date(item.lastDonationDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-[10px] text-slate-400 font-medium">
                            <span>Gender: {item.gender}</span>
                            <span>Mobile: {item.mobileNumber}</span>
                        </div>
                    </div>
                )) : (
                    <div className="text-center p-8 text-slate-400 font-medium">No records found.</div>
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
                    prev.map(r => (r._id === id ? { ...r, verification: true, status: 'Verified' } : r))
                );
            } catch (err) {
                console.error("Failed to verify recipient:", err);
                alert("Could not verify the entry. Please try again.");
            }
        }

        // Handle donor verification similarly
    };

    const handleUpdateRecipient = (id, fields) => {
        setRecipients(prev => prev.map(r => (r._id === id ? { ...r, ...fields } : r)));
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <nav className="-mb-px flex space-x-6">
                    <button
                        onClick={() => setActiveTab('recipients')}
                        className={`pb-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap focus:outline-none transition-all duration-200 ${activeTab === 'recipients'
                                ? 'border-red-500 text-slate-900 font-bold'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Recipients
                    </button>
                    <button
                        onClick={() => setActiveTab('donors')}
                        className={`pb-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap focus:outline-none transition-all duration-200 ${activeTab === 'donors'
                                ? 'border-red-500 text-slate-900 font-bold'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Donors
                    </button>
                </nav>
            </div>

            <main className="mt-4">
                {loading && (
                    <div className="text-center p-12 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="w-10 h-10 border-2 border-red-500 border-dashed rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-xs text-slate-400 font-medium">Fetching verified listings...</p>
                    </div>
                )}
                {error && (
                    <div className="text-center p-10 bg-rose-50 border border-rose-100 rounded-xl">
                        <p className="text-sm font-semibold text-rose-700">{error}</p>
                    </div>
                )}
                {!loading && !error && (
                    <div className="animate-fadeIn">
                        {activeTab === 'recipients' && (
                            <RecipientsView 
                                data={recipients} 
                                onVerify={(id) => handleVerify(id, 'recipient')} 
                                onUpdateRecipient={handleUpdateRecipient} 
                            />
                        )}
                        {activeTab === 'donors' && <DonorsView data={donors} onVerify={(id) => handleVerify(id, 'donor')} />}
                    </div>
                )}
            </main>
        </div>

    );
}
