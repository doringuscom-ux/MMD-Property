import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  X, Plus, Loader2, Image as ImageIcon, Trash2, MapPin, 
  Sparkles, Building, Calendar, CheckCircle2, AlertCircle, Edit3, Camera, RefreshCw
} from 'lucide-react';
import { BASE_URL } from '../api';
import { useAppStatus } from '../hooks/useAppStatus';

const PostProperty = () => {
  const { isDone } = useAppStatus();
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState(null);

  // Upload/Camera States
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [showOptionsIndex, setShowOptionsIndex] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

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

  // --- Camera & Upload Logic ---
  const startCamera = async (index) => {
    try {
      setActiveImageIndex(index);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1080 }, height: { ideal: 1080 } } 
      });
      setCameraStream(stream);
      setShowCameraModal(true);
      setShowOptionsIndex(null);
      setCapturedImage(null);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
    } catch (err) {
      alert('Could not access camera');
    }
  };

  const stopCamera = () => {
    if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
    setCameraStream(null);
    setShowCameraModal(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL('image/jpeg'));
    }
  };

  const handleUploadCaptured = async () => {
    if (!capturedImage) return;
    const index = activeImageIndex;
    stopCamera();
    setUploadingIndex(index);
    const res = await fetch(capturedImage);
    const blob = await res.blob();
    const file = new File([blob], `prop-${Date.now()}.jpg`, { type: "image/jpeg" });
    await uploadFile(file, index);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    if (!formData.title || !formData.price) {
      showToast('error', 'Title & Price are required');
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
               List your premium property with ease.
            </p>
          </div>
        </div>

        {message.text && (
          <div className={`mb-8 p-5 rounded-3xl flex items-center gap-4 animate-fade-in ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            <p className="font-bold">{message.text}</p>
          </div>
        )}

        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-16">
            {/* Sections (Basic, Pricing, Specs, Features) simplified for length... using existing logic */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               {/* Left Column: Basic & Pricing */}
               <div className="space-y-12">
                  <div className="space-y-8">
                     <div className="flex items-center gap-3"><div className="w-1.5 h-8 bg-blue-600 rounded-full"/><h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Basic Information</h4></div>
                     <div className="space-y-6">
                        <div className="space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Title *</label>
                        <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-blue-600"/></div>
                        <div className="space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Description *</label>
                        <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-blue-600 resize-none"/></div>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="flex items-center gap-3"><div className="w-1.5 h-8 bg-blue-600 rounded-full"/><h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Pricing & Location</h4></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Price (₹) *</label><input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-blue-600"/></div>
                        <div className="space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">City *</label><select required name="city" value={formData.city} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-blue-600">{['Chandigarh', 'Panchkula', 'Mohali', 'Zirakpur', 'Derabassi', 'Lalru', 'Kharar', 'New Chandigarh'].map(city => <option key={city} value={city}>{city}</option>)}</select></div>
                     </div>
                     <div className="space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Full Address / Location</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-blue-600"/></div>
                  </div>
               </div>

               {/* Right Column: Specifications & Details */}
               <div className="space-y-12">
                  <div className="space-y-8">
                     <div className="flex items-center gap-3"><div className="w-1.5 h-8 bg-blue-600 rounded-full"/><h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Specifications</h4></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Type</label><select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-blue-600">{['Apartment', 'Villa', 'Plot', 'Commercial', 'Shop', 'Office'].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                        <div className="space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</label><select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-blue-600">{['For Sale', 'For Rent', 'Commercial', 'New Launch', 'Premium'].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                        <div className="space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">BHK</label><input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-blue-600"/></div>
                        <div className="space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Area (sq.ft)</label><input type="number" name="area" value={formData.area} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-blue-600"/></div>
                        <div className="space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Furnishing</label><select name="furnishing" value={formData.furnishing} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-blue-600">{['Furnished', 'Semi-Furnished', 'Unfurnished'].map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                        <div className="space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Facing</label><select name="facing" value={formData.facing} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-blue-600">{['North', 'East', 'South', 'West', 'North-East', 'North-West', 'South-East', 'South-West', 'None'].map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="flex items-center gap-3"><div className="w-1.5 h-8 bg-blue-600 rounded-full"/><h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Additional Details</h4></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Built Year</label><input type="number" name="builtYear" value={formData.builtYear} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-blue-600"/></div>
                        <div className="space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Ready Status</label><select name="readyStatus" value={formData.readyStatus} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-blue-600">{['Ready to Move', 'Under Construction'].map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                        <div className="col-span-2 space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Google Maps Link / Iframe</label><input type="text" name="mapLink" value={formData.mapLink} onChange={handleInputChange} placeholder="Paste google maps link or iframe here" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-blue-600"/></div>
                        <div className="col-span-2 space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Premium Features (Separated by comma)</label><input type="text" name="premiumFeatures" value={formData.premiumFeatures} onChange={handleInputChange} placeholder="Gym, Pool, Parking, etc." className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-blue-600"/></div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Images Section - THE NEW PART */}
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Property Images</h4>
                </div>
                <button type="button" onClick={addImageField} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                  <Plus className="w-4 h-4" /> Add Image Slot
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="space-y-4 group">
                    <div className="relative">
                       <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                       <input 
                         type="text" 
                         value={img} 
                         onChange={(e) => handleImageChange(idx, e.target.value)} 
                         placeholder="Image URL or Click Camera to Upload" 
                         className={`w-full pl-14 ${isDone ? 'pr-32' : 'pr-6'} py-5 rounded-[2rem] bg-slate-50 border border-slate-100 focus:bg-white outline-none font-bold text-xs focus:border-blue-600 transition-all shadow-sm`} 
                       />
                       {isDone && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                           <button 
                             type="button" 
                             onClick={() => setShowOptionsIndex(showOptionsIndex === idx ? null : idx)}
                             className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                           >
                             {uploadingIndex === idx ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                           </button>
                           {formData.images.length > 1 && (
                             <button type="button" onClick={() => removeImageField(idx)} className="p-3 bg-red-50 rounded-2xl text-red-600 hover:bg-red-600 hover:text-white transition-all">
                                <Trash2 className="w-4 h-4" />
                             </button>
                           )}
                        </div>
                       )}

                       {showOptionsIndex === idx && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-2 z-[50] animate-in slide-in-from-top-2">
                             <button type="button" onClick={() => startCamera(idx)} className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-2xl text-xs font-black text-slate-700">
                                <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><Camera className="w-4 h-4" /></div>
                                Take Photo
                             </button>
                             <button type="button" onClick={() => { setActiveImageIndex(idx); fileInputRef.current.click(); }} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-2xl text-xs font-black text-slate-700">
                                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600"><ImageIcon className="w-4 h-4" /></div>
                                From Gallery
                             </button>
                          </div>
                       )}
                    </div>
                    {img && (
                      <div className="h-32 rounded-[2rem] overflow-hidden border border-slate-100">
                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <input type="file" ref={fileInputRef} onChange={(e) => onFileSelect(e, activeImageIndex)} accept="image/*" className="hidden" />
            </div>

            <button type="submit" disabled={formLoading} className="w-full py-6 rounded-[2.5rem] bg-slate-900 text-white font-black text-lg shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-4">
              {formLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
              {formLoading ? 'Saving...' : 'Submit Property for Verification'}
            </button>
          </form>
        </div>
      </main>

      {/* Shared Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md" onClick={stopCamera}></div>
          <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><Camera className="w-6 h-6 text-blue-600" /> Take Photo</h3>
              <button onClick={stopCamera} className="p-2 hover:bg-slate-100 rounded-2xl"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <div className="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
              {!capturedImage ? (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              ) : (
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="p-8 flex flex-col items-center gap-4">
              {!capturedImage ? (
                <button onClick={capturePhoto} className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-xl border-4 border-blue-50">
                  <div className="w-14 h-14 bg-white rounded-full"></div>
                </button>
              ) : (
                <div className="flex gap-4 w-full">
                  <button onClick={() => setCapturedImage(null)} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black flex items-center justify-center gap-2"><RefreshCw className="w-5 h-5" /> Retake</button>
                  <button onClick={handleUploadCaptured} className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5" /> Use This Photo</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PostProperty;
