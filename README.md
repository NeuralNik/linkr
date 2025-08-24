# 🔗 linkr

> A modern, feature-rich QR code generator with React frontend and Python FastAPI backend


## 🌟 Overview

**linkr** is a modern QR code generator that allows users to convert any URL into a scannable QR code with customizable colors and multiple download formats. Built with a sleek dark theme and neon green accents, linkr provides a seamless user experience for generating high-quality QR codes.

## ✨ Features

### 🎨 **Customization Options**
- **Color Selection**: Custom foreground and background colors with color pickers
- **Multiple Formats**: Download QR codes in PNG, JPG, PDF, or SVG formats
- **High Quality**: Generate crisp, high-resolution QR codes
- **Real-time Preview**: See your QR code update instantly

### 🎯 **User Experience**
- **Dark Theme**: Modern dark UI with neon green highlights
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Fast Generation**: Instant QR code creation with Python backend
- **No Data Storage**: Your URLs are not stored on our servers for privacy

### 🔧 **Technical Features**
- **React 18** with TypeScript for type safety
- **Python FastAPI** backend for fast QR generation
- **Tailwind CSS** with custom design system
- **Shadcn/ui** components for consistent UI
- **Vite** for lightning-fast development

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom theme
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks

### **Backend**
- **Framework**: FastAPI (Python)
- **QR Generation**: qrcode library with PIL
- **PDF Generation**: ReportLab
- **Server**: Uvicorn ASGI
- **CORS**: Configured for cross-origin requests

## 🚀 Quick Start

### **Prerequisites**
- **Node.js** 18+ and **pnpm**
- **Python** 3.8+
- **Git**

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/writetosagnik/linkr.git
   cd linkr
   ```

2. **Setup Frontend**
   ```bash
   # Install dependencies
   pnpm install
   
   # Start development server
   pnpm run dev
   ```

3. **Setup Backend**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Start backend server
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Access the Application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

## 🌐 Deployment

### **Deploy to Vercel (Frontend)**

1. **Prerequisites**
   - Vercel account
   - Backend deployed separately (see options below)

2. **Frontend Deployment**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

3. **Environment Variables**
   Set in Vercel dashboard:
   ```
   VITE_API_BASE_URL=https://your-backend-url.vercel.app
   ```

### **Backend Deployment Options**

#### **Option 1: Vercel (Recommended)**
```bash
# Create separate backend deployment
cd backend
vercel
```

#### **Option 2: Railway**
- Push backend folder to Railway
- Automatic Python detection

#### **Option 3: Render**
- Connect GitHub repository
- Use backend subfolder

### **Deployment Checklist**

✅ **Frontend Ready**
- [x] Build process working (`pnpm run build`)
- [x] Environment variables configured
- [x] Vercel.json created
- [x] Static assets optimized

✅ **Backend Ready**
- [x] CORS configured for production
- [x] Vercel.json for Python deployment
- [x] Requirements.txt updated
- [x] Error handling implemented

⚠️ **Manual Steps Required**
- [ ] Deploy backend first
- [ ] Update VITE_API_BASE_URL with backend URL
- [ ] Test production deployment
- [ ] Update CORS origins with frontend URL

## 📁 Project Structure

```
linkr/
├── 📂 backend/                 # Python FastAPI backend
│   ├── main.py                # Main FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── README.md             # Backend documentation
├── 📂 src/                    # React frontend source
│   ├── 📂 assets/            # Static assets (images, logos)
│   ├── 📂 components/        # Reusable React components
│   │   ├── 📂 ui/           # Shadcn/ui components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Footer.tsx       # Site footer
│   │   └── QRGenerator.tsx  # Main QR generation component
│   ├── 📂 pages/            # Page components
│   │   ├── Home.tsx         # Landing page
│   │   ├── Developer.tsx    # About developer page
│   │   └── NotFound.tsx     # 404 page
│   ├── 📂 contexts/         # React contexts
│   ├── 📂 hooks/           # Custom React hooks
│   └── 📂 lib/             # Utility functions
├── 📂 public/               # Public static files
├── package.json            # Frontend dependencies
├── tailwind.config.ts      # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── README.md              # Project documentation
```

## 🎨 Design System

### **Color Palette**
- **Primary**: Neon Green (`#00ff41`)
- **Background**: Dark (`#0a0a0a`)
- **Cards**: Glass effect with borders
- **Text**: High contrast for accessibility

### **Typography**
- **Font**: JetBrains Mono for modern, tech aesthetic
- **Headings**: Bold with gradient effects
- **Body**: Optimized for readability

### **Animations**
- **Glow Effects**: Subtle neon glow on interactive elements
- **Smooth Transitions**: 300ms duration for all interactions
- **Hover States**: Enhanced feedback for user actions

## 🔌 API Endpoints

### **Base URL**: `http://localhost:8000`

#### **Generate QR Code**
```http
POST /generate-qr
Content-Type: application/json

{
  "url": "https://example.com",
  "foreground_color": "#000000",
  "background_color": "#ffffff",
  "format": "png"
}
```

**Response:**
```json
{
  "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "formatted_url": "https://example.com"
}
```

#### **Supported Formats**
- **PNG** - Default, high quality
- **JPG** - Smaller file size
- **SVG** - Vector format, scalable
- **PDF** - Professional document format

## 🎯 Usage

1. **Enter URL**: Input any valid URL in the text field
2. **Customize**: Choose colors and download format
3. **Generate**: Click "Generate QR Code" button
4. **Download**: Download your QR code in the selected format

### **URL Support**
- ✅ `https://example.com`
- ✅ `http://example.com`
- ✅ `example.com` (auto-adds https://)
- ✅ `subdomain.example.com`
- ✅ URLs with paths and parameters

## 🔒 Privacy & Security

- **No Data Storage**: URLs are processed but never stored
- **Client-Side Processing**: Frontend handles UI state locally
- **Secure Communications**: HTTPS in production
- **No Tracking**: No analytics or user tracking implemented

## 👨‍💻 Developer

**Sagnik Pal** - *Exploring AI Milestones*

- 🌐 **GitHub**: [writetosagnik](https://github.com/writetosagnik)
- 💼 **LinkedIn**: [sagnik-pal-930160277](https://www.linkedin.com/in/sagnik-pal-930160277/)
- 📧 **Email**: writeto.uxgnik@gmail.com
- 💬 **Reddit**: [Comfortable-Web-5719](https://www.reddit.com/user/Comfortable-Web-5719/)

## 🛣️ Roadmap

### **v1.2.0 - Planned Features**
- [ ] Batch QR code generation
- [ ] QR code analytics
- [ ] Custom logo embedding
- [ ] More export formats (WebP, TIFF)

### **v1.3.0 - Future Enhancements**
- [ ] User accounts and history
- [ ] QR code templates
- [ ] API rate limiting
- [ ] Progressive Web App (PWA)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **FastAPI** for the fast and modern Python backend
- **Tailwind CSS** for the utility-first CSS framework
- **Shadcn/ui** for beautiful, accessible components
- **Lucide** for the clean, consistent icons

---

**Made with ❤️ by Sagnik** | [Live Demo](http://localhost:5173) | [API Docs](http://localhost:8000/docs)