import { LayoutDashboard, Building2, Plus, LayoutGrid, MapPin, Users, UserCircle, MessageSquare, Calendar, Star, FileText, Newspaper, Settings, BarChart3, LogOut, X } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'Properties', icon: Building2, label: 'Properties' },
    { id: 'Add Property', icon: Plus, label: 'Add Property' },
    { id: 'Categories', icon: LayoutGrid, label: 'Categories' },
    { id: 'Users', icon: Users, label: 'Users' },
    { id: 'Agents', icon: UserCircle, label: 'Agents' },
    { id: 'Enquiries', icon: MessageSquare, label: 'Enquiries' },
    { id: 'Blog', icon: Newspaper, label: 'Blog' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-[110] lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 z-[120] h-screen w-64 bg-[#0F172A] text-slate-400 flex flex-col shrink-0 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-white font-black text-xl tracking-tight leading-tight">Maa Mansa Property</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

      <div className="px-4 py-2 mb-6">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
            <img src={JSON.parse(localStorage.getItem('userInfo'))?.role === 'admin' ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"} alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none mb-1">{JSON.parse(localStorage.getItem('userInfo'))?.name || 'Admin'}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{JSON.parse(localStorage.getItem('userInfo'))?.role || 'Staff'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.comingSoon && setActiveTab(item.id)}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all group ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'hover:bg-white/5 hover:text-white'
            } ${item.comingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
              <span className="text-sm font-bold">{item.label}</span>
            </div>
            {item.comingSoon && (
              <span className="text-[8px] font-black uppercase bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-md">Soon</span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all font-bold text-sm"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
      </aside>
    </>
  );
};

export default AdminSidebar;
