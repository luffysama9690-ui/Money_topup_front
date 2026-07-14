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
};

// Reads the current Telegram user's numeric ID from the Mini App SDK.
// Falls back to a fixed demo ID when opened in a normal browser (so you can
// still test the site outside of Telegram during development).
export function getTelegramId() {
  const tgUser = window?.Telegram?.WebApp?.initDataUnsafe?.user;
  if (tgUser?.id) return String(tgUser.id);
  return "demo-user"; // browser preview fallback
}
