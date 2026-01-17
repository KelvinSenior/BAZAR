# BAZAR - Interactive Food Delivery Platform

BAZAR is a game-like food delivery platform where customers build their meals through an interactive drag-and-drop interface with real-time inventory tracking and social features.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Animations:** Framer Motion, React Spring
- **3D Graphics:** Three.js with React Three Fiber
- **Drag & Drop:** @dnd-kit
- **Real-time:** Pusher (or Supabase Realtime)

## 📋 Features

### Customer Side
- 🎮 Interactive drag-and-drop food builder
- 🎨 3D plate preview with rotation
- 📱 Real-time ingredient availability
- 💾 Save and name custom creations
- 🌐 Explore community gallery
- 🔄 Remix others' creations
- ❤️ Like and follow system
- 📦 Real-time order tracking

### Restaurant Side
- 📊 Real-time inventory management
- 🍳 Kitchen display system (KDS)
- 📝 Menu builder
- 📈 Analytics dashboard
- 🔔 Low stock alerts

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database
- (Optional) Pusher account for real-time features

### Installation

1. **Clone and install dependencies:**
```bash
cd BAZAR
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add:
- `DATABASE_URL` - Your PostgreSQL connection string
- `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER` - For real-time features (optional)

3. **Set up the database:**
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database with sample data
npm run db:seed
```

4. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
BAZAR/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── build/             # Food builder page
│   ├── dashboard/         # Restaurant dashboard
│   ├── gallery/          # Community gallery
│   ├── profile/          # User profile pages
│   └── order/            # Order tracking
├── components/            # React components
│   ├── FoodBuilderCanvas.tsx
│   ├── IngredientPalette.tsx
│   ├── InventoryTracker.tsx
│   ├── PlatePreview3D.tsx
│   └── KitchenView.tsx
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma client
│   ├── store.ts          # Zustand store
│   └── types.ts          # TypeScript types
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── public/               # Static assets
```

## 🎯 Key Pages

### Customer Pages
- `/` - Homepage with featured restaurants
- `/build/[restaurantId]` - Main food builder interface
- `/gallery` - Community creations gallery
- `/profile/creations` - User's saved creations
- `/order/live/[orderId]` - Real-time order tracking

### Restaurant Dashboard
- `/dashboard/inventory` - Inventory management
- `/dashboard/orders` - Order management (KDS)
- `/dashboard/menu-builder` - Menu creation
- `/dashboard/analytics` - Analytics and insights

## 🔌 API Routes

- `POST /api/game/save-creation` - Save a food creation
- `POST /api/inventory/update` - Update ingredient stock
- `GET /api/inventory/[restaurantId]` - Get restaurant inventory
- `GET /api/orders/live` - Get order details
- `POST /api/orders/live` - Update order status
- `POST /api/social/remix` - Remix a creation
- `GET /api/social/gallery` - Get gallery creations

## 🎮 Game Features

### Drag & Drop Builder
- Drag ingredients from palette to canvas
- Position and rotate ingredients
- Undo/redo functionality
- Real-time 3D preview

### Mini-Games (Future)
- Grill timing game
- Sauce mixing challenge
- Assembly speed test

## 🔄 Real-time Updates

The platform uses Pusher for real-time updates:
- Inventory stock changes
- Order status updates
- New creations in gallery

If Pusher is not configured, the app falls back to polling.

## 🗄️ Database Schema

Key models:
- `User` - Customers and restaurant owners
- `Restaurant` - Restaurant information
- `Ingredient` - Ingredients with real-time stock
- `MenuItem` - Restaurant menu items
- `UserCreation` - Saved food designs
- `Order` - Orders with game data
- `Follow`, `Like`, `Remix` - Social features

## 🚧 Development Roadmap

### Week 1 ✅
- [x] Basic drag-drop builder
- [x] 5+ ingredients
- [x] Save functionality

### Week 2 ✅
- [x] Inventory system
- [x] Restaurant dashboard
- [x] Real-time updates

### Week 3 ✅
- [x] Social features
- [x] Gallery
- [x] Remix functionality

### Week 4 (Future)
- [ ] Mini-games
- [ ] Sound effects
- [ ] Haptic feedback
- [ ] Mobile optimizations
- [ ] Advanced analytics

## 📝 Notes

- Replace `temp-user-id` and `temp-restaurant-id` with actual authentication
- Add image upload functionality for creations
- Implement proper error boundaries
- Add loading skeletons for better UX
- Set up CDN for ingredient images

## 🤝 Contributing

This is a production-ready starter template. Extend it with:
- Authentication (NextAuth.js recommended)
- Payment processing
- Email notifications
- Advanced analytics
- Mobile app (React Native)

## 📄 License

MIT License - feel free to use this project for your own food delivery platform!

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
