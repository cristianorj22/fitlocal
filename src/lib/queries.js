import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import {
  getProfile, saveProfile,
  getWeightLog, addWeightEntry, deleteWeightEntry,
  getTodayCheckedIn, addCheckIn,
  getPhotos, savePhoto, deletePhoto,
  StorageError,
} from './storage';
import { normalizeLocale } from './i18n-utils.js';
import { tFor } from './locale-messages.js';
import { syncWidgetData } from './capacitor/bridge';

function todayYmd() {
  return new Date().toISOString().split('T')[0];
}

/** Map stable storage / mutation errors to locale keys (never show raw English to users). */
const ERROR_MESSAGE_TO_KEY = {
  [StorageError.PROFILE]: 'errors.profileStorage',
  [StorageError.WEIGHT_LOG]: 'errors.weight',
  [StorageError.PHOTO_SAVE]: 'errors.photoSave',
  [StorageError.PHOTO_DELETE]: 'errors.photoDelete',
};

/** @param {unknown} err @param {string} descriptionKey dot path in locales, e.g. errors.checkIn */
function notifyMutationError(err, descriptionKey) {
  const locale = normalizeLocale(getProfile()?.locale);
  const title = String(tFor(locale, 'errors.genericTitle'));
  const keyFromErr =
    err instanceof Error && err.message && ERROR_MESSAGE_TO_KEY[err.message]
      ? ERROR_MESSAGE_TO_KEY[err.message]
      : null;
  const description = String(
    tFor(locale, keyFromErr || descriptionKey || 'errors.unknown'),
  );
  toast({
    variant: 'destructive',
    title,
    description,
  });
}

// ─── Query Keys ───────────────────────────────────────────────
export const KEYS = {
  profile: ['profile'],
  weightLog: ['weightLog'],
  checkedIn: ['checkedIn'],
  photos: ['photos'],
};

// ─── Queries ──────────────────────────────────────────────────
export const useProfile = () =>
  useQuery({ queryKey: KEYS.profile, queryFn: getProfile, staleTime: Infinity });

export const useWeightLog = () =>
  useQuery({ queryKey: KEYS.weightLog, queryFn: getWeightLog, staleTime: Infinity });

export const useCheckedIn = () =>
  useQuery({ queryKey: KEYS.checkedIn, queryFn: getTodayCheckedIn, staleTime: Infinity });

export const usePhotos = () =>
  useQuery({ queryKey: KEYS.photos, queryFn: getPhotos, staleTime: Infinity });

// ─── Mutations ────────────────────────────────────────────────
export const useCheckIn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => { addCheckIn(); return true; },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: KEYS.checkedIn });
      const prev = qc.getQueryData(KEYS.checkedIn);
      qc.setQueryData(KEYS.checkedIn, true);
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      qc.setQueryData(KEYS.checkedIn, ctx?.prev);
      notifyMutationError(err, 'errors.checkIn');
    },
    onSuccess: () => {
      // Sync widget data after check-in (streak updated)
      const profile = getProfile();
      if (profile) getWeightLog().then((wl) => syncWidgetData(profile, wl)).catch(() => {});
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEYS.checkedIn }),
  });
};

export const useAddWeight = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (kg) => {
      // #region agent log
      fetch('http://127.0.0.1:7492/ingest/b62ba8d1-46e5-416f-b1b6-80561aba873c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e3a121'},body:JSON.stringify({sessionId:'e3a121',location:'queries.js:useAddWeight:mutationFn',message:'addWeight mutationFn',data:{kg,kgIsNaN:Number.isNaN(kg)},timestamp:Date.now(),hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      await addWeightEntry(kg);
      return getWeightLog();
    },
    onMutate: async (kg) => {
      await qc.cancelQueries({ queryKey: KEYS.weightLog });
      const prev = qc.getQueryData(KEYS.weightLog);
      // Same shape as addWeightEntry in storage (YYYY-MM-DD)
      const now = Date.now();
      qc.setQueryData(KEYS.weightLog, (old = []) => [
        ...old,
        { kg, date: todayYmd(), ts: now },
      ]);
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      // #region agent log
      fetch('http://127.0.0.1:7492/ingest/b62ba8d1-46e5-416f-b1b6-80561aba873c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e3a121'},body:JSON.stringify({sessionId:'e3a121',location:'queries.js:useAddWeight:onError',message:'addWeight error',data:{msg:String(err?.message||err)},timestamp:Date.now(),hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      qc.setQueryData(KEYS.weightLog, ctx?.prev);
      notifyMutationError(err, 'errors.weight');
    },
    onSuccess: (newLog) => {
      // #region agent log
      fetch('http://127.0.0.1:7492/ingest/b62ba8d1-46e5-416f-b1b6-80561aba873c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e3a121'},body:JSON.stringify({sessionId:'e3a121',location:'queries.js:useAddWeight:onSuccess',message:'addWeight success',data:{newLogLen:Array.isArray(newLog)?newLog.length:'n/a'},timestamp:Date.now(),hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      // Sync widget data after weight entry
      const profile = getProfile();
      if (profile) syncWidgetData(profile, newLog).catch(() => {});
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEYS.weightLog }),
  });
};

export const useDeleteWeight = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ts) => {
      return await deleteWeightEntry(ts);
    },
    onMutate: async (ts) => {
      await qc.cancelQueries({ queryKey: KEYS.weightLog });
      const prev = qc.getQueryData(KEYS.weightLog);
      qc.setQueryData(KEYS.weightLog, (old = []) => old.filter((e) => e?.ts !== ts));
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      qc.setQueryData(KEYS.weightLog, ctx?.prev);
      notifyMutationError(err, 'errors.weight');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEYS.weightLog }),
  });
};

export const useSaveProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      saveProfile(data);
      return data;
    },
    onMutate: async (data) => {
      await qc.cancelQueries({ queryKey: KEYS.profile });
      const prev = qc.getQueryData(KEYS.profile);
      qc.setQueryData(KEYS.profile, data);
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      qc.setQueryData(KEYS.profile, ctx?.prev);
      notifyMutationError(err, 'errors.profileSave');
    },
    onSuccess: (data) => {
      // Sync widget data after profile save
      getWeightLog().then((wl) => syncWidgetData(data, wl)).catch(() => {});
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEYS.profile }),
  });
};

export const useSavePhoto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ dataUrl, note }) => {
      await savePhoto(dataUrl, note);
    },
    onMutate: async ({ dataUrl, note }) => {
      await qc.cancelQueries({ queryKey: KEYS.photos });
      const prev = qc.getQueryData(KEYS.photos);
      qc.setQueryData(KEYS.photos, (old = []) => [
        ...old,
        { dataUrl, note, date: new Date().toISOString() },
      ]);
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      qc.setQueryData(KEYS.photos, ctx?.prev);
      notifyMutationError(err, 'errors.photoSave');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEYS.photos }),
  });
};

export const useDeletePhoto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (index) => {
      await deletePhoto(index);
    },
    onMutate: async (index) => {
      await qc.cancelQueries({ queryKey: KEYS.photos });
      const prev = qc.getQueryData(KEYS.photos);
      qc.setQueryData(KEYS.photos, (old = []) => old.filter((_, i) => i !== index));
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      qc.setQueryData(KEYS.photos, ctx?.prev);
      notifyMutationError(err, 'errors.photoDelete');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEYS.photos }),
  });
};