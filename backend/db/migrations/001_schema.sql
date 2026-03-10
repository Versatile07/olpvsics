-- =============================================
-- VSICS Online Learning Platform - Full Schema
-- Migration 001: Create all tables
-- =============================================

CREATE DATABASE IF NOT EXISTS olpvsics;
USE olpvsics;

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS enrollments_external;
DROP TABLE IF EXISTS courses_external;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS notices;
DROP TABLE IF EXISTS placements;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS departments;

-- =============================================
-- DEPARTMENTS TABLE
-- =============================================
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(128) NOT NULL
);

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','faculty','student') NOT NULL DEFAULT 'student',
  department_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- =============================================
-- SUBJECTS TABLE
-- =============================================
CREATE TABLE subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  department_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- =============================================
-- RESOURCES TABLE (notes + papers)
-- =============================================
CREATE TABLE resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  filename VARCHAR(512),
  url VARCHAR(1024),
  uploader_id INT,
  subject_id INT,
  year INT,
  type ENUM('note','paper') DEFAULT 'note',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploader_id) REFERENCES users(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- =============================================
-- ATTENDANCE TABLE
-- =============================================
CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_id INT NOT NULL,
  date DATE NOT NULL,
  student_id INT NOT NULL,
  status ENUM('present','absent') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_attendance (subject_id, date, student_id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  FOREIGN KEY (student_id) REFERENCES users(id)
);

-- =============================================
-- ASSIGNMENTS TABLE
-- =============================================
CREATE TABLE assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject_id INT,
  faculty_id INT,
  deadline DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  FOREIGN KEY (faculty_id) REFERENCES users(id)
);

-- =============================================
-- SUBMISSIONS TABLE
-- =============================================
CREATE TABLE submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT NOT NULL,
  student_id INT NOT NULL,
  filename VARCHAR(512),
  url VARCHAR(1024),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id)
);

-- =============================================
-- PLACEMENTS TABLE
-- =============================================
CREATE TABLE placements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  company VARCHAR(255),
  description TEXT,
  deadline DATE,
  posted_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id)
);

-- =============================================
-- NOTICES TABLE
-- =============================================
CREATE TABLE notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  body TEXT,
  posted_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id)
);

-- =============================================
-- COURSES_EXTERNAL TABLE
-- =============================================
CREATE TABLE courses_external (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  provider VARCHAR(255),
  link VARCHAR(1024),
  description TEXT,
  deadline DATE,
  posted_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id)
);

-- =============================================
-- ENROLLMENTS_EXTERNAL TABLE
-- =============================================
CREATE TABLE enrollments_external (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT,
  student_id INT,
  certificate_url VARCHAR(1024),
  status ENUM('not_registered','registered','completed') DEFAULT 'not_registered',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses_external(id),
  FOREIGN KEY (student_id) REFERENCES users(id)
);
