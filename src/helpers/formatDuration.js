export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${minutes} min (${hours}h${mins > 0 ? ` ${mins}min` : ''})`;
};
