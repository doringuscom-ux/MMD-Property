import { Search, Plus, Edit2, Trash2, Home, Building, Hotel, LandPlot, Warehouse, Store, LayoutGrid } from 'lucide-react';

const AdminCategories = ({ properties = [] }) => {
  // Derive actual categories from properties
  const categoryMap = properties.reduce((acc, p) => {
    const name = p.propertyType || 'Uncategorized';
    if (!acc[name]) {
      acc[name] = { 
        name, 
        count: 0, 
        status: 'Active', 
        icon: name === 'Apartment' ? Building : 
              name === 'House' ? Home : 
              name === 'Villa' ? Hotel : 
              name === 'Land' ? LandPlot : 
              name === 'Commercial' ? Building : LayoutGrid,
        color: name === 'Apartment' ? 'text-blue-600' : 
               name === 'House' ? 'text-emerald-600' : 
               name === 'Villa' ? 'text-amber-600' : 'text-indigo-600',
        bgColor: name === 'Apartment' ? 'bg-blue-50' : 
                 name === 'House' ? 'bg-emerald-50' : 
                 name === 'Villa' ? 'bg-amber-50' : 'bg-indigo-50',
        date: 'N/A' // We don't have category creation date, so we'll show N/A or actual derivation if needed
      };
    }
    acc[name].count += 1;
    return acc;
  }, {});

  const categories = Object.values(categoryMap);

  const stats = [
    { label: 'Total Categories', value: categories.length, icon: LayoutGrid, color: 'bg-blue-600', trend: 'Based on your data' },
    { label: 'Active Categories', value: categories.filter(c => c.status === 'Active').length, icon: Building, color: 'bg-emerald-600', trend: 'Actual' },
    { label: 'Inactive Categories', value: categories.filter(c => c.status === 'Inactive').length, icon: Warehouse, color: 'bg-amber-500', trend: 'Actual' },
    { label: 'Properties Linked', value: properties.length, icon: Home, color: 'bg-blue-500', trend: 'Total listings' },
  ];

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-center gap-2">
                  <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
                </div>
                <p className="text-[10px] font-bold mt-1 text-slate-400">{stat.trend}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-900">All Categories</h3>
            <p className="text-slate-500 text-sm font-medium">Manage your property categories</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-black text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add New Category
            </button>
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category Name</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Properties</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {categories.map((cat, i) => (
                  <tr key={cat.name} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 text-sm font-bold text-slate-400">{i + 1}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl ${cat.bgColor} ${cat.color} flex items-center justify-center`}>
                          <cat.icon className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-black text-slate-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-sm font-black text-slate-700">{cat.count}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        cat.status === 'Active' ? 'text-emerald-600 bg-emerald-50' : 'text-pink-600 bg-pink-50'
                      }`}>
                        {cat.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center flex flex-col items-center">
            <LayoutGrid className="w-16 h-16 text-slate-100 mb-4" />
            <h4 className="text-xl font-black text-slate-900 mb-2">No Categories Found</h4>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">Please add properties to automatically see categories here.</p>
          </div>
        )}

        <div className="p-8 border-t border-slate-50 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-400 tracking-tight">Showing {categories.length} of {categories.length} entries</p>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
