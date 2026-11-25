# Documentación del Subsistema de Persistencia (MV 3) — Proyecto CIMSI

Esta documentación resume la arquitectura de persistencia y el diseño relacional de las bases de datos para su integración en la memoria del proyecto. Ofrece la estructura conceptual, esquemas relacionales y decisiones de diseño clave para que la Persona 8 disponga de la base técnica necesaria para redactar y ampliar la sección correspondiente.

---

## 1. Visión General de la Infraestructura en la MV 3

El subsistema de persistencia del proyecto CIMSI se despliega de forma centralizada en la **Máquina Virtual 3 (MV 3)**. Para garantizar el desacoplamiento entre microservicios y evitar dependencias cruzadas en la capa de datos, se ha optado por una arquitectura multicontenedor.

### Principios de Arquitectura
* **Aislamiento por Microservicio**: Se ejecutan **tres instancias independientes de PostgreSQL 15** en contenedores Docker (`auth_db_container`, `academic_db_container` y `feedback_db_container`).
* **Persistencia en Disco**: Cada contenedor mapea sus datos a un volumen persistente gestionado por Docker (`auth_data`, `academic_data`, `feedback_data`) sobre `/var/lib/postgresql/data`, garantizando la integridad de los datos ante reinicios o actualizaciones de servicio.
* **Exposición de Puertos Mapeados**: Los contenedores exponen internamente el puerto nativo `5432`, mapeado hacia la red de la MV 3 en los puertos `5432` (Auth), `5433` (Academic) y `5434` (Feedback).
* **Seguridad y Aislamiento de Red**: El tráfico entrante a la MV 3 está restringido mediante cortafuegos (`ufw`), permitiendo únicamente la conexión desde la **MV 2** (Backend FastAPI) y la **MV 4** (Nodo réplica).

---

## 2. Modelo y Explicación de las Bases de Datos

El sistema se divide en tres esquemas relacionales independientes, cada uno diseñado para satisfacer los requisitos específicos de su respectivo dominio.

### 2.1. Base de Datos de Autenticación (`auth_db`)
Gestiona la identidad de los usuarios del sistema, sus credenciales y el control de acceso basado en roles.

* **Tabla `users`**:
  * `id` (`UUID`, PK): Identificador único universal del usuario.
  * `email` (`VARCHAR(255)`, Unique, Not Null): Correo electrónico corporativo o universitario.
  * `hashed_password` (`VARCHAR(255)`, Not Null): Hash seguro de la contraseña.
  * `name` y `surname` (`VARCHAR(100)`): Datos personales del usuario.
  * `date_of_birth` (`DATE`): Fecha de nacimiento.
  * `role` (`VARCHAR(20)`, Check): Rol dentro de la plataforma (`student`, `professor`, `admin`).
  * `is_active` (`BOOLEAN`, Default `TRUE`): Estado de activación de la cuenta.
  * `created_at` / `updated_at` (`TIMESTAMP`): Marcas de tiempo de auditoría.

---

### 2.2. Base de Datos Académica (`academic_db`)
Almacena la estructura organizativa de la universidad: grados, asignaturas, cuerpo docente y la vinculación impartida.

* **Tabla `degrees` (Grados)**:
  * `id` (`UUID`, PK): Identificador único del grado.
  * `code` (`VARCHAR(20)`, Unique): Código oficial del grado (ej. `G410`).
  * `name` (`VARCHAR(255)`): Nombre de la titulación.
  * `department` (`VARCHAR(255)`): Departamento responsable.
  * `duration_years` (`SMALLINT`): Duración en años del plan de estudios.
  * `created_at` / `updated_at` (`TIMESTAMP`): Marcas de tiempo de auditoría.

