import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  // Fetch featured restaurants with error handling
  let restaurants = []
  try {
    restaurants = await prisma.restaurant.findMany({
      where: { isActive: true },
      take: 6,
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
      },
    })
  } catch (error) {
    console.error('Database connection error:', error)
    // Continue with empty array - app will show setup message
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            BAZAR
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Build your perfect meal through an interactive game-like experience
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/gallery"
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
            >
              Explore Gallery
            </Link>
            <Link
              href="/restaurants"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>

        {/* Featured Restaurants */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Featured Restaurants</h2>
          {restaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/build/${restaurant.id}`}
                  className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-primary-500 transition-all hover:scale-105"
                >
                  {restaurant.image && (
                    <div className="h-48 bg-slate-700 relative overflow-hidden">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2">{restaurant.name}</h3>
                    {restaurant.description && (
                      <p className="text-slate-400 text-sm">{restaurant.description}</p>
                    )}
                    <div className="mt-4 text-primary-400 font-semibold">Start Building →</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Database Not Connected</h3>
              <p className="text-yellow-300 mb-4">
                The app is running, but can't connect to the database. To see restaurants and ingredients, please:
              </p>
              <ol className="text-left text-yellow-200 space-y-2 max-w-2xl mx-auto mb-4">
                <li>1. Check your Supabase database is active (free tier databases pause after inactivity)</li>
                <li>2. Verify your DATABASE_URL in the <code className="bg-slate-800 px-2 py-1 rounded">.env</code> file is correct</li>
                <li>3. Run <code className="bg-slate-800 px-2 py-1 rounded">npx prisma db push</code> to create tables</li>
                <li>4. Run <code className="bg-slate-800 px-2 py-1 rounded">npm run db:seed</code> to add sample data</li>
              </ol>
              <p className="text-sm text-yellow-300">
                💡 <strong>Tip:</strong> If using Supabase, wake up your database by visiting the Supabase dashboard, then try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


