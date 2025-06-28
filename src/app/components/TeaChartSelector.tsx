'use client'

import React, { useState } from 'react'
import TeaChart3D from './TeaChart3D'
import TeaChart3D_Wireframe from './TeaChart3D_Wireframe'
import TeaChart3D_Particle from './TeaChart3D_Particle'
import TeaChart3D_Content from './TeaChart3D_Content'

export default function TeaChartSelector() {
  const [activeChart, setActiveChart] = useState<'standard' | 'wireframe' | 'particle' | 'content'>('standard')

  const charts = [
    { 
      key: 'standard' as const, 
      name: 'Đồ thị 1'
    },
    { 
      key: 'wireframe' as const, 
      name: 'Đồ thị 2'
    },
    { 
      key: 'particle' as const, 
      name: 'Đồ thị 3'
    },
    { 
      key: 'content' as const, 
      name: 'Đồ thị 4'
    }
  ]

  const renderChart = () => {
    switch (activeChart) {
      case 'standard':
        return <TeaChart3D />
      case 'wireframe':
        return <TeaChart3D_Wireframe />
      case 'particle':
        return <TeaChart3D_Particle />
      case 'content':
        return <TeaChart3D_Content />
      default:
        return <TeaChart3D />
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Bộ chọn đồ thị - responsive cho mobile và desktop */}
      <div className="fixed bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-30 w-auto max-w-[calc(100vw-8px)] sm:max-w-[calc(100vw-16px)]">
        <div className="bg-black/90 backdrop-blur-sm rounded-full px-1.5 sm:px-4 py-1.5 sm:py-2 text-white shadow-lg border border-gray-600/30">
          <div className="flex items-center justify-center gap-0.5 sm:gap-2 md:gap-3">
            {charts.map((chart) => (
              <button
                key={chart.key}
                onClick={() => setActiveChart(chart.key)}
                className={`px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-full transition-all text-xs sm:text-sm font-medium whitespace-nowrap min-w-[50px] sm:min-w-[70px] md:min-w-[80px] touch-manipulation flex-shrink-0 ${
                  activeChart === chart.key
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-700/80 hover:bg-gray-600 text-gray-200 hover:scale-105 active:scale-95'
                }`}
              >
                {chart.name}
              </button>
            ))}
            <div className="w-px h-3 sm:h-4 bg-gray-600 ml-1 hidden md:block"></div>
            <div className="text-xs text-gray-400 ml-1 hidden lg:block">
              {charts.find(c => c.key === activeChart)?.name}
            </div>
          </div>
        </div>
      </div>

      {/* Đồ thị được chọn */}
      <div className="w-full h-full pb-16 sm:pb-20">
        {renderChart()}
      </div>
    </div>
  )
} 