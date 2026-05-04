import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, Building2, CheckCircle2, XCircle, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { BASE_URL } from '../api';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }
    setOtpLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${BASE_URL}/users/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setIsOtpSent(true);
        setMessage('OTP sent to your email!');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isOtpSent) {
      setError('Please verify your email with OTP first');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, otp })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate('/');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-600/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[150px]" />

      <div className="w-full max-w-[1100px] bg-white rounded-[3.5rem] shadow-2xl shadow-blue-900/5 overflow-hidden flex flex-col lg:flex-row relative z-10 border border-white">
        {/* Right Side: Visual Content (Mirrored for Signup) */}
        <div className="lg:w-[45%] bg-[#0F172A] p-12 text-white flex flex-col justify-between relative order-last lg:order-first overflow-hidden">
           <div className="absolute inset-0 opacity-30">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000" alt="Modern Architecture" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]" />
           </div>

           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-12">
                 <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-600/40">
                    <Building2 className="w-7 h-7" />
                 </div>
                 <span className="text-2xl font-black tracking-tight">MMD Property</span>
              </div>
              <h1 className="text-4xl font-black leading-tight mb-8">Start Your <span className="text-emerald-500">Premium</span> Journey with Us.</h1>
              
              <div className="space-y-6">
                 {[
                   "Access Exclusive Off-Market Listings",
                   "Real-time Property Alerts & Updates",
                   "Direct Connect with verified Agents",
                   "Secure Document Management"
                 ].map((text, idx) => (
                   <div key={idx} className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                         <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-sm font-bold text-slate-300">{text}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="relative z-10 bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 mt-12">
              <p className="text-sm font-medium italic text-slate-300">"The best property portal in the North region. Their dashboard is a game changer for investors!"</p>
              <div className="mt-4 flex items-center gap-3">
                 <img src="https://i.pravatar.cc/150?u=jane" className="w-10 h-10 rounded-full border-2 border-emerald-500" alt="" />
                 <div>
                    <p className="text-xs font-black">Rajesh Kumar</p>
                    <p className="text-[10px] font-bold text-slate-500">Premium Investor</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Left Side: Form */}
        <div className="flex-1 p-12 lg:p-20 bg-white">
           <div className="max-w-md mx-auto">
              <div className="mb-8">
                 <h2 className="text-3xl font-black text-slate-900 mb-2">Create Account</h2>
                 <p className="text-slate-500 font-medium">Join our community of premium property seekers.</p>
              </div>

              {error && (
                 <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-3 animate-shake">
                    <XCircle className="w-5 h-5" /> {error}
                 </div>
              )}

              {message && (
                 <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-bold flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5" /> {message}
              </div>
              )}

              <form onSubmit={handleSignup} className="space-y-5">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                       <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                          <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-sm" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                       <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                          <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98XXX XXXX" className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-sm" />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                    <div className="flex gap-3">
                      <div className="relative group flex-1">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-sm" />
                      </div>
                      <button 
                        type="button"
                        onClick={handleSendOTP}
                        disabled={otpLoading || isOtpSent}
                        className="px-4 rounded-2xl bg-emerald-600 text-white text-[10px] font-black hover:bg-emerald-700 transition-all disabled:bg-slate-200 disabled:text-slate-400 min-w-[80px]"
                      >
                        {otpLoading ? '...' : isOtpSent ? 'Sent' : 'Get OTP'}
                      </button>
                    </div>
                 </div>

                 {isOtpSent && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Enter OTP</label>
                      <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                        <input required type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit OTP" className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-sm tracking-[0.5em] text-center" />
                      </div>
                    </div>
                 )}

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
                    <div className="relative group">
                       <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                       <input required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" className="w-full pl-14 pr-14 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-sm" />
                       <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                       </button>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 py-2">
                    <input type="checkbox" required id="terms" className="w-5 h-5 rounded-lg border-slate-200 text-emerald-600 focus:ring-emerald-500" />
                    <label htmlFor="terms" className="text-xs font-bold text-slate-600 leading-tight">
                       I agree to the <Link to="#" className="text-emerald-600 hover:underline">Terms of Service</Link> and <Link to="#" className="text-emerald-600 hover:underline">Privacy Policy</Link>
                    </label>
                 </div>

                 <button 
                   disabled={isLoading}
                   className="w-full py-4.5 rounded-2xl bg-slate-900 text-white font-black text-sm shadow-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                 >
                   {isLoading ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : (
                     <>Verify & Register <ArrowRight className="w-5 h-5" /></>
                   )}
                 </button>
              </form>

              <div className="mt-10 text-center border-t border-slate-50 pt-8">
                 <p className="text-slate-500 font-bold text-sm">
                   Already have an account? <Link to="/login" className="text-emerald-600 hover:underline">Log in here</Link>
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
