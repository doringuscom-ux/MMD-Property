import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BASE_URL } from '../api';
import { Calendar, User, ArrowRight, FileText } from 'lucide-react';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchBlogs = async () => {
            try {
                // By default, backend sends only published blogs when showAll is not true
                const res = await fetch(`${BASE_URL}/blogs`);
                if (res.ok) {
                    const data = await res.json();
                    setBlogs(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className="font-sans bg-slate-50 min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center mb-16 animate-fade-in">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Our Latest Real Estate Insights</h1>
                        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">Stay up to date with the latest news, tips, and trends in the real estate market.</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">No Articles Yet</h3>
                            <p className="text-slate-500 mt-2">Check back soon for our latest updates!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog, idx) => (
                                <Link to={`/blog/${blog._id}`} key={blog._id} className="group block animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className="relative h-64 mb-6 rounded-[2rem] overflow-hidden shadow-sm">
                                        {blog.image ? (
                                            <img 
                                                src={blog.image} 
                                                alt={blog.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-700 ease-out">
                                                <FileText className="w-12 h-12 text-slate-400" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-black text-blue-600 shadow-sm">
                                                {blog.category || 'Real Estate'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-sm font-bold text-slate-400 mb-4 px-1">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" /> 
                                            {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-4 h-4" /> 
                                            By {blog.author}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-2xl font-black text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors px-1">
                                        {blog.title}
                                    </h3>
                                    
                                    <p className="text-slate-500 line-clamp-2 text-lg font-medium px-1 leading-relaxed">
                                        {blog.content}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />

            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.6s ease-out forwards; opacity: 0; }
            `}</style>
        </div>
    );
};

export default Blog;
