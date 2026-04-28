import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Home, Search, Building2, MapPin, ChevronRight, 
  User, LogOut, Heart, List, ChevronDown 
} from 'lucide-react';
import logoImg from '../assets/NewLogo.png';
import { BASE_URL } from '../api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();
  
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, [location]);

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/users/logout`, { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem('userInfo');
    setUser(null);
    setIsProfileOpen(false);
    setIsOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Properties', icon: Building2, href: '/properties' },
    { name: 'Search', icon: Search, href: '#' },
    { name: 'Locations', icon: MapPin, href: '#' },
  ];

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ease-in-out ${scrolled ? 'py-2 glass-light shadow-lg' : 'py-4 bg-white/0'
      }`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center group cursor-pointer">
            <Link to="/" className="relative flex items-center gap-4">
              <div className="p-2.5 rounded-2xl bg-white shadow-xl shadow-blue-500/10 group-hover:shadow-blue-500/20 transition-all duration-500 border border-slate-100">
                <img
                  src={logoImg}
                  alt="Logo"
                  className="h-[46px] md:h-[54px] w-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-base min-[425px]:text-lg max-[1073px]:text-lg md:text-xl font-black text-slate-900 font-heading leading-tight tracking-tight">
                  Maa Mansa Devi Property <span className="text-blue-600">.</span>
                </span>
                <span className="text-[9px] min-[425px]:text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 group-hover:text-blue-600/80 transition-colors leading-none">
                  Panchkula • Mohali
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`group relative px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                  location.pathname === link.href ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <link.icon className={`w-4 h-4 transition-all duration-300 ${
                    location.pathname === link.href ? 'opacity-100 text-blue-600' : 'opacity-40 group-hover:opacity-100 group-hover:text-blue-600'
                  }`} />
                  <span>{link.name}</span>
                </div>
                <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-600 to-emerald-400 transform transition-transform duration-300 ease-out ${
                  location.pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            ))}

            <div className="ml-6 flex items-center space-x-6">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 px-3 py-1.5 rounded-2xl hover:bg-slate-50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">Welcome back</p>
                      <p className="text-sm font-black text-slate-900 flex items-center gap-1">
                        Hi, {user.name} <ChevronDown className={`w-3 h-3 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                      </p>
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 overflow-hidden animate-slide-up z-[110]">
                      <div className="px-6 py-4 border-b border-slate-50">
                        <p className="text-sm font-black text-slate-900">Account Settings</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Manage your profile</p>
                      </div>
                      <div className="p-2">
                        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all font-bold text-sm text-left group">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white shadow-sm transition-all">
                            <List className="w-4 h-4" />
                          </div>
                          My Properties
                        </button>
                        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all font-bold text-sm text-left group">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white shadow-sm transition-all">
                            <Heart className="w-4 h-4" />
                          </div>
                          Saved Properties
                        </button>
                        <div className="h-px bg-slate-50 my-2 mx-4" />
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm text-left group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shadow-sm">
                            <LogOut className="w-4 h-4" />
                          </div>
                          Logout Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-blue-600 text-blue-600 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all active:scale-95">
                  <User className="w-4 h-4" />
                  Login / Sign Up
                </Link>
              )}

              <button className="relative group overflow-hidden px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-300 shadow-xl shadow-blue-600/20 active:scale-95">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-500 group-hover:from-blue-600 group-hover:to-blue-400 transition-all duration-300"></div>
                <span className="relative flex items-center gap-2">
                  List Property <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <button className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shadow-sm">
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-blue-600 transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      <div 
        className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${
          isOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Glass Overlay */}
        <div 
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        <div 
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col`}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black font-heading tracking-tight">Maa Mansa Devi Property.</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Promo Badge for Mobile */}
            <div className="px-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-600/10 rounded-2xl blur-lg" />
                <div className="relative flex items-center gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                  </div>
                  <span className="text-[11px] font-black text-blue-700 uppercase tracking-wider">
                    Panchkula & Mohali's #1 Partner
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Main Menu</h4>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                      location.pathname === link.href 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' 
                        : 'bg-slate-50 text-slate-600 hover:bg-blue-50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${
                      location.pathname === link.href ? 'bg-white/20' : 'bg-white shadow-sm'
                    }`}>
                      <link.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold">{link.name}</span>
                    <ChevronRight className={`ml-auto w-4 h-4 transition-all ${
                      location.pathname === link.href ? 'opacity-100' : 'opacity-0 -translate-x-2'
                    }`} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Account</h4>
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/30">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black">Hi, {user.name}</p>
                      <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Premium Member</p>
                    </div>
                  </div>
                  <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 text-slate-600 hover:bg-blue-50 transition-all group">
                    <div className="p-2 rounded-xl bg-white shadow-sm group-hover:text-blue-600">
                      <List className="w-5 h-5" />
                    </div>
                    <span className="font-bold">My Properties</span>
                  </button>
                  <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 text-slate-600 hover:bg-blue-50 transition-all group">
                    <div className="p-2 rounded-xl bg-white shadow-sm group-hover:text-blue-600">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="font-bold">Saved Properties</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-all group"
                  >
                    <div className="p-2 rounded-xl bg-white shadow-sm">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span className="font-bold">Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full flex items-center justify-center gap-4 p-4 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/30 font-black">
                  <User className="w-6 h-6" />
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-slate-50">
            <button className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black shadow-xl shadow-blue-600/30 active:scale-95 transition-all">
              List Your Property
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
