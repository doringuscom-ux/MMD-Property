import { useState, useEffect, useCallback } from 'react';
import { 
  Search, Filter, MapPin, MoreHorizontal, ChevronLeft, ChevronRight, 
  CheckCircle, MessageSquare, Trash2, Eye, Phone, Mail, Clock, 
  ExternalLink, Calendar, User, Trash, X
} from 'lucide-react';
import { BASE_URL } from '../../api';

const AdminEnquiries = ({ showToast, preSelectedId, onViewDetail }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/enquiries?pageNumber=${currentPage}&pageSize=${itemsPerPage}`, {
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setEnquiries(data.enquiries || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, showToast]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  useEffect(() => {
    if (preSelectedId) {
      // Parent is handling the modal via preSelectedId
    }
  }, [preSelectedId]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/enquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo?.token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        showToast('success', `Enquiry marked as ${status}`);
        fetchEnquiries();
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status });
        }
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/enquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      if (response.ok) {
        showToast('success', 'Enquiry deleted');
        fetchEnquiries();
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to delete');
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch = 
      e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.property?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Status' || e.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Enquiries</h3>
          <p className="text-slate-500 font-medium">Manage and respond to property inquiries</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* Filter Header */}
        <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email, or property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>Contacted</option>
              <option>Closed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Enquiries...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Enquirer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredEnquiries.length > 0 ? filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-900">{enquiry.name}</p>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {enquiry.email}</p>
                          <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3" /> {enquiry.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100">
                          <img src={enquiry.property?.images?.[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 max-w-[200px]">
                          <p className="text-xs font-bold text-slate-900 truncate">{enquiry.property?.title || 'General Enquiry'}</p>
                          <p className="text-[10px] font-medium text-slate-400">{enquiry.property?.city || 'Contact Page'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        enquiry.status === 'Pending' ? 'text-amber-600 bg-amber-50' : 
                        enquiry.status === 'Contacted' ? 'text-blue-600 bg-blue-50' : 
                        'text-emerald-600 bg-emerald-50'
                      }`}>
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <p className="text-xs font-bold text-slate-600">{new Date(enquiry.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => onViewDetail(enquiry._id)}
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(enquiry._id)}
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No enquiries found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-8 border-t border-slate-50 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-400 tracking-tight">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
             <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-50"
             >
              <ChevronLeft className="w-4 h-4" />
             </button>
             <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
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

export default AdminEnquiries;
