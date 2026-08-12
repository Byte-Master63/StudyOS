// src/utils/getDailyIndex.js
export function getDailyIndex(length) {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  return dayOfYear % length;
}
