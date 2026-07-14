# Monkey Topup — Frontend (Mini App UI)

This is the React website that becomes your Telegram Mini App. It talks to
the backend you already deployed on Render (`https://monkey-topup.onrender.com`)
to load real balances, orders, deposits, and notifications for each
Telegram user.

## What changed from the demo version
- `src/api.js` — new file that calls your backend's API
- `src/App.jsx` — now loads real data on startup (`useEffect`) instead of
  using fake starting values, and "Buy" / "Deposit" now hit the real API
- Balance, orders, and messages are per Telegram user (`telegramId`), read
  from `window.Telegram.WebApp` when opened inside Telegram

## How to put this on GitHub

Same idea as the backend:
1. Install **GitHub Desktop** (desktop.github.com) if you haven't already.
2. Sign in, choose **"Add Local Repository"**, pick this folder.
3. Click **"Publish repository"**. Name it `monkey-topup-frontend`.

## How to deploy it on Vercel (step-by-step)

1. Go to **vercel.com**, click **"Log In"**, choose **"Continue with GitHub"**.
2. Click **"Add New..."** → **"Project"**.
3. Find `monkey-topup-frontend` in the repo list and click **Import**.
4. Vercel auto-detects this as a Vite project — leave the build settings as
   they are (Build Command: `vite build`, Output Directory: `dist`).
5. Expand **"Environment Variables"** and add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://monkey-topup.onrender.com/api`
6. Click **Deploy**. Wait ~1 minute.
7. When it's done, Vercel gives you a URL like
   `https://monkey-topup-frontend.vercel.app` — open it in a browser to
   confirm the shop loads (it'll use a "demo-user" balance since you're not
   inside Telegram yet).

## Final step: connect it to your Telegram Bot

1. Open Telegram, message **@BotFather**.
2. Send `/mybots`, choose your bot (Monkey Topup).
3. Choose **Bot Settings** → **Menu Button** → **Edit Menu Button URL**.
4. Paste your Vercel URL (e.g. `https://monkey-topup-frontend.vercel.app`).
5. Open your bot in Telegram and tap the menu button — your shop should
   open, showing your real Telegram-linked balance.

## Testing locally (optional)

```
npm install
npm run dev
```
Opens at `http://localhost:5173`. Outside Telegram it uses a fixed
"demo-user" ID so you can still click around and test the UI and API calls.

## Known limitation to fix later

Payment-screenshot images aren't uploaded to storage yet — the file picker
works, but the image itself isn't sent to the backend (there's no file
storage service wired up yet, e.g. Cloudinary or S3). The deposit/order
still gets created; the admin would need the screenshot sent another way
(e.g. the customer forwards it to the bot chat) until that's added.
