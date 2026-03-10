# VSICS Online Learning Platform — User Manual

## Table of Contents

1. [Getting Started](#getting-started)
2. [Login & Authentication](#login--authentication)
3. [Dashboard Overview](#dashboard-overview)
4. [Admin Guide](#-admin-guide)
5. [Faculty Guide](#-faculty-guide)
6. [Student Guide](#-student-guide)

---

## Getting Started

### System Requirements
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection (or local network access)

### Accessing the Portal
- **URL**: `http://localhost:5173` (development) or your deployed domain
- Navigate to the URL in your browser — you'll see the Home page

### Default Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@vsics.test | AdminPass123 |
| Faculty | faculty@vsics.test | FacultyPass123 |
| Student 1 | student1@vsics.test | StudentPass123 |
| Student 2 | student2@vsics.test | StudentPass123 |

> ⚠️ **Important**: Change default passwords immediately after first login in a production environment.

---

## Login & Authentication

### How to Log In
1. Open the portal in your browser
2. Click **"Login"** or navigate to `/login`
3. Enter your **email** and **password**
4. Click **"Sign In"**
5. You will be redirected to your role-specific **Dashboard**

### Session & Security
- Your session lasts **7 days** before requiring re-login
- The system uses encrypted JWT tokens stored in your browser
- Clicking **"Logout"** immediately ends your session
- If your session expires, you'll be automatically redirected to the login page

### Forgot Password
Contact your system administrator to reset your password.

---

## Dashboard Overview

After logging in, you'll see the **Dashboard** which shows navigation cards based on your role:

| Feature | Admin | Faculty | Student |
|---|:---:|:---:|:---:|
| 📚 Resources (Notes/Papers) | ✅ View + Upload | ✅ View + Upload | ✅ View only |
| 📤 Upload Resource | ✅ | ✅ | ❌ |
| 📋 Attendance | ✅ Mark + View | ✅ Mark + View | ✅ View own % |
| 📝 Assignments | ✅ Create + View | ✅ Create + View | ✅ View + Submit |
| 💼 Placements | ✅ Post + View | ✅ Post + View | ✅ View only |
| 📢 Notices | ✅ Post + View | ✅ Post + View | ✅ View only |
| 🌐 External Courses | ✅ Post + View | ✅ Post + View | ✅ Enroll + Certificate |

---

## 🔑 Admin Guide

As an **Admin**, you have full access to all features of the platform.

### Managing Resources (Notes & Papers)

#### Uploading a Resource
1. From Dashboard, click **"📤 Upload Resource"**
2. Fill in the form:
   - **Title** (required): Name of the material (e.g., "Data Structures Unit 1")
   - **Subject ID**: The numeric subject identifier
   - **Year**: Academic year (e.g., 2026)
   - **Type**: Select **Note** or **Paper**
   - **URL**: Optional link to external material
   - **File**: Click to browse and select a file (PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, ZIP — max 10MB)
3. Click **"Upload"**
4. You'll be redirected to the Resources list after successful upload

#### Viewing Resources
1. Click **"📚 Resources"** from Dashboard
2. Use filters to narrow results:
   - Filter by **Subject ID**
   - Filter by **Year**
   - Filter by **Type** (Notes / Papers)
3. Click **"Filter"** to apply
4. Click **"⬇ Download"** to download a file or **"🔗 Link"** to open external link

### Managing Attendance

#### Marking Attendance
1. Click **"📋 Attendance"** from Dashboard
2. Fill in the form:
   - **Subject ID**: Enter the subject number
   - **Date**: Select the date from the date picker
   - **Records**: Enter in format `student_id:status,student_id:status`
     - Example: `3:present,4:absent`
     - Allowed statuses: `present` or `absent`
3. Click **"Mark Attendance"**
4. If attendance for the same student/date/subject already exists, it will be **updated** (not duplicated)

### Managing Assignments

#### Creating an Assignment
1. Click **"📝 Assignments"** from Dashboard
2. Click the **"+ Create"** button
3. Fill in:
   - **Title** (required): Assignment name
   - **Description**: Instructions for students
   - **Subject ID** (required): Numeric subject identifier
   - **Deadline**: Select date and time
4. Click **"Create"**

#### Viewing Submissions
- Submissions are viewable through the API at `/api/assignments/{id}/submissions`
- Each submission shows student name, email, file name, and submission timestamp

### Posting Placements
1. Use the API: `POST /api/placements` with body:
   ```json
   { "title": "Software Dev Intern", "company": "TechCorp", "description": "Summer 2026", "deadline": "2026-04-30" }
   ```
2. Students will see it in their **"💼 Placements"** page

### Posting Notices
1. Use the API: `POST /api/notices` with body:
   ```json
   { "title": "Exam Schedule", "body": "Mid-term exams begin March 20th. Check department boards for room assignments." }
   ```
2. All users will see it in **"📢 Notices"**

### Posting External Courses
1. Use the API: `POST /api/external-courses` with body:
   ```json
   { "title": "AWS Cloud Practitioner", "provider": "Coursera", "link": "https://coursera.org/aws", "deadline": "2026-06-30" }
   ```
2. Students can enroll and upload completion certificates

---

## 👨‍🏫 Faculty Guide

As **Faculty**, you can upload resources, mark attendance, create assignments, post placements, notices, and external courses.

### Uploading Study Materials

1. From Dashboard, click **"📤 Upload Resource"**
2. Fill in the details:
   - **Title** (required): e.g., "Operating Systems — Chapter 3 Notes"
   - **Subject ID**: Your subject's numeric ID
   - **Year**: Current academic year
   - **Type**: Choose **Note** (lecture notes, handouts) or **Paper** (exam papers, question banks)
   - **File**: Select the file from your computer (max 10MB)
   - **URL**: Alternatively, paste a link to an online resource
3. Click **"Upload"**

> 💡 **Tip**: Use descriptive titles! Students search by title when looking for materials.

### Taking Attendance

1. Click **"📋 Attendance"** from Dashboard
2. You'll see the **Mark Attendance** form
3. Enter:
   - **Subject ID**: Your subject number
   - **Date**: Today's date (or past date if correcting)
   - **Records**: Student IDs and their status
     - Format: `3:present,4:present,5:absent`
     - Each entry is `student_id:status` separated by commas
4. Click **"Mark Attendance"**

> 💡 **Re-marking**: If you made a mistake, simply mark attendance again for the same date and subject — the system will **update** existing records instead of creating duplicates.

### Creating Assignments

1. Click **"📝 Assignments"** from Dashboard
2. Click **"+ Create"** button (top right)
3. Fill in:
   - **Title**: Clear assignment name (e.g., "Lab 5: Binary Trees")
   - **Description**: Detailed instructions, requirements, and grading criteria
   - **Subject ID**: Your subject number
   - **Deadline**: When submissions are due
4. Click **"Create"**

Students will see the assignment and can upload their submission files directly.

### Viewing Student Submissions

Access submissions via the API:
```
GET /api/assignments/{assignment_id}/submissions
```
This returns each student's name, email, submitted file, and timestamp.

### Posting Placements & Notices

You can post placement opportunities and notices the same way as Admin (see Admin Guide above).

---

## 🎓 Student Guide

As a **Student**, you can view resources, check attendance, submit assignments, browse placements and notices, and enroll in external courses.

### Viewing & Downloading Resources

1. From Dashboard, click **"📚 Resources"**
2. Browse the list of available study materials
3. Use filters to find what you need:
   - Enter a **Subject ID** to see materials for a specific subject
   - Enter a **Year** to see materials from a specific year
   - Select **Type** to filter by Notes or Papers
4. Click **"Filter"** to apply your filters
5. To download: Click **"⬇ Download"** next to the resource
6. To open an external link: Click **"🔗 Link"**

### Checking Your Attendance

1. From Dashboard, click **"📋 Attendance"**
2. You'll see a table showing:
   - **Subject name**
   - **Total classes** conducted
   - **Classes you attended**
   - **Attendance percentage**
3. Percentage is color-coded:
   - 🟢 **Green** (75%+): You're meeting the requirement
   - 🔴 **Red** (below 75%): Attendance is below minimum — attend more classes!

> ⚠️ **Note**: Many institutions require a minimum of 75% attendance. Monitor this regularly!

### Submitting Assignments

1. From Dashboard, click **"📝 Assignments"**
2. Browse the list of assignments from your faculty
3. Each assignment shows:
   - Title, subject, faculty name, and deadline
   - Description with instructions
4. To submit:
   - Click **"Choose File"** and select your submission file
   - Click **"Submit"**
   - You'll see a confirmation message: **"Submitted!"**

> 💡 **Tips**:
> - Submit before the deadline shown
> - Accepted formats: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, ZIP
> - Maximum file size: 10MB

### Browsing Placements

1. From Dashboard, click **"💼 Placements"**
2. View available internship and job opportunities
3. Each posting shows:
   - **Title** and **Company**
   - **Description** of the role
   - **Deadline** to apply
   - **Posted by** (which faculty/admin posted it)

> 💡 Contact the placement cell or the poster directly for application details.

### Reading Notices

1. From Dashboard, click **"📢 Notices"**
2. View all announcements, sorted by newest first
3. Each notice shows:
   - **Title**
   - **Full text** of the notice
   - **Posted by** and **date/time**

### External Courses

1. From Dashboard, click **"🌐 External Courses"**
2. Browse available courses from providers like Coursera, Udemy, etc.
3. Each course shows:
   - **Title** and **Provider**
   - **Description** and **Course Link**
   - **Deadline** (if any)

#### Enrolling in a Course
1. Click **"Enroll"** next to the course you want to take
2. You'll see a confirmation: **"Enrolled successfully!"**
3. Click the **"🔗 Course Link"** to go to the external platform and start learning

#### Uploading Completion Certificate
1. After completing the course, return to **"🌐 External Courses"**
2. Next to the course, click **"Choose File"** and select your certificate (PDF or image)
3. The system will mark the course as **"Completed"**

> 💡 Keep your certificates as proof of learning — many employers value these during placements!

---

## Common Actions Quick Reference

| Action | Navigate To | Role |
|---|---|---|
| Log in | `/login` | All |
| View dashboard | `/dashboard` | All |
| Browse notes/papers | `/resources` | All |
| Upload notes/papers | `/upload-resource` | Faculty, Admin |
| Mark attendance | `/attendance` | Faculty, Admin |
| View my attendance % | `/attendance` | Student |
| View assignments | `/assignments` | All |
| Create assignment | `/assignments` → "+ Create" | Faculty, Admin |
| Submit assignment | `/assignments` → file + "Submit" | Student |
| View placements | `/placements` | All |
| View notices | `/notices` | All |
| Browse external courses | `/external-courses` | All |
| Enroll in course | `/external-courses` → "Enroll" | Student |
| Upload certificate | `/external-courses` → file upload | Student |
| Log out | Dashboard → "Logout" | All |

---

## Troubleshooting

### Can't log in?
- Double-check your email and password (they are case-sensitive)
- Contact your admin to verify your account exists
- Clear your browser cache and try again

### Page shows "Loading..." forever?
- Check if the backend server is running
- Try refreshing the page (Ctrl+R / Cmd+R)
- Check your internet connection

### File upload fails?
- Ensure file is under **10MB**
- Use allowed formats: PDF, DOC, DOCX, PPT, PPTX, JPG, JPEG, PNG, ZIP
- Try a different browser if the issue persists

### Attendance shows 0%?
- Your faculty may not have marked attendance yet
- Contact your faculty to verify records

### Need Help?
Contact your system administrator or the IT department.
