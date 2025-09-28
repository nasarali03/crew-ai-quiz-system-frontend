# Frontend Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

```bash
cp env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=CrewAI Quiz System
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   │   ├── layout.tsx     # Admin layout with sidebar
│   │   ├── page.tsx       # Dashboard
│   │   ├── login/         # Admin login
│   │   ├── register/      # Admin registration
│   │   ├── students/      # Student management
│   │   ├── quizzes/       # Quiz management
│   │   │   └── [id]/      # Quiz details
│   │   ├── results/       # Results & analytics
│   │   ├── videos/        # Video submissions
│   │   ├── invitations/   # Quiz invitations
│   │   ├── settings/      # System settings
│   │   └── upload/        # Student upload
│   ├── quiz/              # Student quiz interface
│   │   └── [token]/       # Dynamic quiz pages
│   │       └── results/   # Quiz results
│   ├── video-submit/      # Video submission
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home portal
│   ├── loading.tsx        # Loading component
│   ├── error.tsx          # Error boundary
│   └── not-found.tsx      # 404 page
├── components/            # Reusable components
│   └── ui/               # UI components
├── lib/                  # Utilities and API
│   ├── api.ts           # API client
│   └── utils.ts         # Utility functions
├── middleware.ts         # Route protection
└── package.json         # Dependencies
```

## 🎯 Key Features

### Admin Dashboard

- **Real-time Statistics** - Student count, quiz progress, video submissions
- **Quick Actions** - Upload students, create quizzes, send invitations
- **Recent Activity** - Timeline of system events
- **Responsive Design** - Works on all devices

### Student Quiz Interface

- **Token-based Access** - Secure quiz links
- **Real-time Timer** - Countdown per question
- **Progress Tracking** - Visual progress bar
- **Auto-submit** - Automatic submission on time up
- **Navigation** - Previous/Next question controls

### Video Submission

- **YouTube Integration** - Direct URL submission
- **URL Validation** - Real-time YouTube URL checking
- **Guidelines Display** - Clear submission requirements
- **Preview Interface** - Video preview before submission

## 🔧 Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint checking
```

## 🎨 Styling System

### Tailwind CSS Classes

- **Custom Components** - Pre-defined component classes
- **Color System** - Primary and secondary color palettes
- **Responsive Design** - Mobile-first approach
- **Dark Mode Ready** - CSS variables for theming

### Custom Components

```css
.btn-primary     /* Primary button style */
/* Primary button style */
.btn-secondary   /* Secondary button style */
.input-field     /* Form input style */
.card           /* Card container */
.card-header    /* Card header */
.card-body; /* Card content */
```

## 🔐 Authentication

### Admin Routes Protection

- **Middleware** - Automatic redirect to login
- **Token Storage** - localStorage for admin tokens
- **Route Guards** - Protected admin pages

### Demo Credentials

```
Email: admin@example.com
Password: password123
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features

- **Touch-friendly** interfaces
- **Swipe navigation** for quiz questions
- **Responsive tables** with horizontal scroll
- **Collapsible sidebar** for admin dashboard

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_NAME=CrewAI Quiz System
NEXT_PUBLIC_ENABLE_DEBUG=false
```

### Build for Production

```bash
npm run build
npm start
```

## 🐛 Troubleshooting

### Common Issues

1. **404 Errors on Admin Pages**

   - Ensure you're logged in as admin
   - Check middleware.ts configuration
   - Verify route structure

2. **API Connection Issues**

   - Check NEXT_PUBLIC_API_URL in .env.local
   - Ensure backend is running on port 8000
   - Check CORS configuration

3. **Styling Issues**
   - Run `npm run build` to check for build errors
   - Verify Tailwind CSS configuration
   - Check for missing dependencies

### Development Tips

1. **Hot Reload** - Changes reflect immediately
2. **TypeScript** - Full type safety
3. **ESLint** - Code quality checks
4. **Error Boundaries** - Graceful error handling

## 📊 Performance

- **Next.js Optimization** - Automatic code splitting
- **Image Optimization** - Next.js Image component
- **Bundle Analysis** - Webpack bundle analyzer
- **Lighthouse Score** - 90+ performance rating

## 🔒 Security

- **JWT Authentication** - Secure token-based auth
- **CSRF Protection** - Built-in Next.js protection
- **XSS Prevention** - React's built-in XSS protection
- **HTTPS Only** - Secure communication in production
