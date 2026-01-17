const { PrismaClient } = require('@prisma/client')

async function main() {
  console.log('🌱 Reseeding database with fresh data...')
  
  let prisma
  try {
    console.log('Instantiating PrismaClient...')
    prisma = new PrismaClient()
    console.log('✅ PrismaClient instantiated successfully')
  } catch (err) {
    console.error('❌ Failed to instantiate PrismaClient:', err)
    throw err
  }

  try {
    // Just seed - if data exists it will skip (see below)
    console.log('Starting seed...')

    // Create users
    console.log('Creating users...')
    const owner1 = await prisma.user.create({
      data: { email: 'pizza@bazar.com', name: 'Pizza Owner', role: 'RESTAURANT' }
    })

    const owner2 = await prisma.user.create({
      data: { email: 'burger@bazar.com', name: 'Burger Owner', role: 'RESTAURANT' }
    })

    const owner3 = await prisma.user.create({
      data: { email: 'sushi@bazar.com', name: 'Sushi Owner', role: 'RESTAURANT' }
    })

    // Create Pizza Restaurant
    console.log('Creating Pizza Hut Express...')
    const pizzaResto = await prisma.restaurant.create({
      data: {
        name: 'Pizza Hut Express',
        description: 'Delicious Italian pizzas',
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800',
        address: '123 Pizza St',
        phone: '555-0001',
        isActive: true,
        ownerId: owner1.id,
      },
    })

    // Create ingredients for Pizza
    console.log('Creating pizza ingredients...')
    const mozzarella = await prisma.ingredient.create({ 
      data: { name: 'Mozzarella', category: 'CHEESE', price: 1.5, stock: 100, restaurantId: pizzaResto.id } 
    })
    const pepperoni = await prisma.ingredient.create({ 
      data: { name: 'Pepperoni', category: 'PROTEIN', price: 2.0, stock: 80, restaurantId: pizzaResto.id } 
    })
    const tomatoSauce = await prisma.ingredient.create({ 
      data: { name: 'Tomato Sauce', category: 'SAUCE', price: 0.5, stock: 100, restaurantId: pizzaResto.id } 
    })
    const basil = await prisma.ingredient.create({ 
      data: { name: 'Basil', category: 'TOPPING', price: 0.5, stock: 50, restaurantId: pizzaResto.id } 
    })
    const mushrooms = await prisma.ingredient.create({ 
      data: { name: 'Mushrooms', category: 'VEGETABLE', price: 0.8, stock: 70, restaurantId: pizzaResto.id } 
    })

    // Create pizza menu items
    console.log('Creating pizza menu items...')
    await prisma.menuItem.create({
      data: {
        name: 'Margherita',
        description: 'Classic pizza with tomato and mozzarella',
        basePrice: 10.99,
        category: 'PIZZA',
        restaurantId: pizzaResto.id,
        isAvailable: true,
        preparationTime: 15,
        rating: 4.7,
        ingredients: {
          create: [
            { ingredientId: mozzarella.id, quantity: 2, isRequired: true },
            { ingredientId: tomatoSauce.id, quantity: 1, isRequired: true },
            { ingredientId: basil.id, quantity: 1, isRequired: true },
          ],
        },
      },
    })

    await prisma.menuItem.create({
      data: {
        name: 'Pepperoni Pizza',
        description: 'Loaded with pepperoni and cheese',
        basePrice: 12.99,
        category: 'PIZZA',
        restaurantId: pizzaResto.id,
        isAvailable: true,
        preparationTime: 15,
        rating: 4.8,
        ingredients: {
          create: [
            { ingredientId: mozzarella.id, quantity: 2, isRequired: true },
            { ingredientId: pepperoni.id, quantity: 1, isRequired: true },
            { ingredientId: tomatoSauce.id, quantity: 1, isRequired: true },
          ],
        },
      },
    })

    console.log('✅ Pizza Hut Express created with 2 items')

    // Create Burger Restaurant
    console.log('Creating Burger Kingdom...')
    const burgerResto = await prisma.restaurant.create({
      data: {
        name: 'Burger Kingdom',
        description: 'Premium burgers and fries',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
        address: '456 Burger Ave',
        phone: '555-0002',
        isActive: true,
        ownerId: owner2.id,
      },
    })

    const beefPatty = await prisma.ingredient.create({ 
      data: { name: 'Beef Patty', category: 'PROTEIN', price: 3.0, stock: 100, restaurantId: burgerResto.id } 
    })
    const cheddar = await prisma.ingredient.create({ 
      data: { name: 'Cheddar', category: 'CHEESE', price: 1.0, stock: 100, restaurantId: burgerResto.id } 
    })
    const lettuce = await prisma.ingredient.create({ 
      data: { name: 'Lettuce', category: 'VEGETABLE', price: 0.5, stock: 100, restaurantId: burgerResto.id } 
    })
    const tomato = await prisma.ingredient.create({ 
      data: { name: 'Tomato', category: 'VEGETABLE', price: 0.5, stock: 100, restaurantId: burgerResto.id } 
    })
    const bacon = await prisma.ingredient.create({ 
      data: { name: 'Bacon', category: 'PROTEIN', price: 2.0, stock: 80, restaurantId: burgerResto.id } 
    })

    await prisma.menuItem.create({
      data: {
        name: 'Classic Burger',
        description: 'Juicy beef with lettuce and tomato',
        basePrice: 8.99,
        category: 'BURGERS',
        restaurantId: burgerResto.id,
        isAvailable: true,
        preparationTime: 10,
        rating: 4.5,
        ingredients: {
          create: [
            { ingredientId: beefPatty.id, quantity: 1, isRequired: true },
            { ingredientId: lettuce.id, quantity: 1, isRequired: true },
            { ingredientId: tomato.id, quantity: 1, isRequired: true },
          ],
        },
      },
    })

    await prisma.menuItem.create({
      data: {
        name: 'Bacon Cheeseburger',
        description: 'Beef with bacon and cheddar',
        basePrice: 10.99,
        category: 'BURGERS',
        restaurantId: burgerResto.id,
        isAvailable: true,
        preparationTime: 10,
        rating: 4.7,
        ingredients: {
          create: [
            { ingredientId: beefPatty.id, quantity: 1, isRequired: true },
            { ingredientId: bacon.id, quantity: 1, isRequired: true },
            { ingredientId: cheddar.id, quantity: 1, isRequired: true },
          ],
        },
      },
    })

    console.log('✅ Burger Kingdom created with 2 items')

    // Create Sushi Restaurant
    console.log('Creating Sushi Bar Premium...')
    const sushiResto = await prisma.restaurant.create({
      data: {
        name: 'Sushi Bar Premium',
        description: 'Fresh authentic sushi',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
        address: '789 Sushi Lane',
        phone: '555-0003',
        isActive: true,
        ownerId: owner3.id,
      },
    })

    const salmon = await prisma.ingredient.create({ 
      data: { name: 'Salmon', category: 'PROTEIN', price: 3.5, stock: 80, restaurantId: sushiResto.id } 
    })
    const sushiRice = await prisma.ingredient.create({ 
      data: { name: 'Sushi Rice', category: 'CARB', price: 0.5, stock: 150, restaurantId: sushiResto.id } 
    })
    const nori = await prisma.ingredient.create({ 
      data: { name: 'Nori', category: 'TOPPING', price: 1.0, stock: 100, restaurantId: sushiResto.id } 
    })
    const avocado = await prisma.ingredient.create({ 
      data: { name: 'Avocado', category: 'VEGETABLE', price: 1.5, stock: 70, restaurantId: sushiResto.id } 
    })
    const cucumber = await prisma.ingredient.create({ 
      data: { name: 'Cucumber', category: 'VEGETABLE', price: 0.5, stock: 100, restaurantId: sushiResto.id } 
    })

    await prisma.menuItem.create({
      data: {
        name: 'Salmon Roll',
        description: 'Fresh salmon with cucumber',
        basePrice: 9.99,
        category: 'RICE_BOWLS',
        restaurantId: sushiResto.id,
        isAvailable: true,
        preparationTime: 8,
        rating: 4.8,
        ingredients: {
          create: [
            { ingredientId: salmon.id, quantity: 1, isRequired: true },
            { ingredientId: sushiRice.id, quantity: 1, isRequired: true },
            { ingredientId: nori.id, quantity: 1, isRequired: true },
          ],
        },
      },
    })

    await prisma.menuItem.create({
      data: {
        name: 'Vegetable Roll',
        description: 'Cucumber, avocado, and vegetables',
        basePrice: 7.99,
        category: 'RICE_BOWLS',
        restaurantId: sushiResto.id,
        isAvailable: true,
        preparationTime: 8,
        rating: 4.5,
        ingredients: {
          create: [
            { ingredientId: cucumber.id, quantity: 1, isRequired: true },
            { ingredientId: avocado.id, quantity: 1, isRequired: true },
            { ingredientId: sushiRice.id, quantity: 1, isRequired: true },
          ],
        },
      },
    })

    console.log('✅ Sushi Bar Premium created with 2 items')

    console.log('\n✅ Database seeded successfully!')
    console.log('   3 Restaurants created')
    console.log('   6 Menu Items created')
    console.log('   17 Ingredients created')
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Stack:', error.stack)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
