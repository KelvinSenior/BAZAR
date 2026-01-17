import { PrismaClient, IngredientCategory, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bazar.com' },
    update: {},
    create: {
      email: 'admin@bazar.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  })

  // Create restaurant owner
  const restaurantOwner = await prisma.user.upsert({
    where: { email: 'owner@burgerplace.com' },
    update: {},
    create: {
      email: 'owner@burgerplace.com',
      name: 'Burger Place Owner',
      role: UserRole.RESTAURANT,
    },
  })

  // Create customer users
  const customer1 = await prisma.user.upsert({
    where: { email: 'customer1@example.com' },
    update: {},
    create: {
      email: 'customer1@example.com',
      name: 'John Doe',
      role: UserRole.CUSTOMER,
    },
  })

  const customer2 = await prisma.user.upsert({
    where: { email: 'customer2@example.com' },
    update: {},
    create: {
      email: 'customer2@example.com',
      name: 'Jane Smith',
      role: UserRole.CUSTOMER,
    },
  })

  console.log('✅ Users created')

  // Create restaurants
  const burgerPlace = await prisma.restaurant.upsert({
    where: { ownerId: restaurantOwner.id },
    update: {},
    create: {
      name: 'Burger Place',
      description: 'The best burgers in town with customizable ingredients',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800',
      address: '123 Main St, Food City',
      phone: '+1-555-0123',
      isActive: true,
      ownerId: restaurantOwner.id,
    },
  })

  const pizzaPalace = await prisma.restaurant.create({
    data: {
      name: 'Pizza Palace',
      description: 'Build your perfect pizza with fresh ingredients',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
      address: '456 Pizza Ave, Food City',
      phone: '+1-555-0456',
      isActive: true,
      owner: {
        create: {
          email: 'owner@pizzapalace.com',
          name: 'Pizza Palace Owner',
          role: UserRole.RESTAURANT,
        },
      },
    },
  })

  console.log('✅ Restaurants created')

  // Create ingredients for Burger Place
  const burgerIngredients = [
    // Proteins
    { name: 'Beef Patty', category: IngredientCategory.PROTEIN, price: 3.50, stock: 50, minStock: 10 },
    { name: 'Chicken Patty', category: IngredientCategory.PROTEIN, price: 3.00, stock: 30, minStock: 10 },
    { name: 'Veggie Patty', category: IngredientCategory.PROTEIN, price: 2.50, stock: 20, minStock: 5 },
    { name: 'Bacon', category: IngredientCategory.PROTEIN, price: 2.00, stock: 40, minStock: 10 },
    
    // Vegetables
    { name: 'Lettuce', category: IngredientCategory.VEGETABLE, price: 0.50, stock: 100, minStock: 20 },
    { name: 'Tomato', category: IngredientCategory.VEGETABLE, price: 0.75, stock: 80, minStock: 20 },
    { name: 'Onion', category: IngredientCategory.VEGETABLE, price: 0.50, stock: 60, minStock: 15 },
    { name: 'Pickles', category: IngredientCategory.VEGETABLE, price: 0.50, stock: 90, minStock: 20 },
    { name: 'Jalapeños', category: IngredientCategory.VEGETABLE, price: 0.75, stock: 50, minStock: 10 },
    
    // Carbs
    { name: 'Brioche Bun', category: IngredientCategory.CARB, price: 1.00, stock: 100, minStock: 25 },
    { name: 'Sesame Bun', category: IngredientCategory.CARB, price: 1.00, stock: 80, minStock: 20 },
    { name: 'Whole Wheat Bun', category: IngredientCategory.CARB, price: 1.25, stock: 40, minStock: 10 },
    { name: 'Lettuce Wrap', category: IngredientCategory.CARB, price: 0.75, stock: 60, minStock: 15 },
    
    // Cheese
    { name: 'Cheddar', category: IngredientCategory.CHEESE, price: 1.00, stock: 70, minStock: 15 },
    { name: 'Swiss', category: IngredientCategory.CHEESE, price: 1.25, stock: 50, minStock: 10 },
    { name: 'Pepper Jack', category: IngredientCategory.CHEESE, price: 1.25, stock: 45, minStock: 10 },
    { name: 'Blue Cheese', category: IngredientCategory.CHEESE, price: 1.50, stock: 30, minStock: 5 },
    
    // Sauces
    { name: 'Ketchup', category: IngredientCategory.SAUCE, price: 0.25, stock: 200, minStock: 50 },
    { name: 'Mustard', category: IngredientCategory.SAUCE, price: 0.25, stock: 180, minStock: 50 },
    { name: 'Mayo', category: IngredientCategory.SAUCE, price: 0.25, stock: 150, minStock: 40 },
    { name: 'BBQ Sauce', category: IngredientCategory.SAUCE, price: 0.50, stock: 120, minStock: 30 },
    { name: 'Ranch', category: IngredientCategory.SAUCE, price: 0.50, stock: 100, minStock: 25 },
    { name: 'Special Sauce', category: IngredientCategory.SAUCE, price: 0.75, stock: 80, minStock: 20 },
    
    // Toppings
    { name: 'Fried Onions', category: IngredientCategory.TOPPING, price: 1.00, stock: 60, minStock: 15 },
    { name: 'Mushrooms', category: IngredientCategory.TOPPING, price: 1.25, stock: 40, minStock: 10 },
    { name: 'Avocado', category: IngredientCategory.TOPPING, price: 1.50, stock: 30, minStock: 5 },
    { name: 'Egg', category: IngredientCategory.TOPPING, price: 1.00, stock: 50, minStock: 10 },
    
    // Condiments
    { name: 'Salt', category: IngredientCategory.CONDIMENT, price: 0.10, stock: 500, minStock: 100 },
    { name: 'Pepper', category: IngredientCategory.CONDIMENT, price: 0.10, stock: 500, minStock: 100 },
  ]

  // Delete existing ingredients for this restaurant to avoid duplicates
  await prisma.ingredient.deleteMany({
    where: { restaurantId: burgerPlace.id },
  })

  const createdBurgerIngredients = []
  for (const ing of burgerIngredients) {
    const ingredient = await prisma.ingredient.create({
      data: {
        name: ing.name,
        category: ing.category,
        price: ing.price,
        stock: ing.stock,
        minStock: ing.minStock,
        isAvailable: ing.stock > 0,
        restaurantId: burgerPlace.id,
        image: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop&q=80`,
      },
    })
    createdBurgerIngredients.push(ingredient)
  }

  console.log('✅ Ingredients created')

  // Create menu items
  const classicBurger = await prisma.menuItem.create({
    data: {
      name: 'Classic Burger',
      description: 'A timeless favorite with beef patty, lettuce, tomato, and special sauce',
      basePrice: 8.99,
      restaurantId: burgerPlace.id,
      ingredients: {
        create: [
          {
            ingredientId: createdBurgerIngredients.find((i) => i.name === 'Beef Patty')!.id,
            quantity: 1,
            isRequired: true,
          },
          {
            ingredientId: createdBurgerIngredients.find((i) => i.name === 'Brioche Bun')!.id,
            quantity: 1,
            isRequired: true,
          },
          {
            ingredientId: createdBurgerIngredients.find((i) => i.name === 'Lettuce')!.id,
            quantity: 1,
            isRequired: false,
          },
          {
            ingredientId: createdBurgerIngredients.find((i) => i.name === 'Tomato')!.id,
            quantity: 1,
            isRequired: false,
          },
          {
            ingredientId: createdBurgerIngredients.find((i) => i.name === 'Special Sauce')!.id,
            quantity: 1,
            isRequired: false,
          },
        ],
      },
    },
  })

  const chickenBurger = await prisma.menuItem.create({
    data: {
      name: 'Chicken Burger',
      description: 'Grilled chicken patty with your choice of toppings',
      basePrice: 7.99,
      restaurantId: burgerPlace.id,
      ingredients: {
        create: [
          {
            ingredientId: createdBurgerIngredients.find((i) => i.name === 'Chicken Patty')!.id,
            quantity: 1,
            isRequired: true,
          },
          {
            ingredientId: createdBurgerIngredients.find((i) => i.name === 'Sesame Bun')!.id,
            quantity: 1,
            isRequired: true,
          },
        ],
      },
    },
  })

  console.log('✅ Menu items created')

  // Create sample user creation
  const sampleCreation = await prisma.userCreation.create({
    data: {
      name: 'Ultimate Burger',
      description: 'Loaded burger with all the best ingredients',
      isPublic: true,
      userId: customer1.id,
      restaurantId: burgerPlace.id,
      ingredients: {
        create: [
          {
            ingredientId: createdBurgerIngredients.find((i) => i.name === 'Beef Patty')!.id,
            quantity: 2,
            positionX: 40,
            positionY: 30,
            positionZ: 0,
            rotation: 0,
          },
          {
            ingredientId: createdBurgerIngredients.find((i) => i.name === 'Bacon')!.id,
            quantity: 3,
            positionX: 50,
            positionY: 40,
            positionZ: 0.1,
            rotation: 15,
          },
          {
            ingredientId: createdBurgerIngredients.find((i) => i.name === 'Cheddar')!.id,
            quantity: 2,
            positionX: 45,
            positionY: 35,
            positionZ: 0.05,
            rotation: 0,
          },
          {
            ingredientId: createdBurgerIngredients.find((i) => i.name === 'Lettuce')!.id,
            quantity: 1,
            positionX: 55,
            positionY: 50,
            positionZ: 0.15,
            rotation: 30,
          },
          {
            ingredientId: createdBurgerIngredients.find((i) => i.name === 'Tomato')!.id,
            quantity: 2,
            positionX: 60,
            positionY: 45,
            positionZ: 0.2,
            rotation: 45,
          },
        ],
      },
    },
  })

  console.log('✅ Sample creation created')

  // Create sample order
  const sampleOrder = await prisma.order.create({
    data: {
      status: 'PREPARING',
      totalPrice: 12.99,
      deliveryAddress: '789 Customer St, Food City',
      gameScore: 850,
      gameData: {
        grillTiming: {
          startTime: Date.now() - 60000,
          endTime: Date.now() - 30000,
          perfectTiming: true,
        },
        sauceMixing: {
          accuracy: 95,
          timeTaken: 45000,
        },
        assemblyOrder: [
          createdBurgerIngredients.find((i) => i.name === 'Beef Patty')!.id,
          createdBurgerIngredients.find((i) => i.name === 'Bacon')!.id,
          createdBurgerIngredients.find((i) => i.name === 'Cheddar')!.id,
        ],
        totalTime: 120000,
      },
      userId: customer1.id,
      restaurantId: burgerPlace.id,
      creationId: sampleCreation.id,
    },
  })

  console.log('✅ Sample order created')

  // Create follow relationship
  await prisma.follow.create({
    data: {
      followerId: customer2.id,
      followingId: customer1.id,
    },
  })

  // Create like
  await prisma.like.create({
    data: {
      userId: customer2.id,
      creationId: sampleCreation.id,
    },
  })

  // Update creation like count
  await prisma.userCreation.update({
    where: { id: sampleCreation.id },
    data: { likesCount: 1 },
  })

  console.log('✅ Social relationships created')

  console.log('🎉 Database seed completed!')
  console.log('\n📊 Summary:')
  console.log(`   - Users: 4 (1 admin, 1 restaurant owner, 2 customers)`)
  console.log(`   - Restaurants: 2`)
  console.log(`   - Ingredients: ${createdBurgerIngredients.length}`)
  console.log(`   - Menu Items: 2`)
  console.log(`   - Sample Creation: 1`)
  console.log(`   - Sample Order: 1`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

