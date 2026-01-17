# Quick Setup Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Database

1. Create a PostgreSQL database (local or cloud)
2. Copy `.env.example` to `.env`
3. Add your database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/bazar?schema=public"
```

### Step 3: Initialize Database
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data
npm run db:seed
```

### Step 4: (Optional) Set Up Real-time Features

For real-time inventory and order updates, add Pusher credentials to `.env`:
```
PUSHER_APP_ID=your-app-id
PUSHER_KEY=your-key
PUSHER_SECRET=your-secret
PUSHER_CLUSTER=us2
NEXT_PUBLIC_PUSHER_KEY=your-key
NEXT_PUBLIC_PUSHER_CLUSTER=us2
```

**Note:** The app will work without Pusher, but will use polling instead of real-time updates.

### Step 5: Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🎯 Test Accounts

After seeding, you can use these test accounts:

- **Customer:** customer1@example.com
- **Restaurant Owner:** owner@burgerplace.com
- **Admin:** admin@bazar.com

(Note: Authentication is not implemented yet - replace `temp-user-id` with actual auth)

## 📝 Next Steps

1. **Add Authentication:** Integrate NextAuth.js or your preferred auth solution
2. **Add Images:** Set up image upload for creations (Cloudinary, AWS S3, etc.)
3. **Payment:** Integrate Stripe or your payment provider
4. **Deploy:** Deploy to Vercel, Railway, or your preferred platform

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists

### Prisma Errors
- Run `npx prisma generate` after schema changes
- Run `npx prisma db push` to sync schema

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📚 Documentation

See [README.md](./README.md) for full documentation.


