export function haversine(a, b) {
  const toRad = (value) => (value * Math.PI) / 180;
  const lat = toRad(b[0] - a[0]);
  const lng = toRad(b[1] - a[1]);
  const value =
    Math.sin(lat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(lng / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

export function makeLeg(a, b) {
  const latShift = (b[1] - a[1]) * 0.055;
  const lngShift = (a[0] - b[0]) * 0.055;
  return Array.from({ length: 15 }, (_, index) => {
    const t = index / 14;
    const curve = Math.sin(Math.PI * t);
    return [
      a[0] + (b[0] - a[0]) * t + latShift * curve,
      a[1] + (b[1] - a[1]) * t + lngShift * curve,
    ];
  });
}

export function formatClock(hour) {
  const normalized = hour === 24 ? 24 : Math.floor(hour);
  const minutes = Math.round((hour - Math.floor(hour)) * 60);
  return `${String(normalized).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function formatDuration(hours) {
  const fullHours = Math.floor(hours);
  const minutes = Math.round((hours - fullHours) * 60);
  if (!fullHours) return `${minutes}m`;
  return minutes ? `${fullHours}h ${minutes}m` : `${fullHours}h`;
}
