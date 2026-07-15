// src/api.js
// All calls to the Monkey Topup backend go through here.
//
// The backend URL comes from an environment variable so it's easy to change
// without touching code (set VITE_API_URL in Vercel's project settings).
// If it's not set, it falls back to the Render URL from setup.
const API_BASE = import.meta.env.VITE_API_URL || "https://monkey-topup.onrender.com/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getUser: (telegramId) => request(`/users/${telegramId}`),

  getOrders: (telegramId) => request(`/orders/${telegramId}`),
  createOrder: (payload) => request(`/orders`, { method: "POST", body: JSON.stringify(payload) }),

  getDeposits: (telegramId) => request(`/deposits/${telegramId}`),
  createDeposit: (payload) => request(`/deposits`, { method: "POST", body: JSON.stringify(payload) }),

  getMessages: (telegramId) => request(`/messages/${telegramId}`),
  getUnreadCount: (telegramId) => request(`/messages/${telegramId}/unread-count`),
  markMessagesRead: (telegramId) => request(`/messages/${telegramId}/mark-read`, { method: "POST" }),

  // Admin-only. The backend re-checks the telegramId against
  // ADMIN_TELEGRAM_ID on every one of these calls — nothing here is trusted
  // just because the frontend calls it.
  checkAdmin: (telegramId) => request(`/admin/check?telegramId=${telegramId}`),
  getPendingItems: (telegramId) => request(`/admin/pending?telegramId=${telegramId}`),
  updateDepositStatus: (telegramId, id, status) =>
    request(`/admin/deposits/${id}/status`, { method: "PATCH", body: JSON.stringify({ telegramId, status }) }),
  updateOrderStatus: (telegramId, id, status) =>
    request(`/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ telegramId, status }) }),
};

// Reads the current Telegram user's numeric ID from the Mini App SDK.
// Falls back to a fixed demo ID when opened in a normal browser (so you can
// still test the site outside of Telegram during development).
export function getTelegramId() {
  const tgUser = window?.Telegram?.WebApp?.initDataUnsafe?.user;
  if (tgUser?.id) return String(tgUser.id);
  return "1000000001"; // numeric fallback so it fits the BIGINT column when testing outside Telegram
}

// Reads display info (name, username, avatar) for the Profile page.
// Falls back to demo values when opened outside Telegram, matching the
// fallback numeric ID above.
export function getTelegramUser() {
  const tgUser = window?.Telegram?.WebApp?.initDataUnsafe?.user;
  if (tgUser) {
    return {
      firstName: tgUser.first_name || "",
      lastName: tgUser.last_name || "",
      username: tgUser.username || "",
      photoUrl: tgUser.photo_url || "",
    };
  }
  return { firstName: "Demo User", lastName: "", username: "", photoUrl: "" };
}
