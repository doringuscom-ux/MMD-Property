import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { Plus, LayoutDashboard, Building2, LayoutGrid, MapPin, Users, UserCircle, MessageSquare, Calendar, Star, FileText, Newspaper, Settings, BarChart3, LogOut } from 'lucide-react';
import { BASE_URL } from '../api';

// Admin Components
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';
import DashboardOverview from '../components/admin/DashboardOverview';
import AdminPropertyTable from '../components/admin/AdminPropertyTable';
import AdminPropertyModal from '../components/admin/AdminPropertyModal';
import AdminDeleteModal from '../components/admin/AdminDeleteModal';
import AdminToast from '../components/admin/AdminToast';
import AdminCategories from '../components/admin/AdminCategories';
import AdminPropertyDetails from '../components/admin/AdminPropertyDetails';
import AdminUsers from '../components/admin/AdminUsers';
import AdminEnquiries from '../components/admin/AdminEnquiries';
import AdminEnquiryModal from '../components/admin/AdminEnquiryModal';
// ----------------------------------------------------------------------
// Helper: Format price in Cr/Lakhs
const formatPrice = (price) => {
  if (price >= 1e7) return `${(price / 1e7).toFixed(2)} Cr`;
  if (price >= 1e5) return `${(price / 1e5).toFixed(2)} L`;
  return price.toLocaleString('en-IN');
};

