# Frontend Testing Guide

## 🧪 Testing Checklist

### 1. Home Page (`/`)

- [ ] Portal selection works (Admin/Student tabs)
- [ ] Navigation to admin login works
- [ ] Student portal access works
- [ ] Responsive design on mobile/tablet

### 2. Admin Authentication

- [ ] Login page loads (`/admin/login`)
- [ ] Demo credentials work (admin@example.com / password123)
- [ ] Registration page works (`/admin/register`)
- [ ] Form validation works
- [ ] Error handling works
- [ ] Redirect to dashboard after login

### 3. Admin Dashboard (`/admin`)

- [ ] Dashboard loads with statistics
- [ ] Quick action cards work
- [ ] Recent activity displays
- [ ] Sidebar navigation works
- [ ] Mobile sidebar collapses
- [ ] Logout functionality works

### 4. Student Management (`/admin/students`)

- [ ] Student list displays
- [ ] Search functionality works
- [ ] Filter options work
- [ ] Student cards display correctly
- [ ] Actions buttons work (view, edit, delete)
- [ ] Upload students link works

### 5. Student Upload (`/admin/upload`)

- [ ] Drag & drop interface works
- [ ] File validation works (.xlsx, .xls)
- [ ] Preview functionality works
- [ ] Upload progress shows
- [ ] Success/error messages display
- [ ] Redirect to students page after upload

### 6. Quiz Management (`/admin/quizzes`)

- [ ] Quiz list displays
- [ ] Filter tabs work (All, Active, Completed)
- [ ] Quiz cards show correct information
- [ ] Create quiz button works
- [ ] Quiz actions work (view, edit, delete)
- [ ] Responsive grid layout

### 7. Quiz Creation (`/admin/create-quiz`)

- [ ] Form loads with default values
- [ ] All form fields work
- [ ] Validation works
- [ ] Preview updates in real-time
- [ ] Submit creates quiz
- [ ] AI generation trigger works
- [ ] Redirect to quiz details

### 8. Quiz Details (`/admin/quizzes/[id]`)

- [ ] Quiz information displays
- [ ] Tabs work (Overview, Results, Questions)
- [ ] Statistics show correctly
- [ ] Results table displays
- [ ] Export functionality works
- [ ] Edit/activate buttons work

### 9. Results Page (`/admin/results`)

- [ ] Results table displays
- [ ] Search functionality works
- [ ] Filter by quiz works
- [ ] Sort options work
- [ ] Score colors display correctly
- [ ] Export functionality works

### 10. Video Management (`/admin/videos`)

- [ ] Video submissions display
- [ ] Status indicators work
- [ ] Search functionality works
- [ ] Filter options work
- [ ] Video links work
- [ ] Process videos button works

### 11. Invitations (`/admin/invitations`)

- [ ] Invitation list displays
- [ ] Token display works
- [ ] Status indicators work
- [ ] Search functionality works
- [ ] Quiz filter works
- [ ] Send invitations button works

### 12. Settings (`/admin/settings`)

- [ ] All tabs work (General, AI, Email, Video)
- [ ] Form fields work
- [ ] Save functionality works
- [ ] Validation works
- [ ] Settings persist

### 13. Student Quiz (`/quiz/[token]`)

- [ ] Quiz loads with token
- [ ] Timer works correctly
- [ ] Question navigation works
- [ ] Answer selection works
- [ ] Progress bar updates
- [ ] Auto-submit on time up
- [ ] Submit functionality works
- [ ] Redirect to results

### 14. Quiz Results (`/quiz/[token]/results`)

- [ ] Results display correctly
- [ ] Score calculation works
- [ ] Question review works
- [ ] Next steps display
- [ ] Navigation buttons work
- [ ] Responsive design

### 15. Video Submission (`/video-submit`)

- [ ] Form loads correctly
- [ ] YouTube URL validation works
- [ ] Form validation works
- [ ] Submit functionality works
- [ ] Success message displays
- [ ] Guidelines display correctly

## 🔧 Browser Testing

### Desktop Browsers

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers

- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Firefox Mobile

### Screen Sizes

- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px)
- [ ] Large Desktop (1440px)

## 🚨 Error Testing

### Network Errors

- [ ] API connection fails gracefully
- [ ] Loading states display
- [ ] Error messages show
- [ ] Retry functionality works

### Form Validation

- [ ] Required fields validation
- [ ] Email format validation
- [ ] Password strength validation
- [ ] File type validation

### Authentication

- [ ] Invalid credentials handling
- [ ] Token expiration handling
- [ ] Unauthorized access redirects
- [ ] Session timeout handling

## 📱 Mobile Testing

### Touch Interactions

- [ ] Tap targets are large enough
- [ ] Swipe gestures work
- [ ] Pinch to zoom works
- [ ] Keyboard doesn't break layout

### Performance

- [ ] Page load times < 3 seconds
- [ ] Smooth scrolling
- [ ] No layout shifts
- [ ] Images load properly

## 🎨 Visual Testing

### Design Consistency

- [ ] Colors match design system
- [ ] Typography is consistent
- [ ] Spacing follows grid
- [ ] Icons are properly sized

### Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Color contrast is sufficient
- [ ] Focus indicators visible

## 🚀 Performance Testing

### Core Web Vitals

- [ ] LCP < 2.5s (Largest Contentful Paint)
- [ ] FID < 100ms (First Input Delay)
- [ ] CLS < 0.1 (Cumulative Layout Shift)

### Bundle Size

- [ ] JavaScript bundle < 1MB
- [ ] CSS bundle < 100KB
- [ ] Images optimized
- [ ] Fonts loaded efficiently

## 🧪 Automated Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Accessibility Tests

```bash
npm run test:a11y
```

## 📊 Testing Tools

### Browser DevTools

- [ ] Console errors checked
- [ ] Network tab monitored
- [ ] Performance tab analyzed
- [ ] Lighthouse audit passed

### Testing Libraries

- Jest for unit tests
- React Testing Library for component tests
- Cypress for E2E tests
- Axe for accessibility tests

## 🐛 Common Issues & Solutions

### 1. 404 Errors

**Issue**: Pages not found
**Solution**: Check route structure and middleware

### 2. API Connection Issues

**Issue**: Backend not responding
**Solution**: Check API URL and CORS settings

### 3. Styling Issues

**Issue**: CSS not loading
**Solution**: Check Tailwind configuration

### 4. Authentication Issues

**Issue**: Login not working
**Solution**: Check token storage and middleware

## 📝 Testing Report Template

```
## Frontend Testing Report

### Test Date: [DATE]
### Tester: [NAME]
### Browser: [BROWSER VERSION]
### Device: [DEVICE TYPE]

### ✅ Passed Tests
- [List passed tests]

### ❌ Failed Tests
- [List failed tests with details]

### 🐛 Bugs Found
- [List bugs with severity]

### 📊 Performance
- [Performance metrics]

### 🎯 Recommendations
- [Improvement suggestions]
```
