CREATE DATABASE IF NOT EXISTS academic_db;
USE academic_db;
-- Grados
CREATE TABLE IF NOT EXISTS grados ( 
 id UUID PRIMARY KEY DEFAULT UUID(),
 codigo VARCHAR(20) UNIQUE NOT NULL,
 nombre VARCHAR(255) NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP );
 
-- Asignaturas
CREATE TABLE IF NOT EXISTS asignaturas ( 
 id UUID PRIMARY KEY DEFAULT UUID(),
 grado_id UUID NOT NULL, 
 codigo VARCHAR(20) UNIQUE NOT NULL,
 nombre VARCHAR(255) NOT NULL, 
 curso TINYINT NOT NULL CHECK(curso BETWEEN 1 AND 4), 
 cuatrimestre TINYINT NOT NULL CHECK(cuatrimestre IN (1, 2)), 
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
 FOREIGN KEY (grado_id) REFERENCES grados(id) ON DELETE CASCADE, 
 INDEX idx_asignaturas_grado (grado_id), 
 INDEX idx_asignaturas_codigo (codigo) ); 
 
-- Docentes
CREATE TABLE IF NOT EXISTS docentes ( 
 id UUID PRIMARY KEY DEFAULT UUID(), 
 nombre VARCHAR(100) NOT NULL, 
 apellidos VARCHAR(100) NOT NULL, 
 email VARCHAR(255) UNIQUE NOT NULL, 
 departamento VARCHAR(255) NOT NULL, 
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
 INDEX idx_docentes_email (email) ); 

-- Relación N:M entre Profesores y Asignaturas 
CREATE TABLE IF NOT EXISTS docente_asignatura ( 
 docente_id UUID NOT NULL, 
 asignatura_id UUID NOT NULL, 
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
 PRIMARY KEY (docente_id, asignatura_id), 
 FOREIGN KEY (docente_id) REFERENCES docentes(id) ON DELETE CASCADE, 
 FOREIGN KEY (asignatura_id) REFERENCES asignaturas(id) ON DELETE CASCADE, 
 INDEX idx_docente_asignatura_docente (docente_id), 
 INDEX idx_docente_asignatura_asignatura (asignatura_id) );