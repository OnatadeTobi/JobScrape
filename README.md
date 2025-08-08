# 🚀 JobScrape - AI-Powered Job Information Extractor

> **Extract structured job information from any job posting URL with AI-powered intelligence**

[![Django](https://img.shields.io/badge/Django-5.2.4-green.svg)](https://django.org/)
[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://python.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.53.0-orange.svg)](https://playwright.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-2.0%20Flash-purple.svg)](https://ai.google.dev/gemini)

## 🌟 Features

### ✨ Core Functionality
- **🔗 Universal Job URL Support** - Extract from LinkedIn, Indeed, Glassdoor, and more
- **🤖 AI-Powered Extraction** - Uses Google Gemini 2.0 Flash for intelligent data parsing
- **🕷️ Advanced Web Scraping** - Playwright-powered headless browser automation for reliable data extraction
- **💾 Job Saving & Management** - Save and organize extracted job information
- **👤 User Authentication** - Secure login/register system with email-based accounts
- **📱 Responsive Design** - Beautiful glassmorphism UI that works on all devices

### 🎨 User Experience
- **Glassmorphism Design** - Modern, elegant UI with blur effects and gradients
- **Real-time Feedback** - Loading states, error handling, and success notifications
- **Intuitive Interface** - Clean, user-friendly design with smooth animations
- **Mobile-First** - Fully responsive design optimized for mobile devices

### 🔧 Technical Excellence
- **Headless Browser Automation** - Playwright for reliable web scraping across all job platforms
- **RESTful API** - Clean, well-documented API endpoints
- **Database Integration** - PostgreSQL/SQLite support with Django ORM
- **Docker Support** - Containerized deployment ready
- **Production Ready** - Configured for deployment on Render, Heroku, and more

## 🏗️ Architecture

```
JobScrape/
├── Frontend/                 # Modern JavaScript frontend
│   ├── index.html           # Main application interface
│   ├── script.js            # Core application logic
│   └── style.css            # Glassmorphism styling
└── Backend/                 # Django REST API
    └── jobscrape/
        ├── jobscaper_api/   # Django project settings
        ├── scraper/         # Job scraping functionality
        │   ├── views.py     # Playwright scraping logic
        │   ├── models.py    # Job data models
        │   └── serializers.py # API serializers
        ├── userauth/        # User authentication system
        ├── Dockerfile       # Container configuration
        └── requirements.txt # Python dependencies
```

### 🔍 Scraping Architecture

The application uses a sophisticated two-stage extraction process:

1. **Playwright Scraping Stage**
   - Headless Chromium browser automation
   - Dynamic content rendering and JavaScript execution
   - Robust error handling and timeout management
   - Cross-platform compatibility for all major job sites

2. **AI Processing Stage**
   - Google Gemini 2.0 Flash for intelligent data extraction
   - Structured JSON output formatting
   - Context-aware information parsing
   - Error recovery for incomplete data

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js (for frontend development)
- Google Gemini API key
- PostgreSQL (optional, SQLite for development)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JobScrape/Backend/jobscrape
   ```

2. **Set up environment variables**
   ```bash
   # Create .env file
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   GEMINI_API_KEY=your-gemini-api-key
   ALLOWED_HOSTS=localhost,127.0.0.1
   DATABASE_URL=sqlite:///db.sqlite3  # or your PostgreSQL URL
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Start the development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../../Frontend
   ```

2. **Open in browser**
   - Simply open `index.html` in your browser
   - Or serve with a local server: `python -m http.server 8000`

3. **Configure API endpoint**
   - Update `API_BASE_URL` in `script.js` to point to your backend

## 🎯 Usage

### Basic Workflow

1. **Enter Job URL** - Paste any job posting URL into the input field
2. **Extract Information** - Click "Extract Job Info" to process the URL
3. **Review Results** - View extracted job title, company, location, pay, etc.
4. **Save Job** - Login/register to save jobs to your personal collection
5. **Manage Jobs** - View, organize, and delete saved jobs

### Supported Job Platforms

- ✅ LinkedIn
- ✅ Indeed
- ✅ Glassdoor
- ✅ Monster
- ✅ ZipRecruiter
- ✅ And many more!

## 🔌 API Endpoints

### Authentication
- `POST /api/register/` - User registration
- `POST /api/login/` - User login

### Job Operations
- `POST /api/fetch/` - Extract job information from URL
- `GET /api/jobs/?email={email}` - Get user's saved jobs
- `POST /api/jobs/` - Save a job
- `DELETE /api/jobs/{id}/?email={email}` - Delete a job

### Health Check
- `GET /` - Health check endpoint

## 🎨 UI/UX Features

### Design System
- **Glassmorphism** - Modern glass-like effects with backdrop blur
- **Gradient Backgrounds** - Beautiful animated gradients
- **Smooth Animations** - CSS transitions and keyframe animations
- **Responsive Layout** - Mobile-first design approach

### Interactive Elements
- **Floating Cards** - Glassmorphism cards with hover effects
- **Animated Buttons** - Gradient buttons with hover states
- **Loading States** - Spinning animations and progress indicators
- **Error Handling** - User-friendly error messages and notifications

## 🤖 AI Integration

### Gemini 2.0 Flash
- **Intelligent Extraction** - AI-powered job information parsing
- **Structured Output** - Consistent JSON format for extracted data
- **Multi-platform Support** - Works across different job posting formats
- **Error Recovery** - Handles malformed or incomplete job listings

### 🕷️ Playwright Web Scraping
- **Headless Browser Automation** - Reliable scraping using Chromium browser
- **Dynamic Content Support** - Handles JavaScript-rendered job listings
- **Cross-Platform Compatibility** - Works with LinkedIn, Indeed, Glassdoor, and more
- **Robust Error Handling** - Graceful fallbacks for failed scraping attempts
- **Timeout Management** - Configurable timeouts for different job platforms
- **Content Extraction** - Extracts both HTML content and visible text for AI processing

### Extraction Capabilities
- Job Title
- Company Name
- Location
- Job Type (Remote, On-site, Hybrid)
- Salary/Pay Information
- Platform Source
- Job Description (when available)

## 🚀 Production Deployment

### Environment Variables
```bash
# Required
SECRET_KEY=your-production-secret-key
GEMINI_API_KEY=your-gemini-api-key
ALLOWED_HOSTS=your-domain.com,www.your-domain.com

# Optional
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DEBUG=False
```

### Deployment Platforms
- **Render** - Easy deployment with automatic builds
- **Heroku** - Cloud platform with PostgreSQL support
- **DigitalOcean** - VPS deployment with Docker
- **AWS** - Scalable cloud infrastructure

## 🔧 Configuration

### Frontend Configuration
Update `script.js` to point to your backend:
```javascript
const API_BASE_URL = 'https://your-backend-domain.com/api';
```

### Backend Configuration
Key settings in `settings.py`:
- `ALLOWED_HOSTS` - Configure for your domain
- `CORS_ALLOWED_ORIGINS` - Frontend domain for CORS
- `DATABASES` - Database configuration
- `STATIC_ROOT` - Static files location

### 🕷️ Playwright Configuration

The application uses Playwright for robust web scraping:

```python
# Example scraping implementation from scraper/views.py
async def extract_job_data(self, url):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url, timeout=60000)
        content = await page.content()
        visible_text = await page.inner_text('body')
        await browser.close()
    
    # Send extracted content to Gemini AI for processing
    return self.call_gemini(visible_text)
```

**Key Features:**
- **Headless Mode** - Runs without GUI for server deployment
- **Timeout Handling** - 60-second timeout for slow-loading pages
- **Content Extraction** - Both HTML and visible text for AI processing
- **Browser Management** - Automatic cleanup and resource management

## 🧪 Testing

### Backend Tests
```bash
# Run Django tests
python manage.py test

# Run specific app tests
python manage.py test scraper
python manage.py test userauth
```

### Frontend Testing
- Manual testing with different job URLs
- Browser compatibility testing
- Mobile responsiveness testing

### 🕷️ Scraping Tests
- Test scraping with various job platforms (LinkedIn, Indeed, Glassdoor)
- Verify timeout handling for slow-loading pages
- Test error recovery for failed scraping attempts
- Validate AI processing of scraped content

## 🔒 Security

### Authentication
- Email-based user authentication
- Secure password hashing

### Data Protection
- CORS configuration for frontend
- Input validation and sanitization
- SQL injection prevention with Django ORM

## 📊 Performance

### Optimization Features
- **Caching** - Database query optimization
- **Static Files** - WhiteNoise for static file serving
- **Database Indexing** - Optimized database queries
- **CDN Ready** - Static assets ready for CDN deployment
- **Scraping Optimization** - Efficient Playwright browser management

### Monitoring
- Health check endpoints
- Error logging and monitoring
- Performance metrics tracking
- Scraping success rate monitoring

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Follow PEP 8 for Python code
- Use ESLint for JavaScript
- Maintain consistent formatting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** - For intelligent job information extraction
- **Playwright** - For reliable web scraping and browser automation
- **Django** - For the robust backend framework
- **Glassmorphism Design** - For the beautiful UI inspiration

## 📞 Support

- **Issues** - Report bugs and feature requests on GitHub
- **Documentation** - Check the code comments for detailed explanations
- **Community** - Join our community discussions

---

**Made with ❤️ by Tobi**

*Transform your job search with AI-powered intelligence!*