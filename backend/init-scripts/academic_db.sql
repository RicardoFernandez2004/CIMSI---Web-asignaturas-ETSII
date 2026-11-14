CREATE DATABASE IF NOT EXISTS academic_db;
USE academic_db;
-- Grados
CREATE TABLE IF NOT EXISTS degrees ( 
 id UUID PRIMARY KEY DEFAULT UUID(),
 code VARCHAR(20) UNIQUE NOT NULL,
 name VARCHAR(255) NOT NULL,
 department VARCHAR(255) NOT NULL,
 duration_years TINYINT NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP );


-- Asignaturas
CREATE TABLE IF NOT EXISTS subjects ( 
 id UUID PRIMARY KEY DEFAULT UUID(),
 degree_id UUID NOT NULL, 
 code VARCHAR(20) UNIQUE NOT NULL,
 name VARCHAR(255) NOT NULL, 
 academic_year TINYINT NOT NULL CHECK(academic_year BETWEEN 1 AND 4), 
 semester TINYINT NOT NULL CHECK(semester IN (1, 2)), 
 ects TINYINT NOT NULL,
 
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
 FOREIGN KEY (degree_id) REFERENCES degrees(id) ON DELETE CASCADE, 
 INDEX idx_subjects_degree (degree_id), 
 INDEX idx_subjects_code (code) );

-- Docentes
CREATE TABLE IF NOT EXISTS professors ( 
 id UUID PRIMARY KEY DEFAULT UUID(), 
 name VARCHAR(100) NOT NULL, 
 surname VARCHAR(100) NOT NULL, 
 email VARCHAR(255) UNIQUE NOT NULL, 
 department VARCHAR(255) NOT NULL, 
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
 INDEX idx_teachers_email (email) );

-- Relación N:M entre Profesores y Asignaturas 
CREATE TABLE IF NOT EXISTS subject_teacher ( 
 professor_id UUID NOT NULL, 
 subject_id UUID NOT NULL, 
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
 PRIMARY KEY (professor_id, subject_id), 
 FOREIGN KEY (professor_id) REFERENCES professors(id) ON DELETE CASCADE, 
 FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE, 
 INDEX idx_st_professor (professor_id), 
 INDEX idx_st_subject (subject_id) );

-- --------------------------------------------------------
-- Degrees seed data
-- --------------------------------------------------------
INSERT INTO degrees (id, code, name, department, duration_years) VALUES
('22222222-0000-0000-0000-000000000410', 'G410', 'Ingeniería de Software', 'Lenguajes y Sisttemás Informáticos', 4),
('22222222-0000-0000-0000-000000000420', 'G420', 'Ingeniería de Computadores', 'Arquitectura y Tecnología de Computadores', 4);

-- --------------------------------------------------------
-- Subjects seed data
-- --------------------------------------------------------
INSERT INTO subjects (id, degree_id, code, name, academic_year, semester, ects) VALUES
('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000410', '2000001', 'Fundamentos de Programación', 1, 1, 6),
('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000410', '2000015', 'Bases de Datos', 2, 1, 6),
('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000410', '2000030', 'Sistemas Distribuidos', 3, 2, 6);

-- --------------------------------------------------------
-- Professors seed data
-- --------------------------------------------------------
INSERT INTO professors (id, name, surname, email, department) VALUES
('44444444-0000-0000-0000-000000000001', 'María del Carmen', 'Romero Ternero', 'mcromero@us.es', 'Arquitectura y Tecnología de Computadores'),
('44444444-0000-0000-0000-000000000002', 'Manuel', 'Resinas Díaz', 'resinas@us.es', 'Lenguajes y Sistemas Informáticos');

-- --------------------------------------------------------
-- N:M Relationship: Subject - Professor
-- --------------------------------------------------------
INSERT INTO subject_teacher (professor_id, subject_id) VALUES
('44444444-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000002'), -- Romero in Bases de Datos
('44444444-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000003'); -- Resinas in Sistemas Distribuidos