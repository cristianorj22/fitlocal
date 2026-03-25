import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * useGeolocation — Phase 4A
 *
 * Opt-in geolocation hook. Only acquires position when explicitly started.
 * Supports one-shot (`getCurrentPosition`) and watch mode (`watchPosition`).
 *
 * Privacy: coordinates stay in local state only — never sent to any server.
 */
export default function useGeolocation({ enableHighAccuracy = false, watch = false } = {}) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState('prompt'); // prompt | granted | denied | unsupported
  const watchId = useRef(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setPermission('unsupported');
      return;
    }
    // Check current permission state if available
    if (navigator.permissions?.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermission(result.state); // 'granted' | 'denied' | 'prompt'
        result.addEventListener('change', () => setPermission(result.state));
      }).catch(() => {});
    }
  }, []);

  const handleSuccess = useCallback((pos) => {
    setPosition({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      altitude: pos.coords.altitude,
      speed: pos.coords.speed,
      timestamp: pos.timestamp,
    });
    setError(null);
    setLoading(false);
    setPermission('granted');
  }, []);

  const handleError = useCallback((err) => {
    setError(err.message);
    setLoading(false);
    if (err.code === err.PERMISSION_DENIED) setPermission('denied');
  }, []);

  const start = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setPermission('unsupported');
      return;
    }
    setLoading(true);
    setError(null);
    const opts = { enableHighAccuracy, timeout: 15000, maximumAge: 0 };

    if (watch) {
      watchId.current = navigator.geolocation.watchPosition(handleSuccess, handleError, opts);
    } else {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, opts);
    }
  }, [watch, enableHighAccuracy, handleSuccess, handleError]);

  const stop = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setLoading(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => stop(), [stop]);

  return { position, error, loading, permission, start, stop };
}