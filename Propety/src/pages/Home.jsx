import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import Footer from '../components/Footer';
import {
  Search, MapPin, Home as HomeIcon, Building2, ChevronRight, Users, Star,
  TrendingUp, Phone, ShieldCheck, BadgeCheck, Clock, Handshake,
  Quote, Sparkles, ArrowRight, Award, Heart, Eye, CheckCircle,
  Zap, Compass, Globe, Layers, Coffee, Sun, Moon, Calendar, User, ArrowUpRight,
  Key, PlusCircle, LayoutGrid
} from 'lucide-react';
import { BASE_URL } from '../api';

function Home() {
  const [activeTab, setActiveTab] = useState('Buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('All Types');
  const [budget, setBudget] = useState('Any Budget');
  const [scrolled, setScrolled] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (activeTab && activeTab !== 'Buy') params.append('category', activeTab);
    if (propertyType !== 'All Types') params.append('type', propertyType);
    
    // Budget handling (simple mapping for now)
    if (budget !== 'Any Budget') {
        params.append('budget', budget);
    }

    navigate(`/properties?${params.toString()}`);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/properties?pageSize=100`);
        const data = await response.json();
        const allProperties = data.properties || [];

        // Identify Promoted vs Regular
        const promoted = allProperties.filter(p => p.isPromoted);
        const regular = allProperties.filter(p => !p.isPromoted);

        // Logic for 20-minute rotation of regular properties
        const current20MinWindow = Math.floor(Date.now() / (1000 * 60 * 20));
        const rotatedRegular = [...regular].sort((a, b) => {
           // Deterministic shuffle based on window
           const seed = current20MinWindow + a._id.toString();
           return seed.localeCompare(current20MinWindow + b._id.toString());
        });

        // Combine (All Promoted first, then ONLY 5 rotated regular)
        const combined = [...promoted, ...rotatedRegular.slice(0, 5)];

        const formattedData = combined.map(p => ({
            id: p._id,
            title: p.title,
            price: p.price ? (p.price >= 1e7 ? (p.price / 1e7).toFixed(2) + ' Cr' : p.price >= 1e5 ? (p.price / 1e5).toFixed(2) + ' L' : p.price.toLocaleString('en-IN')) : 'Price on Request',
            location: p.location,
            beds: (p.bedrooms || 0).toString(),
            baths: (p.bathrooms || 0).toString(),
            area: (p.area || 0).toString(),
            type: p.status || p.propertyType,
            rating: "4.8",
            verified: p.isVerified,
            isLiked: false, // Will be updated below
            isPromoted: p.isPromoted,
            image: p.images[0],
            images: p.images
        }));

        setFeaturedProperties(formattedData);

        // Calculate Top Locations
        const locationCounts = allProperties.reduce((acc, p) => {
          const loc = p.city || p.location;
          if (loc) acc[loc] = (acc[loc] || 0) + 1;
          return acc;
        }, {});

        const sortedLocations = Object.entries(locationCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name]) => name);
        
        setTopLocations(sortedLocations);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  // Auto-scroll logic for carousel
  useEffect(() => {
    if (featuredProperties.length > 3) {
      const timer = setInterval(() => {
        setCarouselIndex(prev => (prev + 1) % (featuredProperties.length - 2));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredProperties]);

  const tabs = [
    { name: 'Buy', icon: HomeIcon },
    { name: 'Rent', icon: Key },
    { name: 'New Launch', icon: Zap },
    { name: 'Commercial', icon: Building2 },
    { name: 'Plots/Land', icon: MapPin },
    { name: 'Projects', icon: LayoutGrid }
  ];

  const stats = [
    { icon: HomeIcon, value: '1,200+', label: 'Properties Listed', gradient: 'from-blue-500 to-cyan-500', delay: 0 },
    { icon: Users, value: '3,500+', label: 'Happy Clients', gradient: 'from-emerald-500 to-teal-500', delay: 0.1 },
    { icon: Star, value: '4.9★', label: 'Average Rating', gradient: 'from-amber-500 to-orange-500', delay: 0.2 },
    { icon: TrendingUp, value: '12 Yrs', label: 'Of Experience', gradient: 'from-purple-500 to-pink-500', delay: 0.3 },
  ];

  const services = [
    { title: 'Property Buy/Sell', desc: 'Expert guidance for buying and selling residential and commercial properties.', icon: HomeIcon, color: 'bg-blue-600', features: ['Market Analysis', 'Price Negotiation', 'Legal Support'] },
    { title: 'Rental Solutions', desc: 'Find the best rental homes and office spaces with zero hassle.', icon: Building2, color: 'bg-emerald-600', features: ['Tenant Screening', 'Lease Agreement', 'Property Management'] },
    { title: 'Legal Consulting', desc: 'Complete documentation and legal verification of all property deals.', icon: ShieldCheck, color: 'bg-indigo-600', features: ['Title Verification', 'Contract Drafting', 'Dispute Resolution'] }
  ];

  const whyChooseUs = [
    { icon: BadgeCheck, title: 'Verified Listings', desc: 'Every property goes through a rigorous 5-step verification process with AI-powered fraud detection.', color: 'blue' },
    { icon: Clock, title: 'Quick Turnaround', desc: 'Most deals are closed within 30 days thanks to our huge network of 500+ verified partners.', color: 'emerald' },
    { icon: Handshake, title: 'Transparent Deals', desc: 'No hidden costs. No surprises. Just honest real estate with complete documentation transparency.', color: 'purple' },
    { icon: Award, title: 'Award Winning Service', desc: 'Recognized as the #1 Real Estate Agency in Tri-City for 3 consecutive years.', color: 'amber' }
  ];

  const testimonials = [
    { name: 'Rahul Sharma', role: 'Home Owner, Sector 6', text: 'Found my dream villa in Panchkula through Maa Mansa Devi Property. The process was incredibly smooth and professional. They handled everything from paperwork to registration.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', rating: 5 },
    { name: 'Priya Singh', role: 'IT Professional, Mohali', text: 'Highly recommend their rental services. They understood my requirements perfectly and showed me the best options in Sector 67. Got my dream apartment within a week!', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', rating: 5 },
    { name: 'Amit Verma', role: 'Business Owner, Zirakpur', text: 'Best commercial property deals in the region. Their legal team is very thorough and helped me avoid a potential scam. Saved me crores with their due diligence.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', rating: 5 }
  ];

  const insights = [
    {
      title: "Panchkula Real Estate Market Trends 2026",
      desc: "An in-depth analysis of property price appreciation in Sector 20 and surrounding areas.",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=600",
      date: "May 15, 2026",
      author: "Admin",
      category: "Market Trends"
    },
    {
      title: "Why IT City Mohali is the Next Big Hub",
      desc: "Exploring the massive infrastructure development and investment potential in IT City.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600",
      date: "May 10, 2026",
      author: "Expert",
      category: "Investment"
    },
    {
      title: "10 Tips for First-Time Home Buyers",
      desc: "Avoid common mistakes and get the best deal for your dream home in Zirakpur.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600",
      date: "May 05, 2026",
      author: "Guide",
      category: "Buying Guide"
    }
  ];

  return (
    <div className="min-h-screen font-sans bg-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section with Parallax Effect */}
      <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[5%] w-96 h-96 bg-indigo-400/20 rounded-full blur-[120px] animate-pulse delay-1000" />
          <div className="absolute top-[40%] right-[20%] w-60 h-60 bg-cyan-400/15 rounded-full blur-[90px] animate-pulse delay-700" />
        </div>

        {/* Floating Elements (15 Premium Icons) */}
        <div className="absolute top-[15%] left-[5%] animate-float-slow">
          <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-xl flex items-center justify-center">
            <HomeIcon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="absolute top-[25%] left-[15%] animate-float-delayed delay-700">
          <div className="w-8 h-8 bg-white rounded-xl border border-slate-100 shadow-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
        </div>
        <div className="absolute top-[40%] left-[8%] animate-float-slow delay-300">
          <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 shadow-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
        <div className="absolute top-[8%] right-[12%] animate-float-delayed">
          <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 shadow-xl flex items-center justify-center">
            <Building2 className="w-7 h-7 text-blue-700" />
          </div>
        </div>
        <div className="absolute top-[30%] right-[5%] animate-float-slow delay-1000">
          <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 shadow-lg flex items-center justify-center">
            <Compass className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="absolute top-[50%] right-[12%] animate-float-delayed delay-200">
          <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-cyan-600" />
          </div>
        </div>
        <div className="absolute bottom-[20%] left-[12%] animate-float-slow delay-500">
          <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 shadow-2xl flex items-center justify-center">
            <MapPin className="w-7 h-7 text-red-500" />
          </div>
        </div>
        <div className="absolute bottom-[35%] left-[4%] animate-float-delayed delay-1500">
          <div className="w-9 h-9 bg-white rounded-xl border border-slate-100 shadow-lg flex items-center justify-center">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
        <div className="absolute bottom-[10%] right-[8%] animate-float-slow delay-800">
          <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-xl flex items-center justify-center">
            <Layers className="w-6 h-6 text-violet-600" />
          </div>
        </div>
        <div className="absolute bottom-[30%] right-[15%] animate-float-delayed delay-400">
          <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 shadow-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
        </div>
        <div className="absolute top-[60%] left-[18%] animate-float-slow delay-1200">
          <div className="w-11 h-11 bg-white rounded-xl border border-slate-100 shadow-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
        </div>
        <div className="absolute top-[18%] left-[92%] animate-float-delayed delay-600">
          <div className="w-9 h-9 bg-white rounded-xl border border-slate-100 shadow-lg flex items-center justify-center">
            <Coffee className="w-5 h-5 text-amber-700" />
          </div>
        </div>
        <div className="absolute bottom-[5%] left-[25%] animate-float-slow delay-900">
          <div className="w-8 h-8 bg-white rounded-lg border border-slate-100 shadow-md flex items-center justify-center">
            <Sun className="w-4 h-4 text-orange-500" />
          </div>
        </div>
        <div className="absolute bottom-[15%] right-[2%] animate-float-delayed delay-1100">
          <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 shadow-lg flex items-center justify-center">
            <Moon className="w-5 h-5 text-slate-400" />
          </div>
        </div>
        <div className="absolute top-[45%] right-[92%] animate-float-slow delay-1300">
          <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-xl flex items-center justify-center">
            <HomeIcon className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-36 pb-16 relative z-10">
          {/* Badge with Glow */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
              <span className="relative inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/90 backdrop-blur-sm border border-blue-100 text-blue-600 text-[10px] sm:text-sm font-bold shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                </span>
                Panchkula & Mohali's #1 Property Partner
              </span>
            </div>
          </div>

          {/* Main Heading with Gradient */}
          <h1 className="text-center text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
              Find Your Perfect
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Home in Tri-City
            </span>
          </h1>

          <p className="text-center max-w-2xl mx-auto text-slate-500 text-lg md:text-xl leading-relaxed mb-16">
            Browse verified flats, villas & commercial spaces across Panchkula, Mohali & Zirakpur
            with the most trusted real estate experts.
          </p>

          {/* Search Card with Glassmorphism */}
          <div className="relative group max-w-5xl mx-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500" />
            <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/50">
              {/* Tabs with Animated Underline - Mobile Scrollable */}
              <div className="relative border-b border-slate-100/50 bg-white/50 backdrop-blur-sm overflow-hidden">
                <div className="flex overflow-x-auto no-scrollbar scroll-smooth flex-nowrap">
                  {tabs.map(tab => (
                    <button
                      key={tab.name}
                      onClick={() => setActiveTab(tab.name)}
                      className={`relative px-5 py-4 text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 flex-shrink-0 ${activeTab === tab.name
                        ? 'text-blue-600'
                        : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      <tab.icon className={`w-4 h-4 transition-all ${activeTab === tab.name ? 'scale-110 opacity-100' : 'opacity-50'}`} />
                      <span className="whitespace-nowrap">{tab.name}</span>
                      {activeTab === tab.name && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-slide-up" />
                      )}
                    </button>
                  ))}
                  
                  {/* Special Post Property Tab - Premium Style */}
                  <Link
                    to="/post-property"
                    className="flex-shrink-0 px-6 py-4 flex items-center gap-3 group transition-all"
                  >
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-emerald-200 group-hover:shadow-lg">
                      <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter leading-none mb-1">Owner Exclusive</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors whitespace-nowrap">Post Property</span>
                        <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[8px] font-black shadow-lg shadow-emerald-200 animate-pulse border border-white/20">FREE</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Search Fields */}
              <div className="flex flex-col lg:flex-row gap-0">
                <div className="flex items-center gap-3 flex-1 px-6 py-4 border-b lg:border-b-0 lg:border-r border-slate-100/50 hover:bg-slate-50/50 transition-colors group/input">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search locality, e.g. Sector 20 Panchkula…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 text-slate-800 placeholder-slate-400 text-sm font-medium bg-transparent outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 px-6 py-4 border-b lg:border-b-0 lg:border-r border-slate-100/50 hover:bg-slate-50/50 transition-colors">
                  <Building2 className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <select 
                    value={propertyType}
                    onChange={e => setPropertyType(e.target.value)}
                    className="text-slate-700 text-sm font-medium bg-transparent outline-none cursor-pointer pr-8 appearance-none bg-no-repeat bg-right"
                  >
                    <option>All Types</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Plot</option>
                    <option>Commercial</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 border-b lg:border-b-0 lg:border-r border-slate-100/50 hover:bg-slate-50/50 transition-colors">
                  <span className="text-slate-400 text-sm font-bold flex-shrink-0">₹</span>
                  <select 
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    className="text-slate-700 text-sm font-medium bg-transparent outline-none cursor-pointer pr-8 appearance-none"
                  >
                    <option>Any Budget</option>
                    <option>Under 50L</option>
                    <option>50L – 1Cr</option>
                    <option>1Cr – 2Cr</option>
                    <option>2Cr+</option>
                  </select>
                </div>
                <button 
                  onClick={handleSearch}
                  className="relative overflow-hidden group/btn flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-5 lg:py-4 transition-all duration-300 flex-shrink-0"
                >
                  <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 ease-out group-hover/btn:w-full" />
                  <Search className="w-5 h-5 relative z-10" />
                  <span className="relative z-10 text-sm lg:text-base">Search Properties</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-5 mt-12">
            {topLocations.map(loc => (
              <button
                key={loc}
                onClick={() => navigate(`/properties?search=${loc}`)}
                className="group flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-sm border border-slate-200/50 text-slate-600 text-xs font-semibold hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 shadow-sm hover:shadow"
              >
                <MapPin className="w-3 h-3 transition-transform group-hover:scale-110" />
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Strip with Hover Effects */}
        <div className="relative z-10 border-y border-slate-100 bg-white/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
              {stats.map(({ icon: Icon, value, label, gradient, delay }, idx) => (
                <div
                  key={label}
                  className="group relative"
                >
                  <div className="flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className={`w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-200`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-slate-900 font-black text-2xl md:text-3xl leading-tight mb-1">{value}</p>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em]">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section with Animated Cards */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-[3px] bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
                <span className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Featured Properties
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Top Picks in
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Panchkula & Mohali
                </span>
              </h2>
            </div>
            <button className="group flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all duration-300">
              View All Properties <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-1000 ease-in-out gap-8"
              style={{ transform: `translateX(-${carouselIndex * (100 / (window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1)) }%)` }}
            >
              {featuredProperties.map((property, index) => (
                <div key={index} className="min-w-full md:min-w-[calc(50%-16px)] lg:min-w-[calc(33.333%-22px)] flex-shrink-0">
                  <div className="relative">
                    {property.isPromoted && (
                      <div className="absolute top-4 left-4 z-10 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-200 flex items-center gap-1.5 animate-pulse">
                        <Zap className="w-3 h-3 fill-white" /> Featured Ad
                      </div>
                    )}
                    <PropertyCard {...property} />
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: Math.max(0, featuredProperties.length - 2) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    carouselIndex === i ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with 3D Cards */}
      <section className="pb-12 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-1 bg-blue-600 rounded-full" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              <span className="text-slate-900">Our Premium </span>
              <span className="text-blue-600">Services</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              We provide end-to-end real estate solutions tailored to your needs in the Tri-City area.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={i} className="group relative">
                <div className="relative p-8 rounded-3xl bg-white border border-slate-100 hover:border-transparent shadow-md hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                  <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 shadow-lg transition-all duration-500 group-hover:scale-110`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{service.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {service.features.map((feature, idx) => (
                      <span key={idx} className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-bold transition-colors hover:bg-blue-100 cursor-default flex items-center gap-1">
                        <span className="opacity-60">✓</span> {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us with Split Layout */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
                <span className="text-blue-400 font-bold text-sm uppercase tracking-[0.2em]">Why Choose Us</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-6 leading-tight text-white">
                Tri-City's Most Trusted
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                  Real Estate Agency
                </span>
              </h2>
              <div className="space-y-6">
                {whyChooseUs.map((item, i) => (
                  <div key={i} className="group flex gap-5 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300">
                    <div className={`w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-500 shadow-xl`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 text-white">{item.title}</h4>
                      <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-in-up delay-200">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
                  alt="Office"
                  className="w-full h-[350px] md:h-[450px] object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
              </div>

              {/* Floating Stat Card */}
              <div className="absolute -bottom-8 -left-8 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl max-w-[280px] animate-float">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white leading-none">25%</p>
                    <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">Annual Growth</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Consistently delivering high ROI for our property investors.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Latest Insights Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-1 bg-blue-600 rounded-full" />
                <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Market Insights</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Latest Property <span className="text-blue-600">Guides</span>
              </h2>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-100 font-bold text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all">
              View All Articles <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {insights.map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative h-64 rounded-3xl overflow-hidden mb-6">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold shadow-lg">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-xs font-bold mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {item.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> By {item.author}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 overflow-hidden group">
        {/* Background Image with Parallax-like feel */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600"
            alt="Dream Home"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter">
            Ready to Find Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">Dream Property?</span>
          </h2>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto mb-12 font-medium">
            Join 3,500+ happy families who found their perfect home with Maa Mansa Devi Property experts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="w-full sm:w-auto px-12 py-6 rounded-2xl bg-blue-600 text-white font-black text-lg hover:bg-blue-500 hover:shadow-2xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-3 group/btn">
              Contact Us Today <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover/btn:scale-110 transition-transform"><Phone className="w-4 h-4" /></div>
            </button>
            <Link to="/properties" className="w-full sm:w-auto px-12 py-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-lg hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-3">
              Browse Listings <HomeIcon className="w-6 h-6" />
            </Link>
          </div>

          {/* Support Badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 font-bold text-white/70">
              <ShieldCheck className="w-5 h-5 text-blue-400" /> 100% Verified
            </div>
            <div className="flex items-center gap-2 font-bold text-white/70">
              <Clock className="w-5 h-5 text-blue-400" /> 24/7 Support
            </div>
            <div className="flex items-center gap-2 font-bold text-white/70">
              <Award className="w-5 h-5 text-blue-400" /> Award Winning
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes slide-up {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }
        .animate-float-slow { animation: float 8s ease-in-out infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; transform-origin: left; }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in-up.delay-200 { animation-delay: 0.2s; }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s ease-in-out infinite;
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .delay-1000 { animation-delay: 1s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
}

export default Home;