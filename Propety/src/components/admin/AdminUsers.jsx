import { useState, useEffect } from 'react';
import { Search, UserCircle, Mail, Phone, Calendar, Shield, ShieldCheck, Trash2, MoreVertical, ExternalLink, Lock, Ban, CheckCircle, X, Save, User } from 'lucide-react';
import { BASE_URL } from '../../api';

const AdminUsers = ({ showToast }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All Roles');

  // Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    password: '',
    isBlocked: false
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      if (!response.ok) throw new Error(`Error ${response.status}: Failed to fetch users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      if (showToast) {
        if (error.message.includes('401')) {
          showToast('error', 'Session Expired. Please Logout and Login again.');
        } else {
          showToast('error', 'Failed to load users');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      password: '',
      isBlocked: user.isBlocked || false
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo?.token}`
        },
        body: JSON.stringify(editFormData)
      });

      if (!response.ok) throw new Error('Update failed');
      
      showToast('success', 'User updated successfully');
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      showToast('error', 'Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleBlock = async (user) => {
    const action = user.isBlocked ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} ${user.name}?`)) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        showToast('error', 'Session expired. Please login again.');
        return;
      }

      console.log(`Attempting to ${action} user:`, user._id);

      const response = await fetch(`${BASE_URL}/users/${user._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({ isBlocked: !user.isBlocked })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Action failed');
      }
      
      showToast('success', `User ${!user.isBlocked ? 'blocked' : 'unblocked'} successfully`);
      await fetchUsers();
    } catch (error) {
      console.error('Block Error:', error);
      showToast('error', error.message || `Failed to ${action} user`);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`CRITICAL: Are you sure you want to PERMANENTLY DELETE ${user.name}? This action cannot be undone.`)) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/users/${user._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });

      if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Delete failed');
      }
      
      showToast('success', 'User deleted permanently');
      fetchUsers();
    } catch (error) {
      showToast('error', error.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => {
    const nameMatch = u.name.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || emailMatch;
    const matchesRole = filterRole === 'All Roles' || (filterRole === 'Admin' ? u.role === 'admin' : u.role === 'user');
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 space-y-8 animate-fade-in relative min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h3>
          <p className="text-slate-500 font-bold mt-1">Manage permissions, roles and account status</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm font-bold outline-none focus:ring-4 ring-blue-500/10 focus:border-blue-500 w-72 shadow-sm transition-all"
            />
          </div>
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm font-bold outline-none shadow-sm cursor-pointer hover:border-slate-300 transition-all focus:ring-4 ring-blue-500/10"
          >
            <option>All Roles</option>
            <option>Admin</option>
            <option>Users</option>
          </select>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Profile</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role & Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registration</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-8 py-8">
                      <div className="h-14 bg-slate-50 rounded-2xl w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className={`hover:bg-blue-50/30 transition-all group ${user.isBlocked ? 'bg-red-50/20' : ''}`}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner ${user.role === 'admin' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors">{user.name}</p>
                          <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-wider">User ID: #{user._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 text-slate-600">
                          <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <span className="text-sm font-bold tracking-tight">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-600">
                          <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <span className="text-sm font-bold tracking-tight">{user.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-2.5">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest w-fit border ${user.role === 'admin' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                            {user.role === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                            {user.role}
                          </div>
                          {user.isBlocked ? (
                             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-600 text-white text-[9px] font-black uppercase tracking-widest w-fit animate-pulse">
                                <Ban className="w-3.5 h-3.5" /> Blocked
                             </div>
                          ) : (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest w-fit border border-emerald-100">
                                <CheckCircle className="w-3.5 h-3.5" /> Active
                             </div>
                          )}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 text-slate-500">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                          <Calendar className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                          <p className="text-[10px] font-bold text-slate-400">{new Date(user.createdAt).getFullYear()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => toggleBlock(user)}
                          title={user.isBlocked ? "Unblock User" : "Block User"}
                          className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all ${user.isBlocked ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`}
                        >
                          {user.isBlocked ? <CheckCircle className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={() => openEditModal(user)}
                          className="w-11 h-11 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                           <MoreVertical className="w-5 h-5" />
                        </button>
                        <button 
                           onClick={() => handleDeleteUser(user)}
                           className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-600 hover:text-white transition-all"
                        >
                           <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-200">
                      <UserCircle className="w-12 h-12 text-slate-200" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900">No users matched your search</h4>
                    <p className="text-slate-400 font-bold mt-2">Try different keywords or reset your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setShowEditModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-[#0F172A] p-10 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
               <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-3xl font-black shadow-xl shadow-blue-600/40">
                      {editFormData.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black tracking-tight">Edit User Account</h4>
                      <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest">Update permissions & security</p>
                    </div>
                  </div>
                  <button onClick={() => setShowEditModal(false)} className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/10">
                    <X className="w-6 h-6" />
                  </button>
               </div>
            </div>

            <form onSubmit={handleUpdateUser} className="p-10 space-y-8 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      required
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      className="w-full pl-14 pr-6 py-4.5 rounded-[1.5rem] bg-slate-50 border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm shadow-inner"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      required
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                      className="w-full pl-14 pr-6 py-4.5 rounded-[1.5rem] bg-slate-50 border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                      className="w-full pl-14 pr-6 py-4.5 rounded-[1.5rem] bg-slate-50 border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm shadow-inner"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Privilege</label>
                  <div className="relative group">
                    <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                    <select 
                      value={editFormData.role}
                      onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                      className="w-full pl-14 pr-10 py-4.5 rounded-[1.5rem] bg-slate-50 border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm cursor-pointer appearance-none shadow-inner"
                    >
                      <option value="user">Standard User</option>
                      <option value="sub-admin">Sub Administrator</option>
                      <option value="admin">Main Administrator</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Update Password (Secure)</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="password"
                    placeholder="Enter new strong password"
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({...editFormData, password: e.target.value})}
                    className="w-full pl-14 pr-6 py-4.5 rounded-[1.5rem] bg-slate-50 border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm shadow-inner"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-bold ml-2">Keep empty to maintain the current password.</p>
              </div>

              {/* Status & Block Section */}
              <div className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between gap-6 ${editFormData.isBlocked ? 'bg-red-50 border-red-200' : 'bg-emerald-50/30 border-emerald-100'}`}>
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${editFormData.isBlocked ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
                      {editFormData.isBlocked ? <Ban className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                   </div>
                   <div>
                      <h5 className={`font-black uppercase tracking-widest text-[11px] ${editFormData.isBlocked ? 'text-red-600' : 'text-emerald-600'}`}>
                         Account {editFormData.isBlocked ? 'Blocked' : 'Active'}
                      </h5>
                      <p className="text-slate-500 text-xs font-bold mt-0.5">
                         {editFormData.isBlocked ? 'User cannot access the portal.' : 'User can login and browse property.'}
                      </p>
                   </div>
                </div>
                <div 
                   onClick={() => setEditFormData({...editFormData, isBlocked: !editFormData.isBlocked})}
                   className={`w-16 h-8 rounded-full relative cursor-pointer transition-all duration-300 ${editFormData.isBlocked ? 'bg-red-600' : 'bg-slate-300'}`}
                >
                   <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-sm ${editFormData.isBlocked ? 'left-9' : 'left-1'}`} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-5 rounded-[1.5rem] bg-slate-100 text-slate-600 font-black text-sm hover:bg-slate-200 transition-all active:scale-95"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="flex-2 py-5 rounded-[1.5rem] bg-blue-600 text-white font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 min-w-[200px]"
                >
                  {actionLoading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-6 h-6" /> Save Settings</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminUsers;
