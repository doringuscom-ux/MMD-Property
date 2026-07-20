import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Home, Search, Building2, MapPin, ChevronRight,
  User, Users, LogOut, Heart, List, ChevronDown, Phone, MessageSquare, Settings, Bell
} from 'lucide-react';
import logoImg from '../assets/Logo.svg';
import { BASE_URL } from '../api';

const Navbar = ({ isSolid = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [selectedPropertyForLocation, setSelectedPropertyForLocation] = useState(null);
  const [mapLinkInput, setMapLinkInput] = useState('');
  const [isSubmittingLink, setIsSubmittingLink] = useState(false);
  const [user, setUser] = useState(null);

  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getColorClasses = (color, isRead) => {
    if (isRead) return { container: 'bg-transparent border-transparent hover:bg-slate-50', iconBox: 'bg-slate-100 border-slate-200', icon: 'text-slate-400' };
    switch(color) {
      case 'blue': return { container: 'bg-blue-50/50 hover:bg-blue-50 border-blue-100', iconBox: 'bg-blue-100 border-blue-200', icon: 'text-blue-600' };
      case 'emerald': return { container: 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-100', iconBox: 'bg-emerald-100 border-emerald-200', icon: 'text-emerald-600' };
      default: return { container: 'bg-slate-50/50 hover:bg-slate-50 border-slate-100', iconBox: 'bg-slate-100 border-slate-200', icon: 'text-slate-600' };
    }
  };
  const navigate = useNavigate();

  const location = useLocation();

  const fetchNotifications = async (userInfo) => {
    try {
      const response = await fetch(`${BASE_URL}/notifications/my`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      const parsed = JSON.parse(userInfoStr);
      setUser(parsed);
      fetchNotifications(parsed);
    } else {
      setUser(null);
      setNotifications([]);
    }
  }, [location.pathname, isNotifModalOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatTimeAgo = (dateInput) => {
    if (!dateInput) return 'Just Now';
    const date = new Date(dateInput);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just Now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hr${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, [location]);

  const handleMarkAsRead = async (notif) => {
    try {
      const id = notif._id || notif.id;
      if (!notif.isRead) {
        await fetch(`${BASE_URL}/notifications/${id}/read`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setNotifications(notifications.map(n => 
          (n._id === id || n.id === id) ? { ...n, isRead: true } : n
        ));
      }

      if (notif.type === 'LocationRequested' && notif.property?._id) {
        setSelectedPropertyForLocation(notif.property);
        setMapLinkInput('');
        setShowLocationInput(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitMapLink = async () => {
    if (!mapLinkInput) {
      alert('Please enter a map link');
      return;
    }
    setIsSubmittingLink(true);
    try {
      const res = await fetch(`${BASE_URL}/properties/${selectedPropertyForLocation._id}/map-link`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}` 
        },
        body: JSON.stringify({ mapLink: mapLinkInput })
      });
      if (res.ok) {
        alert('Map link updated successfully!');
        setShowLocationInput(false);
      } else {
        alert('Failed to update map link');
      }
    } catch (err) {
      alert('Error updating map link');
    } finally {
      setIsSubmittingLink(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch(`${BASE_URL}/notifications/my/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

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
    { name: 'Agents', icon: Users, href: '/agents' },
    { name: 'Contact', icon: Phone, href: '/contact' },
  ];

  const isHomePage = location.pathname === '/';
  const isTop = isHomePage && !(isSolid || scrolled);

  return (
    <nav className={`fixed z-[1000] transition-all duration-500 ease-in-out ${!isTop
        ? 'top-0 left-0 w-full bg-white shadow-lg shadow-slate-200/50 py-2.5 lg:py-3'
        : 'top-0 left-0 w-full bg-transparent py-4 lg:py-6'
      }`}>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center group cursor-pointer">
            <Link to="/" className="relative flex items-center gap-4">
              <div className="relative group-hover:scale-105 transition-transform duration-500">
                <img
                  src={logoImg}
                  alt="Logo"
                  className={`h-14 md:h-16 lg:h-[72px] w-auto object-contain drop-shadow-md transition-all duration-300 ${!isTop ? 'brightness-0 contrast-200 opacity-80' : ''}`}
                />
              </div>

              <div className="flex flex-col justify-center">
                <span className={`text-base min-[425px]:text-lg max-[1073px]:text-lg md:text-xl font-black font-heading leading-tight tracking-tight ${isTop ? 'text-white' : 'text-slate-900'}`}>
                  Maa Mansa Property <span className="text-blue-500">.</span>
                </span>
                <span className={`text-[9px] min-[425px]:text-[10px] uppercase tracking-[0.2em] font-bold transition-colors leading-none ${isTop ? 'text-blue-100 group-hover:text-white' : 'text-slate-400 group-hover:text-blue-600/80'}`}>
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
                className={`group relative px-4 py-2 text-sm font-semibold transition-colors duration-300 ${location.pathname === link.href
                    ? (isTop ? 'text-blue-400' : 'text-blue-600')
                    : (isTop ? 'text-slate-200 hover:text-white' : 'text-slate-600 hover:text-blue-600')
                  }`}
              >
                <div className="flex items-center gap-2">
                  <link.icon className={`w-4 h-4 transition-all duration-300 ${location.pathname === link.href
                      ? 'opacity-100'
                      : (isTop ? 'opacity-60 group-hover:opacity-100' : 'opacity-40 group-hover:opacity-100 group-hover:text-blue-600')
                    }`} />
                  <span>{link.name}</span>
                </div>
                <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-600 to-emerald-400 transform transition-transform duration-300 ease-out ${location.pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></span>
              </Link>
            ))}

            <div className="ml-6 flex items-center space-x-6">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-3 px-3 py-1.5 rounded-2xl transition-all group ${isTop ? 'hover:bg-white/10' : 'hover:bg-slate-50'}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className={`text-[10px] font-bold uppercase tracking-tighter leading-none ${isTop ? 'text-blue-200' : 'text-slate-400'}`}>Welcome back</p>
                      <p className={`text-sm font-black flex items-center gap-1 ${isTop ? 'text-white' : 'text-slate-900'}`}>
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
                        <button onClick={() => { setIsProfileOpen(false); setIsNotifModalOpen(true); }} className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all font-bold text-sm text-left group">
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white shadow-sm transition-all relative">
                              <Bell className="w-4 h-4" />
                              {unreadCount > 0 && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />}
                            </div>
                            Notifications
                          </div>
                          {unreadCount > 0 && <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-md text-[10px] font-black">{unreadCount} New</span>}
                        </button>
                        <Link to="/my-properties" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all font-bold text-sm text-left group">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white shadow-sm transition-all">
                            <List className="w-4 h-4" />
                          </div>
                          My Properties
                        </Link>
                        <Link to="/saved-properties" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all font-bold text-sm text-left group">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white shadow-sm transition-all">
                            <Heart className="w-4 h-4" />
                          </div>
                          Saved Properties
                        </Link>
                        <Link to="/my-enquiries" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all font-bold text-sm text-left group">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white shadow-sm transition-all">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          My Enquiries
                        </Link>
                        <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all font-bold text-sm text-left group">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white shadow-sm transition-all">
                            <Settings className="w-4 h-4" />
                          </div>
                          Manage Profile
                        </Link>
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
                <Link to="/login" className={`flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 ${isTop
                    ? 'border-white/80 text-white hover:bg-white hover:text-blue-600'
                    : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}>
                  <User className="w-4 h-4" />
                  Login / Sign Up
                </Link>
              )}

              <Link to="/post-property" className="relative group overflow-hidden px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-300 shadow-xl shadow-blue-600/20 active:scale-95">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-500 group-hover:from-blue-600 group-hover:to-blue-400 transition-all duration-300"></div>
                <span className="relative flex items-center gap-2">
                  List Property <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            {user ? (
              <Link to="/profile" className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </Link>
            ) : (
              <Link to="/login" className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shadow-sm">
                <User className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`relative p-2.5 rounded-xl border transition-all ${isTop
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/30'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-blue-600'
                }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${isOpen ? 'visible' : 'invisible'
          }`}
      >
        {/* Glass Overlay */}
        <div
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'
            } flex flex-col`}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black font-heading tracking-tight">Maa Mansa Property.</span>
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
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${location.pathname === link.href
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30'
                        : 'bg-slate-50 text-slate-600 hover:bg-blue-50'
                      }`}
                  >
                    <div className={`p-2 rounded-xl ${location.pathname === link.href ? 'bg-white/20' : 'bg-white shadow-sm'
                      }`}>
                      <link.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold">{link.name}</span>
                    <ChevronRight className={`ml-auto w-4 h-4 transition-all ${location.pathname === link.href ? 'opacity-100' : 'opacity-0 -translate-x-2'
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
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black">Hi, {user.name}</p>
                      <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Premium Member</p>
                    </div>
                  </div>
                  <button onClick={() => { setIsOpen(false); setIsNotifModalOpen(true); }} className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 text-slate-600 hover:bg-blue-50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-white shadow-sm group-hover:text-blue-600 relative">
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />}
                      </div>
                      <span className="font-bold">Notifications</span>
                    </div>
                    {unreadCount > 0 && <span className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-[10px] font-black">{unreadCount} New</span>}
                  </button>
                  <Link to="/my-properties" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 text-slate-600 hover:bg-blue-50 transition-all group">
                    <div className="p-2 rounded-xl bg-white shadow-sm group-hover:text-blue-600">
                      <List className="w-5 h-5" />
                    </div>
                    <span className="font-bold">My Properties</span>
                  </Link>
                  <Link to="/saved-properties" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 text-slate-600 hover:bg-blue-50 transition-all group">
                    <div className="p-2 rounded-xl bg-white shadow-sm group-hover:text-blue-600">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="font-bold">Saved Properties</span>
                  </Link>
                  <Link to="/my-enquiries" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 text-slate-600 hover:bg-blue-50 transition-all group">
                    <div className="p-2 rounded-xl bg-white shadow-sm group-hover:text-blue-600">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="font-bold">My Enquiries</span>
                  </Link>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 text-slate-600 hover:bg-blue-50 transition-all group">
                    <div className="p-2 rounded-xl bg-white shadow-sm group-hover:text-blue-600">
                      <Settings className="w-5 h-5" />
                    </div>
                    <span className="font-bold">Manage Profile</span>
                  </Link>
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
            <Link to="/post-property" onClick={() => setIsOpen(false)} className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black shadow-xl shadow-blue-600/30 active:scale-95 transition-all text-center block">
              List Your Property
            </Link>
          </div>
        </div>
      </div>

      {/* Notifications Modal Popup */}
      {isNotifModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsNotifModalOpen(false)} />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-scale-up border border-slate-100">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Notifications</h3>
                <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Updates & Alerts</p>
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-lg transition-colors">
                    Mark all read
                  </button>
                )}
                <button onClick={() => setIsNotifModalOpen(false)} className="p-2.5 bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {notifications.length === 0 ? (
                <div className="text-center py-10 flex flex-col items-center justify-center opacity-50">
                  <Bell className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No notifications yet</p>
                </div>
              ) : notifications.map((notif) => {
                const isPropertyNotif = notif.type === 'PropertyPublished' || notif.type === 'PropertyAdded' || notif.type === 'PropertyUpdated';
                const isLocationNotif = notif.type === 'LocationRequested';
                const Icon = isLocationNotif ? MapPin : (isPropertyNotif ? Home : Bell);
                const colors = getColorClasses(notif.type === 'PropertyPublished' ? 'emerald' : 'blue', notif.isRead);
                
                return (
                  <div 
                    key={notif._id || notif.id}
                    onClick={() => handleMarkAsRead(notif)}
                    className={`flex gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${colors.container}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${colors.iconBox}`}>
                      <Icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    <div className="flex-1 relative">
                      <div className="flex justify-between items-start mb-1 pr-6">
                        <p className={`text-sm font-bold ${notif.isRead ? 'text-slate-600' : 'text-slate-900'}`}>{notif.property?.title || 'System Alert'}</p>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 min-w-[70px] text-right">
                          {formatTimeAgo(notif.createdAt)}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed pr-4 ${notif.isRead ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>{notif.message}</p>
                      
                      {!notif.isRead && (
                        <div className="absolute top-1 right-0 w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            

          </div>
        </div>
      )}

      {/* Location Input Modal */}
      {showLocationInput && selectedPropertyForLocation && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowLocationInput(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-scale-up border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 shadow-sm mx-auto">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 text-center mb-2">Provide Map Location</h3>
            <p className="text-sm font-medium text-slate-500 text-center mb-8">
              Admin requested a map link for: <span className="font-bold text-slate-700">{selectedPropertyForLocation.title}</span>
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Google Maps Embed Link / URL</label>
                <input 
                  type="text"
                  value={mapLinkInput}
                  onChange={(e) => setMapLinkInput(e.target.value)}
                  placeholder='<iframe src="..."> or https://maps.app.goo.gl/...'
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>
              <button 
                onClick={submitMapLink}
                disabled={isSubmittingLink}
                className="w-full bg-blue-600 text-white rounded-xl py-3 font-black shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmittingLink ? 'Saving...' : 'Save Map Link'}
              </button>
            </div>
            <button onClick={() => setShowLocationInput(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
