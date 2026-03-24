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
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.checkedIn }),
  });
};

export const useAddWeight = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (kg) => { addWeightEntry(kg); return getWeightLog(); },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.weightLog }),
  });
};

export const useSaveProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => { saveProfile(data); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.profile }),
  });
};

export const useSavePhoto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ dataUrl, note }) => { savePhoto(dataUrl, note); },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.photos }),
  });
};

export const useDeletePhoto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (index) => { deletePhoto(index); },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.photos }),
  });
};