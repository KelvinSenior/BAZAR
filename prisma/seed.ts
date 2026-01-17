import { PrismaClient, IngredientCategory, UserRole, MenuCategory } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  try {
    // Delete data in correct order (respecting foreign keys)
    await prisma.like.deleteMany({})
    await prisma.follow.deleteMany({})
    await prisma.orderItem.deleteMany({})
    await prisma.order.deleteMany({})
    await prisma.userCreation.deleteMany({})
    await prisma.menuItemIngredient.deleteMany({})
    await prisma.menuItem.deleteMany({})
    await prisma.ingredient.deleteMany({})
    await prisma.restaurant.deleteMany({})
    await prisma.user.deleteMany({})

    // Create users
    const owner1 = await prisma.user.create({
      data: { email: 'pizza@bazar.com', name: 'Pizza Owner', role: UserRole.RESTAURANT }
    })

    const owner2 = await prisma.user.create({
      data: { email: 'burger@bazar.com', name: 'Burger Owner', role: UserRole.RESTAURANT }
    })

    const owner3 = await prisma.user.create({
      data: { email: 'sushi@bazar.com', name: 'Sushi Owner', role: UserRole.RESTAURANT }
    })

    const customer = await prisma.user.create({
      data: { email: 'test@bazar.com', name: 'Test Customer', role: UserRole.CUSTOMER }
    })

    // Create Pizza Restaurant
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
    const pizzaIngs = await Promise.all([
      prisma.ingredient.create({ data: { name: 'Mozzarella', category: IngredientCategory.CHEESE, price: 1.5, stock: 100, restaurantId: pizzaResto.id } }),
      prisma.ingredient.create({ data: { name: 'Pepperoni', category: IngredientCategory.PROTEIN, price: 2.0, stock: 80, restaurantId: pizzaResto.id } }),
      prisma.ingredient.create({ data: { name: 'Tomato Sauce', category: IngredientCategory.SAUCE, price: 0.5, stock: 100, restaurantId: pizzaResto.id } }),
      prisma.ingredient.create({ data: { name: 'Basil', category: IngredientCategory.TOPPING, price: 0.5, stock: 50, restaurantId: pizzaResto.id } }),
      prisma.ingredient.create({ data: { name: 'Mushrooms', category: IngredientCategory.VEGETABLE, price: 0.8, stock: 70, restaurantId: pizzaResto.id } }),
      prisma.ingredient.create({ data: { name: 'Olives', category: IngredientCategory.TOPPING, price: 1.0, stock: 60, restaurantId: pizzaResto.id } }),
    ])

    // Create pizza menu items
    await prisma.menuItem.create({
      data: {
        name: 'Margherita',
        description: 'Classic pizza with tomato and mozzarella',
        basePrice: 10.99,
        category: MenuCategory.PIZZA,
        restaurantId: pizzaResto.id,
        isAvailable: true,
        preparationTime: 15,
        rating: 4.7,
        ingredients: {
          create: [
            { ingredientId: pizzaIngs[0].id, quantity: 2, isRequired: true },
            { ingredientId: pizzaIngs[2].id, quantity: 1, isRequired: true },
            { ingredientId: pizzaIngs[3].id, quantity: 1, isRequired: true },
          ],
        },
      },
    })

    await prisma.menuItem.create({
      data: {
        name: 'Pepperoni Pizza',
        description: 'Loaded with pepperoni and cheese',
        basePrice: 12.99,
        category: MenuCategory.PIZZA,
        restaurantId: pizzaResto.id,
        isAvailable: true,
        preparationTime: 15,
        rating: 4.8,
        ingredients: {
          create: [
            { ingredientId: pizzaIngs[0].id, quantity: 2, isRequired: true },
            { ingredientId: pizzaIngs[1].id, quantity: 1, isRequired: true },
            { ingredientId: pizzaIngs[2].id, quantity: 1, isRequired: true },
          ],
        },
      },
    })

    console.log('✅ Pizza Hut Express created with 2 items')

    // Create Burger Restaurant
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

    const burgerIngs = await Promise.all([
      prisma.ingredient.create({ data: { name: 'Beef Patty', category: IngredientCategory.PROTEIN, price: 3.0, stock: 100, restaurantId: burgerResto.id } }),
      prisma.ingredient.create({ data: { name: 'Cheddar', category: IngredientCategory.CHEESE, price: 1.0, stock: 100, restaurantId: burgerResto.id } }),
      prisma.ingredient.create({ data: { name: 'Lettuce', category: IngredientCategory.VEGETABLE, price: 0.5, stock: 100, restaurantId: burgerResto.id } }),
      prisma.ingredient.create({ data: { name: 'Tomato', category: IngredientCategory.VEGETABLE, price: 0.5, stock: 100, restaurantId: burgerResto.id } }),
      prisma.ingredient.create({ data: { name: 'Bacon', category: IngredientCategory.PROTEIN, price: 2.0, stock: 80, restaurantId: burgerResto.id } }),
    ])

    await prisma.menuItem.create({
      data: {
        name: 'Classic Burger',
        description: 'Juicy beef with lettuce and tomato',
        basePrice: 8.99,
        category: MenuCategory.BURGERS,
        restaurantId: burgerResto.id,
        isAvailable: true,
        preparationTime: 10,
        rating: 4.5,
        ingredients: {
          create: [
            { ingredientId: burgerIngs[0].id, quantity: 1, isRequired: true },
            { ingredientId: burgerIngs[2].id, quantity: 1, isRequired: true },
            { ingredientId: burgerIngs[3].id, quantity: 1, isRequired: true },
          ],
        },
      },
    })

    await prisma.menuItem.create({
      data: {
        name: 'Bacon Cheeseburger',
        description: 'Beef with bacon and cheddar',
        basePrice: 10.99,
        category: MenuCategory.BURGERS,
        restaurantId: burgerResto.id,
        isAvailable: true,
        preparationTime: 10,
        rating: 4.7,
        ingredients: {
          create: [
            { ingredientId: burgerIngs[0].id, quantity: 1, isRequired: true },
            { ingredientId: burgerIngs[4].id, quantity: 1, isRequired: true },
            { ingredientId: burgerIngs[1].id, quantity: 1, isRequired: true },
          ],
        },
      },
    })

    console.log('✅ Burger Kingdom created with 2 items')

    // Create Sushi Restaurant
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

    const sushiIngs = await Promise.all([
      prisma.ingredient.create({ data: { name: 'Salmon', category: IngredientCategory.PROTEIN, price: 3.5, stock: 80, restaurantId: sushiResto.id } }),
      prisma.ingredient.create({ data: { name: 'Sushi Rice', category: IngredientCategory.CARB, price: 0.5, stock: 150, restaurantId: sushiResto.id } }),
      prisma.ingredient.create({ data: { name: 'Nori', category: IngredientCategory.TOPPING, price: 1.0, stock: 100, restaurantId: sushiResto.id } }),
      prisma.ingredient.create({ data: { name: 'Avocado', category: IngredientCategory.VEGETABLE, price: 1.5, stock: 70, restaurantId: sushiResto.id } }),
      prisma.ingredient.create({ data: { name: 'Cucumber', category: IngredientCategory.VEGETABLE, price: 0.5, stock: 100, restaurantId: sushiResto.id } }),
    ])

    await prisma.menuItem.create({
      data: {
        name: 'Salmon Roll',
        description: 'Fresh salmon with cucumber',
        basePrice: 9.99,
        category: MenuCategory.RICE_BOWLS,
        restaurantId: sushiResto.id,
        isAvailable: true,
        preparationTime: 8,
        rating: 4.8,
        ingredients: {
          create: [
            { ingredientId: sushiIngs[0].id, quantity: 1, isRequired: true },
            { ingredientId: sushiIngs[1].id, quantity: 1, isRequired: true },
            { ingredientId: sushiIngs[2].id, quantity: 1, isRequired: true },
          ],
        },
      },
    })

    console.log('✅ Sushi Bar Premium created with 1 item')
    console.log('\n✅ Database seeded successfully!')
    console.log('   3 Restaurants ready')
    console.log('   5 Menu Items ready')
    console.log('   15 Ingredients ready')
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
