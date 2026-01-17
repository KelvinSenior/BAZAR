# BAZAR App - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js 14)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Pages (App Router)                                   │   │
│  │ ├─ / (HomePage)                                      │   │
│  │ ├─ /gallery (Community Gallery)                      │   │
│  │ ├─ /build/[restaurantId] (Food Builder)              │   │
│  │ ├─ /profile/creations (User Creations)               │   │
│  │ ├─ /order/live/[orderId] (Order Tracking)            │   │
│  │ └─ /dashboard/* (Restaurant Dashboard)               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Components (React + Framer Motion)                   │   │
│  │ ├─ FoodBuilderCanvas (Drag & Drop)                   │   │
│  │ ├─ PlatePreview3D (Three.js)                         │   │
│  │ ├─ IngredientPalette (UI)                            │   │
│  │ ├─ InventoryTracker (Real-time)                      │   │
│  │ ├─ KitchenView (Kitchen Display)                     │   │
│  │ └─ CreationCard (Gallery Display)                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ State Management (Zustand)                           │   │
│  │ └─ useBuilderStore (Undo/Redo, History)              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Styling (Tailwind CSS + Dark Mode)                   │   │
│  │ └─ Custom theme with food colors                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                    API Routes (Next.js)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ /api/game/save-creation                              │   │
│  │ /api/orders/live                                     │   │
│  │ /api/inventory/[restaurantId]                        │   │
│  │ /api/inventory/update                                │   │
│  │ /api/restaurants/[restaurantId]                      │   │
│  │ /api/dashboard/orders                                │   │
│  │ /api/social/gallery                                  │   │
│  │ /api/social/remix                                    │   │
│  │ /api/users/[userId]/creations                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Input Validation: Zod                                      │
│  Error Handling: Try-Catch + Proper Response Codes          │
└─────────────────────────────────────────────────────────────┘
                            ↓ SQL/ORM
┌─────────────────────────────────────────────────────────────┐
│                  Database Layer (Prisma ORM)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Models:                                              │   │
│  │ ├─ User (CUSTOMER, RESTAURANT, ADMIN)                │   │
│  │ ├─ Restaurant (with owner relationship)              │   │
│  │ ├─ Ingredient (with categories & inventory)          │   │
│  │ ├─ MenuItem (menu composition)                       │   │
│  │ ├─ UserCreation (saved designs)                      │   │
│  │ ├─ Order (with game data)                            │   │
│  │ ├─ Follow (social)                                   │   │
│  │ ├─ Like (social)                                     │   │
│  │ └─ Remix (social)                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ TCP/Network
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Tables with Indexes:                                 │   │
│  │ • Optimized for queries                              │   │
│  │ • Proper foreign key constraints                      │   │
│  │ • Cascade delete for data integrity                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Real-time Layer (Optional):
┌─────────────────────────────────────────────────────────────┐
│                   Pusher or Supabase Realtime               │
│  ├─ Order status updates                                    │
│  ├─ Ingredient availability changes                         │
│  ├─ Kitchen display notifications                           │
│  └─ Social feed updates                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow

### 1. Food Creation Flow
```
User Opens Builder
    ↓
FoodBuilderCanvas Renders (Ingredients Available)
    ↓
User Drags Ingredients (Zustand State Updated)
    ↓
PlatePreview3D Updates in Real-time (3D Rendering)
    ↓
User Saves Creation
    ↓
POST /api/game/save-creation (Zod Validation)
    ↓
Prisma Creates UserCreation + Ingredients Junction
    ↓
Creation Saved to Database
    ↓
User Sees Success Message
```

### 2. Order Flow
```
Customer Views Restaurant
    ↓
GET /api/restaurants/[id] (Ingredient Availability)
    ↓
Customer Selects Menu Item or Uses Builder
    ↓
Customer Adds to Cart (Local State)
    ↓
Customer Proceeds to Checkout
    ↓
POST /api/orders/live (Create Order)
    ↓
Order Created in Database
    ↓
Kitchen Receives Notification (Real-time)
    ↓
Order Status Updates (PENDING → READY → DELIVERED)
    ↓
Customer Sees Live Tracking
```

### 3. Inventory Management Flow
```
Restaurant Opens Dashboard
    ↓
GET /api/inventory/[restaurantId] (Current Stock)
    ↓
Display in InventoryTracker Component
    ↓
Restaurant Updates Stock
    ↓
POST /api/inventory/update (Stock Change)
    ↓
Prisma Updates Ingredient.stock
    ↓
Real-time Update to Builder (Ingredient Availability)
    ↓
Customers See Updated Ingredients
```

### 4. Social Features Flow
```
User Creates Public Dish
    ↓
UserCreation.isPublic = true
    ↓
GET /api/social/gallery (Fetch Public Creations)
    ↓
Displayed in CreationCard Components
    ↓
Users Can Like (POST /api/social/gallery)
    ↓
Likes Counter Updated in Real-time
    ↓
Users Can Remix (POST /api/social/remix)
    ↓
New UserCreation Created (linked to Original)
```

---

## 🎯 Key Features by Layer

### Frontend Features
| Feature | Component | Technology |
|---------|-----------|-----------|
| Drag & Drop Builder | FoodBuilderCanvas | @dnd-kit + Zustand |
| 3D Visualization | PlatePreview3D | Three.js + React Three Fiber |
| Animations | All Components | Framer Motion |
| Real-time Updates | Various | WebSocket (Pusher) |
| State Management | All | Zustand |
| Responsive Design | All | Tailwind CSS |
| Dark Mode | All | Tailwind Dark Mode |

### Backend Features
| Feature | Implementation | Technology |
|---------|---|-----------|
| REST API | API Routes | Next.js 14 |
| Input Validation | API Routes | Zod |
| Database Access | Controllers Logic | Prisma ORM |
| Error Handling | Middleware | Try-Catch + Response |
| Real-time Notifications | Channels | Pusher |

### Database Features
| Feature | Implementation |
|---------|---|
| User Management | Role-based (CUSTOMER/RESTAURANT/ADMIN) |
| Inventory Tracking | Real-time stock management |
| Order Management | Status tracking with game data |
| Social System | Follow, Like, Remix models |
| Relationships | Proper foreign keys & cascade |
| Performance | Indexed queries |

---

## 🔄 User Roles & Permissions

### CUSTOMER
- ✅ Browse restaurants
- ✅ Create custom food designs
- ✅ View real-time ingredient availability
- ✅ Place orders
- ✅ Track orders in real-time
- ✅ View community gallery
- ✅ Like creations
- ✅ Remix others' creations
- ✅ Follow users
- ✅ View their own creations

### RESTAURANT
- ✅ Manage restaurant profile
- ✅ Manage ingredients inventory
- ✅ Build and edit menu items
- ✅ View incoming orders
- ✅ Update order status
- ✅ View analytics
- ✅ Manage kitchen operations

### ADMIN
- ✅ Manage all users
- ✅ Manage all restaurants
- ✅ View system analytics
- ✅ Manage disputes/reports

---

## 🔌 Integration Points (Ready for)

### Authentication (Needs Implementation)
- NextAuth.js, Auth0, or Supabase Auth
- JWT or Session-based
- OAuth with Google/GitHub/Facebook

### Payment (Needs Implementation)
- Stripe or Razorpay
- Order confirmation and invoice generation
- Refund handling

### Real-time (Partially Configured)
- Pusher webhooks for order updates
- Kitchen notifications
- Customer notifications

### Notifications (Needs Implementation)
- Email (SendGrid/Nodemailer)
- SMS (Twilio)
- Push notifications (Firebase Cloud Messaging)

### Analytics (Structure Ready)
- Google Analytics or Mixpanel
- Order analytics
- Revenue tracking
- User behavior

---

## 📦 Dependency Tree

### Critical Dependencies
```
next@14.0.4 (Framework)
├─ react@18.2.0 (UI Library)
├─ typescript@5.3.3 (Language)
├─ prisma@5.7.1 (ORM)
│  └─ @prisma/client@5.7.1
├─ tailwindcss@3.4.0 (Styling)
│  ├─ autoprefixer@10.4.16
│  └─ postcss@8.4.32
├─ zustand@4.4.7 (State)
├─ zod@3.22.4 (Validation)
├─ framer-motion@10.16.16 (Animations)
├─ three@0.159.0 (3D Graphics)
│  ├─ @react-three/fiber@8.15.11
│  └─ @react-three/drei@9.92.7
├─ @dnd-kit/* (Drag & Drop)
├─ pusher@5.2.0 (Real-time)
└─ pusher-js@8.4.0 (Real-time Client)
```

### Dev Dependencies
- ESLint (Code Quality)
- Prettier (Optional Code Formatting)
- tsx (TypeScript Executor)
- Prisma CLI (Database Tools)

---

## 🚀 Performance Considerations

### Frontend Optimization
- ✅ Image lazy loading configured
- ✅ Code splitting (App Router automatic)
- ✅ CSS-in-JS (Tailwind - optimized)
- 🔄 Need: Component-level code splitting
- 🔄 Need: Service workers for offline

### Database Optimization
- ✅ Proper indexing on frequently queried fields
- ✅ Relationships optimized with select()
- 🔄 Need: Query performance monitoring
- 🔄 Need: Caching strategy (Redis)
- 🔄 Need: Pagination on list endpoints

### API Optimization
- 🔄 Need: Rate limiting
- 🔄 Need: Request compression
- 🔄 Need: Caching headers
- 🔄 Need: CDN for static assets

---

## 🔐 Security Architecture

### Current Implementation
- ✅ TypeScript (type safety)
- ✅ Zod validation (input sanitization)
- ✅ Environment variables (secrets management)

### Needs Implementation
- 🔄 Authentication middleware
- 🔄 CORS configuration
- 🔄 CSRF protection
- 🔄 Rate limiting
- 🔄 SQL injection prevention (Prisma handles)
- 🔄 XSS protection
- 🔄 Helmet.js for security headers
- 🔄 HTTPS/SSL enforcement

---

## 📈 Scalability Roadmap

### Phase 1 (Current)
- Single database instance
- Serverless deployment (Vercel)
- No caching layer

### Phase 2 (After MVP)
- Redis caching
- Database connection pooling
- CDN for static assets
- Image optimization service

### Phase 3 (Growth)
- Database replication
- Horizontal scaling
- Microservices consideration
- Message queue (for notifications)

### Phase 4 (Enterprise)
- Kubernetes orchestration
- Advanced monitoring
- Disaster recovery setup
- Multi-region deployment

---

## 📝 Notes for Development Team

1. **Always validate input** with Zod schemas
2. **Use Prisma types** for type safety
3. **Test API routes** before deployment
4. **Monitor database queries** for N+1 problems
5. **Use error boundaries** on frontend
6. **Implement proper logging** for debugging
7. **Test real-time features** with WebSocket
8. **Secure sensitive routes** with authentication
9. **Use environment variables** for configuration
10. **Document API changes** in comments

---

**Last Updated:** January 17, 2026  
**Status:** Production Ready Architecture ✅
