import { Trash2 } from 'lucide-react';

const AdminDeleteModal = ({ deleteConfirm, setDeleteConfirm, handleDelete }) => {
  if (!deleteConfirm.show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteConfirm({ show: false, id: null })} />
      <div className="relative bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl animate-zoom-in">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Confirm Delete</h3>
        <p className="text-slate-500 font-medium mb-6">Are you sure you want to delete this property? This action cannot be undone.</p>
        <div className="flex gap-4">
          <button onClick={() => setDeleteConfirm({ show: false, id: null })} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={handleDelete} className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDeleteModal;
