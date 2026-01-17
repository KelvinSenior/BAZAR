import { PrismaClient, IngredientCategory, UserRole, MenuCategory } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting professional database seed...')

  // Clear existing data
  await prisma.remix.deleteMany({})
  await prisma.like.deleteMany({})
  await prisma.follow.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.userCreation.deleteMany({})
  await prisma.menuItemIngredient.deleteMany({})
  await prisma.menuItem.deleteMany({})
  await prisma.ingredient.deleteMany({})
  await prisma.restaurant.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('✅ Cleaned existing data')

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@bazar.com',
      name: 'Admin',
      role: UserRole.ADMIN,
    },
  })

  const pizzaOwner = await prisma.user.create({
    data: {
      email: 'owner@pizzahut.com',
      name: 'Pizza Hut Manager',
      role: UserRole.RESTAURANT,
    },
  })

  const burgerOwner = await prisma.user.create({
    data: {
      email: 'owner@burgerking.com',
      name: 'Burger King Manager',
      role: UserRole.RESTAURANT,
    },
  })

  const sushiOwner = await prisma.user.create({
    data: {
      email: 'owner@sushibar.com',
      name: 'Sushi Bar Manager',
      role: UserRole.RESTAURANT,
    },
  })

  const customer1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Smith',
      role: UserRole.CUSTOMER,
    },
  })

  const customer2 = await prisma.user.create({
    data: {
      email: 'sarah@example.com',
      name: 'Sarah Johnson',
      role: UserRole.CUSTOMER,
    },
  })

  console.log('✅ Created 6 users')

  // ============== PIZZA RESTAURANT ==============
  const pizzaResto = await prisma.restaurant.create({
    data: {
      name: 'Pizza Hut Express',
      description: 'Build your perfect pizza with fresh, authentic toppings',
      image: 'https://images.unsplash.com/photo-1517248135467-4d71bcdd2167?w=800&h=600&fit=crop',
      address: '123 Pizza Street, Downtown',
      phone: '555-0101',
      isActive: true,
      ownerId: pizzaOwner.id,
    },
  })

  // Pizza ingredients
  const pizzaIngredients = [
    // Sauces
    { name: 'Tomato Sauce', category: IngredientCategory.SAUCE, price: 0.5, stock: 100 },
    { name: 'Garlic Sauce', category: IngredientCategory.SAUCE, price: 0.75, stock: 80 },
    { name: 'White Sauce', category: IngredientCategory.SAUCE, price: 0.75, stock: 60 },
    { name: 'BBQ Sauce', category: IngredientCategory.SAUCE, price: 0.75, stock: 50 },

    // Cheese
    { name: 'Mozzarella', category: IngredientCategory.CHEESE, price: 1.5, stock: 150 },
    { name: 'Cheddar Cheese', category: IngredientCategory.CHEESE, price: 1.25, stock: 80 },
    { name: 'Parmesan', category: IngredientCategory.CHEESE, price: 1.75, stock: 50 },
    { name: 'Feta Cheese', category: IngredientCategory.CHEESE, price: 1.5, stock: 40 },

    // Proteins
    { name: 'Pepperoni', category: IngredientCategory.PROTEIN, price: 2.0, stock: 100 },
    { name: 'Italian Sausage', category: IngredientCategory.PROTEIN, price: 2.25, stock: 70 },
    { name: 'Bacon Bits', category: IngredientCategory.PROTEIN, price: 2.0, stock: 80 },
    { name: 'Chicken Chunks', category: IngredientCategory.PROTEIN, price: 1.75, stock: 60 },
    { name: 'Ham', category: IngredientCategory.PROTEIN, price: 1.5, stock: 50 },
    { name: 'Anchovies', category: IngredientCategory.PROTEIN, price: 2.5, stock: 30 },

    // Vegetables
    { name: 'Bell Peppers', category: IngredientCategory.VEGETABLE, price: 0.75, stock: 120 },
    { name: 'Onions', category: IngredientCategory.VEGETABLE, price: 0.5, stock: 150 },
    { name: 'Mushrooms', category: IngredientCategory.VEGETABLE, price: 1.0, stock: 90 },
    { name: 'Olives', category: IngredientCategory.VEGETABLE, price: 1.25, stock: 70 },
    { name: 'Tomato Slices', category: IngredientCategory.VEGETABLE, price: 0.75, stock: 100 },
    { name: 'Spinach', category: IngredientCategory.VEGETABLE, price: 1.0, stock: 60 },
    { name: 'Jalapeños', category: IngredientCategory.VEGETABLE, price: 0.75, stock: 50 },
    { name: 'Garlic', category: IngredientCategory.VEGETABLE, price: 0.5, stock: 100 },

    // Toppings
    { name: 'Oregano', category: IngredientCategory.TOPPING, price: 0.25, stock: 200 },
    { name: 'Basil', category: IngredientCategory.TOPPING, price: 0.5, stock: 80 },
  ]

  const createdPizzaIng = []
  for (const ing of pizzaIngredients) {
    const ingredient = await prisma.ingredient.create({
      data: {
        name: ing.name,
        category: ing.category,
        price: ing.price,
        stock: ing.stock,
        minStock: 10,
        isAvailable: true,
        restaurantId: pizzaResto.id,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150',
      },
    })
    createdPizzaIng.push(ingredient)
  }

  // Pizza menu items
  const pizzaMenu = [
    {
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
      price: 9.99,
      category: MenuCategory.PIZZA,
      ingredients: ['Tomato Sauce', 'Mozzarella', 'Basil'],
    },
    {
      name: 'Pepperoni Special',
      description: 'Loaded with pepperoni and extra cheese',
      price: 11.99,
      category: MenuCategory.PIZZA,
      ingredients: ['Tomato Sauce', 'Mozzarella', 'Pepperoni', 'Oregano'],
    },
    {
      name: 'Supreme Pizza',
      description: 'Topped with pepperoni, sausage, peppers, onions, and olives',
      price: 14.99,
      category: MenuCategory.PIZZA,
      ingredients: ['Tomato Sauce', 'Mozzarella', 'Pepperoni', 'Italian Sausage', 'Bell Peppers', 'Onions', 'Olives'],
    },
    {
      name: 'Vegetarian Delight',
      description: 'Spinach, mushrooms, peppers, and olives',
      price: 10.99,
      category: MenuCategory.PIZZA,
      ingredients: ['Tomato Sauce', 'Mozzarella', 'Spinach', 'Mushrooms', 'Bell Peppers', 'Olives'],
    },
  ]

  for (const item of pizzaMenu) {
    await prisma.menuItem.create({
      data: {
        name: item.name,
        description: item.description,
        basePrice: item.price,
        category: item.category,
        restaurantId: pizzaResto.id,
        isAvailable: true,
        preparationTime: 15,
        rating: 4.5,
        ingredients: {
          create: item.ingredients.map((ingName) => ({
            ingredientId: createdPizzaIng.find((i) => i.name === ingName)!.id,
            quantity: 1,
            isRequired: true,
          })),
        },
      },
    })
  }

  console.log('✅ Created Pizza Hut Express with 4 menu items')

  // ============== BURGER RESTAURANT ==============
  const burgerResto = await prisma.restaurant.create({
    data: {
      name: 'Burger Kingdom',
      description: 'Craft burgers with premium beef and fresh toppings',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
      address: '456 Burger Lane, Midtown',
      phone: '555-0202',
      isActive: true,
      ownerId: burgerOwner.id,
    },
  })

  // Burger ingredients
  const burgerIngredients = [
    // Proteins
    { name: 'Beef Patty Premium', category: IngredientCategory.PROTEIN, price: 4.0, stock: 100 },
    { name: 'Beef Patty Regular', category: IngredientCategory.PROTEIN, price: 2.5, stock: 120 },
    { name: 'Chicken Patty', category: IngredientCategory.PROTEIN, price: 2.0, stock: 80 },
    { name: 'Turkey Patty', category: IngredientCategory.PROTEIN, price: 2.25, stock: 60 },
    { name: 'Bacon', category: IngredientCategory.PROTEIN, price: 2.0, stock: 100 },
    { name: 'Ham Slice', category: IngredientCategory.PROTEIN, price: 1.5, stock: 70 },

    // Carbs
    { name: 'Brioche Bun', category: IngredientCategory.CARB, price: 1.0, stock: 150 },
    { name: 'Sesame Bun', category: IngredientCategory.CARB, price: 1.0, stock: 140 },
    { name: 'Whole Wheat Bun', category: IngredientCategory.CARB, price: 1.25, stock: 80 },
    { name: 'Lettuce Wrap', category: IngredientCategory.CARB, price: 0.75, stock: 100 },

    // Cheese
    { name: 'American Cheese', category: IngredientCategory.CHEESE, price: 0.75, stock: 150 },
    { name: 'Swiss Cheese', category: IngredientCategory.CHEESE, price: 1.25, stock: 100 },
    { name: 'Cheddar Cheese', category: IngredientCategory.CHEESE, price: 1.0, stock: 120 },
    { name: 'Pepper Jack', category: IngredientCategory.CHEESE, price: 1.25, stock: 80 },

    // Vegetables
    { name: 'Lettuce', category: IngredientCategory.VEGETABLE, price: 0.5, stock: 150 },
    { name: 'Tomato', category: IngredientCategory.VEGETABLE, price: 0.75, stock: 120 },
    { name: 'Onion', category: IngredientCategory.VEGETABLE, price: 0.5, stock: 140 },
    { name: 'Pickles', category: IngredientCategory.VEGETABLE, price: 0.5, stock: 160 },
    { name: 'Red Onion', category: IngredientCategory.VEGETABLE, price: 0.75, stock: 80 },

    // Sauces
    { name: 'Ketchup', category: IngredientCategory.SAUCE, price: 0.25, stock: 300 },
    { name: 'Mustard', category: IngredientCategory.SAUCE, price: 0.25, stock: 280 },
    { name: 'Mayo', category: IngredientCategory.SAUCE, price: 0.25, stock: 250 },
    { name: 'Special Sauce', category: IngredientCategory.SAUCE, price: 0.75, stock: 150 },
    { name: 'Sriracha Mayo', category: IngredientCategory.SAUCE, price: 0.5, stock: 100 },
    { name: 'Garlic Aioli', category: IngredientCategory.SAUCE, price: 0.75, stock: 90 },

    // Toppings
    { name: 'Fried Onions', category: IngredientCategory.TOPPING, price: 1.0, stock: 100 },
    { name: 'Avocado', category: IngredientCategory.TOPPING, price: 1.5, stock: 60 },
    { name: 'Egg', category: IngredientCategory.TOPPING, price: 1.0, stock: 80 },
    { name: 'Mushrooms', category: IngredientCategory.TOPPING, price: 1.25, stock: 70 },
  ]

  const createdBurgerIng = []
  for (const ing of burgerIngredients) {
    const ingredient = await prisma.ingredient.create({
      data: {
        name: ing.name,
        category: ing.category,
        price: ing.price,
        stock: ing.stock,
        minStock: 10,
        isAvailable: true,
        restaurantId: burgerResto.id,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150',
      },
    })
    createdBurgerIng.push(ingredient)
  }

  // Burger menu items
  const burgerMenu = [
    {
      name: 'Classic Burger',
      description: 'Premium beef patty with lettuce, tomato, onion, and special sauce',
      price: 8.99,
      category: MenuCategory.BURGERS,
      ingredients: ['Beef Patty Premium', 'Brioche Bun', 'Lettuce', 'Tomato', 'Onion', 'Special Sauce'],
    },
    {
      name: 'Bacon Cheeseburger',
      description: 'Juicy beef with crispy bacon, cheddar, and all the fixings',
      price: 10.99,
      category: MenuCategory.BURGERS,
      ingredients: ['Beef Patty Premium', 'Brioche Bun', 'Bacon', 'Cheddar Cheese', 'Lettuce', 'Tomato', 'Special Sauce'],
    },
    {
      name: 'Double Deluxe',
      description: 'Two beef patties, double cheese, bacon, and fried onions',
      price: 13.99,
      category: MenuCategory.BURGERS,
      ingredients: ['Beef Patty Premium', 'Beef Patty Premium', 'Brioche Bun', 'Swiss Cheese', 'Bacon', 'Fried Onions', 'Garlic Aioli'],
    },
    {
      name: 'Spicy Jalapeño Burger',
      description: 'Seasoned beef with pepper jack, jalapeños, and sriracha mayo',
      price: 9.99,
      category: MenuCategory.BURGERS,
      ingredients: ['Beef Patty Regular', 'Sesame Bun', 'Pepper Jack', 'Sriracha Mayo'],
    },
    {
      name: 'Mushroom Swiss',
      description: 'Tender beef with sautéed mushrooms and melted swiss',
      price: 10.49,
      category: MenuCategory.BURGERS,
      ingredients: ['Beef Patty Premium', 'Brioche Bun', 'Swiss Cheese', 'Mushrooms', 'Garlic Aioli'],
    },
  ]

  for (const item of burgerMenu) {
    await prisma.menuItem.create({
      data: {
        name: item.name,
        description: item.description,
        basePrice: item.price,
        category: item.category,
        restaurantId: burgerResto.id,
        isAvailable: true,
        preparationTime: 10,
        rating: 4.6,
        ingredients: {
          create: item.ingredients.map((ingName) => ({
            ingredientId: createdBurgerIng.find((i) => i.name === ingName)!.id,
            quantity: 1,
            isRequired: true,
          })),
        },
      },
    })
  }

  console.log('✅ Created Burger Kingdom with 5 menu items')

  // ============== SUSHI RESTAURANT ==============
  const sushiResto = await prisma.restaurant.create({
    data: {
      name: 'Sushi Bar Premium',
      description: 'Fresh, authentic sushi with premium ingredients',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop',
      address: '789 Sushi Street, Uptown',
      phone: '555-0303',
      isActive: true,
      ownerId: sushiOwner.id,
    },
  })

  // Sushi ingredients
  const sushiIngredients = [
    // Proteins
    { name: 'Salmon', category: IngredientCategory.PROTEIN, price: 3.5, stock: 80 },
    { name: 'Tuna', category: IngredientCategory.PROTEIN, price: 4.0, stock: 70 },
    { name: 'Shrimp', category: IngredientCategory.PROTEIN, price: 3.0, stock: 60 },
    { name: 'Crab Stick', category: IngredientCategory.PROTEIN, price: 2.0, stock: 90 },
    { name: 'Egg Tamago', category: IngredientCategory.PROTEIN, price: 1.5, stock: 80 },

    // Carbs
    { name: 'Sushi Rice', category: IngredientCategory.CARB, price: 0.5, stock: 200 },
    { name: 'Nori Seaweed', category: IngredientCategory.CARB, price: 1.0, stock: 150 },

    // Vegetables
    { name: 'Cucumber', category: IngredientCategory.VEGETABLE, price: 0.5, stock: 100 },
    { name: 'Avocado', category: IngredientCategory.VEGETABLE, price: 1.5, stock: 80 },
    { name: 'Carrot', category: IngredientCategory.VEGETABLE, price: 0.5, stock: 120 },
    { name: 'Bell Pepper', category: IngredientCategory.VEGETABLE, price: 0.75, stock: 90 },

    // Sauces
    { name: 'Soy Sauce', category: IngredientCategory.SAUCE, price: 0.25, stock: 300 },
    { name: 'Wasabi', category: IngredientCategory.SAUCE, price: 0.5, stock: 100 },
    { name: 'Spicy Mayo', category: IngredientCategory.SAUCE, price: 0.75, stock: 80 },

    // Toppings
    { name: 'Sesame Seeds', category: IngredientCategory.TOPPING, price: 0.5, stock: 150 },
  ]

  const createdSushiIng = []
  for (const ing of sushiIngredients) {
    const ingredient = await prisma.ingredient.create({
      data: {
        name: ing.name,
        category: ing.category,
        price: ing.price,
        stock: ing.stock,
        minStock: 10,
        isAvailable: true,
        restaurantId: sushiResto.id,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150',
      },
    })
    createdSushiIng.push(ingredient)
  }

  // Sushi menu items
  const sushiMenu = [
    {
      name: 'Salmon Roll',
      description: 'Fresh salmon, cucumber, and avocado',
      price: 7.99,
      category: MenuCategory.RICE_BOWLS,
      ingredients: ['Salmon', 'Sushi Rice', 'Nori Seaweed', 'Cucumber', 'Avocado'],
    },
    {
      name: 'Tuna Spicy Roll',
      description: 'Spicy tuna with jalapeño and sriracha mayo',
      price: 8.99,
      category: MenuCategory.RICE_BOWLS,
      ingredients: ['Tuna', 'Sushi Rice', 'Nori Seaweed', 'Spicy Mayo', 'Sesame Seeds'],
    },
  ]

  for (const item of sushiMenu) {
    await prisma.menuItem.create({
      data: {
        name: item.name,
        description: item.description,
        basePrice: item.price,
        category: item.category,
        restaurantId: sushiResto.id,
        isAvailable: true,
        preparationTime: 8,
        rating: 4.7,
        ingredients: {
          create: item.ingredients.map((ingName) => ({
            ingredientId: createdSushiIng.find((i) => i.name === ingName)!.id,
            quantity: 1,
            isRequired: true,
          })),
        },
      },
    })
  }

  console.log('✅ Created Sushi Bar Premium with 2 menu items')

  // ============== CREATE SAMPLE ORDERS ==============
  const order1 = await prisma.order.create({
    data: {
      status: 'DELIVERED',
      totalPrice: 24.99,
      deliveryAddress: '123 Customer Ave, Downtown',
      userId: customer1.id,
      restaurantId: pizzaResto.id,
    },
  })

  const order2 = await prisma.order.create({
    data: {
      status: 'PREPARING',
      totalPrice: 19.99,
      deliveryAddress: '456 Customer Blvd, Midtown',
      userId: customer2.id,
      restaurantId: burgerResto.id,
    },
  })

  console.log('✅ Created sample orders')

  // ============== CREATE SOCIAL RELATIONSHIPS ==============
  await prisma.follow.create({
    data: {
      followerId: customer2.id,
      followingId: customer1.id,
    },
  })

  console.log('✅ Created social relationships')

  console.log('\n🎉 Professional database seed completed!')
  console.log('\n📊 Summary:')
  console.log('   ✅ 6 Users (1 admin, 3 restaurant owners, 2 customers)')
  console.log('   ✅ 3 Restaurants (Pizza, Burger, Sushi)')
  console.log('   ✅ 60+ Ingredients across all restaurants')
  console.log('   ✅ 11 Menu Items with proper categories and ingredients')
  console.log('   ✅ 2 Sample Orders')
  console.log('   ✅ Social relationships (follows)')
  console.log('\n🚀 Ready for development!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
