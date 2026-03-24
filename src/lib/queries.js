import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProfile, saveProfile,
  getWeightLog, addWeightEntry,
  getTodayCheckedIn, addCheckIn,
  getPhotos, savePhoto, deletePhoto,
} from './storage';

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
    onError: (_err, _vars, ctx) => qc.setQueryData(KEYS.checkedIn, ctx.prev),
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
      qc.setQueryData(KEYS.weightLog, (old = []) => [
        ...old,
        { kg, date: new Date().toISOString() },
      ]);
      return { prev };
    },
    onError: (_err, _vars, ctx) => qc.setQueryData(KEYS.weightLog, ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: KEYS.weightLog }),
  });
};

export const useSaveProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => { saveProfile(data); return data; },
    onMutate: async (data) => {
      await qc.cancelQueries({ queryKey: KEYS.profile });
      const prev = qc.getQueryData(KEYS.profile);
      qc.setQueryData(KEYS.profile, data);
      return { prev };
    },
    onError: (_err, _vars, ctx) => qc.setQueryData(KEYS.profile, ctx.prev),
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
    onError: (_err, _vars, ctx) => qc.setQueryData(KEYS.photos, ctx.prev),
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
    onError: (_err, _vars, ctx) => qc.setQueryData(KEYS.photos, ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: KEYS.photos }),
  });
};