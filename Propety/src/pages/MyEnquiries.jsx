import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  MessageSquare, MapPin, Eye, Clock, CheckCircle2, 
  ChevronRight, Loader2, Calendar, Phone, Mail, Building
} from 'lucide-react';
import { BASE_URL } from '../api';

const MyEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userInfo));
    }
  }, [navigate]);

  const fetchMyEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/enquiries/my`, {
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setEnquiries(data || []);
      }
    } catch (error) {
      console.error('Error fetching my enquiries:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyEnquiries();
    }
  }, [user, fetchMyEnquiries]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Contacted':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
            <CheckCircle2 className="w-3 h-3" /> Contacted
          </span>
        );
      case 'Pending':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100">
            <Clock className="w-3 h-3" /> Awaiting Response
          </span>
        );
      case 'Closed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-100">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              My <span className="text-blue-600">Enquiries</span>
            </h1>
            <p className="text-slate-500 font-medium">Track your property requests and agent responses</p>
          </div>
          <Link to="/properties" className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black text-sm shadow-sm hover:bg-slate-50 transition-all active:scale-95">
            Browse Properties
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
             <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading your requests...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-16 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <MessageSquare className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">No enquiries yet</h3>
            <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">You haven't sent any property enquiries. Find a home you love and reach out to our agents!</p>
            <Link to="/properties" className="inline-flex items-center gap-3 px-10 py-4.5 rounded-2.5xl bg-slate-900 text-white font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10">
              Explore Properties <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {enquiries.map((enquiry) => (
              <div key={enquiry._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-stretch">
                   {/* Property Info */}
                   <div className="lg:w-1/3 p-6 bg-slate-50/50 border-r border-slate-50">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                            <img src={enquiry.property?.images?.[0]} className="w-full h-full object-cover" alt="" />
                         </div>
                         <div className="min-w-0">
                            <h3 className="text-lg font-black text-slate-900 truncate">{enquiry.property?.title}</h3>
                            <p className="text-blue-600 font-black">₹ {enquiry.property?.price?.toLocaleString()}</p>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                               <MapPin className="w-3 h-3" /> {enquiry.property?.city}
                            </div>
                         </div>
                      </div>
                      <Link to={`/property/${enquiry.property?._id}`} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-xs hover:bg-blue-50 hover:text-blue-600 transition-all">
                        <Eye className="w-4 h-4" /> View Property
                      </Link>
                   </div>

                   {/* Enquiry Content */}
                   <div className="flex-1 p-8 flex flex-col justify-between gap-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                         <div className="space-y-4">
                            <div className="flex items-center gap-3">
                               {getStatusBadge(enquiry.status)}
                               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  <Calendar className="w-3.5 h-3.5" /> Sent on {new Date(enquiry.createdAt).toLocaleDateString()}
                               </div>
                            </div>
                            <div className="p-5 rounded-2xl bg-blue-50/30 border border-blue-100 text-slate-600 font-medium italic relative">
                               <span className="text-4xl text-blue-200 absolute -top-2 -left-1 font-serif">"</span>
                               {enquiry.message}
                               <span className="text-4xl text-blue-200 absolute -bottom-6 -right-1 font-serif">"</span>
                            </div>
                         </div>
                         
                         {enquiry.adminNotes && (
                           <div className="md:w-64 p-5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2 shrink-0">
                              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Agent Response</p>
                              <p className="text-xs font-bold text-emerald-800 leading-relaxed">{enquiry.adminNotes}</p>
                           </div>
                         )}
                      </div>

                      <div className="flex items-center gap-6 pt-6 border-t border-slate-50">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                               <Mail className="w-4 h-4" />
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase">Contact Email</p>
                               <p className="text-xs font-black text-slate-900">{enquiry.email}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                               <Phone className="w-4 h-4" />
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase">Contact Phone</p>
                               <p className="text-xs font-black text-slate-900">{enquiry.phone}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyEnquiries;
