# Frontend-Backend Integration Test Guide

## Prerequisites

1. **Backend Server Running**: Make sure the backend is running on `http://localhost:8000`
2. **Frontend Server Running**: Make sure the frontend is running on `http://localhost:3000`
3. **Firebase Configuration**: Ensure Firebase is properly configured in the backend

## Testing Steps

### 1. Start Backend Server

```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Start Frontend Server

```bash
cd frontend
npm run dev
```

### 3. Test API Integration

1. Navigate to `http://localhost:3000/test-api`
2. Click "Run All Tests" to test all API endpoints
3. Check the results to see which endpoints are working

### 4. Test Individual Features

#### Admin Dashboard

- Navigate to `http://localhost:3000/admin`
- Should show real data from the backend (if Firebase is configured)
- If Firebase is not configured, will show empty data

#### Students Page

- Navigate to `http://localhost:3000/admin/students`
- Should attempt to fetch students from `/api/admin/students`
- Will show loading state and then empty list if no data

#### Quizzes Page

- Navigate to `http://localhost:3000/admin/quizzes`
- Should attempt to fetch quizzes from `/api/admin/quizzes`
- Will show loading state and then empty list if no data

#### Video Submission

- Navigate to `http://localhost:3000/video-submit`
- Fill out the form and submit
- Should call `/api/video/submit` endpoint

#### Quiz Taking

- Navigate to `http://localhost:3000/quiz/[token]`
- Replace `[token]` with a valid quiz token
- Should fetch quiz data from `/api/quiz/[token]`

## Expected Results

### With Firebase Configured

- All API calls should work
- Data should be fetched and displayed
- Forms should submit successfully

### Without Firebase Configured

- Health endpoints should work (200 OK)
- Admin endpoints should return 401 Unauthorized
- Quiz endpoints should return 404 Not Found
- Video endpoints should work (no auth required)
- Frontend should handle errors gracefully

## Troubleshooting

### Backend Not Running

- Error: "Network Error" or "ECONNREFUSED"
- Solution: Start the backend server

### Firebase Not Configured

- Error: "Firebase credentials not found"
- Solution: Configure Firebase in the backend

### CORS Issues

- Error: "CORS policy" errors
- Solution: Check CORS configuration in backend

### Authentication Issues

- Error: 401 Unauthorized
- Solution: This is expected for admin endpoints without login

## Next Steps

1. **Configure Firebase**: Set up Firebase credentials in the backend
2. **Test with Real Data**: Create some test data in Firebase
3. **Test Authentication**: Implement and test the login flow
4. **Test Full Workflow**: Test the complete quiz creation and submission flow
