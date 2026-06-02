import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { BASE_URL } from '../../api';

const AdminBlogModal = ({ showModal, setShowModal, editingBlog, handleSubmit, formLoading, formData, handleInputChange, setFormData }) => {
    if (!showModal) return null;

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch(`${BASE_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userInfo?.token}`
                },
                body: uploadData
            });
            const data = await res.json();
            if (res.ok) {
                setFormData(prev => ({ ...prev, image: data.url }));
            } else {
                alert('Image upload failed');
            }
        } catch (error) {
            console.error(error);
            alert('Upload error');
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 py-12 sm:p-8 md:p-16">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-full min-h-0 overflow-hidden animate-fade-in">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-900">{editingBlog ? 'Edit Blog' : 'Add New Blog'}</h3>
                    <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <form id="blogForm" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                                placeholder="Enter blog title"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Content</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                required
                                rows="8"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium resize-none"
                                placeholder="Write your blog content here..."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Author</label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                                    placeholder="e.g. Admin"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                                    placeholder="e.g. Real Estate"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Status</label>
                                <select
                                    name="published"
                                    value={formData.published}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                                >
                                    <option value={true}>Published</option>
                                    <option value={false}>Draft</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Cover Image</label>
                            
                            <div className="flex items-center gap-4">
                                {formData.image ? (
                                    <div className="relative w-32 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 border-slate-200 group">
                                        <img src={formData.image} alt="Cover" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                            className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-32 h-24 flex-shrink-0 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50">
                                        <ImageIcon className="w-8 h-8 text-slate-400" />
                                    </div>
                                )}
                                
                                <div className="flex-1 space-y-3">
                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-sm"
                                        placeholder="Or paste image URL here"
                                    />
                                    <div className="relative">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <button type="button" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all">
                                            <Upload className="w-4 h-4" /> Upload Image
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        form="blogForm"
                        type="submit"
                        disabled={formLoading}
                        className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        {formLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {editingBlog ? 'Save Changes' : 'Create Blog'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminBlogModal;
