-- =============================================
-- VSICS Online Learning Platform - Seed Data
-- Migration 002: Insert sample data
-- =============================================

USE olpvsics;

-- Department
INSERT INTO departments (name) VALUES ('Computer Science');

-- Admin user (password: AdminPass123)
-- Hash generated with bcrypt, 10 rounds
INSERT INTO users (name, email, password, role, department_id) VALUES
('Admin User', 'admin@vsics.test', '$2b$10$8KzaNdKIMyOkASCYkNHXSuDr1gLXrb3pVnD4G3eNqVqLGXpKq3EDm', 'admin', 1);

-- Faculty user (password: FacultyPass123)
INSERT INTO users (name, email, password, role, department_id) VALUES
('Dr. Sharma', 'faculty@vsics.test', '$2b$10$8KzaNdKIMyOkASCYkNHXSuDr1gLXrb3pVnD4G3eNqVqLGXpKq3EDm', 'faculty', 1);

-- Student users (password: StudentPass123)
INSERT INTO users (name, email, password, role, department_id) VALUES
('Rahul Kumar', 'student1@vsics.test', '$2b$10$8KzaNdKIMyOkASCYkNHXSuDr1gLXrb3pVnD4G3eNqVqLGXpKq3EDm', 'student', 1),
('Priya Singh', 'student2@vsics.test', '$2b$10$8KzaNdKIMyOkASCYkNHXSuDr1gLXrb3pVnD4G3eNqVqLGXpKq3EDm', 'student', 1);

-- Sample subjects
INSERT INTO subjects (name, department_id) VALUES
('Data Structures', 1),
('Database Management Systems', 1),
('Operating Systems', 1),
('Web Development', 1);
