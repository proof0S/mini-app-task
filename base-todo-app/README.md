# Daily Tasks - Farcaster Mini App 🎯

A beautiful daily task manager built for Farcaster. Build better habits, one task at a time!

![Daily Tasks Preview](public/images/og-image.png)

## Features ✨

- ✅ Add, complete, and delete tasks
- 🔥 Streak tracking for consecutive days
- 🎉 Celebration animations (confetti!)
- 💾 Local storage persistence
- 📱 Mobile-first design
- 🎨 Beautiful glassmorphism UI

## Quick Start 🚀

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

### 3. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/base-daily-tasks)

Or deploy manually:

```bash
npm install -g vercel
vercel
```

## Farcaster Setup 📲

### Step 1: Update Environment Variables

After deploying to Vercel, update your `.env` file:

```
NEXT_PUBLIC_URL=https://your-app.vercel.app
```

### Step 2: Create App Images

You need 3 images in `/public/images/`:

1. **icon.png** (200x200) - App icon
2. **splash.png** (200x200) - Splash screen icon  
3. **og-image.png** (1200x630) - Preview image

### Step 3: Generate Account Association

1. Go to [Warpcast Developer Tools](https://warpcast.com/~/developers)
2. Enable Developer Mode
3. Generate your account association signature
4. Update `public/.well-known/farcaster.json` with your signature

### Step 4: Update Manifest

Edit `public/.well-known/farcaster.json`:

```json
{
  "accountAssociation": {
    "header": "YOUR_HEADER",
    "payload": "YOUR_PAYLOAD", 
    "signature": "YOUR_SIGNATURE"
  },
  "frame": {
    "version": "1",
    "name": "Daily Tasks",
    "iconUrl": "https://YOUR-APP.vercel.app/images/icon.png",
    "homeUrl": "https://YOUR-APP.vercel.app",
    "imageUrl": "https://YOUR-APP.vercel.app/images/og-image.png",
    "buttonTitle": "✨ Open App",
    "splashImageUrl": "https://YOUR-APP.vercel.app/images/splash.png",
    "splashBackgroundColor": "#0066CC"
  }
}
```

### Step 5: Test Your Mini App

1. Go to [Farcaster Mini App Embed Tool](https://warpcast.com/~/developers/mini-apps)
2. Enter your app URL
3. Test the preview and functionality

### Step 6: Share!

Cast your app URL on Farcaster. Users can open it directly from the feed!

## Tech Stack 🛠

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **SDK**: @farcaster/frame-sdk
- **Deployment**: Vercel

## Project Structure 📁

```
base-daily-tasks/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── TodoApp.tsx
├── public/
│   ├── .well-known/
│   │   └── farcaster.json
│   └── images/
│       ├── icon.png
│       ├── splash.png
│       └── og-image.png
├── package.json
├── tailwind.config.js
└── README.md
```

## Customization 🎨

### Change Colors

Edit the gradient in `components/TodoApp.tsx`:

```tsx
style={{
  background: 'linear-gradient(135deg, #0066CC 0%, #0099FF 25%, #00BFFF 50%, #6B5BFF 75%, #00D4FF 100%)'
}}
```

### Add More Emojis

Edit the `emojis` array in `components/TodoApp.tsx`:

```tsx
const emojis = ['✨', '🎯', '💪', '📚', '💧', '🏃', '🧘', '💼', '🎨', '🎵', '🍎', '💤'];
```

## Future Updates 🔮

- [ ] Push notifications
- [ ] Categories
- [ ] Statistics page
- [ ] Social sharing
- [ ] On-chain achievements

## License 📄

MIT License

---

Built with 💙 on Base
