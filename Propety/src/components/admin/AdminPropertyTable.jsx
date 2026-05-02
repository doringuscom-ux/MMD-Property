import { Search, Filter, Plus, Edit2, Trash2, Eye, MapPin, MoreHorizontal, ChevronLeft, ChevronRight, CheckCircle, FileEdit, Trash } from 'lucide-react';

const AdminPropertyTable = ({ 
  properties = [], 
  loading, 
  paginatedProperties, 
  formatPrice, 
  openEditModal, 
  confirmDelete, 
  currentPage, 
  totalPages, 
  setCurrentPage,
  onViewDetails,
  selectedIds = [],
  setSelectedIds,
  handleBulkAction,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  itemsPerPage,
  setItemsPerPage
}) => {
  // Calculate real stats
  const publishedCount = properties.filter(p => p.adminStatus === 'Published').length;
  const pendingCount = properties.filter(p => p.adminStatus === 'Pending').length;
  const draftCount = properties.filter(p => p.adminStatus === 'Draft').length;

  const stats = [
    { label: 'Total Properties', value: properties.length.toLocaleString(), icon: '🏠', color: 'bg-blue-600', trend: 'Actual count' },
    { label: 'Published', value: publishedCount.toLocaleString(), icon: '✅', color: 'bg-emerald-600', trend: `${properties.length ? Math.round((publishedCount/properties.length)*100) : 0}% of total` },
    { label: 'Pending', value: pendingCount.toLocaleString(), icon: '🕒', color: 'bg-amber-500', trend: `${properties.length ? Math.round((pendingCount/properties.length)*100) : 0}% of total` },
    { label: 'Draft', value: draftCount.toLocaleString(), icon: '📝', color: 'bg-blue-500', trend: 'Other listings' },
    { label: 'Expired', value: '0', icon: '❌', color: 'bg-red-500', trend: 'Actual count' },
  ];

  const categories = ['All Categories', ...new Set(properties.map(p => p.propertyType))];

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedProperties.map(p => p._id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Properties...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Mini Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-lg shadow-current/20`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <div>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.1em]">{stat.label}</p>
                <h4 className="text-xl font-black text-slate-900 leading-none">{stat.value}</h4>
              </div>
            </div>
            <p className="text-[9px] font-bold text-slate-400 tracking-tight">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Bulk Action Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-24 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-fade-in border border-white/10 mx-auto max-w-2xl">
          <div className="flex items-center gap-4 pl-2">
             <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-sm">{selectedIds.length}</div>
             <span className="text-sm font-bold">Properties Selected</span>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={() => handleBulkAction('Publish')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-black transition-all">
                <CheckCircle className="w-4 h-4" /> Publish
             </button>
             <button onClick={() => handleBulkAction('Draft')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-black transition-all">
                <FileEdit className="w-4 h-4" /> Draft
             </button>
             <button onClick={() => handleBulkAction('Delete')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-xs font-black transition-all">
                <Trash className="w-4 h-4" /> Delete
             </button>
             <button onClick={() => setSelectedIds([])} className="ml-2 p-2 text-slate-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">Cancel</button>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* Filter Header */}
        <div className="p-8 border-b border-slate-50 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
             <div className="flex items-center gap-4 flex-1 max-w-md">
                <div className="relative group flex-1">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                   <input
                     type="text"
                     placeholder="Search properties..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-sm"
                   />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Show</span>
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => {setItemsPerPage(Number(e.target.value)); setCurrentPage(1);}}
                    className="bg-slate-50 border-none rounded-xl px-3 py-2 text-xs font-black text-blue-600 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    {[5, 10, 20, 50].map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
                </div>
             </div>
             <div className="flex flex-wrap items-center gap-3">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <option>All Status</option>
                  <option>Published</option>
                  <option>Pending</option>
                  <option>Draft</option>
                </select>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                <button 
                  onClick={() => {setSearchTerm(''); setStatusFilter('All Status'); setCategoryFilter('All Categories');}}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all"
                >
                  Clear Filters
                </button>
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 w-10">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all"
                    checked={selectedIds.length === paginatedProperties.length && paginatedProperties.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Price</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Admin Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Added By</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedProperties.length > 0 ? paginatedProperties.map((property) => (
                <tr key={property._id} className={`hover:bg-slate-50/50 transition-colors group ${selectedIds.includes(property._id) ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-8 py-5 w-10">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all"
                      checked={selectedIds.includes(property._id)}
                      onChange={() => toggleSelectOne(property._id)}
                    />
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 shadow-sm relative">
                        <img src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=100'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className={`absolute top-1 left-1 w-2.5 h-2.5 rounded-full border-2 border-white ${property.adminStatus === 'Published' ? 'bg-emerald-500' : property.adminStatus === 'Pending' ? 'bg-amber-500' : 'bg-slate-400'}`} title={property.adminStatus} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate max-w-[200px]">{property.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">#PROP{property._id?.slice(-4)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-xs font-bold truncate max-w-[150px]">
                        {property.location}{property.city ? `, ${property.city}` : ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50">
                      {property.propertyType}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-sm font-black text-slate-900">₹ {formatPrice(property.price)}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      property.adminStatus === 'Published' ? 'text-emerald-600 bg-emerald-50' : 
                      property.adminStatus === 'Pending' ? 'text-amber-600 bg-amber-50' : 'text-slate-600 bg-slate-100'
                    }`}>
                      {property.adminStatus || 'Draft'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">A</div>
                      <div className="text-left">
                        <p className="text-[10px] font-black text-slate-900 leading-none mb-1">Admin</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Super Admin</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => onViewDetails && onViewDetails(property)}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openEditModal(property)}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => confirmDelete(property._id)}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="px-8 py-20 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No properties found matching your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-8 border-t border-slate-50 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-400 tracking-tight">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, properties.length)} of {properties.length} entries
          </p>
          <div className="flex items-center gap-2">
             <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-50"
             >
              <ChevronLeft className="w-4 h-4" />
             </button>
             {totalPages > 0 && [...Array(totalPages)].map((_, i) => (
               <button 
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${
                  currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-50'
                }`}
               >
                 {i + 1}
               </button>
             ))}
             <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-50"
             >
              <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPropertyTable;
