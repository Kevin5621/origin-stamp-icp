/**
 * Menghasilkan inisial dari username
 * @param username - Username pengguna
 * @returns Inisial (maksimal 2 karakter)
 */
export const getInitials = (username: string): string => {
  if (!username) return "";

  // Split username berdasarkan spasi, titik, atau underscore
  const parts = username.split(/[\s._-]+/).filter((part) => part.length > 0);

  if (parts.length === 0) return "";

  if (parts.length === 1) {
    // Jika hanya satu kata, ambil 2 karakter pertama
    return username.slice(0, 2).toUpperCase();
  }

  // Jika ada multiple words, ambil huruf pertama dari 2 kata pertama
  const firstInitial = parts[0].charAt(0);
  const secondInitial = parts[1].charAt(0);

  return (firstInitial + secondInitial).toUpperCase();
};

/**
 * Menghasilkan warna background untuk avatar berdasarkan username
 * @param username - Username pengguna
 * @returns Kode warna hex
 */
export const getAvatarColor = (username: string): string => {
  if (!username) return "#6B7280"; // Default gray

  // Generate consistent color based on username
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert to hex color
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};
