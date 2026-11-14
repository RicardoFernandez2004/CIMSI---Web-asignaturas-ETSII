CREATE DATABASE IF NOT EXISTS feedback_db;
USE feedback_db; 
CREATE TABLE IF NOT EXISTS rewiews (
 id UUID PRIMARY KEY DEFAULT UUID(),
 -- Referencia lógica a auth_db.users.id 
 user_id UUID NOT NULL, 
 -- Referencia lógica a academic_db.subjects.id 
 subject_id UUID NOT NULL, 
 -- Referencia lógica a academic_db.professors.id 
 professor_id UUID NOT NULL, 
 subject_score TINYINT NOT NULL CHECK(subject_score BETWEEN 1 AND 5), 
 teacher_score TINYINT NOT NULL CHECK(teacher_score BETWEEN 1 AND 5), 
 comments TEXT NOT NULL, 
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
 INDEX idx_user_reviews (user_id), 
 INDEX idx_subject_reviews (subject_id), 
 INDEX idx_teacher_reviews (professor_id) );

-- --------------------------------------------------------
-- Reviews seed data (logical FK reference via static UUIDs)
-- --------------------------------------------------------
INSERT INTO reviews (id, user_id, subject_id, professor_id, subject_score, teacher_score, comments) VALUES
-- Review 1 by Student 1 on Bases de Datos (Professor: María del Carmen Romero)
('55555555-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000001', 5, 5, 'Muy buena asignatura en la que quedan excelentemente explicados los modelos de bases de datos relacionales'),
-- Review 2 by Student 2 on Sistemas Distribuidos (Professor: Manuel Resinas)
('55555555-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000002', 4, 5, 'Contenido interesante sobre contenedores en Docker, pero hay que echarle horas');