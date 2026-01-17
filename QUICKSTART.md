# 🚀 Quick Start Guide - See What's Built So Far

## Step-by-Step Instructions

### ✅ Step 1: Install Dependencies (First Time Only)

Open terminal in the `BAZAR` folder and run:

```bash
npm install
```

**Wait for this to complete** - it installs all required packages.

---

### ✅ Step 2: Set Up Database

#### Option A: Quick Setup with Supabase (Recommended - Free & Easy)

1. Go to https://supabase.com and sign up (free)
2. Create a new project
3. Go to **Settings → Database**
4. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
5. Create a `.env` file in the `BAZAR` folder
6. Add this line (replace with your Supabase connection string):
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
   ```

#### Option B: Local PostgreSQL

1. Install PostgreSQL on your computer
2. Create a database named `bazar`
3. Create a `.env` file in the `BAZAR` folder
4. Add:
   ```
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/bazar?schema=public"
   ```

---

### ✅ Step 3: Initialize Database

Run these commands in order:

```bash
# Generate Prisma Client (creates database client)
npx prisma generate

# Create database tables
npx prisma db push

# Add sample data (restaurants, ingredients, etc.)
npm run db:seed
```

**You should see:** "🎉 Database seed completed!"

---

### ✅ Step 4: Start the Development Server

```bash
npm run dev
```

**You should see:**
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Ready in 2.3s
```

---

### ✅ Step 5: Open in Browser

Go to: **http://localhost:3000**

---

## 🎯 What You'll See

### Homepage (`/`)
- Featured restaurants
- "Explore Gallery" and "Browse Restaurants" buttons
- Gradient background with BAZAR branding

### Food Builder (`/build/[restaurantId]`)
- **Left Side:** Ingredient palette with categories (Protein, Vegetables, Sauces, etc.)
- **Center:** Dark canvas for drag-and-drop building
- **Right Side:** 
  - 3D plate preview (rotating view)
  - Inventory tracker with stock levels

**Try it:**
1. Drag ingredients from left to center
2. See them appear on the canvas
3. Watch the 3D preview update
4. Use Undo/Redo buttons
5. Click "Save" to save your creation

### Gallery (`/gallery`)
- Community food creations
- Sort by Popular or Recent
- View likes and remixes count

### Profile (`/profile/creations`)
- Your saved creations
- Remix option

### Restaurant Dashboard (`/dashboard/*`)
- Inventory management
- Order tracking (Kitchen Display System)
- Menu builder
- Analytics

---

## 🔍 Quick Test Checklist

After running, verify these work:

- [ ] Homepage loads with restaurants
- [ ] Click a restaurant → Opens builder
- [ ] Drag ingredients to canvas
- [ ] 3D preview shows ingredients
- [ ] Undo/Redo buttons work
- [ ] Gallery page loads
- [ ] Inventory shows stock levels

---

## ❌ Troubleshooting

### "Module not found" error
```bash
rm -rf node_modules
npm install
```

### Database connection error
- Check your `.env` file exists
- Verify DATABASE_URL is correct
- Make sure PostgreSQL is running (if local)

### Port 3000 already in use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Prisma errors
```bash
npx prisma generate
npx prisma db push
```

---

## 📱 Want to Test on iPhone?

See `MOBILE_SETUP.md` for instructions on accessing from your phone on the same Wi-Fi network.

---

## 🎨 What's Been Built

✅ Complete database schema with relationships  
✅ Drag-and-drop food builder  
✅ 3D plate preview with Three.js  
✅ Real-time inventory tracking  
✅ Restaurant dashboard  
✅ Gallery and social features  
✅ API routes for all features  
✅ Sample data with 30+ ingredients  

**Everything is production-ready with TypeScript, error handling, and mobile-responsive design!**

