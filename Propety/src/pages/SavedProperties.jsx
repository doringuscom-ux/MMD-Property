import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Building, MapPin, Eye, Heart, ChevronRight, Loader2, AlertCircle, Trash2
} from 'lucide-react';
import { BASE_URL } from '../api';

const SavedProperties = () => {
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

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/users/wishlist`, {
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setProperties(data || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user, fetchWishlist]);

  const handleRemove = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/users/wishlist/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      if (response.ok) {
        setProperties(properties.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Saved <span className="text-blue-600">Properties</span>
            </h1>
            <p className="text-slate-500 font-medium">Your personal collection of dream homes and investments</p>
          </div>
          <Link to="/properties" className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black text-sm shadow-sm hover:bg-slate-50 transition-all active:scale-95">
            Browse More
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
             <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading your collection...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-16 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Heart className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Your wishlist is empty</h3>
            <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">Found a property you like? Click the heart icon to save it here for later.</p>
            <Link to="/properties" className="inline-flex items-center gap-3 px-10 py-4.5 rounded-2.5xl bg-slate-900 text-white font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10">
              Explore Properties <ChevronRight className="w-4 h-4" />
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
                    <button 
                      onClick={() => handleRemove(prop._id)}
                      className="p-3 rounded-full bg-white/90 backdrop-blur-md text-red-500 shadow-xl border border-white transition-all hover:scale-110 active:scale-95"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
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
                      <MapPin className="w-4 h-4 text-blue-500" /> {prop.location}{prop.city ? `, ${prop.city}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <Link to={`/property/${prop._id}`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10">
                      <Eye className="w-4 h-4" /> View Details
                    </Link>
                    <button 
                      onClick={() => handleRemove(prop._id)}
                      className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all group/btn"
                      title="Remove from saved"
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

export default SavedProperties;
