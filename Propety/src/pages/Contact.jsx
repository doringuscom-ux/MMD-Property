import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Phone, Mail, MapPin, Clock, Send, MessageSquare, 
  ChevronRight, Globe
} from 'lucide-react';
import { BASE_URL } from '../api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSuccess(false);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    try {
      const response = await fetch(`${BASE_URL}/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userInfo ? `Bearer ${userInfo.token}` : ''
        },
        body: JSON.stringify({
          ...formData,
          message: formData.subject ? `[${formData.subject}] ${formData.message}` : formData.message
        })
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 98765 43210",
      subDetails: "Mon-Sat from 9am to 6pm",
      color: "bg-blue-50 text-blue-600",
      link: "tel:+919876543210"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "info@mmdproperty.com",
      subDetails: "Online support 24/7",
      color: "bg-emerald-50 text-emerald-600",
      link: "mailto:info@mmdproperty.com"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "SCO 12, Sector 20, Panchkula",
      subDetails: "Haryana, India - 134116",
      color: "bg-purple-50 text-purple-600",
      link: "https://maps.google.com"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar isSolid={true} />

      {/* Hero Section */}
      <section className="relative pt-44 pb-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
            alt="Contact Hero" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900 to-slate-900" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Contact Support
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Conversation</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Have questions about a property or need expert advice? Our team is here to help you find your perfect home in Tri-City.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="relative z-20 -mt-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info, idx) => (
              <a 
                href={info.link} 
                key={idx}
                className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
              >
                <div className={`w-16 h-16 rounded-2xl ${info.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <info.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{info.title}</h3>
                <p className="text-lg font-bold text-slate-700 mb-1">{info.details}</p>
                <p className="text-sm text-slate-400 font-medium">{info.subDetails}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Form & Map Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Form */}
            <div className="flex-1">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 mb-4">Send us a Message</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Fill out the form below and one of our property experts will get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 00000 00000"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                    <select 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900 appearance-none"
                    >
                      <option value="">Select a topic</option>
                      <option value="Buying">Buying a Property</option>
                      <option value="Selling">Selling a Property</option>
                      <option value="Rental">Rental Inquiry</option>
                      <option value="Other">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
                  <textarea 
                    rows="5"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900 resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={sending}
                  className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {sending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : success ? (
                    <>
                      <Send className="w-5 h-5" /> Message Sent Successfully!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Side Info & Map */}
            <div className="lg:w-[400px] space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-600/30 transition-colors" />
                
                <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                  Connect with us <MessageSquare className="w-6 h-6 text-blue-400" />
                </h3>
                
                <div className="space-y-6">
                  <p className="text-slate-400 font-medium leading-relaxed">
                    Follow us on social media for the latest property updates and market trends in Panchkula and Mohali.
                  </p>
                  
                  <div className="flex gap-4">
                    <a href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all group/icon">
                      <svg className="w-5 h-5 fill-slate-400 group-hover:text-white" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all group/icon">
                      <svg className="w-5 h-5 fill-slate-400 group-hover:text-white" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all group/icon">
                      <svg className="w-5 h-5 fill-slate-400 group-hover:text-white" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all group/icon">
                      <Globe className="w-5 h-5 text-slate-400 group-hover:text-white" />
                    </a>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-black uppercase tracking-widest text-slate-500">Office Hours</span>
                    </div>
                    <p className="font-bold">Mon - Sat: 9:00 AM - 7:00 PM</p>
                    <p className="text-slate-500 text-sm">Sunday: Closed</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
