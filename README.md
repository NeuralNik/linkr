<p align="center">
  <img src="https://i.postimg.cc/k5yv3JfQ/linkr-banner.png" alt="Linkr Banner" style="max-width:100%;"/>
</p>

# 🔗 linkr

> A modern, feature-rich QR code generator with React frontend and Python FastAPI backend

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://linkr-inky-three.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Hacktoberfest](https://img.shields.io/badge/hacktoberfest-welcome-orange.svg)](CONTRIBUTING.md)

## 🌟 Overview

**linkr** is a modern QR code generator that allows you to convert any URL into a scannable QR code with customizable colors and multiple download formats. Built with a sleek dark theme and neon green accents, linkr provides a seamless user experience for generating high-quality QR codes.

**Live Demo:** [https://linkr-inky-three.vercel.app/](https://linkr-inky-three.vercel.app/)

## ✨ Features

### 🎨 **Customization Options**

- **QR Code Templates**: 15 pre-designed color schemes and styles (Professional, Creative, Nature, Tech, Minimal)
- **Color Selection**: Custom foreground and background colors with color pickers
- **Multiple Formats**: Download QR codes in PNG, JPG, PDF, or SVG formats
- **High Quality**: Generate crisp, high-resolution QR codes
- **Real-time Preview**: See your QR code update instantly
- **QR History**: Automatic saving and management of generated QR codes with search and filter capabilities

### 🎯 **User Experience**

- **Dark Theme**: Modern dark UI with neon green highlights
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Fast Generation**: Instant QR code creation with Python backend
- **Batch Processing**: Generate multiple QR codes at once from CSV or manual input
- **QR Code History**: Automatic history tracking with search, filter, and export capabilities
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

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **pnpm** (comes with Node.js)
- **Python** 3.8+ ([Download](https://www.python.org/downloads/))
- **Git** ([Download](https://git-scm.com/))

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/writetosagnik/linkr.git
cd linkr
```

#### 2. Setup Backend (Terminal 1)

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

**Backend will be running at:**

- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

#### 3. Setup Frontend (Terminal 2)

Open a new terminal window:

```bash
# From project root
# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm run dev
```

**Frontend will be running at:** http://localhost:5173

#### 4. Access the Application

Open your browser and navigate to:

- **Frontend:** http://localhost:5173
- **Backend API Docs:** http://localhost:8000/docs

You're all set! Start generating QR codes! 🎉

## � Usage

1. **Enter URL**: Type or paste any URL in the input field
2. **Customize Colors** (Optional):
   - Choose foreground color (QR code color)
   - Choose background color
   - Select from pre-designed templates
3. **Select Format**: Choose from PNG, JPG, PDF, or SVG
4. **Generate**: Click "Generate QR Code"
5. **Download**: Click download button to save your QR code
6. **History**: Access your previously generated QR codes from the History page

### Supported URL Formats

- ✅ `https://example.com`
- ✅ `http://example.com`
- ✅ `example.com` (automatically adds https://)
- ✅ `subdomain.example.com`
- ✅ URLs with paths: `example.com/path/to/page`
- ✅ URLs with parameters: `example.com?id=123&name=test`

## 🧪 Testing

### Test the Backend API

Visit http://localhost:8000/docs to access the interactive API documentation (Swagger UI).

**Test QR Generation via curl:**

```bash
curl -X POST "http://localhost:8000/generate-qr" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com",
    "foreground_color": "#000000",
    "background_color": "#ffffff",
    "format": "png"
  }'
```

### Available Endpoints

- `GET /` - Health check
- `POST /generate-qr` - Generate QR code
- `POST /download-qr` - Download QR code in specified format
- `GET /docs` - Interactive API documentation

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


## � Available Scripts

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend

```bash
# From backend/ directory with venv activated
uvicorn main:app --reload                    # Start with auto-reload
uvicorn main:app --reload --port 8000        # Specify port
uvicorn main:app --host 0.0.0.0 --port 8000  # Expose to network
```

## 🛠️ Development

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000
```

### Project Architecture

```
Frontend (React + TypeScript)
    ↓
  Vite Dev Server (localhost:5173)
    ↓
  HTTP Requests
    ↓
Backend (FastAPI + Python)
    ↓
  Uvicorn Server (localhost:8000)
    ↓
  QR Code Generation
```

### Code Structure

- **Frontend**: Component-based React architecture with TypeScript
- **Backend**: RESTful API with FastAPI
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Hooks (useState, useEffect)
- **API Communication**: Fetch API with async/await

## 🔒 Privacy & Security

- **No Data Storage**: URLs are processed in memory but never stored on disk or database
- **Client-Side Processing**: Frontend handles UI state locally in browser
- **No Tracking**: No analytics or user tracking implemented
- **Open Source**: Fully transparent codebase for security auditing

## 🐛 Troubleshooting

### Backend won't start

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:** Make sure virtual environment is activated and dependencies are installed:

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Frontend can't connect to backend

**Error:** Network request failed / CORS error

**Solution:**

1. Ensure backend is running on port 8000
2. Check backend terminal for any errors
3. Verify CORS is configured in `backend/main.py`

### Port already in use

**Error:** `Address already in use`

**Solution:**

```bash
# Windows - Find and kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

### Dependencies installation fails

**Solution:**

```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Or use pnpm
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 👨‍💻 Developer

**Sagnik Pal** - _Exploring AI Milestones_

- 🌐 **GitHub**: [writetosagnik](https://github.com/writetosagnik)
- 💼 **LinkedIn**: [sagnik-pal-930160277](https://www.linkedin.com/in/sagnik-pal-930160277/)
- 📧 **Email**: writeto.uxgnik@gmail.com
- 💬 **Reddit**: [Comfortable-Web-5719](https://www.reddit.com/user/Comfortable-Web-5719/)

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### How to Contribute

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/linkr.git`
3. **Create** a feature branch: `git checkout -b feature/AmazingFeature`
4. **Make** your changes
5. **Test** thoroughly (both frontend and backend)
6. **Commit** your changes: `git commit -m 'Add some AmazingFeature'`
7. **Push** to your fork: `git push origin feature/AmazingFeature`
8. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Test your changes locally before submitting PR
- Update documentation if needed
- Keep PRs focused on a single feature/fix

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌐 Deployment

Want to deploy your own instance? Check out our [Deployment Guide](DEPLOYMENT_GUIDE.md) for detailed instructions on deploying to Render, Vercel, and other platforms.

## 🙏 Acknowledgments

- [React](https://react.dev/) - Amazing JavaScript framework
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible components
- [Lucide](https://lucide.dev/) - Clean, consistent icons
- [Vite](https://vitejs.dev/) - Lightning-fast build tool

## 📞 Support

- 📧 Email: writeto.uxgnik@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/writetosagnik/linkr/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/writetosagnik/linkr/discussions)

## ⭐ Show Your Support

If you find this project helpful, please consider giving it a star on GitHub! It helps others discover the project.

---

**Made with ❤️ by [Sagnik Pal](https://github.com/writetosagnik)** | [Live Demo](https://linkr-inky-three.vercel.app/) | [Report Bug](https://github.com/writetosagnik/linkr/issues) | [Request Feature](https://github.com/writetosagnik/linkr/issues)



<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
