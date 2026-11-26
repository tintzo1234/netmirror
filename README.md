# NetMirror — Netflix Clone Setup Guide

Welcome to **NetMirror**! Your full-stack video streaming platform with:
- 🎬 Netflix dark UI with responsive grids, hero banner, sliders & categories
- 🔐 User Email/Password Authentication & profiles
- 📺 Movies & TV Series (Seasons & Episodes management)
- 💾 Download toggle per movie/episode (Admin controlled)
- 🛠️ **Admin Panel** (`/admin`): Upload movies, series episodes, set downloads, manage items
- 👑 **Super Admin Dashboard** (`/superadmin`): View all registered users, their individual watch history, top-watched titles, and activity logs

---

## 1. Prerequisites (Install Node.js)
Since Node.js was not detected on your Windows machine:
1. Download & Install Node.js LTS from: **[https://nodejs.org/](https://nodejs.org/)**
2. Check in PowerShell or Terminal:
   ```bash
   node --version
   npm --version
   ```

---

## 2. Setup Firebase (100% Free Tier)
1. Go to **[https://console.firebase.google.com/](https://console.firebase.google.com/)** and click **Create a Project**.
2. **Enable Authentication**:
   - Go to **Build > Authentication > Sign-in method**.
   - Enable **Email/Password**.
3. **Enable Firestore Database**:
   - Go to **Build > Firestore Database > Create Database**.
   - Choose **Start in production mode** (or test mode for quick start).
   - In Firestore **Rules** tab, paste the rules from `firestore.rules`.
4. **Enable Cloud Storage**:
   - Go to **Build > Storage > Get Started**.
   - Start in test mode or production mode.
5. **Get your Project Configuration**:
   - In Project Settings (gear icon) > General > Your apps > click Web (`</>`).
   - Copy the `firebaseConfig` keys.
6. Create `.env.local` inside this project directory (`Netmirror/.env.local`):
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

---

## 3. How to Make Yourself Admin or Super Admin
1. Register on the website via `/register`.
2. Open **Firebase Console > Firestore Database > users collection**.
3. Find your user document (matches your `uid`).
4. Change the `role` field value from `"user"` to:
   - `"admin"` (access to `/admin` to upload movies & series)
   - `"superadmin"` (access to `/admin` AND `/superadmin` to view all users & watch history)

---

## 4. Run the Website
Inside the `Netmirror` folder:
```bash
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!
