-- =============================================
-- VSICS Online Learning Platform - Real Seed Data
-- Migration 002: Real institutional accounts
-- =============================================

USE olpvsics;

-- Department
INSERT INTO departments (name) VALUES ('BCA');

-- =============================================
-- USERS
-- Passwords are replaced at runtime by migrate.js
-- using per-email placeholder tokens
-- =============================================

-- Admin
INSERT INTO users (name, email, password, role, department_id) VALUES
('Administrator', 'admin@vsics.edu', 'HASH:admin@vsics.edu', 'admin', 1);

-- Student
INSERT INTO users (name, email, password, role, department_id) VALUES
('Rahul', 'rahul@vsics.edu', 'HASH:rahul@vsics.edu', 'student', 1);

-- Faculty
INSERT INTO users (name, email, password, role, department_id) VALUES
('Dr. Rekh Nath Singh',  'rekh@vsics.edu',   'HASH:rekh@vsics.edu',   'faculty', 1),
('Mr. Iqbal Masood',     'iqbal@vsics.edu',  'HASH:iqbal@vsics.edu',  'faculty', 1),
('Mr. Ram Awtar',        'ram@vsics.edu',    'HASH:ram@vsics.edu',    'faculty', 1),
('Dr. Aparna Shukla',    'aparna@vsics.edu', 'HASH:aparna@vsics.edu', 'faculty', 1),
('Mr. Nitin Mishra',     'nitin@vsics.edu',  'HASH:nitin@vsics.edu',  'faculty', 1),
('Mr. Ashish Kumar',     'ashish@vsics.edu', 'HASH:ashish@vsics.edu', 'faculty', 1),
('Mr. Sanjay Tiwari',   'sanjay@vsics.edu', 'HASH:sanjay@vsics.edu', 'faculty', 1),
('Mrs. Shweta Shukla',  'shweta@vsics.edu', 'HASH:shweta@vsics.edu', 'faculty', 1);

-- =============================================
-- SUBJECTS (Semester reference in name)
-- =============================================

INSERT INTO subjects (name, department_id) VALUES
-- Semester 1
('C Programming (Sem 1)', 1),
('Fundamentals of Computers (Sem 1)', 1),
('Management (Sem 1)', 1),
('Mathematics I (Sem 1)', 1),
('Communication Skills (Sem 1)', 1),
-- Semester 2
('C++ Programming (Sem 2)', 1),
('Data Structures (Sem 2)', 1),
('Mathematics II (Sem 2)', 1),
('Accounts (Sem 2)', 1),
('Computer Organization (Sem 2)', 1),
-- Semester 3
('Python Programming (Sem 3)', 1),
('Operating Systems (Sem 3)', 1),
('Web Technologies (Sem 3)', 1),
('Software Engineering (Sem 3)', 1),
('Emerging Technologies (Sem 3)', 1),
-- Semester 4
('DBMS (Sem 4)', 1),
('Computer Graphics (Sem 4)', 1),
('Mathematics III (Sem 4)', 1),
('Optimization Techniques (Sem 4)', 1),
('Cyber Security (Sem 4)', 1),
-- Semester 5
('Java Programming (Sem 5)', 1),
('Computer Networks (Sem 5)', 1),
('Numerical Methods (Sem 5)', 1),
('Minor Project (Sem 5)', 1),
-- Semester 6
('Major Project (Sem 6)', 1),
('Information Security (Sem 6)', 1),
('E-Commerce (Sem 6)', 1);
