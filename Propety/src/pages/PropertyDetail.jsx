import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, BedDouble, Bath, Square, Calendar, ShieldCheck,
  Share2, Heart, Phone, Mail, MessageSquare, ChevronRight,
  CheckCircle2, Star, Clock, Map, Building2, User2, ArrowLeft,
  Loader2, AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EMICalculator from '../components/EMICalculator';
import { BASE_URL } from '../api';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const response = await fetch(`${BASE_URL}/properties/${id}`, {
          headers: {
            'Authorization': userInfo?.token ? `Bearer ${userInfo.token}` : ''
          }
        });
        const data = await response.json();
        
        if (!response.ok) {
            setError(data.message || 'Property not found');
            setLoading(false);
            return;
        }

        // Check if property is in user's wishlist
        if (userInfo) {
          const wishRes = await fetch(`${BASE_URL}/users/wishlist`, {
            headers: { 'Authorization': `Bearer ${userInfo.token}` }
          });
          const wishData = await wishRes.json();
          if (wishRes.ok) {
            setIsLiked(wishData.some(p => p._id === id));
          }
        }

        // Format data for the UI
        const formattedData = {
            id: data._id,
            title: data.title,
            price: data.price >= 10000000 ? (data.price/10000000).toFixed(2) + ' Cr' : data.price >= 100000 ? (data.price/100000).toFixed(2) + ' L' : data.price.toLocaleString('en-IN'),
            location: data.location,
            type: data.propertyType,
            status: "For Sale",
            area: `${data.area} sq.ft`,
            bhk: data.bedrooms,
            baths: data.bathrooms,
            description: data.description,
            images: data.images && data.images.length > 0 ? data.images : [
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
              "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
            ],
            features: data.premiumFeatures ? data.premiumFeatures.split(',').map(f => f.trim()).filter(f => f !== '') : [],
            agent: {
              name: "Rakesh Saini",
              role: "Senior Consultant",
              phone: "+91 98765 43210",
              image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            },
            details: {
              "Property ID": data._id.substring(0, 8).toUpperCase(),
              "Built Year": data.builtYear || "2023",
              "Furnishing": data.furnishing || "Semi-Furnished",
              "Facing": data.facing || "North-East",
              "Floor": data.floor || "12th of 15"
            },
            mapLink: data.mapLink
        };
        
        setProperty(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property:', error);
        setError('Failed to connect to server');
        setLoading(false);
      }
    };

    fetchProperty();
    window.scrollTo(0, 0);
  }, [id]);

  const handleSave = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/users/wishlist/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        }
      });
      if (response.ok) {
        setIsLiked(!isLiked);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>;
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-8 text-center bg-slate-50">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 max-w-lg border border-slate-100">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-4">{error}</h3>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
          The property you are looking for might be pending approval or doesn't exist. Please try again later or contact support.
        </p>
        <Link to="/properties" className="inline-flex items-center gap-3 px-10 py-4.5 rounded-2.5xl bg-slate-900 text-white font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10">
          Browse Properties <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

  if (!property) return <div className="min-h-screen flex items-center justify-center">Property not found</div>;

  // Helper to convert price strings to numbers for the calculator
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace('₹', '').replace(/,/g, '').trim();
    let value = parseFloat(cleanStr);
    if (cleanStr.includes('Cr')) value *= 10000000;
    else if (cleanStr.includes('L')) value *= 100000;
    return value;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link to="/properties" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors group">
              <div className="p-2 rounded-xl bg-white border border-slate-200 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Properties
            </Link>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button 
                onClick={handleSave}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all shadow-sm font-bold ${
                  isLiked 
                    ? 'bg-red-500 border-red-500 text-white' 
                    : 'bg-white border-slate-200 text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} /> 
                {isLiked ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          {/* Property Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-600/20">{property.status}</span>
                  <span className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-wider">{property.type}</span>
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <ShieldCheck className="w-5 h-5 fill-blue-50" />
                    <span className="text-sm font-black uppercase tracking-widest">Verified</span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{property.title}</h1>
                <div className="flex items-center gap-2 text-slate-500 font-medium text-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  {property.location}
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 min-w-[200px] text-center md:text-right">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Asking Price</p>
                <h2 className="text-4xl md:text-5xl font-black text-blue-600">₹{property.price}</h2>
              </div>
            </div>
          </div>

          {/* Image Gallery + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-4">
                <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 group">
                  <img src={property.images[activeImage]} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  <div className="absolute bottom-6 right-6 px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-sm">
                    {activeImage + 1} / {property.images.length} Photos
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {property.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-4 transition-all ${activeImage === index ? 'border-blue-600 scale-95 shadow-lg shadow-blue-600/20' : 'border-white hover:border-blue-200 hover:scale-105'
                        }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content Sections - Now stacked tightly under gallery */}
              <div className="space-y-8">
                {/* Quick Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: BedDouble, label: property.bhk + " BHK", sub: "Bedrooms" },
                    { icon: Bath, label: property.baths + " Baths", sub: "Washrooms" },
                    { icon: Square, label: property.area, sub: "Build Area" },
                    { icon: Clock, label: "Ready", sub: "Status" }
                  ].map((spec, index) => (
                    <div key={index} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all group">
                      <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 w-fit mb-3 group-hover:scale-110 transition-transform">
                        <spec.icon className="w-6 h-6" />
                      </div>
                      <p className="text-xl font-black text-slate-900">{spec.label}</p>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{spec.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <section className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm shadow-slate-200/50">
                  <h3 className="text-2xl font-black text-slate-900 mb-5 flex items-center gap-3">
                    <Building2 className="w-7 h-7 text-blue-600" /> Description
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-base md:text-lg font-medium whitespace-pre-line">
                    {property.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mt-8 pt-6 border-t border-slate-50">
                    {Object.entries(property.details).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">{key}</span>
                        <span className="text-slate-900 font-black">{value}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Features */}
                {property.features.length > 0 && (
                  <section className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm shadow-slate-200/50">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Star className="w-7 h-7 text-blue-600" /> Premium Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-slate-700 font-black text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </section>
                )}

                {/* Location Map Section */}
                <section className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm shadow-slate-200/50">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Map className="w-7 h-7 text-blue-600" /> Location Map
                  </h3>
                  <div className="aspect-video rounded-[1.5rem] bg-slate-100 border border-slate-200 relative overflow-hidden group">
                    {property.mapLink ? (
                      <div className="w-full h-full relative">
                        <div 
                          className="w-full h-full" 
                          dangerouslySetInnerHTML={{ __html: property.mapLink.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"') }} 
                        />
                        {/* Overlay to catch clicks and show directions button */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <div className="p-5 rounded-[2rem] bg-white/90 backdrop-blur-md border border-white shadow-2xl text-center space-y-3 max-w-xs pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center mx-auto shadow-xl shadow-blue-600/30">
                              <MapPin className="w-7 h-7 text-white" />
                            </div>
                            <h4 className="text-xl font-black text-slate-900">Live Map</h4>
                            <p className="text-slate-500 font-medium text-sm">Explore the surroundings of {property.location}.</p>
                            <button 
                              onClick={() => {
                                const match = property.mapLink.match(/src="([^"]+)"/);
                                if (match && match[1]) window.open(match[1], '_blank');
                              }}
                              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-black text-sm hover:bg-blue-600 transition-colors"
                            >
                              Open in Full Map
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img
                          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                          alt="Map"
                          className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="p-5 rounded-[2rem] bg-white/90 backdrop-blur-md border border-white shadow-2xl text-center space-y-3 max-w-xs">
                            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center mx-auto shadow-xl shadow-blue-600/30">
                              <MapPin className="w-7 h-7 text-white" />
                            </div>
                            <h4 className="text-xl font-black text-slate-900">Premium Location</h4>
                            <p className="text-slate-500 font-medium text-sm">Located in the most sought-after area of {property.location}.</p>
                            <button className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-black text-sm hover:bg-blue-600 transition-colors">
                              Get Directions
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </section>

                {/* EMI Calculator Section */}
                <EMICalculator initialAmount={parsePrice(property.price)} />
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-600/10 transition-colors" />
                  <div className="relative">
                    <h3 className="text-xl font-black text-slate-900 mb-5 flex items-center gap-3">
                      Contact Agent <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    </h3>
                    <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shadow-lg border-2 border-white shrink-0">
                        <img src={property.agent.image} alt={property.agent.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-lg">{property.agent.name}</h4>
                        <p className="text-slate-500 font-bold text-sm">{property.agent.role}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <button className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group/btn">
                        <Phone className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                        Call Now
                      </button>
                      <button className="w-full py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-black hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group/btn">
                        <MessageSquare className="w-5 h-5 group-hover/btn:-translate-y-1 transition-transform" />
                        WhatsApp Inquiry
                      </button>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-4 text-center">Express Interest</p>
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium focus:ring-4 ring-blue-500/10 focus:border-blue-600 transition-all mb-3"
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium focus:ring-4 ring-blue-500/10 focus:border-blue-600 transition-all mb-4"
                      />
                      <button className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-black text-sm hover:bg-blue-600 transition-colors shadow-xl shadow-slate-900/20">
                        Request Details
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] opacity-10 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative">
                    <h3 className="text-xl font-black mb-3">Want to Sell?</h3>
                    <p className="text-slate-400 text-sm font-medium mb-4">List your property with Panchkula's #1 Property Partner and get the best value.</p>
                    <button className="flex items-center gap-2 text-white font-black group/link">
                      List Your Property <ChevronRight className="w-5 h-5 text-blue-500 group-hover/link:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;