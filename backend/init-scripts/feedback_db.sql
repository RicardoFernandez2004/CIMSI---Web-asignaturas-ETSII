CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT UUID(),
    student_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    student_grade SMALLINT NOT NULL CHECK (student_grade BETWEEN 1 AND 10),
    general_rating SMALLINT NOT NULL CHECK (general_rating BETWEEN 0 AND 5),
    difficulty_rating SMALLINT NOT NULL CHECK (difficulty_rating BETWEEN 0 AND 5),
    teaching_rating SMALLINT NOT NULL CHECK (teaching_rating BETWEEN 0 AND 5),
    comments TEXT NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_subject UNIQUE (student_id, subject_id),
    INDEX idx_student_reviews (student_id),
    INDEX idx_subject_reviews (subject_id)
);

-- --------------------------------------------------------
-- Reviews seed data (logical FK reference via static UUIDs)
-- --------------------------------------------------------
INSERT INTO reviews (id, student_id, subject_id, student_grade, general_rating, difficulty_rating, teaching_rating, comments, is_anonymous) VALUES
('55555555-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000002', 9, 5, 3, 5, 'Muy buena asignatura en la que quedan excelentemente explicados los modelos de bases de datos relacionales', FALSE),
('55555555-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000003', 8, 4, 4, 5, 'Contenido interesante sobre contenedores en Docker, pero hay que echarle horas', FALSE);