import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Building, MapPin, Eye, Edit2, Trash2, Clock, CheckCircle2, 
  XCircle, ChevronRight, Loader2, Plus, AlertCircle
} from 'lucide-react';
import { BASE_URL } from '../api';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
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

  const fetchMyProperties = useCallback(async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      // Note: Backend getProperties now handles showing user's own properties
      // but we need to make sure we're getting only the current user's properties for this page
      // if we want a dedicated view. For now, we use the same endpoint with the token.
      // To get ONLY my properties, I might need a specific filter or the backend to support it.
      // I'll filter them on the frontend for now if the backend returns everything (though it should only return mine + verified ones).
      const response = await fetch(`${BASE_URL}/properties?pageSize=100`, {
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      const data = await response.json();
      
      // Filter to show only current user's properties
      const myProps = data.properties?.filter(p => p.postedBy?._id === userInfo?._id || p.postedBy === userInfo?._id) || [];
      setProperties(myProps);
    } catch (error) {
      console.error('Error fetching my properties:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyProperties();
    }
  }, [user, fetchMyProperties]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      if (response.ok) {
        setProperties(properties.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Published':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
            <CheckCircle2 className="w-3 h-3" /> Live
          </span>
        );
      case 'Pending':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100">
            <Clock className="w-3 h-3" /> Reviewing
          </span>
        );
      case 'Draft':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-100">
            <XCircle className="w-3 h-3" /> Draft
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
              My <span className="text-blue-600">Properties</span>
            </h1>
            <p className="text-slate-500 font-medium">Manage your listings and track their approval status</p>
          </div>
          <Link to="/post-property" className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
            <Plus className="w-5 h-5" /> Post New Property
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
             <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading your listings...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-16 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Building className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">No properties listed yet</h3>
            <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">You haven't posted any property listings. Start listing your real estate today!</p>
            <Link to="/post-property" className="inline-flex items-center gap-3 px-10 py-4.5 rounded-2.5xl bg-slate-900 text-white font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10">
              Post Your First Listing <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <div key={prop._id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-500">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={prop.images[0] || 'https://via.placeholder.com/600x400?text=No+Image'} 
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />
                  
                  <div className="absolute top-6 right-6">
                    {getStatusBadge(prop.adminStatus)}
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white text-2xl font-black">
                      ₹{prop.price >= 1e7 
                        ? (prop.price / 1e7).toFixed(2) + ' Cr' 
                        : prop.price >= 1e5 
                          ? (prop.price / 1e5).toFixed(2) + ' L' 
                          : prop.price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-widest">{prop.propertyType}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{prop.title}</h3>
                    <p className="flex items-center gap-1.5 text-slate-400 text-sm font-bold">
                      <MapPin className="w-4 h-4 text-blue-500" /> {prop.location ? (prop.city ? `${prop.location}, ${prop.city}` : prop.location) : (prop.city || '')}
                    </p>
                  </div>

                  {prop.adminStatus === 'Pending' && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold text-amber-700 leading-relaxed italic">
                           Your property is under review. Only you can see it right now.
                        </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex gap-2">
                      <Link to={`/property/${prop._id}`} className="p-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link to={`/edit-property/${prop._id}`} className="p-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                    </div>
                    <button 
                      onClick={() => handleDelete(prop._id)}
                      className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default MyProperties;
