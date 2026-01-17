import { PrismaClient } from '@prisma/client'

console.log('🔍 Debug seed starting...')
console.log('1. Attempting to import PrismaClient...')

try {
  console.log('2. Creating PrismaClient instance...')
  const prisma = new PrismaClient()
  console.log('3. PrismaClient created successfully:', !!prisma)
  console.log('4. Checking user model:', !!prisma.user)
  
  prisma.$disconnect()
  console.log('✅ Everything looks good!')
} catch (error) {
  console.error('❌ Error:', error)
  process.exit(1)
}
