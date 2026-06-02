import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BASE_URL } from '../api';
import { Calendar, User, ArrowLeft, FileText, Share2 } from 'lucide-react';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchBlog = async () => {
            try {
                const res = await fetch(`${BASE_URL}/blogs/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setBlog(data);
                } else {
                    navigate('/blogs');
                }
            } catch (error) {
                console.error(error);
                navigate('/blogs');
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex justify-center items-center">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!blog) return null;

    return (
        <div className="font-sans bg-slate-50 min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-1 pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
                    
                    <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4" /> Back to all articles
                    </Link>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 md:p-12 border-b border-slate-100">
                            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
                                    <Calendar className="w-4 h-4 text-blue-600" /> {new Date(blog.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
                                    <User className="w-4 h-4 text-blue-600" /> {blog.author}
                                </div>
                            </div>
                            
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-8">
                                {blog.title}
                            </h1>

                            <div className="flex items-center gap-4">
                                <button className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors" title="Share article">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {blog.image && (
                            <div className="w-full aspect-[21/9] overflow-hidden bg-slate-100">
                                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="p-8 md:p-12 prose prose-slate max-w-none prose-headings:font-black prose-p:font-medium prose-p:text-slate-600 prose-a:text-blue-600 hover:prose-a:text-blue-700">
                            {/* Simple text rendering. In a real app, you might use a markdown renderer or dangerouslySetInnerHTML if using a rich text editor */}
                            {blog.content.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-6 leading-relaxed whitespace-pre-wrap">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                    
                </div>
            </main>

            <Footer />
            
            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default BlogDetail;
