# Contributing to linkr 🎉

We love your input! We want to make contributing to linkr as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.8+ ([Download](https://www.python.org/downloads/))
- **Git** ([Download](https://git-scm.com/))

### Development Setup

1. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your fork: `git clone https://github.com/YOUR_USERNAME/linkr.git`

2. **Set up the project locally**
   ```bash
   cd linkr
   
   # Backend setup
   cd backend
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Frontend setup (in new terminal)
   cd .. # back to root
   npm install
   ```

3. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   
   # Terminal 2 - Frontend
   npm run dev
   ```

4. **Test your setup**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/docs

## 🔄 Development Workflow

### Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-description
   # or
   git checkout -b docs/update-readme
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test thoroughly**
   ```bash
   # Test backend
   cd backend
   # Test API endpoints via http://localhost:8000/docs
   
   # Test frontend
   npm run build  # Ensure build works
   # Test all features in browser
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   
   # Or for bug fixes:
   git commit -m "fix: resolve QR generation issue"
   
   # Or for documentation:
   git commit -m "docs: update installation guide"
   ```

### Commit Message Format

We follow conventional commit format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add batch QR code generation
fix: resolve CORS issue in production
docs: update API documentation
style: format code with prettier
refactor: optimize QR generation algorithm
```

## 🎯 How to Contribute

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**Great Bug Reports** include:
- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs **actual behavior**
- **Environment details** (OS, browser, Node/Python versions)
- **Screenshots** if applicable

Use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md) for consistency.

### ✨ Suggesting Features

We love feature suggestions! Please:
- **Check existing issues** to avoid duplicates
- **Provide clear use cases** for the feature
- **Explain the benefit** to users
- **Consider implementation complexity**

Use our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md).

### 🔧 Code Contributions

#### Frontend (React + TypeScript)

**Code Style:**
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use descriptive variable names

**File Structure:**
```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── contexts/      # React contexts
├── lib/           # Utility functions
└── assets/        # Static assets
```

**Example Component:**
```typescript
interface QRDisplayProps {
  qrCode: string;
  url: string;
}

export function QRDisplay({ qrCode, url }: QRDisplayProps) {
  return (
    <div className="qr-display">
      <img src={qrCode} alt={`QR code for ${url}`} />
    </div>
  );
}
```

#### Backend (FastAPI + Python)

**Code Style:**
- Follow PEP 8 style guidelines
- Use type hints for function parameters and returns
- Write descriptive docstrings
- Keep functions focused on single responsibility
- Handle errors gracefully

**Example API Endpoint:**
```python
@app.post("/generate-qr", response_model=QRResponse)
async def generate_qr(request: URLRequest):
    """
    Generate QR code for the provided URL.
    
    Args:
        request: URLRequest containing url and customization options
        
    Returns:
        QRResponse with base64 encoded QR code and formatted URL
        
    Raises:
        HTTPException: If URL validation fails
    """
    try:
        # Implementation here
        pass
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
```

#### Styling (Tailwind CSS)

- Use existing design system colors and spacing
- Follow mobile-first responsive design
- Use semantic class names
- Leverage custom CSS classes for complex styles

**Design System:**
```css
/* Primary colors */
--neon-green: #00ff41
--dark-bg: #0a0a0a

/* Component patterns */
.glass-effect     /* For cards and modals */
.glow-effect      /* For interactive elements */
.text-glow        /* For highlighted text */
```

## 🧪 Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, please test:

**Frontend:**
- [ ] All pages load without errors
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] All interactive elements work (buttons, forms, etc.)
- [ ] Error states display correctly
- [ ] Loading states work properly

**Backend:**
- [ ] All API endpoints return correct responses
- [ ] Error handling works for invalid inputs
- [ ] CORS configuration allows frontend requests
- [ ] API documentation is accessible at `/docs`

**Integration:**
- [ ] Frontend can connect to backend
- [ ] QR code generation works end-to-end
- [ ] File downloads work in all supported formats
- [ ] Color customization applies correctly

### Browser Testing

Test your changes in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (if on macOS)
- ✅ Edge (latest)

## 📋 Pull Request Process

### Before Submitting

1. **Update documentation** if you've changed APIs or added features
2. **Test thoroughly** on multiple browsers and devices
3. **Check for merge conflicts** with the main branch
4. **Ensure your branch is up to date**:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

### Submitting Your PR

1. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request**:
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill out the PR template completely
   - Link any related issues

3. **PR Requirements**:
   - [ ] Clear, descriptive title
   - [ ] Detailed description of changes
   - [ ] Screenshots/GIFs for UI changes
   - [ ] Updated documentation
   - [ ] Passes all checks
   - [ ] Addresses reviewer feedback

### PR Review Process

1. **Automated checks** must pass (linting, building)
2. **Manual review** by maintainers
3. **Feedback incorporation** if needed
4. **Approval and merge** once everything looks good

## 🏷️ Issue Labels

We use labels to organize issues:

**Type:**
- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `documentation` - Documentation updates
- `question` - Further information requested

**Priority:**
- `high priority` - Critical issues
- `medium priority` - Important improvements
- `low priority` - Nice-to-have features

**Difficulty:**
- `good first issue` - Perfect for newcomers
- `help wanted` - Community contributions welcome
- `advanced` - Requires deep project knowledge

**Hacktoberfest:**
- `hacktoberfest` - Eligible for Hacktoberfest
- `hacktoberfest-accepted` - Approved Hacktoberfest contribution

## 🌟 Recognition

Contributors are recognized in:
- Project README
- Release notes for significant contributions
- GitHub contributor graph
- Special mentions in project updates

## 📞 Getting Help

**Stuck? Need help?** We're here for you:

- 💬 **GitHub Discussions**: [Ask questions](https://github.com/writetosagnik/linkr/discussions)
- 🐛 **Issues**: [Report bugs or request features](https://github.com/writetosagnik/linkr/issues)
- 📧 **Email**: writeto.uxgnik@gmail.com
- 💼 **LinkedIn**: [sagnik-pal-930160277](https://www.linkedin.com/in/sagnik-pal-930160277/)

## 🎉 Hacktoberfest 2025

We're excited to participate in Hacktoberfest! 

**How to participate:**
1. **Register** at [hacktoberfest.com](https://hacktoberfest.com)
2. **Find issues** labeled `hacktoberfest` or `good first issue`
3. **Submit quality PRs** between October 1-31
4. **Get your PRs merged** to count toward Hacktoberfest

**Hacktoberfest Guidelines:**
- Focus on **quality over quantity**
- Make **meaningful contributions**
- Be **respectful** in all interactions
- **Help others** in discussions

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you're expected to uphold this code.

## 📄 License

By contributing, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers the project.

---

## 🚀 Ready to Contribute?

1. **Browse [open issues](https://github.com/writetosagnik/linkr/issues)**
2. **Look for `good first issue` labels** if you're new
3. **Comment on an issue** to get assigned
4. **Fork, code, test, and submit** your PR!

**Thank you for making linkr better! 🎉**

---

*This guide is updated regularly. Last updated: October 2025*