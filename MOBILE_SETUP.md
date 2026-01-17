# 📱 Running BAZAR on iPhone During Development

## Quick Setup for iPhone Testing

### Step 1: Find Your Computer's IP Address

**On Windows:**
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x or 10.x.x.x)

**On Mac/Linux:**
```bash
ifconfig | grep "inet "
```
Or use:
```bash
ip addr show | grep "inet "
```

### Step 2: Start the Dev Server for Mobile Access

Instead of `npm run dev`, use:
```bash
npm run dev:mobile
```

This starts the server on `0.0.0.0`, making it accessible from your local network.

### Step 3: Connect Your iPhone

1. **Ensure both devices are on the same Wi-Fi network**
   - Your computer and iPhone must be on the same Wi-Fi

2. **Open Safari on your iPhone**
   - Go to: `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`

3. **Bookmark it** for easy access during development

### Step 4: Enable Mobile Features

The app is already mobile-responsive, but you can enhance the experience:

#### Enable Touch Gestures
The drag-and-drop works with touch on mobile devices.

#### Test Real-time Features
- Real-time inventory updates work on mobile
- Order tracking updates in real-time
- Gallery loads with mobile-optimized images

## 🔧 Troubleshooting

### Can't Connect?

1. **Check Firewall:**
   - Windows: Allow Node.js through Windows Firewall
   - Mac: System Preferences → Security → Firewall → Allow Node

2. **Verify IP Address:**
   - Make sure you're using the correct IP (not 127.0.0.1)
   - Try pinging your computer from iPhone (not possible, but verify IP is correct)

3. **Check Network:**
   - Both devices must be on the same Wi-Fi
   - Some corporate networks block device-to-device communication

### Alternative: Use ngrok (For Testing Outside Local Network)

If you need to test from anywhere:

1. Install ngrok:
```bash
npm install -g ngrok
```

2. Start your dev server:
```bash
npm run dev
```

3. In another terminal, run:
```bash
ngrok http 3000
```

4. Use the ngrok URL on your iPhone (works from anywhere!)

## 📱 Mobile-Specific Features

The app includes:
- ✅ Touch-friendly drag-and-drop
- ✅ Responsive layouts
- ✅ Mobile-optimized navigation
- ✅ Touch gestures for 3D preview rotation
- ✅ Mobile-friendly forms

## 🚀 Pro Tips

1. **Use Chrome DevTools Remote Debugging:**
   - Connect iPhone via USB
   - Open Chrome → `chrome://inspect`
   - Debug directly from your computer

2. **Hot Reload Works:**
   - Changes auto-reload on your iPhone
   - No need to refresh manually

3. **Test Different Screen Sizes:**
   - The app is responsive, but test on actual device for best results

## ⚠️ Important Notes

- The app runs as a **web app** in Safari, not as a native app
- For a true native app experience, you'd need to create a React Native version
- Performance is optimized for mobile browsers
- Some features (like haptic feedback) require native app implementation

---

**Need a Native App?** If you want a true Expo/React Native app, I can help create a mobile version that shares the same backend API!


