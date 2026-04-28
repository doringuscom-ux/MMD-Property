import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Building2, XCircle } from 'lucide-react';
import { BASE_URL } from '../api';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.role === 'admin' || user.role === 'sub-admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        if (data.role === 'admin' || data.role === 'sub-admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-[1100px] bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 overflow-hidden flex flex-col lg:flex-row relative z-10 border border-white">
        {/* Left Side: Branding & Image */}
        <div className="lg:w-[45%] bg-[#0F172A] p-12 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute inset-0 opacity-20">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000" alt="Premium Property" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent" />
           </div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-12">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/40">
                    <Building2 className="w-7 h-7" />
                 </div>
                 <span className="text-2xl font-black tracking-tight">MMD Property</span>
              </div>
              <h1 className="text-4xl font-black leading-tight mb-6">Experience the Next Level of <span className="text-blue-500">Real Estate</span> Management.</h1>
              <p className="text-slate-400 font-medium leading-relaxed max-w-sm">Join thousands of property owners who trust Maa Mansa Devi Property for their premium real estate needs.</p>
           </div>

           <div className="relative z-10 mt-12">
              <div className="flex -space-x-4 mb-4">
                 {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="w-10 h-10 rounded-full border-4 border-[#0F172A]" alt="" />
                 ))}
                 <div className="w-10 h-10 rounded-full border-4 border-[#0F172A] bg-blue-600 flex items-center justify-center text-[10px] font-black">+2k</div>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trusted by 2,000+ happy clients</p>
           </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 p-12 lg:p-20 bg-white">
           <div className="max-w-md mx-auto">
              <div className="mb-12">
                 <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back!</h2>
                 <p className="text-slate-500 font-medium">Please enter your details to access your account.</p>
              </div>

              {error && (
                 <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-3 animate-shake">
                    <XCircle className="w-5 h-5" /> {error}
                 </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                    <div className="relative group">
                       <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                       <input 
                         required 
                         type="email" 
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         placeholder="admin@mmdproperty.com" 
                         className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                       <Link to="#" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Forgot?</Link>
                    </div>
                    <div className="relative group">
                       <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                       <input 
                         required 
                         type={showPassword ? "text" : "password"} 
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         placeholder="••••••••" 
                         className="w-full pl-14 pr-14 py-4.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm"
                       />
                       <button 
                         type="button"
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                       >
                         {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                       </button>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 py-2">
                    <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="remember" className="text-sm font-bold text-slate-600 cursor-pointer">Remember me for 30 days</label>
                 </div>

                 <button 
                   disabled={isLoading}
                   className="w-full py-4.5 rounded-2xl bg-slate-900 text-white font-black text-sm shadow-2xl shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                 >
                   {isLoading ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : (
                     <>Sign In <ArrowRight className="w-5 h-5" /></>
                   )}
                 </button>
              </form>

              <div className="mt-12 text-center">
                 <p className="text-slate-500 font-bold text-sm">
                   Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Create an account</Link>
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