* **Tabla `subjects` (Asignaturas)**:
  * `id` (`UUID`, PK): Identificador único de la asignatura.
  * `degree_id` (`UUID`, FK `degrees.id`): Grado al que pertenece.
  * `code` (`VARCHAR(20)`, Unique): Código de la asignatura.
  * `name` (`VARCHAR(255)`): Nombre de la asignatura.
  * `academic_year` (`SMALLINT`, Check 1-4): Curso académico.
  * `semester` (`SMALLINT`, Check 1-2): Cuatrimestre.
  * `ects` (`SMALLINT`): Créditos ECTS.
  * `created_at` / `updated_at` (`TIMESTAMP`): Marcas de tiempo de auditoría.

* **Tabla `professors` (Docentes)**:
  * `id` (`UUID`, PK): Identificador único del profesor.
  * `name` y `surname` (`VARCHAR(100)`): Nombre y apellidos.
  * `email` (`VARCHAR(255)`, Unique): Correo institucional.
  * `department` (`VARCHAR(255)`): Departamento académico.
  * `created_at` / `updated_at` (`TIMESTAMP`): Marcas de tiempo de auditoría.

* **Tabla `subject_teacher` (Relación N:M Docente-Asignatura)**:
  * `professor_id` (`UUID`, FK `professors.id`): Referencia al docente.
  * `subject_id` (`UUID`, FK `subjects.id`): Referencia a la asignatura.
  * Clave primaria compuesta (`professor_id`, `subject_id`).
  * `created_at` (`TIMESTAMP`): Marcas de tiempo de auditoría.

---

### 2.3. Base de Datos de Feedback (`feedback_db`)
Recoge las evaluaciones y valoraciones realizadas por los estudiantes sobre asignaturas y profesores.

* **Tabla `reviews` (Reseñas)**:
  * `id` (`UUID`, PK): Identificador único de la reseña.
  * `user_id` (`UUID`, Not Null): Referencia lógica al usuario autor de la reseña (`auth_db.users.id`).
  * `subject_id` (`UUID`, Not Null): Referencia lógica a la asignatura evaluada (`academic_db.subjects.id`).
  * `student_grade` (`SMALLINT`, Check 1-10): Nota obtenida por el alumno en la asignatura.
  * `general_rating` (`SMALLINT`, Check 0-5): Puntuación otorgada a la asignatura.
  * `difficulty_rating` (`SMALLINT`, Check 0-5): Puntuación otorgada a la dificultad de la asignatura.
  * `teaching_rating` (`SMALLINT`, Check 0-5): Puntuación otorgada al profesor.
  * `comments` (`TEXT`): Comentario detallado de la valoración.
  * `is_anonymous` (`BOOLEAN`, Default False): Comentario anónimo o no.
  * `created_at` / `updated_at` (`TIMESTAMP`): Marcas de tiempo de auditoría.

---

## 3. Decisiones de Diseño para la Redacción de la Memoria

Para enriquecer la justificación técnica en la memoria final (especialmente de cara a los criterios M7 y M12), se destacan los siguientes puntos:

1. **Desacoplamiento Mediante UUIDs**: Al no existir claves ajenas físicas (`FOREIGN KEY`) entre bases de datos distintas, las relaciones entre dominios (como un `user_id` en `feedback_db`) se mantienen a nivel lógico mediante identificadores universales `UUID`. Esto permite que cada microservicio escale o se migre de forma independiente.
2. **Gestión de Configuración Externa (`.env`)**: Ninguna contraseña o dirección IP está integrada directamente en el código fuente. Las credenciales se inyectan mediante variables de entorno en Docker Compose (`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`). Los valores concretos se encuentran en un `.env` (que GitHub ignora) en el mismo directorio, por lo que los valores se sustituyen de manera automática para aquellos que tengan el `.env`
3. **Poblado Inicial (*Seed Data*)**: Se incluyen scripts SQL de inicialización (`/docker-entrypoint-initdb.d/`) que automatizan la creación de tablas y la carga de datos de prueba preconfigurados con UUIDs fijos, facilitando los tests de integración entre componentes.
