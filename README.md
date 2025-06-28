# 🍃 Tea Visualization 3D

Dự án trực quan hóa dữ liệu trà 3D tương tác cho **Tủa Chùa Shan Teas**, sử dụng React Three Fiber để hiển thị các đặc tính hương vị của trà trong không gian ba chiều.

![Tea Visualization 3D](public/tuachuashantea.jpg)

## ✨ Tính năng

### 🎯 **4 Chế độ hiển thị đồ thị:**
- **Standard**: Đồ thị 3D cơ bản với điểm dữ liệu hình cầu
- **Particle**: Hiệu ứng particle với animation float
- **Wireframe**: Hiển thị wireframe với điểm octahedron
- **Content**: Hiển thị cube với đường nối đặc biệt A-B

### 📊 **Trực quan hóa dữ liệu:**
- **3 trục tọa độ**: Độ đắng/chát (X), Độ ngọt (Y), Hương hoa (Z)
- **16 điểm dữ liệu**: 15 điểm mẫu + 1 điểm trung bình (G)
- **Điểm đặc biệt**: Điểm số 10 và điểm G có vân ngoài độc đáo
- **Màu sắc tùy chỉnh**: Hệ thống màu được quản lý tập trung

### 🎮 **Tương tác:**
- **Xoay**: Kéo chuột để xoay đồ thị
- **Zoom**: Cuộn chuột để phóng to/thu nhỏ
- **Pan**: Shift + kéo để di chuyển
- **Click điểm**: Hiển thị đường chiếu xuống các trục

### 🎨 **Hiệu ứng đặc biệt:**
- **Vân ngoài**: Điểm G và số 10 có wireframe pattern xoay
- **Animation**: Rotation, scaling, floating effects
- **Label động**: Luôn hướng về camera
- **Đường kết nối**: Nối các điểm liền kề + đường A-B đặc biệt

## 🛠️ Công nghệ sử dụng

- **Frontend**: Next.js 15.3.4 + React 19
- **3D Engine**: Three.js + React Three Fiber
- **3D Components**: @react-three/drei
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Build Tool**: Turbopack

## 📁 Cấu trúc dự án

```
tea_visualize/
├── src/
│   ├── app/
│   │   ├── components/           # Các component đồ thị 3D
│   │   │   ├── TeaChart3D.tsx           # Đồ thị chuẩn
│   │   │   ├── TeaChart3D_Particle.tsx  # Đồ thị particle
│   │   │   ├── TeaChart3D_Wireframe.tsx # Đồ thị wireframe
│   │   │   ├── TeaChart3D_Content.tsx   # Đồ thị content
│   │   │   └── TeaChartSelector.tsx     # Selector chuyển đổi
│   │   ├── layout.tsx            # Layout chính
│   │   ├── page.tsx             # Trang chủ
│   │   └── globals.css          # Styles toàn cục
│   └── data/
│       ├── general.ts           # Dữ liệu 15 điểm mẫu
│       ├── content.ts           # Dữ liệu 16 điểm content
│       └── colors.ts            # Config màu sắc tập trung
├── public/
│   └── tuachuashantea.jpg      # Logo thương hiệu
├── Dockerfile                   # Docker configuration
└── package.json                # Dependencies
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống:
- Node.js 18+ 
- npm hoặc yarn

### Cài đặt:

```bash
# Clone repository
git clone <repository-url>
cd tea_visualize

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

### Build production:

```bash
# Build ứng dụng
npm run build

# Chạy production server
npm start
```

## 📊 Dữ liệu

### Cấu trúc dữ liệu general.ts (15 điểm):
```typescript
s_bitterness: number[]  // Độ đắng/chát (0.034 - 0.103)
s_sweetness: number[]   // Độ ngọt (0.025 - 0.112)  
s_floral: number[]      // Hương hoa (0.0034 - 0.274)
```

### Cấu trúc dữ liệu content.ts (16 điểm):
```typescript
bitterness: number[]    // Độ đắng (0.014 - 1.0)
sweetness: number[]     // Độ ngọt (-0.015 - 1.0)
floral: number[]        // Hương hoa (0.008 - 1.0)
```

## 🎨 Hệ thống màu sắc

Màu sắc được quản lý tập trung trong `src/data/colors.ts`:

- **Trục X (Đắng/Chát)**: `#5b2f18` (Nâu cafe đậm)
- **Trục Y (Ngọt)**: `#ed8c00` (Cam đậm) 
- **Trục Z (Hương hoa)**: `#ff4757` (Đỏ)
- **Điểm G (Trung bình)**: `#2c3e50` (Xanh đen)

## 🎮 Hướng dẫn sử dụng

1. **Chọn chế độ hiển thị**: Sử dụng selector để chuyển đổi giữa 4 chế độ
2. **Tương tác với đồ thị**:
   - Kéo để xoay
   - Cuộn để zoom
   - Shift+kéo để pan
3. **Click vào điểm**: Xem đường chiếu xuống các trục
4. **Quan sát điểm đặc biệt**: Điểm số 10 và G có vân ngoài xoay

## 🐳 Docker

```bash
# Build Docker image
docker build -t tea-visualize .

# Run container
docker run -p 3000:3000 tea-visualize
```

## 🔧 Tùy chỉnh

### Thay đổi màu sắc:
Chỉnh sửa file `src/data/colors.ts`

### Thêm dữ liệu mới:
Cập nhật file `src/data/general.ts` hoặc `src/data/content.ts`

### Tùy chỉnh hiệu ứng:
Chỉnh sửa các component trong `src/app/components/`

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này thuộc về **Tủa Chùa Shan Teas**. Mọi quyền được bảo lưu.

## 📞 Liên hệ

**Tủa Chùa Shan Teas - Chill Trà**

---

⭐ Nếu dự án này hữu ích, hãy cho chúng tôi một star!
