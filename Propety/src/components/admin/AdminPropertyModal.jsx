import { useState, useRef } from 'react';
import { X, Edit2, Plus, Loader2, Image as ImageIcon, Trash2, MapPin, Sparkles, Building, Calendar, Move, Camera, RefreshCw, CheckCircle2 } from 'lucide-react';
import { BASE_URL } from '../../api';
import { useAppStatus } from '../../hooks/useAppStatus';

const AdminPropertyModal = ({
  showModal,
  setShowModal,
  editingProperty,
  handleSubmit,
  formLoading,
  formData,
  handleInputChange,
  handleImageChange,
  addImageField,
  removeImageField
}) => {
  const { isDone } = useAppStatus();
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [showOptionsIndex, setShowOptionsIndex] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  if (!showModal) return null;

  // --- Camera Logic ---
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
      
      // Use timeout to ensure videoRef is available
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch (err) {
      console.error("Camera Error:", err);
      alert('Could not access camera');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
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

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)} />
      <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-zoom-in">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${editingProperty ? 'bg-blue-600' : 'bg-emerald-600'} text-white shadow-lg`}>
              {editingProperty ? <Edit2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">{editingProperty ? 'Edit Property' : 'Add New Property'}</h3>
              <p className="text-slate-500 text-sm font-medium">Complete all details for a premium listing</p>
            </div>
          </div>
          <button onClick={() => setShowModal(false)} className="p-3 rounded-xl hover:bg-slate-50 text-slate-400 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-12">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-l-4 border-blue-600 pl-4">Basic Information</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Property Title *</label>
                  <input required type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Premium 3BHK Villa" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-600 outline-none transition-all font-bold text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Description *</label>
                  <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="Detailed description..." className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-600 outline-none transition-all font-bold text-sm resize-none" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-l-4 border-blue-600 pl-4">Pricing & Location</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Price (₹) *</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g. 7500000" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-600 outline-none transition-all font-bold text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">City *</label>
                  <select required name="city" value={formData.city} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm focus:border-blue-600 transition-all">
                    {['Chandigarh', 'Panchkula', 'Mohali', 'Zirakpur', 'Derabassi', 'Lalru', 'Kharar', 'New Chandigarh'].map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Sector / Area / Society</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. Sector 20 or Peer Muchalla" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-600 outline-none transition-all font-bold text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Type</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm">
                    {['Apartment', 'Villa', 'Plot', 'Office', 'Studio', 'Penthouse', 'Project', 'Commercial'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Listing Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm">
                    {['For Sale', 'For Rent', 'New Launch'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Admin Visibility Status</label>
                  <select name="adminStatus" value={formData.adminStatus} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-blue-50 border-2 border-blue-100 focus:border-blue-600 outline-none font-bold text-sm text-blue-600">
                    {['Published', 'Pending', 'Draft'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Detailed Specifications */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-l-4 border-blue-600 pl-4">Property Specifications</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Bedrooms</label>
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Washrooms</label>
                <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Build Area (sq.ft)</label>
                <input type="number" name="area" value={formData.area} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Furnishing</label>
                <select name="furnishing" value={formData.furnishing} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm">
                  {['Unfurnished', 'Semi-Furnished', 'Furnished'].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Floor</label>
                <input type="text" name="floor" value={formData.floor} onChange={handleInputChange} placeholder="e.g. 2nd of 4" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Facing</label>
                <select name="facing" value={formData.facing} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm">
                  {['None', 'North', 'East', 'South', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Built Year</label>
                <input type="number" name="builtYear" value={formData.builtYear} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm" />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Ready Status</label>
                <select name="readyStatus" value={formData.readyStatus} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-emerald-50 border-emerald-100 text-emerald-700 outline-none font-bold text-sm">
                  {['Ready to Move', 'Under Construction'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Premium Features & Highlights */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-l-4 border-blue-600 pl-4">Premium Features & Highlights</h4>
               <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>
            <textarea 
              name="premiumFeatures" 
              value={formData.premiumFeatures} 
              onChange={handleInputChange} 
              rows="3" 
              placeholder="e.g. Private Pool, Home Theater, Modular Kitchen, Gated Security, Club House..." 
              className="w-full px-6 py-5 rounded-[2rem] bg-amber-50/30 border border-amber-100 focus:border-amber-400 outline-none transition-all font-medium text-sm text-amber-900" 
            />
          </div>

          {/* Section 4: Media & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-l-4 border-blue-600 pl-4">Property Images</h4>
                <button type="button" onClick={addImageField} className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform">
                  <Plus className="w-4 h-4" /> Add Image Slot
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="flex gap-2 group items-start">
                    <div className="flex-1 space-y-2">
                       <div className="relative group/input">
                          <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="text" value={img} onChange={(e) => handleImageChange(idx, e.target.value)} placeholder="Image URL or Upload..." className={`w-full pl-11 ${isDone ? 'pr-24' : 'pr-4'} py-3.5 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-medium text-xs focus:border-blue-600 transition-all`} />
                          
                          {isDone && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                               <button 
                                 type="button" 
                                 onClick={() => setShowOptionsIndex(showOptionsIndex === idx ? null : idx)}
                                 className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                               >
                                 {uploadingIndex === idx ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
                               </button>
                            </div>
                          )}

                          {/* Mini Options Menu */}
                          {isDone && showOptionsIndex === idx && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-[200] animate-in slide-in-from-top-2">
                               <button type="button" onClick={() => startCamera(idx)} className="w-full flex items-center gap-2 p-2 hover:bg-blue-50 rounded-xl text-[10px] font-black text-slate-700">
                                  <Camera className="w-3 h-3 text-blue-600" /> Take Photo
                               </button>
                               <button type="button" onClick={() => { setActiveImageIndex(idx); fileInputRef.current.click(); }} className="w-full flex items-center gap-2 p-2 hover:bg-emerald-50 rounded-xl text-[10px] font-black text-slate-700">
                                  <ImageIcon className="w-3 h-3 text-emerald-600" /> From Gallery
                               </button>
                            </div>
                          )}
                       </div>
                    </div>
                    <button type="button" onClick={() => removeImageField(idx)} className="p-3.5 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <input type="file" ref={fileInputRef} onChange={(e) => onFileSelect(e, activeImageIndex)} accept="image/*" className="hidden" />
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-l-4 border-blue-600 pl-4">Google Map Integration</h4>
              <div className="space-y-3">
                <div className="relative">
                   <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                   <textarea 
                    name="mapLink" 
                    value={formData.mapLink} 
                    onChange={handleInputChange} 
                    rows="4" 
                    placeholder="Paste the <iframe...> code from Google Maps here" 
                    className="w-full pl-11 pr-4 py-4 rounded-[2rem] bg-slate-50 border border-slate-100 focus:border-blue-600 outline-none transition-all font-medium text-xs resize-none" 
                   />
                </div>
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                   <p className="text-[10px] font-bold text-blue-800 leading-relaxed italic">
                     Tip: Go to Google Maps → Share → Embed a map → Copy HTML
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-8 border-t border-slate-50 flex items-center justify-end gap-4 sticky bottom-0 bg-white z-10 pb-4">
            <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 rounded-2xl border border-slate-200 text-slate-500 font-black text-sm hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" disabled={formLoading} className={`px-12 py-4 rounded-2xl bg-slate-900 text-white font-black text-sm shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center gap-3 ${formLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-slate-800'}`}>
              {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingProperty ? 'Update Property' : 'Publish Property Listing'}
            </button>
          </div>
        </form>
      </div>

      {/* --- SHARED CAMERA MODAL --- */}
      {showCameraModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md" onClick={stopCamera}></div>
          <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Camera className="w-6 h-6 text-blue-600" /> Capture Property Image
              </h3>
              <button onClick={stopCamera} className="p-2 hover:bg-slate-100 rounded-2xl transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="relative bg-slate-100 aspect-video flex items-center justify-center overflow-hidden">
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
    </div>
  );
};

export default AdminPropertyModal;
