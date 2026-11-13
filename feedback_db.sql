CREATE DATABASE IF NOT EXISTS feedback_db;
USE feedback_db; 
CREATE TABLE IF NOT EXISTS reseñas (
 id UUID PRIMARY KEY DEFAULT UUID(),
 -- Referencia lógica a auth_db.users.id 
 user_id UUID NOT NULL, 
 -- Referencia lógica a academic_db.asignaturas.id 
 asignatura_id UUID NOT NULL, 
 -- Referencia lógica a academic_db.docentes.id 
 docente_id UUID NOT NULL, 
 puntuacion_asignatura TINYINT NOT NULL CHECK(puntuacion_asignatura BETWEEN 1 AND 5), 
 puntuacion_docente TINYINT NOT NULL CHECK(puntuacion_docente BETWEEN 1 AND 5), 
 comentario TEXT NOT NULL, 
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
 INDEX idx_reseñas_user (user_id), 
 INDEX idx_reseñas_asignatura (asignatura_id), 
 INDEX idx_reseñas_docente (docente_id) );
