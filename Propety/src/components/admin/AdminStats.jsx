import { Building2, TrendingUp, Users, Star } from 'lucide-react';

const AdminStats = ({ properties, formatPrice }) => {
  const stats = [
    { label: 'Total Properties', value: properties.length, icon: Building2, color: 'blue' },
    { label: 'For Sale', value: properties.filter(p => p.status === 'For Sale').length, icon: TrendingUp, color: 'emerald' },
    { label: 'For Rent', value: properties.filter(p => p.status === 'For Rent').length, icon: Users, color: 'purple' },
    { label: 'Avg. Price', value: properties.length ? `₹${formatPrice(properties.reduce((s, p) => s + p.price, 0) / properties.length)}` : '₹0', icon: Star, color: 'amber' }
  ];

  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className={`w-12 h-12 rounded-2xl ${colorClasses[stat.color].bg} ${colorClasses[stat.color].text} flex items-center justify-center mb-4`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
          <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
