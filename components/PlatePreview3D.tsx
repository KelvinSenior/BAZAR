'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { useBuilderStore } from '@/lib/store'

interface PlatePreview3DProps {
  className?: string
  autoRotate?: boolean
  rotationSpeed?: number
}

export default function PlatePreview3D({
  className = '',
  autoRotate = true,
  rotationSpeed = 0.5,
}: PlatePreview3DProps) {
  const { creation } = useBuilderStore()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 overflow-hidden ${className}`}
    >
      <div className="relative w-full h-full min-h-[400px]">
        <Canvas shadows>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={50} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <pointLight position={[-5, -5, -5]} intensity={0.5} />

            {/* Plate */}
            <Plate autoRotate={autoRotate} rotationSpeed={rotationSpeed} />

            {/* Ingredients on plate */}
            {creation.ingredients.map((ingredient, index) => (
              <Ingredient3D
                key={ingredient.id}
                ingredient={ingredient}
                index={index}
                total={creation.ingredients.length}
              />
            ))}

            <OrbitControls
              enablePan={false}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={10}
              autoRotate={autoRotate}
              autoRotateSpeed={rotationSpeed}
            />
            <Environment preset="sunset" />
          </Suspense>
        </Canvas>

        {/* Loading overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: creation.ingredients.length === 0 ? 1 : 0 }}
            className="text-slate-400 text-sm"
          >
            Add ingredients to see 3D preview
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// 3D Plate component
function Plate({ autoRotate, rotationSpeed }: { autoRotate: boolean; rotationSpeed: number }) {
  const plateRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (plateRef.current && autoRotate) {
      plateRef.current.rotation.y += 0.001 * rotationSpeed
    }
  })

  return (
    <group>
      {/* Plate base */}
      <mesh ref={plateRef} position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
        <meshStandardMaterial color="#f5f5f5" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Plate rim */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <torusGeometry args={[1.5, 0.05, 16, 32]} />
        <meshStandardMaterial color="#e5e5e5" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  )
}

// 3D Ingredient component
function Ingredient3D({
  ingredient,
  index,
  total,
}: {
  ingredient: {
    id: string
    name: string
    image: string
    position: { x: number; y: number; z: number; rotation: number }
  }
  index: number
  total: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Convert 2D canvas position to 3D plate position
  const radius = 1.2
  const angle = (index / total) * Math.PI * 2
  const x = Math.cos(angle) * radius * (ingredient.position.x / 100 - 0.5)
  const z = Math.sin(angle) * radius * (ingredient.position.y / 100 - 0.5)
  const y = 0.1 + (index * 0.05) // Stack ingredients slightly

  useFrame(() => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = y + Math.sin(Date.now() * 0.001 + index) * 0.02
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[x, y, z]}
      rotation={[0, (ingredient.position.rotation * Math.PI) / 180, 0]}
      castShadow
    >
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial
        color={getIngredientColor(ingredient.name)}
        metalness={0.2}
        roughness={0.8}
      />
    </mesh>
  )
}

// Helper function to get color based on ingredient name
function getIngredientColor(name: string): string {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('tomato') || lowerName.includes('pepper')) return '#ef4444'
  if (lowerName.includes('lettuce') || lowerName.includes('cucumber')) return '#22c55e'
  if (lowerName.includes('cheese')) return '#fbbf24'
  if (lowerName.includes('meat') || lowerName.includes('chicken') || lowerName.includes('beef'))
    return '#991b1b'
  if (lowerName.includes('bread') || lowerName.includes('bun')) return '#d97706'
  return '#8b5cf6'
}


