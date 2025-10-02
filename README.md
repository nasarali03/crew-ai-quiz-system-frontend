# CrewAI Quiz System Frontend

Modern Next.js frontend for the CrewAI Quiz System with admin dashboard and student quiz interfaces.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
# Create .env.local with NEXT_PUBLIC_API_URL

# Start development
npm run dev
```

## 📋 Features

- **Admin Dashboard** - Complete quiz and student management
- **Student Management** - Excel import/export with template
- **Quiz Creation** - Interactive quiz builder with AI generation
- **Real-time Results** - Live analytics and performance tracking
- **Token-based Quiz Access** - Secure, unique quiz links
- **Responsive Design** - Works on all devices
- **Type Safety** - Full TypeScript implementation

## 🏗️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **React Hot Toast** - Beautiful notifications

## 📁 Project Structure

```
frontend/
├── app/
│   ├── admin/              # Admin dashboard
│   │   ├── create-quiz/    # Quiz creation
│   │   ├── login/          # Authentication
│   │   ├── quizzes/        # Quiz management
│   │   ├── results/        # Analytics
│   │   └── students/       # Student management
│   ├── quiz/[token]/       # Student quiz interface
│   └── api/               # API routes
├── components/ui/          # Reusable components
├── lib/
│   ├── api.ts             # API client
│   └── utils.ts           # Utilities
└── public/                # Static assets
```

## 🔧 Configuration

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production
# NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Set root directory to `frontend/`
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy automatically on push

### Manual Production

```bash
npm run build
npm start
```

## 📱 Key Pages

### Admin Dashboard (`/admin`)

- **Login/Register** - Admin authentication
- **Students** - Upload and manage students via Excel
- **Create Quiz** - AI-powered quiz generation
- **Quizzes** - Manage all quizzes and send invitations
- **Results** - Comprehensive analytics and exports

### Student Interface (`/quiz/[token]`)

- **Secure Access** - Token-based quiz access
- **Timed Questions** - Interactive quiz experience
- **Progress Tracking** - Visual progress indicators
- **Immediate Results** - Instant feedback and scores

## 🔄 Student Workflow

1. **Receive Email** - Personalized invitation with unique link
2. **Access Quiz** - One-time use token for security
3. **Take Quiz** - Timed questions with navigation
4. **View Results** - Immediate feedback and performance

## 🧪 Testing

```bash
# Development testing
npm run dev

# Test admin flow:
# 1. Register at /admin/register
# 2. Upload students at /admin/upload
# 3. Create quiz at /admin/create-quiz
# 4. Send invitations and test student flow
```

## 🛠️ Development

### API Integration

```typescript
import { adminAPI, quizAPI } from "@/lib/api";

// Admin operations
const quizzes = await adminAPI.getQuizzes();
const students = await adminAPI.getStudents();

// Student operations
const quiz = await quizAPI.getQuiz(token);
const result = await quizAPI.submitAnswers(token, answers);
```

### Adding Components

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export function Button({
  children,
  onClick,
  variant = "primary",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn ${
        variant === "primary" ? "btn-primary" : "btn-secondary"
      }`}
    >
      {children}
    </button>
  );
}
```

## 🚨 Troubleshooting

### Common Issues

1. **API Connection Error**

   - Check `NEXT_PUBLIC_API_URL` in `.env.local`
   - Ensure backend is running on correct port
   - Verify network connectivity

2. **Authentication Issues**

   - Clear browser localStorage
   - Check token expiration
   - Verify admin credentials

3. **Build Errors**
   - Run `npm install` to update dependencies
   - Clear `.next` cache: `rm -rf .next`
   - Check TypeScript errors

## 📖 Key Features Detail

### Admin Dashboard

- **Student Upload**: Excel template with validation
- **Quiz Builder**: AI-generated questions with preview
- **Invitation System**: Bulk sending with rate limiting
- **Analytics**: Real-time results and performance metrics

### Student Experience

- **Secure Access**: Unique tokens prevent unauthorized access
- **Version Control**: Quiz snapshots ensure consistency
- **Responsive Design**: Works on mobile, tablet, desktop
- **Progress Tracking**: Clear indicators and navigation

### API Client

- **Automatic Auth**: JWT tokens handled automatically
- **Error Handling**: Graceful error messages
- **Request Interceptors**: Consistent headers and formatting
- **Response Processing**: Standardized data handling

## 🎯 Production Checklist

- [ ] Set production `NEXT_PUBLIC_API_URL`
- [ ] Test all admin workflows
- [ ] Verify student quiz experience
- [ ] Check responsive design on all devices
- [ ] Test error handling scenarios
- [ ] Validate Excel upload/download
- [ ] Confirm email integration works

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

1. Check browser console for errors
2. Verify environment variables
3. Test backend API connectivity
4. Review network requests in DevTools
5. Contact development team
