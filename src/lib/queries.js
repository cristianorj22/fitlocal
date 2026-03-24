import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import {
  getProfile, saveProfile,
  getWeightLog, addWeightEntry,
  getTodayCheckedIn, addCheckIn,
  getPhotos, savePhoto, deletePhoto,
} from './storage';

function todayYmd() {
  return new Date().toISOString().split('T')[0];
}

function notifyMutationError(err, fallbackMessage) {
  const description = err instanceof Error && err.message ? err.message : fallbackMessage;
  toast({
    variant: 'destructive',
    title: 'Something went wrong',
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
      notifyMutationError(err, 'Could not save check-in. Please try again.');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEYS.checkedIn }),
  });
};

export const useAddWeight = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (kg) => {
      await addWeightEntry(kg);
      return getWeightLog();
    },
    onMutate: async (kg) => {
      await qc.cancelQueries({ queryKey: KEYS.weightLog });
      const prev = qc.getQueryData(KEYS.weightLog);
      // Same shape as addWeightEntry in storage (YYYY-MM-DD)
      qc.setQueryData(KEYS.weightLog, (old = []) => [
        ...old,
        { kg, date: todayYmd() },
      ]);
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      qc.setQueryData(KEYS.weightLog, ctx?.prev);
      notifyMutationError(err, 'Could not save weight. Please try again.');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEYS.weightLog }),
  });
};

export const useSaveProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const ok = saveProfile(data);
      if (!ok) throw new Error('Unable to save profile to device storage.');
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
      notifyMutationError(err, 'Could not save profile. Please try again.');
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
      notifyMutationError(err, 'Could not save photo. Storage may be full.');
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
      notifyMutationError(err, 'Could not delete photo. Please try again.');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEYS.photos }),
  });
};