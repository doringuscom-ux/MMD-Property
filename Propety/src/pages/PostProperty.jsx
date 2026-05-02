import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  X, Plus, Loader2, Image as ImageIcon, Trash2, MapPin, 
  Sparkles, Building, Calendar, CheckCircle2, AlertCircle, Edit3
} from 'lucide-react';
import { BASE_URL } from '../api';

const PostProperty = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState(null);

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

  // Fetch property data for editing
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

  const showToast = (type, text) => {
    setMessage({ type, text });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (type === 'success') {
        setTimeout(() => navigate('/my-properties'), 2000);
    } else {
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    if (!formData.title || !formData.price || !formData.location) {
      showToast('error', 'Title, Price & Location are required');
      setFormLoading(false);
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const url = isEditMode ? `${BASE_URL}/properties/${id}` : `${BASE_URL}/properties`;
      const method = isEditMode ? 'PUT' : 'POST';

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }

      const isAdminUser = user?.role === 'admin' || user?.role === 'sub-admin';
      const successMsg = isEditMode 
        ? (isAdminUser ? 'Property updated successfully!' : 'Property updated successfully! It will be reviewed again by admin.')
        : (isAdminUser ? 'Property published successfully!' : 'Property submitted successfully! It will be visible to everyone once approved by admin.');
      
      showToast('success', successMsg);
    } catch (error) {
      console.error(error);
      showToast('error', error.message || 'Something went wrong.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-32 pb-20">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
               {isEditMode ? <Edit3 className="w-3 h-3" /> : <Building className="w-3 h-3" />}
               {isEditMode ? 'Edit Listing' : 'List Your Property'}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              {isEditMode ? 'Update' : 'Post'} Your <span className="text-blue-600">Property</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-xl">
              {isEditMode 
                ? 'Update your property details below.' 
                : (user?.role === 'admin' || user?.role === 'sub-admin' 
                    ? 'Admin: Enter the details to publish a new property listing immediately.' 
                    : 'Fill in the details below to list your property. Our team will verify and publish it within 24-48 hours.')}
            </p>
          </div>
        </div>

        {/* Message Toast */}
        {message.text && (
          <div className={`mb-8 p-5 rounded-3xl flex items-center gap-4 animate-fade-in ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            <p className="font-bold">{message.text}</p>
          </div>
        )}

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-16">
            {/* Section 1: Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Basic Information</h4>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Property Title *</label>
                    <input required type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Premium 3BHK Villa in Sector 20" className="w-full px-6 py-4.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-bold text-sm shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Description *</label>
                    <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="5" placeholder="Tell us more about the property, amenities, nearby locations..." className="w-full px-6 py-4.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-bold text-sm resize-none shadow-sm" />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Pricing & Location</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Price (₹) *</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g. 7500000" className="w-full px-6 py-4.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-bold text-sm shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">City *</label>
                    <select required name="city" value={formData.city} onChange={handleInputChange} className="w-full px-6 py-4.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none font-bold text-sm shadow-sm">
                      {['Chandigarh', 'Panchkula', 'Mohali', 'Zirakpur', 'Derabassi', 'Lalru', 'Kharar', 'New Chandigarh'].map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Sector / Area *</label>
                    <input required type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. Sector 20" className="w-full px-6 py-4.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-bold text-sm shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Property Type</label>
                    <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full px-6 py-4.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none font-bold text-sm shadow-sm">
                      {['Apartment', 'Villa', 'Plot', 'Office', 'Studio', 'Penthouse', 'Project', 'Commercial'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Listing For</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-6 py-4.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none font-bold text-sm shadow-sm">
                      {['For Sale', 'For Rent', 'New Launch'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Detailed Specs */}
            <div className="space-y-10">
              <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                  <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Property Specifications</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {[
                  { label: 'Bedrooms', name: 'bedrooms', type: 'number' },
                  { label: 'Washrooms', name: 'bathrooms', type: 'number' },
                  { label: 'Build Area (sq.ft)', name: 'area', type: 'number' },
                  { label: 'Floor', name: 'floor', type: 'text', placeholder: 'e.g. 2nd of 4' },
                  { label: 'Built Year', name: 'builtYear', type: 'number' },
                ].map((field) => (
                  <div key={field.name} className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">{field.label}</label>
                    <input 
                      type={field.type} 
                      name={field.name} 
                      value={formData[field.name]} 
                      onChange={handleInputChange} 
                      placeholder={field.placeholder}
                      className="w-full px-6 py-4.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none font-bold text-sm shadow-sm" 
                    />
                  </div>
                ))}
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Furnishing</label>
                  <select name="furnishing" value={formData.furnishing} onChange={handleInputChange} className="w-full px-6 py-4.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none font-bold text-sm shadow-sm">
                    {['Unfurnished', 'Semi-Furnished', 'Furnished'].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Facing</label>
                  <select name="facing" value={formData.facing} onChange={handleInputChange} className="w-full px-6 py-4.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none font-bold text-sm shadow-sm">
                    {['None', 'North', 'East', 'South', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Construction Status</label>
                  <select name="readyStatus" value={formData.readyStatus} onChange={handleInputChange} className="w-full px-6 py-4.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none font-bold text-sm shadow-sm">
                    {['Ready to Move', 'Under Construction'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Premium Features */}
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Premium Features</h4>
                </div>
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Amenities & Highlights</label>
                <textarea 
                  name="premiumFeatures" 
                  value={formData.premiumFeatures} 
                  onChange={handleInputChange} 
                  rows="3" 
                  placeholder="e.g. Private Pool, Modular Kitchen, Gated Security, Club House, 24/7 Power Backup..." 
                  className="w-full px-8 py-6 rounded-[2.5rem] bg-amber-50/20 border border-amber-100 focus:bg-white focus:border-amber-400 outline-none transition-all font-medium text-sm text-amber-900 shadow-sm" 
                />
              </div>
            </div>

            {/* Section 4: Images */}
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Property Images</h4>
                </div>
                <button type="button" onClick={addImageField} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                  <Plus className="w-4 h-4" /> Add Image URL
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="text" value={img} onChange={(e) => handleImageChange(idx, e.target.value)} placeholder="Paste image URL here..." className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white outline-none font-medium text-xs focus:border-blue-600 transition-all shadow-sm" />
                    </div>
                    {formData.images.length > 1 && (
                      <button type="button" onClick={() => removeImageField(idx)} className="p-4.5 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 max-w-lg">
                  <AlertCircle className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">
                    {user?.role === 'admin' || user?.role === 'sub-admin' 
                      ? 'Admin Mode: This property will be published immediately and marked as verified.' 
                      : 'By submitting, you agree to our terms. Your property will be reviewed by our admin team before being made public.'}
                  </p>
               </div>
               <button type="submit" disabled={formLoading} className={`w-full md:w-auto px-16 py-5 rounded-[2rem] bg-slate-900 text-white font-black text-base shadow-2xl shadow-slate-900/30 active:scale-95 transition-all flex items-center justify-center gap-4 ${formLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600 hover:shadow-blue-600/30'}`}>
                {formLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isEditMode ? <Edit3 className="w-6 h-6" /> : <Building className="w-6 h-6" />)}
                {formLoading ? 'Saving...' : (isEditMode ? 'Update Property Listing' : 'Publish Property Listing')}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
      
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { bg: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { bg: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default PostProperty;
