import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { X, Check } from 'lucide-react';

const ImageCropperModal = ({ imageSrc, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (crop) => setCrop(crop);
  const onZoomChange = (zoom) => setZoom(zoom);

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedBlob);
    } catch (e) {
      console.error(e);
      onCancel();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-black text-slate-900">Crop Image</h3>
          <button 
            onClick={onCancel} 
            className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative w-full h-[60vh] bg-slate-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={onZoomChange}
            objectFit="contain"
            restrictPosition={false}
            minZoom={0.2}
          />
        </div>

        {/* Footer Controls */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={0.2}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div className="flex items-center gap-4 justify-end">
            <button 
              onClick={onCancel}
              className="px-6 py-3 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleCropSave}
              disabled={isProcessing}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              <Check className="w-5 h-5" />
              {isProcessing ? 'Cropping...' : 'Crop & Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
