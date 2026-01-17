# 🔧 Fixing Database Connection Issues

## Current Issue
The app can't connect to your Supabase database. This is common and fixable!

## Quick Fixes

### Fix 1: Wake Up Supabase Database (Most Common Issue)

**Free tier Supabase databases pause after 1 week of inactivity!**

1. Go to https://supabase.com/dashboard
2. Open your project
3. Go to **Settings → Database**
4. Scroll down and look for "Paused" status
5. Click **"Resume"** or **"Restore"** to wake it up
6. Wait 1-2 minutes for the database to start

### Fix 2: Check Connection String Format

Your connection string should look like this:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

**Common Issues:**
- ❌ Double `@@` - Should be single `@` between password and host
- ❌ Missing password - Make sure password is included
- ❌ Wrong format - Copy directly from Supabase dashboard

**How to get the correct connection string:**
1. Go to Supabase Dashboard → Settings → Database
2. Scroll to "Connection string"
3. Select **"Session mode"** or **"Transaction mode"**
4. Copy the entire string (it includes your password)
5. Paste it in your `.env` file as `DATABASE_URL=...`

### Fix 3: Verify Your .env File

Make sure your `.env` file in the `BAZAR` folder has:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
```

**Note:** The connection string should be in quotes and on one line.

### Fix 4: Check IP Whitelisting (If Needed)

Some Supabase projects require IP whitelisting:
1. Go to Settings → Database → Connection Pooling
2. Check if "Restrict connections to specific IPs" is enabled
3. If yes, either:
   - Add your IP address to the allowlist
   - Or disable IP restrictions (for development)

## After Fixing Connection

Once your database is connected, run:

```bash
# Create tables
npx prisma db push

# Add sample data
npm run db:seed
```

Then refresh your browser - you should see restaurants!

## Test Connection

To test if your database is reachable:

```bash
# Test with Prisma
npx prisma db pull

# Or check connection string format
npx prisma validate
```

## Still Having Issues?

If none of the above work:

1. **Check Supabase Status:** Visit https://status.supabase.com
2. **Verify Database is Active:** Check Supabase dashboard → Project status
3. **Try Connection Pooler URL:** Use the "Connection pooling" URL instead of direct connection
4. **Check Firewall:** Make sure your firewall isn't blocking port 5432

---

**The app will now run even without database connection** - you'll see a helpful message instead of errors! 🎉

