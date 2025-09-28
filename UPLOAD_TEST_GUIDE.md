# Student Upload Functionality Test Guide

## Overview

This guide helps you test the student upload functionality with Excel files containing name, email, student_id, and data columns.

## Prerequisites

1. **Backend Server Running**: Make sure the backend is running on `http://localhost:8000`
2. **Frontend Server Running**: Make sure the frontend is running on `http://localhost:3000`
3. **Firebase Configuration**: Ensure Firebase is properly configured in the backend

## Test Steps

### 1. Create Test Excel File

Create an Excel file with the following columns:

- **name** (required): Student's full name
- **email** (required): Student's email address
- **student_id** (optional): Student ID number
- **data** (optional): Additional student data
- **extra_info** (optional): Extra information

**Sample Data:**

```
name           | email                    | student_id | data                    | extra_info
John Doe       | john.doe@example.com     | STU001     | Computer Science Major  | CS Student
Jane Smith     | jane.smith@example.com   | STU002     | Mathematics Major       | Math Student
Bob Johnson    | bob.johnson@example.com  | STU003     | Physics Major           | Physics Student
```

### 2. Test Upload Process

1. **Navigate to Upload Page**

   - Go to `http://localhost:3000/admin/upload`
   - You should see the upload interface

2. **Download Template** (Optional)

   - Click "Download Template" to get a sample Excel file
   - Use this as a reference for the correct format

3. **Upload Excel File**

   - Drag and drop your Excel file or click to browse
   - The file should be accepted if it's .xlsx or .xls format
   - You should see a preview of the data

4. **Review Preview**

   - Check that all columns are displayed correctly
   - Verify the data looks correct
   - Make sure all required columns (name, email) are present

5. **Submit Upload**
   - Click "Upload Students" button
   - You should see a success message
   - The page should redirect to the students page after 2 seconds

### 3. Verify Upload Results

1. **Check Students Page**

   - Navigate to `http://localhost:3000/admin/students`
   - You should see the uploaded students in the table
   - All columns (name, email, student_id, data) should be displayed

2. **Verify Data Integrity**
   - Check that all student data is correctly displayed
   - Verify that optional columns show the data or "-" if empty
   - Ensure the student count matches what you uploaded

### 4. Test Error Handling

1. **Invalid File Format**

   - Try uploading a non-Excel file (e.g., .txt, .pdf)
   - Should show an error message

2. **Missing Required Columns**

   - Create an Excel file without "name" or "email" columns
   - Should show an error message about missing columns

3. **Empty File**

   - Try uploading an empty Excel file
   - Should handle gracefully

4. **Large File**
   - Try uploading a file with many students (test with 100+ rows)
   - Should handle the upload successfully

## Expected Results

### Successful Upload

- ✅ File is accepted and preview is shown
- ✅ Upload completes successfully
- ✅ Success message is displayed
- ✅ Students appear on the students page
- ✅ All columns are displayed correctly
- ✅ Redirect to students page works

### Error Handling

- ✅ Invalid file formats are rejected
- ✅ Missing required columns show error
- ✅ Network errors are handled gracefully
- ✅ Authentication errors are handled (if not logged in)

## Troubleshooting

### Backend Not Running

- **Error**: "Network Error" or "ECONNREFUSED"
- **Solution**: Start the backend server

### Firebase Not Configured

- **Error**: "Firebase credentials not found"
- **Solution**: Configure Firebase in the backend

### Authentication Issues

- **Error**: 401 Unauthorized
- **Solution**: This is expected for admin endpoints without login

### File Upload Issues

- **Error**: "File must be an Excel file"
- **Solution**: Ensure file is .xlsx or .xls format

### Column Validation Issues

- **Error**: "Excel file must contain columns: ['name', 'email']"
- **Solution**: Ensure Excel file has name and email columns

## Next Steps

1. **Test with Real Data**: Upload a real student list
2. **Test Edge Cases**: Empty files, large files, invalid data
3. **Test Authentication**: Implement and test the login flow
4. **Test Full Workflow**: Test complete student management workflow
