export const ADMIN_TELEGRAM_IDS = ['5463769569'];
export const ADMIN_USERNAMES = ['nazarov_df', '@nazarov_df'];

export function isAdminUser(user: {
  telegramId?: string | number | null;
  telegram?: string | null;
  role?: string | null;
  isLoggedIn?: boolean;
} | null | undefined): boolean {
  if (!user) return false;

  if (user.telegramId && ADMIN_TELEGRAM_IDS.includes(String(user.telegramId))) {
    return true;
  }

  if (user.telegram) {
    const clean = user.telegram.replace('@', '').trim().toLowerCase();
    if (ADMIN_USERNAMES.map(u => u.replace('@', '').toLowerCase()).includes(clean)) {
      return true;
    }
  }

  if (user.role === 'ADMIN' || user.role === 'ADMIN / Создатель') {
    return true;
  }

  return false;
}