const Admin = () => {
  // --- Global Admin State ---
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // --- Property State ---
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [enquiries, setEnquiries] = useState([]);
  const [usersCount, setUsersCount] = useState(0);

  // Modal & form state
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Detail view state
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Bulk select state
  const [selectedIds, setSelectedIds] = useState([]);

  // Delete confirmation modal
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: 'Apartment',
    status: 'For Sale',
    adminStatus: 'Published',
    city: 'Chandigarh',
    bedrooms: '',
    bathrooms: '',
    area: '',
    images: [''],
    mapLink: '',
    furnishing: 'Unfurnished',
    floor: '',
    facing: 'None',
    builtYear: new Date().getFullYear(),
    readyStatus: 'Ready to Move',
    premiumFeatures: ''
  });

  // ----------------------------------------------------------------------
  // Fetch properties
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/properties?pageSize=100&showAll=true`, {
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      if (response.status === 401) {
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProperties(data.properties || []);
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const fetchEnquiries = useCallback(async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/enquiries?pageSize=5`, {
        headers: { 'Authorization': `Bearer ${userInfo?.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEnquiries(data.enquiries || []);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const fetchUsers = useCallback(async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${userInfo?.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsersCount(data.length || 0);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ----------------------------------------------------------------------
  // Toast notification
  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // ----------------------------------------------------------------------
  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Handle nested objects like coordinates
    if (name === 'coordinates') {
        setFormData(prev => ({ ...prev, coordinates: value }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages.length ? newImages : [''] }));
  };

  const openAddModal = () => {
    setEditingProperty(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      location: '',
      propertyType: 'Apartment',
      status: 'For Sale',
      adminStatus: 'Published',
      bedrooms: '',
      bathrooms: '',
      area: '',
      images: [''],
      mapLink: '',
      furnishing: 'Unfurnished',
      floor: '',
      facing: 'None',
      builtYear: new Date().getFullYear(),
      readyStatus: 'Ready to Move',
      premiumFeatures: '',
      city: 'Chandigarh',
      coordinates: { lat: '', lng: '' }
    });
    setShowModal(true);
  };

  const openEditModal = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      propertyType: property.propertyType,
      status: property.status,
      adminStatus: property.adminStatus || 'Published',
      bedrooms: property.bedrooms || '',
      bathrooms: property.bathrooms || '',
      area: property.area || '',
      images: property.images?.length ? property.images : [''],
      mapLink: property.mapLink || '',
      furnishing: property.furnishing || 'Unfurnished',
      floor: property.floor || '',
      facing: property.facing || 'None',
      builtYear: property.builtYear || new Date().getFullYear(),
      readyStatus: property.readyStatus || 'Ready to Move',
      premiumFeatures: property.premiumFeatures || '',
      city: property.city || 'Chandigarh',
      coordinates: property.coordinates || { lat: '', lng: '' }
    });
    setShowModal(true);
  };

  // ----------------------------------------------------------------------
  // Submit (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    if (!formData.title || !formData.price) {
      showToast('error', 'Title & Price are required');
      setFormLoading(false);
      return;
    }

    try {
      const url = editingProperty
        ? `${BASE_URL}/properties/${editingProperty._id}`
        : `${BASE_URL}/properties`;
      const method = editingProperty ? 'PUT' : 'POST';

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo?.token}`
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
          bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
          area: formData.area ? Number(formData.area) : undefined,
          images: formData.images.filter(img => img.trim() !== '')
        })
      });

      if (!response.ok) throw new Error('Request failed');

      showToast('success', `Property ${editingProperty ? 'updated' : 'added'} successfully`);
      setShowModal(false);
      fetchProperties();
    } catch (error) {
      console.error(error);
      showToast('error', 'Something went wrong.');
    } finally {
      setFormLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // Delete handlers
  const confirmDelete = (id) => setDeleteConfirm({ show: true, id });
  const handleDelete = async () => {
    const id = deleteConfirm.id;
    if (!id) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/properties/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      if (!response.ok) throw new Error('Delete failed');
      showToast('success', 'Property deleted');
      fetchProperties();
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to delete');
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  };

  const handleEnquiryStatusUpdate = async (id, status) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/enquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo?.token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        showToast('success', `Enquiry marked as ${status}`);
        fetchEnquiries();
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to update enquiry');
    }
  };

  const handleEnquiryDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/enquiries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userInfo?.token}` }
      });
      if (response.ok) {
        showToast('success', 'Enquiry deleted');
        setSelectedEnquiryId(null);
        fetchEnquiries();
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to delete');
    }
  };

  const handleNotificationAction = async (notification) => {
    if (notification.type === 'EnquiryAdded') {
      // Find enquiry ID from message if not directly in notification (or we might need to add it to backend)
      // For now, if we don't have it, we just go to the tab. 
      // But ideally we'd have notification.enquiryId
      setActiveTab('Enquiries');
      if (notification.enquiry) {
        setSelectedEnquiryId(notification.enquiry);
      }
      return;
    }

    if (notification.property) {
      const propertyId = typeof notification.property === 'object' ? notification.property._id : notification.property;
      try {
        setLoading(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const response = await fetch(`${BASE_URL}/properties/${propertyId}`, {
          headers: { 'Authorization': `Bearer ${userInfo?.token}` }
        });
        if (response.ok) {
          const property = await response.json();
          setActiveTab('Properties');
          openEditModal(property);
        } else {
          showToast('error', 'Could not find the property');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // ----------------------------------------------------------------------
  // Bulk actions
  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;

    const confirmMsg = action === 'Delete' 
      ? `Are you sure you want to delete ${selectedIds.length} properties?`
      : `Move ${selectedIds.length} properties to ${action}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (action === 'Delete') {
        const response = await fetch(`${BASE_URL}/properties/bulk/delete`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userInfo?.token}`
          },
          body: JSON.stringify({ ids: selectedIds })
        });
        if (!response.ok) throw new Error('Bulk delete failed');
        showToast('success', `${selectedIds.length} properties deleted`);
      } else {
        const response = await fetch(`${BASE_URL}/properties/bulk/update`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userInfo?.token}`
          },
          body: JSON.stringify({ 
            ids: selectedIds, 
            updateData: { adminStatus: action === 'Publish' ? 'Published' : 'Draft' } 
          })
        });
        if (!response.ok) throw new Error('Bulk update failed');
        showToast('success', `${selectedIds.length} properties updated to ${action}`);
      }
      setSelectedIds([]);
      fetchProperties();
    } catch (error) {
      console.error(error);
      showToast('error', 'Bulk action failed');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // Filter & Pagination
  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.propertyId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Status' || p.adminStatus === statusFilter;
    
    const matchesCategory = categoryFilter === 'All Categories' || p.propertyType === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Tab change effect
  useEffect(() => {
    if (activeTab === 'Add Property') {
      setActiveTab('Properties');
      openAddModal();
    }
    // Clear selection when switching tabs
    if (activeTab !== 'Properties') {
      setSelectedProperty(null);
    }
  }, [activeTab]);

  // ----------------------------------------------------------------------
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar - Desktop */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminTopbar 
          activeTab={activeTab} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onNotificationClick={handleNotificationAction}
        />

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          <AdminToast message={message} />

          {activeTab === 'Dashboard' ? (
            <DashboardOverview 
              properties={properties} 
              enquiries={enquiries} 
              usersCount={usersCount} 
              formatPrice={formatPrice} 
              onEnquiryClick={(id) => {
                setSelectedEnquiryId(id);
              }}
            />
          ) : activeTab === 'Categories' ? (
            <AdminCategories properties={properties} />
          ) : activeTab === 'Properties' ? (
            <>
              {selectedProperty ? (
                <AdminPropertyDetails 
                  property={selectedProperty} 
                  onBack={() => setSelectedProperty(null)} 
                  formatPrice={formatPrice}
                />
              ) : (
                <div className="p-8 space-y-8 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Manage Properties</h3>
                      <p className="text-slate-500 font-medium">View and manage your real estate listings</p>
                    </div>
                    <button onClick={openAddModal} className="px-6 py-3.5 rounded-2xl bg-blue-600 text-white font-black text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2">
                      <Plus className="w-5 h-5" /> Add Property
                    </button>
                  </div>

                  <AdminPropertyTable 
                    properties={properties}
                    loading={loading}
                    paginatedProperties={paginatedProperties}
                    formatPrice={formatPrice}
                    openEditModal={openEditModal}
                    confirmDelete={confirmDelete}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    onViewDetails={(prop) => setSelectedProperty(prop)}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    handleBulkAction={handleBulkAction}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                  />
                </div>
              )}
            </>
          ) : activeTab === 'Users' ? (
            <AdminUsers showToast={showToast} />
          ) : activeTab === 'Enquiries' ? (
            <AdminEnquiries 
              showToast={showToast} 
              preSelectedId={selectedEnquiryId} 
              onViewDetail={(id) => setSelectedEnquiryId(id)}
            />
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                   <LayoutDashboard className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">{activeTab}</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Feature Coming Soon</p>
             </div>
          )}
        </main>
      </div>

      <AdminPropertyModal 
        showModal={showModal}
        setShowModal={setShowModal}
        editingProperty={editingProperty}
        handleSubmit={handleSubmit}
        formLoading={formLoading}
        formData={formData}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        addImageField={addImageField}
        removeImageField={removeImageField}
      />

      <AdminDeleteModal 
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        handleDelete={handleDelete}
      />

      <AdminEnquiryModal 
        enquiry={enquiries.find(e => e._id === selectedEnquiryId)}
        onClose={() => setSelectedEnquiryId(null)}
        onUpdateStatus={handleEnquiryStatusUpdate}
        onDelete={handleEnquiryDelete}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        body { font-family: 'Outfit', sans-serif; }
      `}</style>
    </div>
  );
};

export default Admin;