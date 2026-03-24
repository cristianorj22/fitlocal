import { useState, useRef } from 'react';
import WeightChart from '../components/WeightChart';
import { Camera, Trash2, X } from 'lucide-react';
import { useProfile, useWeightLog, usePhotos, useSavePhoto, useDeletePhoto } from '../lib/queries';

export default function Progress() {
  const { data: profile } = useProfile();
  const { data: weightLog = [] } = useWeightLog();
  const { data: photos = [] } = usePhotos();
  const savePhoto = useSavePhoto();
  const deletePhoto = useDeletePhoto();
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const fileRef = useRef();

  if (!profile) return null;

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      savePhoto.mutate({ dataUrl: ev.target.result, note });
      setNote('');
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (i) => {
    deletePhoto.mutate(i);
    setSelected(null);
  };

  return (
    <div className="max-w-lg mx-auto p-5 space-y-6">
      <div className="pt-4">
        <h1 className="text-2xl font-bold">Progress</h1>
      </div>

      <WeightChart log={weightLog} targetWeight={profile.targetWeight} />

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Start', val: `${profile.weight} kg` },
          { label: 'Current', val: `${weightLog[weightLog.length - 1]?.kg || profile.weight} kg` },
          { label: 'Target', val: `${profile.targetWeight || '—'} kg` },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 rounded-2xl p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className="font-bold text-sm">{s.val}</div>
          </div>
        ))}
      </div>

      {/* Photo section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Progress Photos</h2>
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-500 rounded-xl text-sm font-medium">
            <Camera className="w-4 h-4" /> Add Photo
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
        </div>

        {photos.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl h-32 flex flex-col items-center justify-center gap-2 text-gray-600">
            <Camera className="w-8 h-8" />
            <span className="text-sm">No photos yet</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((p, i) => (
              <button key={i} onClick={() => setSelected(i)} className="aspect-square rounded-xl overflow-hidden">
                <img src={p.dataUrl} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Photo modal */}
      {selected !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-5">
          <div className="w-full max-w-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-400">{new Date(photos[selected]?.date).toLocaleDateString()}</span>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(selected)} className="p-2 bg-red-500/20 rounded-lg">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
                <button onClick={() => setSelected(null)} className="p-2 bg-gray-800 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <img src={photos[selected]?.dataUrl} alt="" className="w-full rounded-2xl" />
            {photos[selected]?.note && <p className="text-sm text-gray-400 mt-3">{photos[selected].note}</p>}
          </div>
        </div>
      )}
    </div>
  );
}