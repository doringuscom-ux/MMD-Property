import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  X, Plus, Loader2, Image as ImageIcon, Trash2, MapPin, 
  Sparkles, Building, Calendar, CheckCircle2, AlertCircle, Edit3, Camera, RefreshCw, Map, Star
} from 'lucide-react';
import { BASE_URL } from '../api';
const PostProperty = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState(null);

  // Upload/Camera States
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [showOptionsIndex, setShowOptionsIndex] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: 'Apartment',
    status: 'For Sale',
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

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userInfo));
    }
  }, [navigate]);

  useEffect(() => {
    if (isEditMode) {
      const fetchProperty = async () => {
        try {
          const response = await fetch(`${BASE_URL}/properties/${id}`);
          if (!response.ok) throw new Error('Failed to fetch property');
          const data = await response.json();
          
          setFormData({
            title: data.title || '',
            description: data.description || '',
            price: data.price || '',
            location: data.location || '',
            propertyType: data.propertyType || 'Apartment',
            status: data.status || 'For Sale',
            bedrooms: data.bedrooms || '',
            bathrooms: data.bathrooms || '',
            area: data.area || '',
            images: data.images?.length ? data.images : [''],
            mapLink: data.mapLink || '',
            furnishing: data.furnishing || 'Unfurnished',
            floor: data.floor || '',
            facing: data.facing || 'None',
            builtYear: data.builtYear || new Date().getFullYear(),
            readyStatus: data.readyStatus || 'Ready to Move',
            premiumFeatures: data.premiumFeatures || '',
            city: data.city || 'Chandigarh',
            coordinates: data.coordinates || { lat: '', lng: '' }
          });
        } catch (err) {
          console.error(err);
          showToast('error', 'Failed to load property data');
        }
      };
      fetchProperty();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const makeFeaturedImage = (index) => {
    if (index === 0) return;
    const newImages = [...formData.images];
    const targetImage = newImages[index];
    newImages.splice(index, 1);
    newImages.unshift(targetImage);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  // --- Camera & Upload Logic simplified natively ---

  const onFileSelect = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    setShowOptionsIndex(null);
    setUploadingIndex(index);
    await uploadFile(file, index);
  };

  const uploadFile = async (file, index) => {
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userInfo.token}` },
        body: uploadData
      });

      const data = await response.json();
      if (response.ok) {
        handleImageChange(index, data.url);
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (error) {
      alert('Error uploading image');
    } finally {
      setUploadingIndex(null);
    }
  };

  const showToast = (type, text) => {
    setMessage({ type, text });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (type === 'success') {
        setTimeout(() => navigate('/my-properties'), 2000);
    } else {
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    }
  };

  const saveProperty = async (isDraft = false, isAutoSave = false) => {
    if (!isDraft && (!formData.title || !formData.price)) {
      if (!isAutoSave) showToast('error', 'Title & Price are required');
      return;
    }

    if (!isAutoSave) setFormLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const url = isEditMode ? `${BASE_URL}/properties/${id}` : `${BASE_URL}/properties`;
      const method = isEditMode ? 'PUT' : 'POST';

      const payload = {
          ...formData,
          price: formData.price ? Number(formData.price) : 0,
          bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
          bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
          area: formData.area ? Number(formData.area) : undefined,
          images: formData.images.filter(img => img.trim() !== '')
      };
      
      if (isDraft) {
          payload.adminStatus = 'Draft';
      }

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo?.token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (!isAutoSave) {
           const errorData = await response.json();
           throw new Error(errorData.message || 'Request failed');
        }
        return;
      }

      const data = await response.json();

      if (!isEditMode && isDraft && isAutoSave) {
          navigate(`/edit-property/${data._id}`, { replace: true });
          return;
      }

      if (!isAutoSave) {
          const isAdminUser = user?.role === 'admin' || user?.role === 'sub-admin';
          let successMsg = '';
          if (isDraft) {
             successMsg = 'Draft saved successfully!';
          } else {
             successMsg = isEditMode 
               ? (isAdminUser ? 'Property updated successfully!' : 'Property updated successfully! It will be reviewed again by admin.')
               : (isAdminUser ? 'Property published successfully!' : 'Property submitted successfully! It will be visible to everyone once approved by admin.');
          }
          
          showToast('success', successMsg);
      }
    } catch (error) {
      console.error(error);
      if (!isAutoSave) showToast('error', error.message || 'Something went wrong.');
    } finally {
      if (!isAutoSave) setFormLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProperty(false, false);
  };

  // Auto-Save Effect
  useEffect(() => {
     const timer = setTimeout(() => {
        // Only auto-save if they've at least typed a title to avoid junk empty drafts
        if (formData.title && formData.title.trim() !== '') {
            saveProperty(true, true);
        }
     }, 5000); // 5 seconds auto-save after typing
     return () => clearTimeout(timer);
  }, [formData]);

  const amenitiesList = ['Gym', 'Swimming Pool', '24/7 Security', 'Power Backup', 'Club House', 'Park/Garden', 'Parking', 'Lift/Elevator', 'Vastu Compliant', 'Balcony'];
  
  const handleFeatureToggle = (feature) => {
    const current = formData.premiumFeatures.split(',').map(s => s.trim()).filter(Boolean);
    const updated = current.includes(feature) ? current.filter(f => f !== feature) : [...current, feature];
    setFormData(prev => ({ ...prev, premiumFeatures: updated.join(', ') }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest border border-blue-100">
               {isEditMode ? <Edit3 className="w-3 h-3" /> : <Building className="w-3 h-3" />}
               {isEditMode ? 'Edit Listing' : 'List Your Property'}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              {isEditMode ? 'Update' : 'Post'} Your <span className="text-blue-600">Property</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-xl">
               List your premium property with ease.
            </p>
          </div>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-4 animate-fade-in ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            <p className="font-bold text-sm">{message.text}</p>
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-10">
            {/* Sections (Basic, Pricing, Specs, Features) simplified for length... using existing logic */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Left Column: Basic & Pricing */}
               <div className="space-y-10">
                  <div className="space-y-6">
                     <div className="flex items-center gap-3"><div className="w-1.5 h-8 bg-blue-600 rounded-full"/><h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Basic Information</h4></div>
                     <div className="space-y-5">
                        <div className="space-y-2"><label className="text-xs font-black text-slate-500 uppercase tracking-widest">Title *</label>
                        <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"/></div>
                        <div className="space-y-2"><label className="text-xs font-black text-slate-500 uppercase tracking-widest">Description *</label>
                        <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm resize-none"/></div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex items-center gap-3"><div className="w-1.5 h-8 bg-blue-600 rounded-full"/><h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Pricing & Location</h4></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><label className="text-xs font-black text-slate-500 uppercase tracking-widest">Price (₹) *</label><input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"/></div>
                        <div className="space-y-2"><label className="text-xs font-black text-slate-500 uppercase tracking-widest">City *</label><select required name="city" value={formData.city} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm">{['Chandigarh', 'Panchkula', 'Mohali', 'Zirakpur', 'Derabassi', 'Lalru', 'Kharar', 'New Chandigarh'].map(city => <option key={city} value={city}>{city}</option>)}</select></div>
                     </div>
                     <div className="space-y-2"><label className="text-xs font-black text-slate-500 uppercase tracking-widest">Full Address / Location</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"/></div>
                  </div>
               </div>

               {/* Right Column: Specifications & Details */}
               <div className="space-y-10">
                  <div className="space-y-6">
                     <div className="flex items-center gap-3"><div className="w-1.5 h-8 bg-blue-600 rounded-full"/><h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Specifications</h4></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><label className="text-xs font-black text-slate-500 uppercase tracking-widest">Type</label><select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm">{['Apartment', 'Villa', 'Plot', 'Commercial', 'Shop', 'Office'].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                        <div className="space-y-2"><label className="text-xs font-black text-slate-500 uppercase tracking-widest">Status</label><select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm">{['For Sale', 'For Rent', 'Commercial', 'New Launch', 'Premium'].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                        <div className="space-y-2"><label className="text-xs font-black text-slate-500 uppercase tracking-widest">BHK</label><input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"/></div>
                        <div className="space-y-2"><label className="text-xs font-black text-slate-500 uppercase tracking-widest">Washrooms</label><input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"/></div>
                        <div className="space-y-2"><label className="text-xs font-black text-slate-500 uppercase tracking-widest">Area (sq.ft)</label><input type="number" name="area" value={formData.area} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"/></div>
                        <div className="space-y-2"><label className="text-xs font-black text-slate-500 uppercase tracking-widest">Furnishing</label><select name="furnishing" value={formData.furnishing} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm">{['Furnished', 'Semi-Furnished', 'Unfurnished'].map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                        <div className="space-y-2"><label className="text-xs font-black text-slate-500 uppercase tracking-widest">Facing</label><select name="facing" value={formData.facing} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm">{['North', 'East', 'South', 'West', 'North-East', 'North-West', 'South-East', 'South-West', 'None'].map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Full Width Section: Additional Details */}
            <div className="space-y-6 pt-8 mt-8 border-t border-slate-100">
               <div className="flex items-center gap-3"><div className="w-1.5 h-8 bg-blue-600 rounded-full"/><h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Additional Details</h4></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><label className="text-xs font-black text-slate-500 uppercase tracking-widest">Built Year</label><input type="number" name="builtYear" value={formData.builtYear} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"/></div>
                        <div className="space-y-2"><label className="text-xs font-black text-slate-500 uppercase tracking-widest">Ready Status</label><select name="readyStatus" value={formData.readyStatus} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm">{['Ready to Move', 'Under Construction'].map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                        
                        <div className="col-span-2 space-y-2">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Location (Google Maps)</label>
                          <div className="relative">
                            <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="text" name="mapLink" value={formData.mapLink} onChange={handleInputChange} placeholder="Paste Maps link or iframe here" className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"/>
                          </div>
                        </div>
                        
                        <div className="col-span-2 space-y-3">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Premium Features</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {amenitiesList.map(feature => {
                              const isSelected = formData.premiumFeatures.split(',').map(s => s.trim()).includes(feature);
                              return (
                                <label key={feature} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                                  <input type="checkbox" checked={isSelected} onChange={() => handleFeatureToggle(feature)} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                  <span className={`text-xs font-bold ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>{feature}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                     </div>
                  </div>

            {/* Images Section - THE NEW PART */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Property Images</h4>
                </div>
                <button type="button" onClick={addImageField} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                  <Plus className="w-4 h-4" /> Add Slot
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    {img ? (
                      <div className="h-48 rounded-[1.5rem] overflow-hidden border-2 border-slate-200 shadow-sm relative">
                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                        
                        {/* Featured Badge */}
                        {idx === 0 && (
                          <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-amber-500/20">
                            <Star className="w-3 h-3 fill-current" /> Featured
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                           {idx !== 0 && (
                             <button type="button" onClick={() => makeFeaturedImage(idx)} className="p-3 bg-amber-500 rounded-xl text-white hover:scale-110 transition-transform" title="Set as Featured">
                               <Star className="w-5 h-5 fill-current" />
                             </button>
                           )}
                           <button type="button" onClick={() => { setActiveImageIndex(idx); fileInputRef.current.click(); }} className="p-3 bg-white rounded-xl text-blue-600 hover:scale-110 transition-transform" title="Edit Image">
                             <Edit3 className="w-5 h-5" />
                           </button>
                           {formData.images.length > 1 && (
                             <button type="button" onClick={() => removeImageField(idx)} className="p-3 bg-red-500 rounded-xl text-white hover:scale-110 transition-transform" title="Delete Image">
                                <Trash2 className="w-5 h-5" />
                             </button>
                           )}
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 rounded-[1.5rem] border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer relative group/empty" onClick={() => setShowOptionsIndex(showOptionsIndex === idx ? null : idx)}>
                        
                        {/* Delete Empty Slot Button */}
                        {formData.images.length > 1 && (
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); removeImageField(idx); }} 
                            className="absolute top-3 right-3 p-2 bg-red-100 text-red-600 rounded-full opacity-0 group-hover/empty:opacity-100 hover:bg-red-500 hover:text-white transition-all z-10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        {uploadingIndex === idx ? (
                          <div className="flex flex-col items-center gap-2 text-blue-600">
                             <Loader2 className="w-8 h-8 animate-spin" />
                             <span className="text-xs font-bold">Uploading...</span>
                          </div>
                        ) : (
                          <>
                             <div className="p-4 bg-white rounded-full shadow-sm text-slate-400 group-hover/empty:text-blue-500 group-hover/empty:scale-110 transition-all">
                                <ImageIcon className="w-8 h-8" />
                             </div>
                             <div className="text-center">
                                <p className="text-sm font-bold text-slate-600">Click to upload image</p>
                                <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest">Or paste URL</p>
                             </div>
                          </>
                        )}
                        
                       {showOptionsIndex === idx && (
                          <div className="absolute inset-x-2 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-[50] animate-in slide-in-from-top-2" onClick={e => e.stopPropagation()}>
                             <input type="text" value={img} onChange={(e) => handleImageChange(idx, e.target.value)} placeholder="Paste Image URL" className="w-full px-4 py-2 mb-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:border-blue-500" />
                             <div className="grid grid-cols-2 gap-2">
                               <button type="button" onClick={() => { setActiveImageIndex(idx); setShowOptionsIndex(null); cameraInputRef.current.click(); }} className="flex flex-col items-center gap-1 p-2 hover:bg-blue-50 rounded-xl text-[10px] font-black text-slate-700">
                                  <Camera className="w-5 h-5 text-blue-600" /> Camera
                               </button>
                               <button type="button" onClick={() => { setActiveImageIndex(idx); setShowOptionsIndex(null); fileInputRef.current.click(); }} className="flex flex-col items-center gap-1 p-2 hover:bg-emerald-50 rounded-xl text-[10px] font-black text-slate-700">
                                  <ImageIcon className="w-5 h-5 text-emerald-600" /> Gallery
                               </button>
                             </div>
                          </div>
                       )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <input type="file" ref={fileInputRef} onChange={(e) => onFileSelect(e, activeImageIndex)} accept="image/*" className="hidden" />
              <input type="file" ref={cameraInputRef} onChange={(e) => onFileSelect(e, activeImageIndex)} accept="image/*" capture="environment" className="hidden" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
               <button 
                 type="button" 
                 onClick={() => saveProperty(true, false)} 
                 disabled={formLoading} 
                 className="w-full sm:w-1/3 py-5 rounded-2xl bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-black text-lg transition-all flex items-center justify-center gap-3"
               >
                 Save as Draft
               </button>
               <button 
                 type="submit" 
                 disabled={formLoading} 
                 className="w-full sm:w-2/3 py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
               >
                 {formLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                 {formLoading ? 'Saving Property...' : 'Publish Property'}
               </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostProperty;
