import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, Clock, CheckCircle2, Trash2, X, Plus, Edit3, MessageSquare } from 'lucide-react';
import { BASE_URL } from '../../api';

const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
};

const AdminTopbar = ({ activeTab, searchTerm, setSearchTerm, onNotificationClick }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0;

  const fetchNotifications = async () => {
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (!userInfoStr) return;
      
      const userInfo = JSON.parse(userInfoStr);
      if (!userInfo?.token) return;

      const response = await fetch(`${BASE_URL}/notifications`, {
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
           console.warn('Session expired or user found. Logging out...');
           localStorage.removeItem('userInfo');
           window.location.href = '/login';
        }
        return;
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (notification) => {
    markAsRead(notification._id);
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    setShowNotifications(false);
  };

  const markAsRead = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${userInfo?.token}` }
      });
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      await fetch(`${BASE_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${userInfo?.token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      await fetch(`${BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userInfo?.token}` }
      });
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-[100]">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 rounded-xl bg-slate-50 text-slate-500">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-black text-slate-900">{activeTab}</h2>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative group hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-sm"
          />
        </div>

        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2.5 rounded-xl transition-all ${
              showNotifications ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-3 w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Notifications</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Updates on property listings</p>
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs font-black text-blue-600 hover:text-blue-700 transition-colors">
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {!Array.isArray(notifications) || notifications.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-sm font-bold text-slate-400">No new notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {notifications.map((n) => (
                      <div 
                        key={n._id} 
                        onClick={() => handleItemClick(n)}
                        className={`p-5 flex gap-4 hover:bg-slate-50 transition-all cursor-pointer relative group ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                      >
                        {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />}
                        <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${
                          n.type === 'PropertyAdded' ? 'bg-emerald-50 text-emerald-600' : 
                          n.type === 'EnquiryAdded' ? 'bg-amber-50 text-amber-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {n.type === 'PropertyAdded' ? <Plus className="w-6 h-6" /> : 
                           n.type === 'EnquiryAdded' ? <MessageSquare className="w-6 h-6" /> :
                           <Edit3 className="w-6 h-6" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className={`text-sm leading-tight ${!n.isRead ? 'font-black text-slate-900' : 'font-medium text-slate-600'}`}>
                            {n.message}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                              <Clock className="w-3 h-3" /> {formatTimeAgo(n.createdAt)}
                            </span>
                            {!n.isRead && (
                                <span className="flex items-center gap-1 text-[10px] font-black text-blue-600">
                                   <CheckCircle2 className="w-3 h-3" /> New
                                </span>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={(e) => deleteNotification(n._id, e)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {Array.isArray(notifications) && notifications.length > 0 && (
                <div className="p-4 bg-slate-50/50 text-center border-t border-slate-50">
                   <button onClick={() => setShowNotifications(false)} className="text-xs font-black text-slate-500 hover:text-slate-900 flex items-center justify-center gap-2 mx-auto">
                      <X className="w-4 h-4" /> Close Panel
                   </button>
                </div>
              )}
            </div>
          )}

          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 cursor-pointer">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { bg: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { bg: #e2e8f0; border-radius: 10px; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </header>
  );
};

export default AdminTopbar;
