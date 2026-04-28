import { Search, Bell, Menu } from 'lucide-react';

const AdminTopbar = ({ activeTab, searchTerm, setSearchTerm }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-[100]">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 rounded-xl bg-slate-50 text-slate-500">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-black text-slate-900">{activeTab}</h2>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative group hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">5</span>
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 cursor-pointer">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
