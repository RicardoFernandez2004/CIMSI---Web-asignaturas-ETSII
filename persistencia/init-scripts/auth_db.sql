CREATE DATABASE IF NOT EXISTS auth_db;
USE auth_db;
CREATE TABLE IF NOT EXISTS users ( 
 id UUID PRIMARY KEY DEFAULT UUID(), 
 email VARCHAR(255) UNIQUE NOT NULL, 
 hashed_password VARCHAR(255) NOT NULL, 
 name VARCHAR(100) NOT NULL, 
 surname VARCHAR(100) NOT NULL, 
 date_of_birth DATE NOT NULL, 
 role ENUM('student', 'professor', 'admin') NOT NULL DEFAULT 'student', 
 is_active BOOLEAN NOT NULL DEFAULT TRUE, 
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
 INDEX idx_users_email (email) );

 -- --------------------------------------------------------
-- Users seed data
-- --------------------------------------------------------
INSERT INTO users (id, email, hashed_password, name, surname, date_of_birth, role, is_active) VALUES
-- Student 1
('11111111-0000-0000-0000-000000000001', 'student1@alum.us.es', '$2b$12$eImiTXuWVxfM37uY4JANjOL.81F8RzW67.Z6j5j6J6J6J6J6J6J6J', 'Carlos', 'Gómez Ruiz', '2001-05-14', 'student', TRUE),
-- Student 2
('11111111-0000-0000-0000-000000000002', 'student2@alum.us.es', '$2b$12$eImiTXuWVxfM37uY4JANjOL.81F8RzW67.Z6j5j6J6J6J6J6J6J6J', 'Ana', 'Martínez Silva', '2002-11-20', 'student', TRUE),
-- Professor
('11111111-0000-0000-0000-000000000003', 'professor1@us.es', '$2b$12$eImiTXuWVxfM37uY4JANjOL.81F8RzW67.Z6j5j6J6J6J6J6J6J6J', 'Francisco', 'Javier Ramos', '1978-03-10', 'professor', TRUE),
-- Admin
('11111111-0000-0000-0000-000000000004', 'admin@us.es', '$2b$12$eImiTXuWVxfM37uY4JANjOL.81F8RzW67.Z6j5j6J6J6J6J6J6J6J', 'Admin', 'System', '1990-01-01', 'admin', TRUE);

