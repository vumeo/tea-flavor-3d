'use client'

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Sphere, Grid, Billboard, Line } from '@react-three/drei'
import * as THREE from 'three'
import { s_bitterness, s_sweetness, s_floral } from '../../data/general'
import { COLORS, getAxisColor, getPointColor, getTextColor, getTextOutlineColor } from '../../data/colors'

// Component hiển thị hình chiếu từ điểm được chọn
function ProjectionLines({ selectedPoint }: { selectedPoint: [number, number, number] | null }) {
  if (!selectedPoint) return null
  
  const [x, y, z] = selectedPoint
  
  // Tạo các đường chiếu với nét đứt
  const projectionLines = useMemo(() => {
    return [
      // Chiếu xuống trục X (mặt phẳng YZ)
      [new THREE.Vector3(x, y, z), new THREE.Vector3(0, y, z)],
      // Chiếu xuống trục Y (mặt phẳng XZ)  
      [new THREE.Vector3(x, y, z), new THREE.Vector3(x, 0, z)],
      // Chiếu xuống trục Z (mặt phẳng XY)
      [new THREE.Vector3(x, y, z), new THREE.Vector3(x, y, 0)]
    ]
  }, [x, y, z])
  
  const projectionColors = [COLORS.connections.projection, COLORS.connections.projection, COLORS.connections.projection] // Màu cho đường chiếu
  
  return (
    <group>
      {projectionLines.map((points, index) => (
        <Line 
          key={index}
          points={points}
          color={projectionColors[index]}
          lineWidth={3}
          transparent
          opacity={0.9}
          dashed
          dashSize={0.15}
          gapSize={0.05}
        />
      ))}
      
      {/* Điểm chiếu trên các trục */}
      <mesh position={[0, y, z]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[x, 0, z]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[x, y, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

// Component cho điểm particle với hiệu ứng float có thể click
function ParticlePoint({ 
  position, 
  color, 
  size, 
  intensity, 
  onClick 
}: { 
  position: [number, number, number]
  color: string
  size: number
  intensity: number
  onClick?: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const patternRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.3
    }
    // Vân ngoài cho điểm G (điểm cuối cùng có intensity cao)
    if (patternRef.current && intensity > 0.5) {
      patternRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1
      patternRef.current.rotation.x = -state.clock.elapsedTime * 0.7
      patternRef.current.rotation.y = state.clock.elapsedTime * 1.1
      patternRef.current.rotation.z = -state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group>
      {/* Particle chính */}
      <mesh 
        ref={meshRef} 
        position={position}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={intensity}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      
      {/* Vân ngoài cho điểm G */}
      {intensity > 0.5 && (
        <mesh ref={patternRef} position={position}>
          <sphereGeometry args={[size * 1.5, 12, 12]} />
          <meshBasicMaterial 
            color={color} 
            wireframe={true}
            transparent 
            opacity={0.5}
          />
        </mesh>
      )}
    </group>
  )
}

// Component cho trục tọa độ phong cách particle với số liệu
function ParticleAxes() {
  // Tạo markers số liệu trên trục
  const axisMarkers = useMemo(() => {
    const markers = []
    
    // Trục X (Độ đắng) - 5 điểm
    for (let i = 0; i <= 4; i++) {
      const pos = (i / 4) * 2
      const value = (s_bitterness[0] + i * (s_bitterness[s_bitterness.length - 1] - s_bitterness[0]) / 4).toFixed(3)
      markers.push({ position: [pos, -0.15, 0], value, color: '#e74c3c' })
    }
    
    // Trục Y (Độ ngọt) - 5 điểm
    for (let i = 0; i <= 4; i++) {
      const pos = (i / 4) * 2
      const value = (s_sweetness[0] + i * (s_sweetness[s_sweetness.length - 1] - s_sweetness[0]) / 4).toFixed(3)
      markers.push({ position: [-0.15, pos, 0], value, color: '#2ecc71' })
    }
    
    // Trục Z (Hương hoa) - 5 điểm
    for (let i = 0; i <= 4; i++) {
      const pos = (i / 4) * 2
      const value = (s_floral[0] + i * (s_floral[s_floral.length - 1] - s_floral[0]) / 4).toFixed(3)
      markers.push({ position: [0, -0.15, pos], value, color: '#f1c40f' })
    }
    
    return markers
  }, [])

  return (
    <group>
      {/* Trục với particle nhỏ - mở rộng đến 3.0 */}
      {Array.from({ length: 16 }, (_, i) => (
        <group key={`x-${i}`}>
          <Sphere args={[0.01]} position={[i * 0.2, 0, 0]}>
            <meshBasicMaterial color={getAxisColor('x')} />
          </Sphere>
        </group>
      ))}
      
      {Array.from({ length: 16 }, (_, i) => (
        <group key={`y-${i}`}>
          <Sphere args={[0.01]} position={[0, i * 0.2, 0]}>
            <meshBasicMaterial color={getAxisColor('y')} />
          </Sphere>
        </group>
      ))}
      
      {Array.from({ length: 16 }, (_, i) => (
        <group key={`z-${i}`}>
          <Sphere args={[0.01]} position={[0, 0, i * 0.2]}>
            <meshBasicMaterial color={getAxisColor('z')} />
          </Sphere>
        </group>
      ))}
      
      {/* Mũi tên trục X */}
      <mesh position={[3, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.05, 0.12, 8]} />
        <meshBasicMaterial color={getAxisColor('x')} />
      </mesh>
      
      {/* Mũi tên trục Y */}
      <mesh position={[0, 3, 0]}>
        <coneGeometry args={[0.05, 0.12, 8]} />
        <meshBasicMaterial color={getAxisColor('y')} />
      </mesh>
      
      {/* Mũi tên trục Z */}
      <mesh position={[0, 0, 3]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.05, 0.12, 8]} />
        <meshBasicMaterial color={getAxisColor('z')} />
      </mesh>
      
      <Billboard position={[3.2, 0.1, 0]}>
        <Text 
          fontSize={0.15} 
          color={getAxisColor('x')} 
          anchorX="center" 
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Đắng / Chát
        </Text>
      </Billboard>
      <Billboard position={[0.1, 3.2, 0]}>
        <Text 
          fontSize={0.15} 
          color={getAxisColor('y')} 
          anchorX="center" 
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Ngọt
        </Text>
      </Billboard>
      <Billboard position={[0, 0.1, 3.2]}>
        <Text 
          fontSize={0.15} 
          color={getAxisColor('z')} 
          anchorX="center" 
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Hương Hoa
        </Text>
      </Billboard>
      

    </group>
  )
}

// Component chính cho đồ thị Particle
function TeaChart3DParticleScene() {
  const [selectedPoint, setSelectedPoint] = useState<[number, number, number] | null>(null)
  
  const dataPoints = useMemo(() => {
    const maxBitterness = Math.max(...s_bitterness)
    const maxSweetness = Math.max(...s_sweetness)
    const maxFloral = Math.max(...s_floral)
    
    // Tính giá trị trung bình của 15 điểm
    const avgBitterness = s_bitterness.reduce((sum, val) => sum + val, 0) / s_bitterness.length
    const avgSweetness = s_sweetness.reduce((sum, val) => sum + val, 0) / s_sweetness.length
    const avgFloral = s_floral.reduce((sum, val) => sum + val, 0) / s_floral.length
    
    // Tạo 15 điểm gốc + 1 điểm trung bình
    const points = s_bitterness.map((bitterness: number, index: number) => {
      const sweetness = s_sweetness[index] || 0
      const floral = s_floral[index] || 0
      
      const x = (bitterness / maxBitterness) * 2
      const y = (sweetness / maxSweetness) * 2
      const z = (floral / maxFloral) * 2
      
      // Kích thước dựa trên giá trị tổng hợp
      const totalValue = bitterness + sweetness + floral
      const maxTotal = Math.max(...s_bitterness) + Math.max(...s_sweetness) + Math.max(...s_floral)
      const size = 0.02 + (totalValue / maxTotal) * 0.06
      
      // Cường độ phát sáng
      const intensity = 0.2 + (totalValue / maxTotal) * 0.6
      
        // Sử dụng config màu
        const color = getPointColor(index, false)
      
             return {
         position: [x, y, z] as [number, number, number],
         color,
         size,
         intensity,
         index,
         bitterness: bitterness.toFixed(3),
         sweetness: sweetness.toFixed(3),
         floral: floral.toFixed(3),
         isAverage: false
       }
    })
    
    // Thêm điểm trung bình
    const avgX = (avgBitterness / maxBitterness) * 2
    const avgY = (avgSweetness / maxSweetness) * 2
    const avgZ = (avgFloral / maxFloral) * 2
    
    // Kích thước và cường độ cho điểm trung bình
    const avgTotalValue = avgBitterness + avgSweetness + avgFloral
    const maxTotal = Math.max(...s_bitterness) + Math.max(...s_sweetness) + Math.max(...s_floral)
    const avgSize = 0.02 + (avgTotalValue / maxTotal) * 0.06 // Cùng kích thước với các điểm khác
    const avgIntensity = 0.3 + (avgTotalValue / maxTotal) * 0.7
    
    points.push({
      position: [avgX, avgY, avgZ] as [number, number, number],
      color: getPointColor(15, true), // Màu cho điểm trung bình
      size: avgSize,
      intensity: avgIntensity,
      index: 15,
      bitterness: avgBitterness.toFixed(3),
      sweetness: avgSweetness.toFixed(3),
      floral: avgFloral.toFixed(3),
      isAverage: true
    })
    
    return points
  }, [])

  // Tạo các đường kết nối giữa các điểm liền kề (chỉ 15 điểm đầu, không nối với điểm trung bình)
  const connectionLines = useMemo(() => {
    const lines = []
    for (let i = 0; i < Math.min(dataPoints.length - 1, 14); i++) { // Chỉ nối đến điểm 14 (index 14)
      lines.push([
        new THREE.Vector3(...dataPoints[i].position),
        new THREE.Vector3(...dataPoints[i + 1].position)
      ])
    }
    return lines
  }, [dataPoints])

  // Tạo đoạn thẳng trên đường OG từ 0.5×OG đến 1.5×OG
  const ogLine = useMemo(() => {
    if (dataPoints.length === 0) return null
    
    const pointG = dataPoints[dataPoints.length - 1] // Điểm G là điểm cuối cùng
    const [gx, gy, gz] = pointG.position
    
    // Điểm bắt đầu = 0.5 * vector_OG
    const startPoint = [gx * 0.5, gy * 0.5, gz * 0.5]
    
    // Điểm kết thúc = 1.5 * vector_OG
    const endPoint = [gx * 1.5, gy * 1.5, gz * 1.5]
    
    return [
      new THREE.Vector3(...startPoint), // Điểm 0.5×OG
      new THREE.Vector3(...endPoint) // Điểm 1.5×OG
    ]
  }, [dataPoints])

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-5, 5, -5]} intensity={0.4} color="#ff6666" />
      <pointLight position={[5, -5, 5]} intensity={0.4} color="#6666ff" />
      
      {/* Lưới vô hạn */}
      <Grid
        args={[10, 10]}
        cellSize={0.2}
        cellThickness={0.5}
        cellColor={COLORS.grid.particleCellColor}
        sectionSize={1}
        sectionThickness={1}
        sectionColor={COLORS.grid.particleSectionColor}
        fadeDistance={25}
        infiniteGrid
      />
      
      <ParticleAxes />
      
      {/* Hiển thị hình chiếu từ điểm được chọn */}
      <ProjectionLines selectedPoint={selectedPoint} />
      
      {/* Các đường kết nối giữa các điểm */}
      {connectionLines.map((points, index) => (
        <Line 
          key={index} 
          points={points} 
          color={COLORS.connections.normal} 
          lineWidth={2} 
          transparent 
          opacity={0.5}
        />
      ))}
      
      {/* Đoạn thẳng trên đường OG từ 0.5×OG đến 1.5×OG */}
      {ogLine && (
        <Line 
          points={ogLine} 
          color="#ffffff" 
          lineWidth={3} 
          transparent 
          opacity={0.8}
          dashed
          dashSize={0.1}
          gapSize={0.05}
        />
      )}
      
      {/* Các điểm particle */}
      {dataPoints.map((point: any, index: number) => (
        <group key={index}>
          <ParticlePoint
            position={point.position}
            color={point.color}
            size={point.size}
            intensity={point.intensity}
            onClick={() => setSelectedPoint(point.position)}
          />
          {/* Chỉ hiển thị số thứ tự - luôn hướng về camera */}
          <Billboard position={[
            point.position[0] + 0.1, 
            point.position[1] + (index === 9 || point.isAverage ? 0.12 : 0.1), // Giảm khoảng cách cho điểm đặc biệt
            point.position[2]
          ]}>
            <Text
              fontSize={0.12}
              color={getTextColor(point.isAverage)}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor={getTextOutlineColor(point.isAverage)}
            >
              {point.isAverage ? 'G' : `${index + 1}`}
            </Text>
          </Billboard>
        </group>
      ))}
      
      <OrbitControls 
        target={[1, 1, 1]}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={10}
        minDistance={2}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  )
}

export default function TeaChart3D_Particle() {
  return (
    <div className={`w-full h-screen ${COLORS.backgrounds.particle} overflow-hidden`}>
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 text-white">
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src="/tuachuashantea.jpg" 
            alt="Tủa Chùa Shan Tea Logo" 
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
          />
          <h1 className="text-sm sm:text-2xl font-bold">Tủa Chùa Shan Teas - Chill Trà</h1>
        </div>
      </div>
      
      <Canvas
        camera={{ position: [4, 4, 4], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        frameloop="demand"
      >
        <TeaChart3DParticleScene />
      </Canvas>
    </div>
  )
} 