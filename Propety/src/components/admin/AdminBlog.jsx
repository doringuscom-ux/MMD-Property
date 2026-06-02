import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, User, FileText } from 'lucide-react';
import { BASE_URL } from '../../api';
import AdminBlogModal from './AdminBlogModal';

const AdminBlog = ({ showToast }) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '',
        author: 'Admin',
        category: 'Real Estate',
        published: true
    });

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/blogs?showAll=true`);
            if (response.ok) {
                const data = await response.json();
                setBlogs(data);
            }
        } catch (error) {
            console.error(error);
            showToast('error', 'Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'select-one' && name === 'published' ? value === 'true' : value
        }));
    };

    const openAddModal = () => {
        setEditingBlog(null);
        setFormData({ title: '', content: '', image: '', author: 'Admin', category: 'Real Estate', published: true });
        setShowModal(true);
    };

    const openEditModal = (blog) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title,
            content: blog.content,
            image: blog.image,
            author: blog.author,
            category: blog.category || 'Real Estate',
            published: blog.published
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const url = editingBlog ? `${BASE_URL}/blogs/${editingBlog._id}` : `${BASE_URL}/blogs`;
            const method = editingBlog ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo?.token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showToast('success', `Blog ${editingBlog ? 'updated' : 'created'} successfully`);
                setShowModal(false);
                fetchBlogs();
            } else {
                showToast('error', 'Failed to save blog');
            }
        } catch (error) {
            console.error(error);
            showToast('error', 'Something went wrong');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const response = await fetch(`${BASE_URL}/blogs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${userInfo?.token}` }
            });

            if (response.ok) {
                showToast('success', 'Blog deleted');
                fetchBlogs();
            } else {
                showToast('error', 'Failed to delete blog');
            }
        } catch (error) {
            console.error(error);
            showToast('error', 'Something went wrong');
        }
    };

    return (
        <>
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-black text-slate-900">Manage Blogs</h3>
                    <p className="text-slate-500 font-medium">Create and manage your blog posts</p>
                </div>
                <button onClick={openAddModal} className="px-6 py-3.5 rounded-2xl bg-blue-600 text-white font-black text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Add Blog
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-10 h-10 text-slate-400" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">No Blogs Found</h4>
                        <p className="text-slate-500">Get started by creating your first blog post.</p>
                        <button onClick={openAddModal} className="mt-6 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
                            Create Blog
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Blog</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Author</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {blogs.map(blog => (
                                    <tr key={blog._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                                    {blog.image ? (
                                                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FileText className="w-6 h-6 m-auto mt-3 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 line-clamp-1">{blog.title}</p>
                                                    <p className="text-xs text-slate-500 line-clamp-1">{blog.content.substring(0, 50)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                                <User className="w-4 h-4 text-slate-400" /> {blog.author}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                                                blog.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {blog.published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                                <Calendar className="w-4 h-4 text-slate-400" /> 
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(blog)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(blog._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
        <AdminBlogModal 
            showModal={showModal}
            setShowModal={setShowModal}
            editingBlog={editingBlog}
            handleSubmit={handleSubmit}
            formLoading={formLoading}
            formData={formData}
            handleInputChange={handleInputChange}
            setFormData={setFormData}
        />
        </>
    );
};

export default AdminBlog;
