'use client'

import React, { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Billboard, Grid, Line, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { bitterness, sweetness, floral } from '../../data/content'
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

// Component cho điểm dữ liệu với hiệu ứng cube có thể click
function ContentCube({ 
  position, 
  color, 
  size = 0.05, 
  isSpecial = false, 
  onClick 
}: { 
  position: [number, number, number], 
  color: string, 
  size?: number,
  isSpecial?: boolean,
  onClick?: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const patternRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Xoay cube liên tục
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.z += 0.005
      
      // Hiệu ứng đặc biệt cho điểm cuối cùng (16)
      if (isSpecial) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2
        meshRef.current.scale.setScalar(scale)
        meshRef.current.rotation.y += 0.02 // Xoay nhanh hơn
      }
    }
    
    // Vân ngoài cho điểm đặc biệt
    if (patternRef.current && isSpecial) {
      patternRef.current.rotation.x = state.clock.elapsedTime * 1.1
      patternRef.current.rotation.y = -state.clock.elapsedTime * 0.8
      patternRef.current.rotation.z = state.clock.elapsedTime * 1.4
    }
  })

  return (
    <group>
      {/* Cube chính */}  
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
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={isSpecial ? 0.4 : 0.2}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>
      
      {/* Vân ngoài cho điểm đặc biệt */}
      {isSpecial && (
        <mesh ref={patternRef} position={position}>
          <boxGeometry args={[size * 1.7, size * 1.7, size * 1.7]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.4}
            wireframe
          />
        </mesh>
      )}
    </group>
  )
}

// Component cho trục tọa độ với số liệu
function ContentAxes() {
  const xAxisPoints = useMemo(() => [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(3, 0, 0)
  ], [])
  
  const yAxisPoints = useMemo(() => [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 3, 0)
  ], [])
  
  const zAxisPoints = useMemo(() => [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 3)
  ], [])



  return (
    <group>
            <Line points={xAxisPoints} color={getAxisColor('x')} lineWidth={3} />
      <Line points={yAxisPoints} color={getAxisColor('y')} lineWidth={3} />
      <Line points={zAxisPoints} color={getAxisColor('z')} lineWidth={3} />
      
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

// Component chính cho đồ thị Content
function TeaChart3DContentScene() {
  const [selectedPoint, setSelectedPoint] = useState<[number, number, number] | null>(null)
  
  // Chuẩn hóa dữ liệu content và tạo các điểm
  const dataPoints = useMemo(() => {
    const maxBitterness = Math.max(...bitterness)
    const maxSweetness = Math.max(...sweetness)
    const maxFloral = Math.max(...floral)
    
    // Tính giá trị trung bình của 16 điểm
    const avgBitterness = bitterness.reduce((sum, val) => sum + val, 0) / bitterness.length
    const avgSweetness = sweetness.reduce((sum, val) => sum + val, 0) / sweetness.length
    const avgFloral = floral.reduce((sum, val) => sum + val, 0) / floral.length
    
    // Tạo 16 điểm gốc + 1 điểm trung bình
    const points = bitterness.map((bitter: number, index: number) => {
      const sweet = sweetness[index] || 0
      const floralValue = floral[index] || 0
      
      // Chuẩn hóa và scale dữ liệu
      const x = (bitter / maxBitterness) * 2
      const y = (sweet / maxSweetness) * 2
      const z = (floralValue / maxFloral) * 2
      
        // Sử dụng config màu với logic đặc biệt cho Content
        const color = getPointColor(index, false, index === 15)
      
      return {
        position: [x, y, z] as [number, number, number],
        color,
        index,
        bitterness: bitter.toFixed(3),
        sweetness: sweet.toFixed(3),
        floral: floralValue.toFixed(3),
        isAverage: false
      }
    })
    
    // Thêm điểm trung bình
    const avgX = (avgBitterness / maxBitterness) * 2
    const avgY = (avgSweetness / maxSweetness) * 2
    const avgZ = (avgFloral / maxFloral) * 2
    
    points.push({
      position: [avgX, avgY, avgZ] as [number, number, number],
      color: getPointColor(16, true), // Màu cho điểm trung bình
      index: 16,
      bitterness: avgBitterness.toFixed(3),
      sweetness: avgSweetness.toFixed(3),
      floral: avgFloral.toFixed(3),
      isAverage: true
    })
    
    return points
  }, [])

  // Tạo các đường kết nối giữa các điểm liền kề (chỉ 16 điểm đầu, không nối với điểm trung bình)
  const connectionLines = useMemo(() => {
    const lines = []
    for (let i = 0; i < Math.min(dataPoints.length - 1, 15); i++) { // Chỉ nối đến điểm 15 (index 15)
      lines.push([
        new THREE.Vector3(...dataPoints[i].position),
        new THREE.Vector3(...dataPoints[i + 1].position)
      ])
    }
    return lines
  }, [dataPoints])

  // Đường nối điểm A và B (nét đứt)
  const firstToLastLine = useMemo(() => {
    if (dataPoints.length > 16) { // Đảm bảo có cả điểm A (index 0) và B (index 15)
      return [
        new THREE.Vector3(...dataPoints[0].position),  // Điểm A
        new THREE.Vector3(...dataPoints[15].position)  // Điểm B (index 15)
      ]
    }
    return []
  }, [dataPoints])

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.0} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#ffffff" />
      <directionalLight position={[0, 10, 5]} intensity={0.8} />
      
      {/* Lưới vô hạn */}
      <Grid
        args={[10, 10]}
        cellSize={0.2}
        cellThickness={0.5}
        cellColor={COLORS.grid.contentCellColor}
        sectionSize={1}
        sectionThickness={1}
        sectionColor={COLORS.grid.contentSectionColor}
        fadeDistance={25}
        infiniteGrid
      />
      
      <ContentAxes />
      
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
      
      {/* Đường nối điểm A và B (nét đứt) */}
      {firstToLastLine.length > 0 && (
        <Line 
          points={firstToLastLine} 
          color={COLORS.connections.dashed} 
          lineWidth={2} 
          transparent 
          opacity={0.5}
          dashed
          dashSize={0.1}
          gapSize={0.05}
        />
      )}
      
      {dataPoints.map((point: any, index: number) => (
        <group key={index}>
          <ContentCube
            position={point.position}
            color={point.color}
            size={point.isAverage ? 0.07 : 0.05}
            isSpecial={index === 9 || index === 15 || point.isAverage}
            onClick={() => setSelectedPoint(point.position)}
          />
          {/* Chỉ hiển thị label A, B và AVG */}
          {(index === 0 || index === 15 || point.isAverage) && (
            <Billboard position={[
              point.position[0] + (index === 0 ? 0.08 : 0.08), 
              point.position[1] + (index === 0 ? 0.08 : (index === 15 || point.isAverage ? 0.12 : 0.08)), // Giảm khoảng cách cho điểm B và G
              point.position[2] + (index === 0 ? 0 : 0.08)
            ]}>
              <Text
                fontSize={0.16}
                color={getTextColor(point.isAverage)}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.03}
                outlineColor={getTextOutlineColor(point.isAverage)}
              >
                {point.isAverage ? 'G' : (index === 0 ? 'A' : 'B')}
              </Text>
            </Billboard>
          )}
        </group>
      ))}
      
      <OrbitControls 
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

export default function TeaChart3D_Content() {
  return (
    <div className={`w-full h-screen ${COLORS.backgrounds.content} overflow-hidden`}>
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
        camera={{ position: [3, 3, 3], fov: 75 }}
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
        <TeaChart3DContentScene />
      </Canvas>
    </div>
  )
} 