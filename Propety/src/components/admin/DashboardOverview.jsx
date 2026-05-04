import { Building2, Users, MessageSquare, Calendar, TrendingUp, MapPin, Plus, UserPlus, Settings, BarChart3, Search } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LabelList } from 'recharts';

import { useState } from 'react';

const DashboardOverview = ({ properties, enquiries = [], usersCount = 0, formatPrice, onEnquiryClick }) => {
  const [timeframe, setTimeframe] = useState('Last 6 Months');
  // Calculate Actual Status Data from properties
  const statusCounts = properties.reduce((acc, p) => {
    const status = p.status || 'For Sale'; // Fallback
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const total = properties.length || 1;
  const colors = ['#2563eb', '#10b981', '#fbbf24', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6'];
  const statusData = Object.keys(statusCounts).map((status, index) => {
    const count = statusCounts[status];
    const percentage = properties.length ? Math.round((count / total) * 100) : 0;
    return {
      name: status,
      percentage: percentage,
      value: count,
      topLabel: `${percentage}%`,
      color: colors[index % colors.length]
    };
  });

  // Custom Tick Component for X-Axis
  const CustomXAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={15} textAnchor="middle" fill="#94a3b8" style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>
          {payload.value}
        </text>
        <text x={0} y={32} textAnchor="middle" fill="#0f172a" style={{ fontSize: '12px', fontWeight: '900' }}>
          {statusCounts[payload.value]} Props
        </text>
      </g>
    );
  };

  // Calculate Growth Data
  const getGrowthData = () => {
    if (timeframe === 'Last 6 Months') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      const last6Months = [];
      
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(currentMonth - i);
        const monthName = months[d.getMonth()];
        const year = d.getFullYear();
        
        const count = enquiries.filter(e => {
          const enqDate = new Date(e.createdAt);
          return enqDate.getMonth() === d.getMonth() && enqDate.getFullYear() === year;
        }).length;
        
        last6Months.push({ name: monthName, enquiries: count });
      }
      return last6Months;
    } else {
      // This Month (Daily)
      const now = new Date();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const dailyData = [];
      
      for (let i = 1; i <= daysInMonth; i++) {
        const count = enquiries.filter(e => {
          const enqDate = new Date(e.createdAt);
          return enqDate.getDate() === i && 
                 enqDate.getMonth() === now.getMonth() && 
                 enqDate.getFullYear() === now.getFullYear();
        }).length;
        
        dailyData.push({ name: i.toString(), enquiries: count });
      }
      return dailyData;
    }
  };

  const growthData = getGrowthData();

  const stats = [
    { label: 'Total Properties', value: properties.length, icon: Building2, color: 'bg-blue-600', trend: 'Actual', iconColor: 'text-blue-600' },
    { label: 'Total Users', value: usersCount, icon: Users, color: 'bg-emerald-600', trend: 'Actual', iconColor: 'text-emerald-600' },
    { label: 'Total Enquiries', value: enquiries.length, icon: MessageSquare, color: 'bg-amber-500', trend: 'Last 5', iconColor: 'text-amber-500' },
  ];

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="relative bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-center gap-2">
                  <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
                  <span className={`text-[10px] font-bold flex items-center ${stat.comingSoon ? 'text-slate-400' : 'text-blue-600'}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Analytics Chart - Real Empty State */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900">Performance Overview</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Growth Analytics</p>
            </div>
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option>Last 6 Months</option>
              <option>This Month</option>
              <option>By Date</option>
            </select>
          </div>
          
          <div className="flex-1 min-h-[300px] w-full">
            {timeframe === 'By Date' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-[10px] font-black text-slate-400 uppercase text-center pb-2">{day}</div>
                  ))}
                  {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-14 rounded-2xl bg-slate-50/30"></div>
                  ))}
                  {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }).map((_, i) => {
                    const day = i + 1;
                    const count = enquiries.filter(e => {
                      const d = new Date(e.createdAt);
                      return d.getDate() === day && d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
                    }).length;
                    return (
                      <div key={day} className={`h-14 rounded-2xl flex flex-col items-center justify-center transition-all relative group ${
                        count > 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                      }`}>
                        <span className="text-xs font-bold">{day}</span>
                        {count > 0 && (
                          <span className="text-[9px] font-black">{count} {count === 1 ? 'Enq' : 'Enqs'}</span>
                        )}
                        {/* Hover Detail */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          {new Date(new Date().getFullYear(), new Date().getMonth(), day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: {count} Enquiries
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400 font-bold text-center uppercase tracking-widest pt-4">Currently viewing {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</p>
              </div>
            ) : enquiries.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEnq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 900, color: '#0f172a' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="enquiries" 
                    stroke="#2563eb" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorEnq)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                  <BarChart3 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">No Performance Data Yet</h4>
                <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium">Historical data will be automatically plotted here once you start receiving enquiries.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Enquiries - Real Empty State */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900">Recent Enquiries</h3>
          </div>
          
          <div className="flex-1">
             {enquiries.filter(e => e.status === 'Pending').length > 0 ? (
               <div className="space-y-6">
                 {enquiries.filter(e => e.status === 'Pending').slice(0, 10).map((enquiry, i) => (
                   <div 
                     key={i} 
                     onClick={() => onEnquiryClick?.(enquiry._id)}
                     className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-all"
                   >
                     <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                       <MessageSquare className="w-5 h-5" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-black text-slate-900 truncate">{enquiry.name}</p>
                       <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tighter">
                         {enquiry.property?.title || 'General Enquiry'}
                       </p>
                     </div>
                     <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                       enquiry.status === 'Pending' ? 'text-amber-600 bg-amber-50' : 
                       enquiry.status === 'Contacted' ? 'text-blue-600 bg-blue-50' : 
                       'text-emerald-600 bg-emerald-50'
                     }`}>
                       {enquiry.status}
                     </span>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-center py-10">
                 <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                    <MessageSquare className="w-8 h-8" />
                 </div>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Pending Enquiries</p>
                 <p className="text-xs text-slate-400 mt-2 font-medium">All customer enquiries have been addressed.</p>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Properties by Status - Actual Data */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative min-h-[400px]">
          <h3 className="text-lg font-black text-slate-900 mb-8">Property Portfolio</h3>
          {properties.length > 0 ? (
            <>
              <div className="h-[250px] w-full overflow-visible relative">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={statusData} margin={{ top: 25, bottom: 40, left: 10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={<CustomXAxisTick />} 
                      interval={0}
                    />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: 'transparent' }} formatter={(value) => [value, 'Properties']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={32}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList 
                        dataKey="topLabel" 
                        position="top" 
                        style={{ fill: '#475569', fontSize: '11px', fontWeight: '900' }} 
                        offset={10}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center">
               <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-3 text-slate-300"><Building2 className="w-6 h-6" /></div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Add properties to see stats</p>
            </div>
          )}
        </div>

        {/* Top Locations - Actual derivation if possible or empty */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900">Locations Overview</h3>
          </div>
          <div className="flex-1">
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {['Chandigarh', 'Panchkula', 'Mohali', 'Zirakpur', 'Derabassi', 'Lalru', 'Kharar', 'New Chandigarh'].map((loc, i) => {
                const count = properties.filter(p => p.city === loc || p.location?.includes(loc)).length;
                return (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{loc}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: `${properties.length > 0 ? (count / properties.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase w-12 text-right">{count} Props</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-8">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
             <button className="p-6 rounded-[2rem] bg-slate-50 hover:bg-blue-50 transition-all group flex flex-col items-center gap-3 border border-transparent hover:border-blue-100">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform"><Plus className="w-6 h-6" /></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Add Property</span>
             </button>
             <button className="p-6 rounded-[2rem] bg-slate-50 hover:bg-emerald-50 transition-all group flex flex-col items-center gap-3 border border-transparent hover:border-emerald-100 opacity-50 cursor-not-allowed">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600"><UserPlus className="w-6 h-6" /></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Add User</span>
             </button>
             <button className="p-6 rounded-[2rem] bg-slate-50 hover:bg-purple-50 transition-all group flex flex-col items-center gap-3 border border-transparent hover:border-purple-100 opacity-50 cursor-not-allowed">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-purple-600"><Settings className="w-6 h-6" /></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Settings</span>
             </button>
             <button className="p-6 rounded-[2rem] bg-slate-50 hover:bg-amber-50 transition-all group flex flex-col items-center gap-3 border border-transparent hover:border-amber-100 opacity-50 cursor-not-allowed">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-amber-600"><BarChart3 className="w-6 h-6" /></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reports</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
