export function isAdmin(user) {
  return user?.email === import.meta.env.VITE_ADMIN_EMAIL;
}