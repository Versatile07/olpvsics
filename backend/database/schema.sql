-- =============================================
-- VSICS Online Learning Platform - Database Schema
-- Run this script to create all required tables
-- =============================================

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS materials;
DROP TABLE IF EXISTS notices;
DROP TABLE IF EXISTS placements;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS users;

-- =============================================
-- USERS TABLE
-- Stores all users: students, faculty, admins
-- =============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty', 'admin') NOT NULL DEFAULT 'student',
    semester INT DEFAULT NULL,  -- For students only (1-8)
    roll_number VARCHAR(20) DEFAULT NULL,  -- For students only
    department VARCHAR(100) DEFAULT 'Computer Science',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- =============================================
-- SUBJECTS TABLE
-- All subjects offered in the college
-- =============================================
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    semester INT NOT NULL,  -- Which semester this subject belongs to
    faculty_id INT,  -- Assigned faculty
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_semester (semester)
);

-- =============================================
-- MATERIALS TABLE
-- Notes and Previous Year Papers
-- =============================================
CREATE TABLE materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type ENUM('notes', 'paper') NOT NULL,  -- 'notes' or 'paper' (previous year)
    subject_id INT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    year INT DEFAULT NULL,  -- For previous year papers only
    uploaded_by INT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_type (type),
    INDEX idx_subject (subject_id)
);

-- =============================================
-- CLASSES TABLE
-- Each class session for attendance tracking
-- =============================================
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    faculty_id INT NOT NULL,
    class_date DATE NOT NULL,
    topic VARCHAR(200) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_class (subject_id, class_date),  -- Prevent duplicate attendance
    INDEX idx_date (class_date)
);

-- =============================================
-- ATTENDANCE TABLE
-- Individual attendance records
-- =============================================
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    student_id INT NOT NULL,
    status ENUM('present', 'absent', 'late') NOT NULL DEFAULT 'absent',
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (class_id, student_id),  -- Prevent duplicate marks
    INDEX idx_student (student_id)
);

-- =============================================
-- ASSIGNMENTS TABLE
-- Assignments posted by faculty
-- =============================================
CREATE TABLE assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    subject_id INT NOT NULL,
    faculty_id INT NOT NULL,
    file_path VARCHAR(500) DEFAULT NULL,  -- Optional attachment
    deadline DATETIME NOT NULL,
    max_marks INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_deadline (deadline),
    INDEX idx_subject (subject_id)
);

-- =============================================
-- SUBMISSIONS TABLE
-- Student assignment submissions
-- =============================================
CREATE TABLE submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    marks INT DEFAULT NULL,  -- Marks given by faculty (null = not graded)
    remarks TEXT DEFAULT NULL,
    graded_at TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_submission (assignment_id, student_id),  -- One submission per student
    INDEX idx_assignment (assignment_id)
);

-- =============================================
-- PLACEMENTS TABLE
-- Job postings, internships, workshops
-- =============================================
CREATE TABLE placements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(100) NOT NULL,
    type ENUM('job', 'internship', 'workshop', 'event') NOT NULL,
    description TEXT NOT NULL,
    eligibility TEXT,  -- e.g., "6th semester and above, CGPA > 7.0"
    location VARCHAR(100),
    salary_package VARCHAR(50),  -- e.g., "5-7 LPA" or "15k/month"
    apply_link VARCHAR(500),
    deadline DATE NOT NULL,
    posted_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_deadline (deadline),
    INDEX idx_type (type)
);

-- =============================================
-- NOTICES TABLE
-- Digital notice board
-- =============================================
CREATE TABLE notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    priority ENUM('normal', 'important', 'urgent') DEFAULT 'normal',
    target_role ENUM('all', 'student', 'faculty') DEFAULT 'all',
    attachment_path VARCHAR(500) DEFAULT NULL,
    posted_by INT NOT NULL,
    expires_at DATE DEFAULT NULL,  -- Optional expiry date
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_priority (priority),
    INDEX idx_created (created_at DESC)
);

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Sample Admin User (password: admin123)
INSERT INTO users (name, email, password_hash, role, department) VALUES
('Admin User', 'admin@vsics.edu', '$2b$10$Ej1kB8FQ5E.5WVfH3r.4JuR3cVzMZxjL4y7Y5K2WqzF1Qq3HhH1Uy', 'admin', 'Administration');

-- Sample Faculty Users (password: faculty123)
INSERT INTO users (name, email, password_hash, role, department) VALUES
('Dr. Sharma', 'sharma@vsics.edu', '$2b$10$Ej1kB8FQ5E.5WVfH3r.4JuR3cVzMZxjL4y7Y5K2WqzF1Qq3HhH1Uy', 'faculty', 'Computer Science'),
('Prof. Gupta', 'gupta@vsics.edu', '$2b$10$Ej1kB8FQ5E.5WVfH3r.4JuR3cVzMZxjL4y7Y5K2WqzF1Qq3HhH1Uy', 'faculty', 'Computer Science');

-- Sample Students (password: student123)
INSERT INTO users (name, email, password_hash, role, semester, roll_number) VALUES
('Rahul Kumar', 'rahul@vsics.edu', '$2b$10$Ej1kB8FQ5E.5WVfH3r.4JuR3cVzMZxjL4y7Y5K2WqzF1Qq3HhH1Uy', 'student', 6, 'CS2021001'),
('Priya Singh', 'priya@vsics.edu', '$2b$10$Ej1kB8FQ5E.5WVfH3r.4JuR3cVzMZxjL4y7Y5K2WqzF1Qq3HhH1Uy', 'student', 6, 'CS2021002'),
('Amit Verma', 'amit@vsics.edu', '$2b$10$Ej1kB8FQ5E.5WVfH3r.4JuR3cVzMZxjL4y7Y5K2WqzF1Qq3HhH1Uy', 'student', 4, 'CS2022001');

-- Sample Subjects
INSERT INTO subjects (name, code, semester, faculty_id) VALUES
('Data Structures', 'CS301', 3, 2),
('Database Management Systems', 'CS401', 4, 2),
('Operating Systems', 'CS402', 4, 3),
('Computer Networks', 'CS501', 5, 3),
('Web Development', 'CS502', 5, 2),
('Machine Learning', 'CS601', 6, 3);

-- Sample Notice
INSERT INTO notices (title, content, priority, target_role, posted_by) VALUES
('Welcome to VSICS Portal', 'Welcome to the new online learning platform! Please update your profile and explore the features.', 'important', 'all', 1);

-- =============================================
-- USEFUL QUERIES (for reference)
-- =============================================

-- Get attendance percentage for a student by subject:
-- SELECT 
--     s.name AS subject,
--     COUNT(CASE WHEN a.status = 'present' THEN 1 END) * 100.0 / COUNT(*) AS percentage
-- FROM attendance a
-- JOIN classes c ON a.class_id = c.id
-- JOIN subjects s ON c.subject_id = s.id
-- WHERE a.student_id = ?
-- GROUP BY s.id;

-- Get all materials for a semester:
-- SELECT m.*, s.name AS subject_name 
-- FROM materials m
-- JOIN subjects s ON m.subject_id = s.id
-- WHERE s.semester = ?;
