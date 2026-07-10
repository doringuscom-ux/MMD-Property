import { Phone, Mail, ChevronRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-[#0B0F19] text-white overflow-hidden border-t border-white/5">
      {/* Background aesthetic effects */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand & Social Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col gap-6 items-center md:items-start text-center md:text-left">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                Maa Mansa <span className="text-blue-500">Property.</span>
              </h2>
              <p className="text-slate-400 font-light leading-relaxed max-w-sm text-sm mx-auto md:mx-0">
                Elevating your real estate experience. We build trust through transparency and deliver premium properties across Panchkula and Mohali.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
              {[
                { icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z", label: "Facebook", bg: "hover:bg-[#1877F2] hover:border-[#1877F2]" },
                { icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z", label: "Instagram", bg: "hover:bg-[#E4405F] hover:border-[#E4405F]" },
                { icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z", label: "Twitter", bg: "hover:bg-[#1DA1F2] hover:border-[#1DA1F2]" },
                { icon: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z", label: "LinkedIn", bg: "hover:bg-[#0A66C2] hover:border-[#0A66C2]" }
              ].map((social) => (
                <a key={social.label} href="#" className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 ${social.bg} group shadow-lg`}>
                  <svg className="w-5 h-5 fill-slate-300 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 flex flex-col items-center md:items-start">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white text-center md:text-left">Company</h4>
            <ul className="space-y-4">
              {['Home', 'Properties', 'About Us', 'Contact Us', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-400 hover:text-white flex items-center gap-3 group transition-colors text-sm w-fit">
                    <ChevronRight className="w-3.5 h-3.5 text-blue-500 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <span className="transform -translate-x-4 group-hover:translate-x-0 transition-transform duration-300">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1 flex flex-col items-center md:items-start">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white text-center md:text-left">Get in Touch</h4>
            <div className="space-y-6">
              <a href="tel:+919876543210" className="flex items-start gap-4 group w-fit">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all mt-0.5 shadow-sm group-hover:shadow-blue-500/30">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs text-slate-500 mb-1">Call Support</span>
                  <span className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors tracking-wide">+91 98765 43210</span>
                </div>
              </a>
              <a href="mailto:info@maamansadevi.com" className="flex items-start gap-4 group w-fit">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all mt-0.5 shadow-sm group-hover:shadow-emerald-500/30">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs text-slate-500 mb-1">Email Us</span>
                  <span className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors tracking-wide">info@maamansadevi.com</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium">
          <p className="text-slate-500 order-2 md:order-1 tracking-wide">
            © {new Date().getFullYear()} MAA MANSA PROPERTY. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6 order-1 md:order-2">
            <span className="text-slate-500 tracking-wide">Powered By <a href="https://digitalorra.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 font-bold hover:text-blue-400 hover:underline transition-colors">Digital ORRA</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
