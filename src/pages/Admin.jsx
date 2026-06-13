import React, { useEffect, useState } from 'react';
import VerificationTable from './VerificationTable';
import ProfileEditPage from '../components/Profile';
import AchievementsManager from '../components/AchievementsManager';
import WhatWeDoManager from '../components/WhatWeDoManager';
import TeamManager from '../components/TeamManager';
import TestimonialManager from '../components/TestimonialManager';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/images.png';
import { api } from '../config/Url';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Award, 
  Heart, 
  Users, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search, 
  TrendingUp, 
  Clock, 
  PlusCircle, 
  ArrowUpRight,
  Activity,
  HeartHandshake
} from 'lucide-react';
// --- Premium Dashboard Component ---
const PremiumDashboard = ({ donors, recipients, loading }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  if (loading) {
    return (
      <div className="text-center p-12 bg-white border border-slate-100/80 rounded-2xl shadow-sm">
        <div className="w-8 h-8 border-2 border-red-500 border-dashed rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-xs text-slate-400 font-medium">Fetching real dashboard metrics...</p>
      </div>
    );
  }

  // Calculate real metrics from the database
  const totalDonors = donors.length;
  const activeRequests = recipients.length;
  const pendingRequests = recipients.filter(r => !r.verification).length;
  
  const totalEntries = donors.length + recipients.length;
  const verifiedEntries = donors.filter(d => d.verification).length + recipients.filter(r => r.verification).length;
  const verificationRate = totalEntries > 0 ? ((verifiedEntries / totalEntries) * 100).toFixed(1) : '0.0';

  const stats = [
    { label: 'Total Donors', value: totalDonors, change: `${donors.filter(d => d.verification).length} Verified`, description: 'Registered in database', trend: 'up' },
    { label: 'Active Requests', value: activeRequests, change: `${pendingRequests} Pending`, description: 'Patient requests queue', trend: 'warning' },
    { label: 'Urgent Cases', value: recipients.filter(r => r.urgency === 'Immediate' || r.urgency === 'Urgent').length, change: 'Urgent priority', description: 'Immediate fulfillment', trend: 'danger' },
    { label: 'Verification Rate', value: `${verificationRate}%`, change: `${verifiedEntries} Total`, description: 'Approved donor profiles', trend: 'up' }
  ];

  // Calculate real monthly analytics from the database!
  // Generate the last 6 months list dynamically
  const getLastSixMonthsNames = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];
    const d = new Date();
    for (let i = 5; i >= 0; i--) {
      const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
      result.push({
        name: months[m.getMonth()],
        monthIdx: m.getMonth(),
        year: m.getFullYear()
      });
    }
    return result;
  };

  const getMonthAndYear = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return { month: d.getMonth(), year: d.getFullYear() };
  };

  const monthlyStats = getLastSixMonthsNames().map(m => {
    // Count donations: match donor's lastDonationDate or createdAt to this month and year
    const donationsCount = donors.filter(d => {
      const date = d.lastDonationDate || d.createdAt;
      const parsed = getMonthAndYear(date);
      return parsed && parsed.month === m.monthIdx && parsed.year === m.year;
    }).length;

    // Count hospital requests: match recipient request's createdAt or date
    const requestsCount = recipients.filter(r => {
      const date = r.createdAt || r.date;
      const parsed = getMonthAndYear(date);
      return parsed && parsed.month === m.monthIdx && parsed.year === m.year;
    }).length;

    return {
      name: m.name,
      donations: donationsCount,
      requests: requestsCount
    };
  });

  const maxVal = Math.max(...monthlyStats.map(s => Math.max(s.donations, s.requests)), 5);

  const chartPoints = monthlyStats.map((stat, idx) => {
    const x = 40 + idx * 80; // horizontal spacing: 40, 120, 200, 280, 360, 440
    const y = 170 - (stat.donations / maxVal) * 140; // mapped from 170 (val=0) to 30 (val=maxVal)
    return { x, y, val: stat.donations, label: stat.name };
  });

  const reqPoints = monthlyStats.map((stat, idx) => {
    const x = 40 + idx * 80;
    const y = 170 - (stat.requests / maxVal) * 140;
    return { x, y, val: stat.requests, label: stat.name };
  });

  // SVG Paths
  const donationPath = chartPoints.reduce((acc, curr, idx) => 
    idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`, ''
  );

  const requestPath = reqPoints.reduce((acc, curr, idx) => 
    idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`, ''
  );

  const fillPath = `${donationPath} L 440 180 L 40 180 Z`;

  // Calculate real blood type counts from registered donors
  const bloodGroupsList = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const bloodInventory = bloodGroupsList.map(group => {
    const count = donors.filter(d => d.bloodGroup === group).length;
    let status = 'Normal';
    let color = 'bg-emerald-500';
    if (count === 0) {
      status = 'Critical';
      color = 'bg-red-500 animate-pulse';
    } else if (count < 2) {
      status = 'Low';
      color = 'bg-amber-500';
    }
    return {
      type: group,
      units: count,
      max: Math.max(10, count * 2), // visual range calculation
      status,
      color
    };
  });

  // Filter top 4 real urgent requests
  const urgentRequests = recipients
    .filter(r => !r.verification || r.urgency === 'Immediate' || r.urgency === 'Urgent')
    .slice(0, 4)
    .map(r => ({
      id: r._id,
      patient: r.name,
      hospital: `${r.city || 'Unknown'}, ${r.state || 'IN'}`,
      type: r.bloodGroup,
      urgency: r.urgency || 'Urgent',
      status: r.verification ? 'Verified' : 'Pending'
    }));

  // Generate real recent activity logs
  const recentLogs = [];
  
  recipients.slice(0, 2).forEach((r, idx) => {
    recentLogs.push({
      id: `req-${idx}`,
      action: 'Request Received',
      detail: `${r.name} requires ${r.bloodGroup} Group (${r.urgency})`,
      time: 'Recent'
    });
  });

  donors.slice(0, 2).forEach((d, idx) => {
    recentLogs.push({
      id: `don-${idx}`,
      action: 'Donor Registered',
      detail: `${d.name} (${d.bloodGroup}) - verified: ${d.verification ? 'Yes' : 'No'}`,
      time: 'Recent'
    });
  });

  if (recentLogs.length === 0) {
    recentLogs.push({
      id: 'empty',
      action: 'System Status Active',
      detail: 'No new registrations today',
      time: 'Now'
    });
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Upper Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Overview Dashboard</h1>
          <p className="text-sm text-slate-500">Real-time stats driven by active donor registries.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Live Monitoring
          </span>
          <span className="text-xs text-slate-400 font-medium">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 hover:border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' :
                stat.trend === 'warning' ? 'bg-amber-50 text-amber-600' :
                'bg-rose-50 text-rose-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-red-600 transition-colors duration-200">{stat.value}</span>
            </div>
            <p className="mt-1 text-xs text-slate-400 font-normal">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Analytics & Blood Stock Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Donations vs Hospital Requests</h3>
              <p className="text-xs text-slate-400">Monthly trend comparison (Real Data)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-100 border border-red-500 rounded-full"></span> Donations</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-slate-300 border-t-2 border-dashed border-slate-600"></span> Requests</span>
            </div>
          </div>
          
          <div className="relative">
            <svg viewBox="0 0 500 200" className="w-full h-auto overflow-visible select-none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="40" y1="180" x2="480" y2="180" stroke="#f1f5f9" strokeWidth="1.5" />
              <line x1="40" y1="130" x2="480" y2="130" stroke="#f8fafc" strokeWidth="1" />
              <line x1="40" y1="80" x2="480" y2="80" stroke="#f8fafc" strokeWidth="1" />
              <line x1="40" y1="30" x2="480" y2="30" stroke="#f8fafc" strokeWidth="1" />

              {/* Area Fill */}
              <path d={fillPath} fill="url(#chartGrad)" />

              {/* Dotted Requests line */}
              <path d={requestPath} fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 4" />

              {/* Donation Solid line */}
              <path d={donationPath} fill="none" stroke="#ef4444" strokeWidth="2.5" />

              {/* Interactive Points - Donations */}
              {chartPoints.map((pt, idx) => (
                <g key={`don-${idx}`}>
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r="4" 
                    fill="#ffffff" 
                    stroke="#ef4444" 
                    strokeWidth="2.5"
                    className="cursor-pointer hover:r-6 transition-all duration-150"
                    onMouseEnter={() => setHoveredPoint({ ...pt, type: 'donation' })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <text x={pt.x} y="196" textAnchor="middle" className="text-[10px] fill-slate-400 font-medium">{pt.label}</text>
                </g>
              ))}

              {/* Interactive Points - Requests */}
              {reqPoints.map((pt, idx) => (
                <g key={`req-${idx}`}>
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r="4" 
                    fill="#ffffff" 
                    stroke="#64748b" 
                    strokeWidth="2.5"
                    className="cursor-pointer hover:r-6 transition-all duration-150"
                    onMouseEnter={() => setHoveredPoint({ ...pt, type: 'request' })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              ))}

              {/* SVG Tooltip */}
              {hoveredPoint && (
                <g>
                  <rect 
                    x={hoveredPoint.x - 45} 
                    y={hoveredPoint.y - 35} 
                    width="90" 
                    height="24" 
                    rx="6" 
                    fill="#1e293b" 
                    className="shadow-lg filter drop-shadow-md"
                  />
                  <text 
                    x={hoveredPoint.x} 
                    y={hoveredPoint.y - 19} 
                    fill="#ffffff" 
                    textAnchor="middle" 
                    className="text-[9px] font-bold"
                  >
                    {hoveredPoint.type === 'donation' ? 'Donated' : 'Requested'}: {hoveredPoint.val}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Blood Stock Board */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base mb-1">Donor Groups</h3>
            <p className="text-xs text-slate-400 mb-4">Availability based on donors list</p>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[200px] pr-1 scrollbar-thin">
            {bloodInventory.map((item, idx) => {
              const percentage = (item.units / item.max) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">{item.type}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        item.status === 'Critical' ? 'bg-red-50 text-red-600' :
                        item.status === 'Low' ? 'bg-amber-50 text-amber-600' :
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-slate-400">{item.units} Donors</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`${item.color} h-1.5 rounded-full`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Layout - Requests vs Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Urgent Request Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Active Urgent Requests</h3>
              <p className="text-xs text-slate-400">Top queue demanding verification</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-400 font-medium">
                  <th className="py-3 px-2">Patient</th>
                  <th className="py-3 px-2">Location</th>
                  <th className="py-3 px-2">Blood</th>
                  <th className="py-3 px-2">Urgency</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs text-slate-600">
                {urgentRequests.length > 0 ? (
                  urgentRequests.map((req, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-2 font-medium text-slate-700">{req.patient}</td>
                      <td className="py-3 px-2 text-slate-500">{req.hospital}</td>
                      <td className="py-3 px-2 font-mono font-bold text-red-500">{req.type}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          req.urgency === 'Immediate' || req.urgency === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {req.urgency}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          req.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-400 font-medium">No active recipient requests.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent logs */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-base">Activity Log</h3>
            <p className="text-xs text-slate-400">System actions record</p>
          </div>
          <div className="space-y-4">
            {recentLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100/80 text-slate-600 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="font-semibold text-slate-700">{log.action}</p>
                  <p className="text-slate-400 text-[11px]">{log.detail}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};


// --- Redesigned Main AdminPanel Panel Shell ---
function AdminPanel() {
  const [activePage, setActivePage] = useState('verification');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [cookie, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();

  // Dashboard-wide real data state
  const [recipients, setRecipients] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cookie.sessionToken) {
      navigate('/auth');
    }
  }, [cookie.sessionToken, navigate]);

  // Fetch real data for dashboard metrics
  useEffect(() => {
    const fetchRealData = async () => {
      if (!cookie.sessionToken) return;
      try {
        const headers = { Authorization: `Bearer ${cookie.sessionToken}` };
        const [recipientsRes, donorsRes] = await Promise.all([
          api.get('/recipients/get-recipient', { headers }),
          api.get('/donors/get-donor', { headers })
        ]);
        setRecipients(recipientsRes.data?.data || []);
        setDonors(donorsRes.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch dashboard real data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRealData();
  }, [cookie.sessionToken]);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <PremiumDashboard donors={donors} recipients={recipients} loading={loading} />;
      case 'verification':
        return <VerificationTable />;
      case 'achievements':
        return <AchievementsManager />;
      case 'what-we-do':
        return <WhatWeDoManager />;
      case 'team':
        return <TeamManager />;
      case 'stories':
        return <TestimonialManager />;
      case 'profile':
        return <ProfileEditPage />;
      default:
        return <VerificationTable />;
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'verification', label: 'Verifications', icon: ShieldAlert },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'what-we-do', label: 'What We Do', icon: Heart },
    { id: 'team', label: 'Meet Our Team', icon: Users },
    { id: 'stories', label: 'Stories of Hope', icon: HeartHandshake },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    setSidebarOpen(false);
  };

  const getNavClasses = (pageName) => {
    const base = "flex items-center gap-3 w-full p-2.5 rounded-lg text-sm font-medium transition-all duration-200";
    if (activePage === pageName) {
      return `${base} bg-white text-red-600 border border-slate-200/50 shadow-sm`;
    }
    return `${base} text-slate-500 hover:bg-slate-200/40 hover:text-slate-800`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex font-sans antialiased text-slate-600">
      
      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Premium Sidebar with Light slate-50 Background */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-slate-50 border-r border-slate-200/60 p-5 z-50 flex flex-col justify-between
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 transition-transform duration-300 ease-out
      `}>
        <div className="space-y-6">
          {/* Logo Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img className="w-8 h-8 rounded-lg object-cover" src={Logo} alt="CBD Logo" />
              <div className="leading-tight">
                <span className="text-sm font-bold text-slate-800 block">Crescent Blood</span>
                <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wider">Admin Panel</span>
              </div>
            </div>
            
            {/* Close Button mobile */}
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1.5 rounded-lg hover:bg-slate-200/50 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button 
                  key={item.id} 
                  onClick={() => handleNavClick(item.id)} 
                  className={getNavClasses(item.id)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Account */}
        <div className="pt-4 border-t border-slate-200/60 space-y-2.5">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-slate-700 text-xs border border-slate-200/50">
              AD
            </div>
            <div className="leading-tight">
              <span className="text-xs font-semibold text-slate-700 block">System Administrator</span>
              <span className="text-[10px] text-slate-400">admin@crescentbd.org</span>
            </div>
          </div>
          <button 
            className="flex items-center justify-center gap-2 w-full p-2 text-xs font-semibold rounded-lg bg-white border border-slate-200/50 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all duration-200 shadow-sm"
            onClick={() => {
              removeCookie('sessionToken');
              navigate('/auth');
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Modern Top Navigation Bar */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3.5 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            {/* Hamburger Button */}
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb / Title */}
            <div className="hidden sm:block text-sm font-semibold text-slate-800 uppercase tracking-wider">
              {menuItems.find(item => item.id === activePage)?.label || 'Admin Portal'}
            </div>
          </div>

          {/* Right Top Header Actions */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-50/50 border border-slate-100 hover:border-slate-200/80 focus:border-red-200 focus:bg-white focus:outline-none rounded-lg w-56 transition-all duration-150"
              />
            </div>

            {/* Alert/Notifications Indicator */}
            <button className="relative p-2 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500"></span>
            </button>

            {/* Admin Badge */}
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 tracking-wider uppercase border border-slate-200/50">
              Root Admin
            </span>
          </div>
        </header>

        {/* View Layout Container */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>
      </div>

    </div>
  );
}

export default AdminPanel;