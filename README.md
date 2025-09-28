# CrewAI Quiz System - Frontend

Next.js frontend for the CrewAI-powered quiz system with modern UI and seamless user experience.

## Features

- **Modern UI** with Tailwind CSS and Headless UI
- **Responsive Design** for all device sizes
- **Admin Dashboard** with comprehensive management tools
- **Student Quiz Interface** with real-time timer
- **Video Submission** with YouTube integration
- **Real-time Updates** with React state management
- **TypeScript** for type safety

## Quick Start

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Setup Environment**:

   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Run Development Server**:

   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   ```
   http://localhost:3000
   ```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   │   ├── layout.tsx     # Admin layout with sidebar
│   │   ├── page.tsx       # Admin dashboard
│   │   ├── login/         # Admin login
│   │   ├── upload/        # Student upload
│   │   └── create-quiz/   # Quiz creation
│   ├── quiz/              # Student quiz pages
│   │   └── [token]/       # Dynamic quiz pages
│   ├── video-submit/      # Video submission
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/                   # Utilities and API
│   └── api.ts            # API client configuration
├── components/            # Reusable components
├── styles/               # Additional styles
└── public/               # Static assets
```

## Pages Overview

### Admin Pages

- **Dashboard** (`/admin`) - Overview with stats and quick actions
- **Login** (`/admin/login`) - Admin authentication
- **Upload Students** (`/admin/upload`) - Excel file upload with preview
- **Create Quiz** (`/admin/create-quiz`) - Quiz configuration and AI generation
- **Students** (`/admin/students`) - Student management
- **Quizzes** (`/admin/quizzes`) - Quiz management
- **Results** (`/admin/results`) - Analytics and rankings

### Student Pages

- **Home** (`/`) - Portal selection (Admin/Student)
- **Quiz** (`/quiz/[token]`) - Timed quiz interface
- **Video Submit** (`/video-submit`) - Video submission form

## Key Features

### Admin Dashboard

- **Real-time Statistics** - Student count, quiz progress, video submissions
- **Quick Actions** - Upload students, create quizzes, send invitations
- **Recent Activity** - Timeline of system events
- **Responsive Grid** - Adaptive layout for all screen sizes

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

## API Integration

### Authentication

```typescript
import { authAPI } from "@/lib/api";

// Login
const response = await authAPI.login(email, password);
localStorage.setItem("admin_token", response.data.access_token);

// Get current user
const user = await authAPI.getMe();
```

### Admin Operations

```typescript
import { adminAPI } from "@/lib/api";

// Upload students
const formData = new FormData();
formData.append("file", excelFile);
await adminAPI.uploadStudents(excelFile);

// Create quiz
await adminAPI.createQuiz(quizData);

// Generate questions
await adminAPI.generateQuestions(quizId);
```

### Student Quiz

```typescript
import { quizAPI } from "@/lib/api";

// Get quiz
const quiz = await quizAPI.getQuiz(token);

// Submit answers
await quizAPI.submitAnswers(token, answers);
```

## Styling

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

## State Management

### React Hooks

- **useState** - Local component state
- **useEffect** - Side effects and API calls
- **useForm** - Form handling with react-hook-form
- **Custom Hooks** - Reusable state logic

### API State

- **Loading States** - Loading indicators for async operations
- **Error Handling** - Toast notifications for errors
- **Success Feedback** - Confirmation messages

## Development

### Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint checking
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=CrewAI Quiz System
NEXT_PUBLIC_ENABLE_DEBUG=true
```

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## Performance

- **Next.js Optimization** - Automatic code splitting
- **Image Optimization** - Next.js Image component
- **Bundle Analysis** - Webpack bundle analyzer
- **Lighthouse Score** - 90+ performance rating

## Security

- **JWT Authentication** - Secure token-based auth
- **CSRF Protection** - Built-in Next.js protection
- **XSS Prevention** - React's built-in XSS protection
- **HTTPS Only** - Secure communication in production
