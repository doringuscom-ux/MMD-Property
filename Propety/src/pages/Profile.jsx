import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Mail, Phone, Lock, Save, Camera, ShieldCheck, CheckCircle2, XCircle, Key, Eye, EyeOff, Loader2, Image as ImageIcon, X, RefreshCw, AlertCircle } from 'lucide-react';
import { BASE_URL } from '../api';
const Profile = () => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    oldPassword: '',
    password: '',
    confirmPassword: ''
  });
  const [avatar, setAvatar] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [originalEmail, setOriginalEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.token) {
        try {
          const response = await fetch(`${BASE_URL}/users/profile`, {
            headers: {
              'Authorization': `Bearer ${userInfo.token}`
            }
          });
          const data = await response.json();
          if (response.ok) {
            setFormData({
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || '',
              oldPassword: '',
              password: '',
              confirmPassword: ''
            });
            setAvatar(data.avatar || '');
            setOriginalEmail(data.email || '');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    if (e.target.name === 'email' && e.target.value === originalEmail && !formData.password) {
      setIsOtpSent(false);
      setOtp('');
    }
  };

  // --- Camera Logic ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } } 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCameraModal(true);
      setShowUploadOptions(false);
      setCapturedImage(null);
    } catch (err) {
      console.error("Camera Error:", err);
      setMessage({ type: 'error', text: 'Could not access camera. Please check permissions.' });
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
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
    }
  };

  const handleUploadCaptured = async () => {
    if (!capturedImage) return;

    setUploading(true);
    stopCamera();

    // Convert dataURL to blob
    const res = await fetch(capturedImage);
    const blob = await res.blob();
    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

    const uploadData = new FormData();
    uploadData.append('image', file);

    await performUpload(uploadData);
  };

  // --- Common Upload Logic ---
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setShowUploadOptions(false);
    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    await performUpload(uploadData);
  };

  const performUpload = async (uploadData) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/users/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: uploadData
      });

      const data = await response.json();

      if (response.ok) {
        setAvatar(data.avatar);
        setMessage({ type: 'success', text: 'Profile picture updated!' });
        const updatedUser = { ...userInfo, avatar: data.avatar };
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      } else {
        setMessage({ type: 'error', text: data.message || 'Upload failed' });
      }
    } catch (error) {
      console.error('Profile Upload Client Error:', error);
      setMessage({ type: 'error', text: 'Error uploading image: ' + error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSendOTP = async () => {
    const emailToSend = formData.email;
    if (!emailToSend) {
      setMessage({ type: 'error', text: 'Email is required' });
      return;
    }
    setOtpLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${BASE_URL}/users/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToSend, isRegistration: false })
      });

      const data = await response.json();

      if (response.ok) {
        setIsOtpSent(true);
        setMessage({ type: 'success', text: `OTP sent to ${emailToSend}!` });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to send OTP' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error. Please try again.' });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const isEmailChanged = formData.email !== originalEmail;
    const isPasswordChanged = formData.password.length > 0;
    const hasOldPassword = formData.oldPassword.length > 0;

    const verificationNeeded = isEmailChanged || (isPasswordChanged && !hasOldPassword);
    
    if (verificationNeeded && !isOtpSent) {
      setMessage({ type: 'error', text: 'Please verify with OTP or enter Old Password to save changes' });
      setLoading(false);
      return;
    }

    if (isPasswordChanged && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`${BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          oldPassword: formData.oldPassword || undefined,
          password: formData.password || undefined,
          otp: verificationNeeded ? otp : undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setOriginalEmail(data.email);
        setIsOtpSent(false);
        setOtp('');
        setFormData(prev => ({ ...prev, oldPassword: '', password: '', confirmPassword: '' }));
        const updatedUser = { ...userInfo, ...data };
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      } else {
        setMessage({ type: 'error', text: data.message || 'Update failed' });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const isVerificationNeeded = (formData.email !== originalEmail) || (formData.password.length > 0 && !formData.oldPassword);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar isSolid={true} />
      
      <div className="pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center relative z-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Manage Your Profile</h1>
            <p className="text-slate-500 font-medium tracking-tight">Update your personal information and security settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar/Avatar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center relative">
                <div className="relative inline-block mb-4">
                  <div className="w-28 h-28 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-200 mx-auto overflow-hidden relative group">
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      formData.name?.charAt(0).toUpperCase()
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  {/* Hidden Inputs */}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

                  {/* Camera Icon Button */}
                  <button 
                    type="button"
                    onClick={() => setShowUploadOptions(!showUploadOptions)}
                    className="absolute bottom-0 right-0 p-3 bg-white rounded-2xl shadow-xl border border-slate-100 text-blue-600 hover:scale-110 transition-transform active:scale-95"
                  >
                    <Camera className="w-5 h-5" />
                  </button>

                  {/* Upload Options Menu */}
                  {showUploadOptions && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUploadOptions(false)}></div>
                      <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 translate-y-full w-48 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-3 z-50 animate-in zoom-in-95 fade-in duration-200">
                        <div className="flex flex-col gap-1 text-left">
                          <button 
                            type="button"
                            onClick={startCamera}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-2xl transition-colors text-slate-700 font-bold text-sm w-full"
                          >
                            <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><Camera className="w-4 h-4" /></div>
                            Take Photo
                          </button>
                          <button 
                            type="button"
                            onClick={() => { fileInputRef.current.click(); }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 rounded-2xl transition-colors text-slate-700 font-bold text-sm w-full"
                          >
                            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600"><ImageIcon className="w-4 h-4" /></div>
                            From Gallery
                          </button>
                          <div className="h-px bg-slate-50 my-1"></div>
                          <button 
                            type="button"
                            onClick={() => setShowUploadOptions(false)}
                            className="flex items-center justify-center gap-2 px-4 py-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors w-full"
                          >
                            <X className="w-3 h-3" /> Cancel
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <h3 className="text-xl font-black text-slate-900">{formData.name}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Member</p>
                
                <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col gap-3 text-left">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Account Security: {isVerificationNeeded ? 'Update Pending' : 'High'}
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                {message.text && (
                  <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    {message.text}
                  </div>
                )}

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Personal Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <User className="w-3 h-3" /> Full Name
                      </label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900"
                        placeholder="Your Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Mail className="w-3 h-3" /> Email Address
                      </label>
                      <div className="flex gap-2">
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900"
                          placeholder="your@email.com"
                        />
                        {formData.email !== originalEmail && (
                          <button 
                            type="button"
                            onClick={handleSendOTP}
                            disabled={otpLoading || isOtpSent}
                            className="px-4 rounded-2xl bg-emerald-600 text-white text-[10px] font-black hover:bg-emerald-700 transition-all disabled:bg-slate-200 disabled:text-slate-400 min-w-[80px]"
                          >
                            {otpLoading ? '...' : isOtpSent ? 'Sent' : 'Verify Email'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Phone Number
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>

                <div className="space-y-6 pt-6">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Security Settings</h4>
                    {isVerificationNeeded && (
                        <button 
                          type="button"
                          onClick={handleSendOTP}
                          disabled={otpLoading || isOtpSent}
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-black hover:bg-blue-700 transition-all disabled:bg-slate-200 disabled:text-slate-400 shadow-lg shadow-blue-600/20"
                        >
                          {otpLoading ? '...' : isOtpSent ? 'OTP Sent' : 'Forgot Password? Get OTP'}
                        </button>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Key className="w-3 h-3" /> Old Password (optional if using OTP)
                      </label>
                      <div className="relative">
                        <input 
                          type={showOldPassword ? "text" : "password"}
                          name="oldPassword"
                          value={formData.oldPassword}
                          onChange={handleChange}
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900 pr-14"
                          placeholder="Enter old password to change without OTP"
                        />
                        <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
                          {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <Lock className="w-3 h-3" /> New Password
                        </label>
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900 pr-14"
                            placeholder="Min. 8 characters"
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <ShieldCheck className="w-3 h-3" /> Confirm Password
                        </label>
                        <div className="relative">
                          <input 
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900 pr-14"
                            placeholder="Confirm new password"
                          />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isOtpSent && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-4 bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                      <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Enter 6-Digit OTP to Verify Changes
                      </label>
                      <input 
                        required 
                        type="text" 
                        maxLength="6" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        placeholder="0 0 0 0 0 0" 
                        className="w-full px-6 py-4 rounded-2xl bg-white border border-emerald-200 focus:border-emerald-500 outline-none transition-all font-black text-center text-2xl tracking-[0.5em] text-emerald-900" 
                      />
                      <p className="text-[9px] text-emerald-600 font-bold text-center mt-2 italic">Check your email for the verification code</p>
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-lg shadow-xl shadow-slate-900/20 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" /> {isVerificationNeeded ? 'Verify & Save Changes' : 'Save Profile Changes'}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* --- CAMERA MODAL --- */}
      {showCameraModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md" onClick={stopCamera}></div>
          <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Camera className="w-6 h-6 text-blue-600" /> Take Profile Photo
              </h3>
              <button onClick={stopCamera} className="p-2 hover:bg-slate-100 rounded-2xl transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Video Preview */}
            <div className="relative bg-slate-100 aspect-square flex items-center justify-center overflow-hidden">
              {!capturedImage ? (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  <div className="absolute inset-0 border-[40px] border-black/20 pointer-events-none flex items-center justify-center">
                     <div className="w-64 h-64 border-2 border-dashed border-white/50 rounded-full"></div>
                  </div>
                </>
              ) : (
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
              )}
              
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Footer / Controls */}
            <div className="p-8 flex flex-col items-center gap-4">
              {!capturedImage ? (
                <button 
                  onClick={capturePhoto}
                  className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-600/30 active:scale-90 transition-transform border-4 border-blue-50"
                >
                  <div className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white rounded-full"></div>
                  </div>
                </button>
              ) : (
                <div className="flex gap-4 w-full">
                  <button 
                    onClick={() => setCapturedImage(null)}
                    className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                  >
                    <RefreshCw className="w-5 h-5" /> Retake
                  </button>
                  <button 
                    onClick={handleUploadCaptured}
                    className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Use This Photo
                  </button>
                </div>
              )}
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {!capturedImage ? 'Align your face within the frame' : 'Do you want to use this photo?'}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />


    </div>
  );
};

export default Profile;
