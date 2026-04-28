import { Building2, Users, MessageSquare, Calendar, TrendingUp, MapPin, Plus, UserPlus, Settings, BarChart3, Search } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LabelList } from 'recharts';

const DashboardOverview = ({ properties, formatPrice }) => {
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

  const stats = [
    { label: 'Total Properties', value: properties.length, icon: Building2, color: 'bg-blue-600', trend: 'Actual', iconColor: 'text-blue-600' },
    { label: 'Total Users', value: '0', icon: Users, color: 'bg-emerald-600', trend: 'Coming Soon', iconColor: 'text-emerald-600', comingSoon: true },
    { label: 'Total Enquiries', value: '0', icon: MessageSquare, color: 'bg-amber-500', trend: 'Coming Soon', iconColor: 'text-amber-500', comingSoon: true },
    { label: 'Total Bookings', value: '0', icon: Calendar, color: 'bg-blue-500', trend: 'Coming Soon', iconColor: 'text-blue-500', comingSoon: true },
  ];

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none">
              <option>This Year</option>
            </select>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
               <BarChart3 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">No Performance Data Yet</h4>
            <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium">Historical data will be automatically plotted here once you start receiving enquiries and bookings.</p>
          </div>
        </div>

        {/* Recent Enquiries - Real Empty State */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900">Recent Enquiries</h3>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                <MessageSquare className="w-8 h-8" />
             </div>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Recent Enquiries</p>
             <p className="text-xs text-slate-400 mt-2 font-medium">Direct customer enquiries will appear here.</p>
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
          {properties.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(properties.reduce((acc, p) => {
                acc[p.location] = (acc[p.location] || 0) + 1;
                return acc;
              }, {})).slice(0, 4).sort((a,b) => b[1] - a[1]).map(([loc, count], i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"><MapPin className="w-4 h-4" /></div>
                    <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{loc}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">{count} Props</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
               <MapPin className="w-8 h-8 text-slate-200 mb-2" />
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Locations Data</p>
            </div>
          )}
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
