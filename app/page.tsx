import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
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
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('Database connection error:', error)
    // Continue with empty array - app will show setup message
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation Bar */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-400">BAZAR</Link>
          <div className="flex gap-4">
            <Link
              href="/restaurants"
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              Restaurants
            </Link>
            <Link
              href="/gallery"
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              Gallery
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-colors font-medium"
            >
              <ShoppingBag size={20} />
              Cart
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            BAZAR
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Build your perfect meal through an interactive game-like experience
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/restaurants"
              className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
            >
              Browse Restaurants
            </Link>
            <Link
              href="/gallery"
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
            >
              Explore Gallery
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
                  href={`/restaurants/${restaurant.id}`}
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
                      <p className="text-slate-400 text-sm line-clamp-2">{restaurant.description}</p>
                    )}
                    <div className="mt-4 text-primary-400 font-semibold">View Menu →</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
              <p className="text-slate-400">No restaurants available yet</p>
              <p className="text-slate-500 text-sm mt-2">Check back soon for exciting new restaurants!</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Meal?</h2>
          <p className="text-lg mb-6 opacity-90">Choose your restaurant and start creating with our interactive food builder</p>
          <Link
            href="/restaurants"
            className="inline-block px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  )
}
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


