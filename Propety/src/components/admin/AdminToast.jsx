import { CheckCircle2, AlertCircle } from 'lucide-react';

const AdminToast = ({ message }) => {
  if (!message.text) return null;

  return (
    <div className={`fixed top-24 right-8 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-slide-up ${
      message.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
    }`}>
      {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <span className="font-bold text-sm">{message.text}</span>
    </div>
  );
};

export default AdminToast;
