import { useState, useRef } from 'react';
import WeightChart from '../components/WeightChart';
import { Camera, Trash2, X, Share2, Download } from 'lucide-react';
import { exportAllDataCsv } from '../lib/exportCsv';
import { toast } from '@/components/ui/use-toast';
import { useProfile, useWeightLog, usePhotos, useSavePhoto, useDeletePhoto } from '../lib/queries';
import { useI18n } from '../contexts/LocaleContext.jsx';

export default function Progress() {
  const { t, formatDateShort } = useI18n();
  const { data: profile } = useProfile();
  const { data: weightLog = [] } = useWeightLog();
  const { data: photos = [] } = usePhotos();
  const savePhoto = useSavePhoto();
  const deletePhoto = useDeletePhoto();
  const [selected, setSelected] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExportCsv = async () => {
    if (!profile) return;
    setExporting(true);
    await exportAllDataCsv();
    toast({ title: t('progress.exportDone') });
    setExporting(false);
  };

  const handleShare = async () => {
    if (!navigator.share) return;
    const current = weightLog[weightLog.length - 1]?.kg || profile.weight;
    const target = profile.targetWeight;
    const text = `FitLocal — ${profile.name}\nPeso atual: ${current} kg${target ? ` → Objetivo: ${target} kg` : ''}`;
    setSharing(true);
    try { await navigator.share({ title: 'FitLocal Progress', text }); } catch { /* cancelled */ }
    setSharing(false);
  };
  const [note, setNote] = useState('');
  const fileRef = useRef();

  if (!profile) return null;

  const compressImage = (file) =>
    new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const MAX_W = 1024;
        const scale = Math.min(1, MAX_W / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);

        URL.revokeObjectURL(objectUrl);
        canvas.width = 0;
        canvas.height = 0;
        img.src = '';

        resolve(dataUrl);
      };
      img.src = objectUrl;
    });

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const dataUrl = await compressImage(file);
    savePhoto.mutate({ dataUrl, note });
    setNote('');
    e.target.value = '';
  };

  const handleDelete = (i) => {
    deletePhoto.mutate(i);
    setSelected(null);
  };

  return (
    <div className="max-w-lg mx-auto p-5 space-y-6">
      <div className="pt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('progress.title')}</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={exporting}
            aria-label={t('progress.exportCsv')}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-muted border border-border text-muted-foreground disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
          </button>
          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              type="button"
              onClick={handleShare}
              disabled={sharing}
              aria-label="Share progress"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-muted border border-border text-muted-foreground disabled:opacity-50"
            >
              <Share2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <WeightChart log={weightLog} targetWeight={profile.targetWeight} />

      <div className="grid grid-cols-3 gap-3">
        {[
          { labelKey: 'progress.start', val: `${profile.weight} kg` },
          { labelKey: 'progress.current', val: `${weightLog[weightLog.length - 1]?.kg || profile.weight} kg` },
          { labelKey: 'progress.target', val: `${profile.targetWeight || '—'} kg` },
        ].map((s) => (
          <div key={s.labelKey} className="bg-card border border-border rounded-2xl p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">{t(s.labelKey)}</div>
            <div className="font-bold text-sm">{s.val}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">{t('progress.photos')}</h2>
          <button
            type="button"
            aria-label={t('progress.addPhoto')}
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 min-h-[44px] bg-emerald-500 rounded-xl text-sm font-medium"
          >
            <Camera className="w-4 h-4" /> {t('progress.addPhoto')}
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
        </div>

        {photos.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl h-32 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Camera className="w-8 h-8" />
            <span className="text-sm">{t('progress.noPhotos')}</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((p, i) => (
              <button key={i} type="button" onClick={() => setSelected(i)} className="aspect-square rounded-xl overflow-hidden">
                <img src={p.dataUrl} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {selected !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-5">
          <div className="w-full max-w-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">{formatDateShort(photos[selected]?.date)}</span>
              <div className="flex gap-3">
                <button
                  type="button"
                  aria-label={t('progress.deletePhoto')}
                  onClick={() => handleDelete(selected)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-red-500/20 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
                <button
                  type="button"
                  aria-label={t('progress.closePhoto')}
                  onClick={() => setSelected(null)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-muted rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <img src={photos[selected]?.dataUrl} alt="" className="w-full rounded-2xl" />
            {photos[selected]?.note && <p className="text-sm text-muted-foreground mt-3">{photos[selected].note}</p>}
          </div>
        </div>
      )}
    </div>
  );
}