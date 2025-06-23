// useContextData.js
import { useEffect, useState } from 'react';

const useContextData = () => {
  const [context, setContext] = useState({
    typingTimestamps: [],
    typingSpeed: 0,
    cursorMovements: [],
    tabSwitches: 0,
    screenFPSDrops: 0,
    ip: '',
    location: null,
    device: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    loginTime: new Date().toISOString()
  });

  // Typing speed tracking
  const handleKeyDown = () => {
    const now = Date.now();
    setContext(prev => ({
      ...prev,
      typingTimestamps: [...prev.typingTimestamps, now]
    }));
  };

  // Cursor tracking
  useEffect(() => {
    const handleMove = (e) => {
      setContext(prev => ({
        ...prev,
        cursorMovements: [...prev.cursorMovements, {
          x: e.clientX,
          y: e.clientY,
          t: Date.now()
        }]
      }));
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Tab visibility tracking
  useEffect(() => {
    let switches = 0;
    const handleVisibility = () => {
      if (document.hidden) switches++;
      setContext(prev => ({ ...prev, tabSwitches: switches }));
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Screen recording indicator (FPS drop detection)
  useEffect(() => {
    let drops = 0;
    let last = performance.now();

    const checkFPS = () => {
      const now = performance.now();
      if (now - last > 100) drops++;
      last = now;
      setContext(prev => ({ ...prev, screenFPSDrops: drops }));
      requestAnimationFrame(checkFPS);
    };

    requestAnimationFrame(checkFPS);
  }, []);

  // Get IP and Geolocation
  useEffect(() => {
    const getIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setContext(prev => ({ ...prev, ip: data.ip }));
      } catch {}
    };

    navigator.geolocation.getCurrentPosition(pos => {
      const loc = {
        latitude: pos.coords.latitude || 0,
        longitude: pos.coords.longitude || 0
      };
      
      setContext(prev => ({ ...prev, location: loc }));
    });
    getIP();
  }, []);

  // Compute typing speed
  useEffect(() => {
    const times = context.typingTimestamps;
    if (times.length < 2) return;
    const deltas = times.slice(1).map((t, i) => t - times[i]);
    const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    setContext(prev => ({ ...prev, typingSpeed: Number(avg.toFixed(2)) }));
  }, [context.typingTimestamps]);

  return { context, handleKeyDown };
};

export default useContextData;
