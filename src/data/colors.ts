// Cấu hình màu sắc cho toàn bộ ứng dụng Tea Visualization
export const COLORS = {
  // Màu trục tọa độ
  axes: {
    bitterness: '#646b3a',    // Màu cafe cho trục Chát/Đắng
    sweetness: '#a45429',     // Màu mật ong cho trục Ngọt
    floral: '#9c88ff',        // Màu xanh nhạt cho trục Hương Hoa
  },

  // Màu điểm dữ liệu
  points: {
    normal: '#7bed9f',        // Màu xanh nhạt cho điểm thường
    special: '#f1c40f',       // Màu vàng cho điểm số 10
    average: '#ffffff',       // Màu đen nhạt cho điểm trung bình (G)
    contentSpecial: '#e67e22', // Màu cam cho điểm B trong Content
  },

  // Màu text và outline
  text: {
    normal: 'white',          // Màu text thường
    average: '#000000',       // Màu text cho điểm G
    normalOutline: '#000000', // Màu outline cho text thường
    averageOutline: '#ffffff', // Màu outline trắng cho điểm G
  },

  // Màu đường kết nối
  connections: {
    normal: '#7bed9f',        // Màu đường kết nối thường
    dashed: '#95a5a6',        // Màu đường nét đứt
    projection: '#ffffff',    // Màu đường chiếu
  },

  // Màu grid và background
  grid: {
    cellColor: '#404040',     // Màu ô lưới nhỏ
    sectionColor: '#606060',  // Màu ô lưới lớn
    wireframeCellColor: '#333333',    // Màu ô lưới cho wireframe
    wireframeSectionColor: '#555555', // Màu section cho wireframe
    particleCellColor: '#333333',     // Màu ô lưới cho particle
    particleSectionColor: '#444444',  // Màu section cho particle
    contentCellColor: '#404040',      // Màu ô lưới cho content
    contentSectionColor: '#606060',   // Màu section cho content
  },

  // Màu background cho các chart khác nhau
  backgrounds: {
    standard: 'bg-gray-950',   // Background cho standard chart
    wireframe: 'bg-gray-950',  // Background cho wireframe chart
    particle: 'bg-black',      // Background cho particle chart
    content: 'bg-gray-900',    // Background cho content chart
  }
} as const

// Helper functions để lấy màu theo context
export const getAxisColor = (axis: 'x' | 'y' | 'z'): string => {
  switch (axis) {
    case 'x': return COLORS.axes.bitterness
    case 'y': return COLORS.axes.sweetness
    case 'z': return COLORS.axes.floral
    default: return COLORS.axes.bitterness
  }
}

export const getPointColor = (index: number, isAverage: boolean, isContentSpecial: boolean = false): string => {
  if (isAverage) return COLORS.points.average
  if (index === 9) return COLORS.points.special // Điểm số 10 (index 9)
  if (isContentSpecial) return COLORS.points.contentSpecial
  return COLORS.points.normal
}

export const getTextColor = (isAverage: boolean): string => {
  return isAverage ? COLORS.text.average : COLORS.text.normal
}

export const getTextOutlineColor = (isAverage: boolean): string => {
  return isAverage ? COLORS.text.averageOutline : COLORS.text.normalOutline
}

// Export types cho TypeScript
export type AxisType = 'x' | 'y' | 'z'
export type ChartType = 'standard' | 'wireframe' | 'particle' | 'content' 