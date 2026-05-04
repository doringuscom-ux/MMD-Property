import React from 'react';
import { X, User, Mail, Phone, Trash2 } from 'lucide-react';

const AdminEnquiryModal = ({ enquiry, onClose, onUpdateStatus, onDelete }) => {
  if (!enquiry) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
           <h3 className="text-xl font-black text-slate-900">Enquiry Details</h3>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
             <X className="w-5 h-5 text-slate-400" />
           </button>
        </div>
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enquirer Information</p>
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-900 font-bold"><User className="w-4 h-4 text-blue-600" /> {enquiry.name}</div>
                    <div className="flex items-center gap-3 text-slate-900 font-bold"><Mail className="w-4 h-4 text-blue-600" /> {enquiry.email}</div>
                    <div className="flex items-center gap-3 text-slate-900 font-bold"><Phone className="w-4 h-4 text-blue-600" /> {enquiry.phone}</div>
                 </div>
              </div>
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Property Interested</p>
                 <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <img src={enquiry.property?.images?.[0]} className="w-12 h-12 rounded-lg object-cover" alt="" />
                    <div className="min-w-0">
                       <p className="text-xs font-bold text-slate-900 truncate">{enquiry.property?.title || 'General Enquiry'}</p>
                       <p className="text-[10px] font-bold text-blue-600">{enquiry.property ? `₹ ${enquiry.property.price?.toLocaleString()}` : 'Contact Support'}</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message</p>
              <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100 text-slate-700 font-medium leading-relaxed italic">
                "{enquiry.message}"
              </div>
           </div>

           <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2">
                 <button 
                    onClick={() => onUpdateStatus(enquiry._id, 'Contacted')}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      enquiry.status === 'Contacted' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                 >
                    Mark Contacted
                 </button>
                 <button 
                    onClick={() => onUpdateStatus(enquiry._id, 'Closed')}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      enquiry.status === 'Closed' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                 >
                    Mark Closed
                 </button>
              </div>
              <button 
                onClick={() => onDelete(enquiry._id)}
                className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
      <style>{`
        .animate-zoom-in { animation: zoom-in 0.3s ease-out forwards; }
        @keyframes zoom-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default AdminEnquiryModal;
