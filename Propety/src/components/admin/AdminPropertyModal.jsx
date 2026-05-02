import { X, Edit2, Plus, Loader2, Image as ImageIcon, Trash2, MapPin, Sparkles, Building, Calendar, Move } from 'lucide-react';

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
  if (!showModal) return null;

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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Sector / Area / Society *</label>
                  <input required type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. Sector 20 or Peer Muchalla" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-600 outline-none transition-all font-bold text-sm" />
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
                  <Plus className="w-4 h-4" /> Add Image URL
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="flex gap-2 group">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" value={img} onChange={(e) => handleImageChange(idx, e.target.value)} placeholder="Paste image URL here..." className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-medium text-xs focus:border-blue-600 transition-all" />
                    </div>
                    <button type="button" onClick={() => removeImageField(idx)} className="p-3.5 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
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
    </div>
  );
};

export default AdminPropertyModal;
