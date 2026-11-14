# Contratos API - Academic Service

## Información general
*   **Base URL (Local):** `http://localhost:8001/api/academic`
*   **Autorización:** Las solicitudes de lectura (`GET`) solo son accesibles tras la autenticación. Las operaciones de escritura (`POST`, `PUT`, `DELETE`) requieren un token asociado a un usuario con el rol `admin`. Si los permisos son insuficientes, el servidor devolverá un error `403 Forbidden`.

---

## 1. Grados (Degrees)

### 1.1 Obtener todos los grados
*   **Método y URL:** `GET /degrees`
*   **Parámetros de consulta (Opcionales):** 
    *   `skip` (int, default 0): Número de registros a omitir.
    *   `limit` (int, default 100): Número máximo de resultados.
*   **Respuesta (200 OK):**
    ```json
    [
      {
        "id": "uuid-del-grado",
        "code": "INF01",
        "name": "Ingegneria Informatica",
        "department": "Ingegneria e Architettura",
        "duration_years": 3,
        "created_at": "2023-10-25T10:00:00Z",
        "updated_at": "2023-10-25T10:00:00Z"
      }
    ]
    ```

### 1.2 Crear un nuevo grado (Admin)
*   **Método y URL:** `POST /degrees`
*   **Cuerpo de la solicitud:**
    ```json
    {
      "code": "INF01",
      "name": "Ingegneria Informatica",
      "department": "Ingegneria e Architettura",
      "duration_years": 3
    }
    ```
*   **Respuestas:**
    *   `201 Created`: Devuelve el objeto creado (incluidos `id` y timestamp).
    *   `409 Conflict`: Si ya existe otro grado con el mismo `code`.

### 1.3 Actualizar un grado (Admin)
*   **Método y URL:** `PUT /degrees/{degree_id}`
*   **Parámetros de ruta:** `degree_id` (UUID del grado).
*   **Cuerpo de la solicitud:** Cualquier dato es opcional; solo debes incluir los campos que deseas modificar.
    ```json
    {
      "name": "Ingegneria Informatica e delle Telecomunicazioni"
    }
    ```
*   **Respuestas:**
    *   `200 OK`: Devuelve el objeto actualizado.
    *   `404 Not Found`: Si el ID no existe.

### 1.4 Eliminar un grado (Admin)
*   **Método y URL:** `DELETE /degrees/{degree_id}`
*   **Nota:** Esta operación eliminará en cascada todas las asignaturas asociadas a este grado.
*   **Respuestas:**
    *   `204 No Content`: Eliminación exitosa (sin cuerpo en la respuesta).
    *   `404 Not Found`: Si el ID no existe.

---

## 2. Docentes (Professors)

### 2.1 Obtener todos los docentes
*   **Método y URL:** `GET /professors`
*   **Parámetros de consulta (Opcionales):** `skip` (int), `limit` (int)
*   **Respuesta exitosa (200 OK):** Lista de objetos de docentes.

### 2.2 Crear un docente (Admin)
*   **Método y URL:** `POST /professors`
*   **Cuerpo de la solicitud:**
    ```json
    {
      "name": "Mario",
      "surname": "Rossi",
      "email": "mario.rossi@universita.it",
      "department": "Matematica"
    }
    ```
*   **Respuestas:** `201 Created`, o `409 Conflict` si ya existe un docente con el mismo correo.

### 2.3 Actualizar un docente (Admin)
*   **Método y URL:** `PUT /professors/{professor_id}`
*   **Cuerpo de la solicitud:** Campos opcionales (name, surname, email, department).
*   **Respuesta:** `200 OK` (objeto actualizado) o `404 Not Found`.

### 2.4 Eliminar un docente (Admin)
*   **Método y URL:** `DELETE /professors/{professor_id}`
*   **Nota:** También elimina la asignación de este docente en todas las asignaturas que impartía.
*   **Respuesta:** `204 No Content` o `404 Not Found`.

---

## 3. Asignaturas (Subjects)

### 3.1 Obtener todas las asignaturas (con filtros)
*   **Método y URL:** `GET /subjects`
*   **Parámetros de consulta (Opcionales):**
    *   `skip` (int), `limit` (int)
    *   `degree_id` (UUID): Filtrar por grado.
    *   `academic_year` (int 1-4): Filtrar por año.
    *(Ejemplo: `/subjects?degree_id=123-abc&academic_year=2`)*
*   **Respuesta exitosa (200 OK):**
    ```json
    [
      {
        "id": "uuid-asignatura",
        "code": "MAT01",
        "name": "Analisi I",
        "academic_year": 1,
        "semester": 1,
        "ects": 9,
        "degree_id": "uuid-del-grado",
        "created_at": "...",
        "updated_at": "..."
      }
    ]
    ```

### 3.2 Crear una asignatura (Admin)
*   **Método y URL:** `POST /subjects`
*   **Cuerpo de la solicitud:**
    ```json
    {
      "code": "MAT01",
      "name": "Analisi I",
      "academic_year": 1,
      "semester": 1,
      "ects": 9,
      "degree_id": "uuid-del-grado-existente"
    }
    ```
*   **Respuestas:** `201 Created`, o `409 Conflict` (si ya existe el mismo código).

### 3.3 Asignar profesores a una asignatura (Admin)
*   **Método y URL:** `POST /subjects/{subject_id}/professors`
*   **Descripción:** Reemplaza los profesores asignados a la asignatura por los indicados en este array.
*   **Cuerpo de la solicitud:**
    ```json
    {
      "professor_ids": [
        "uuid-professor-1",
        "uuid-professor-2"
      ]
    }
    ```
*   **Respuestas:**
    *   `200 OK`: Asignación completada (devuelve los datos de la asignatura).
    *   `400 Bad Request`: Si alguno de los IDs de profesor proporcionados no existe en la base de datos.
    *   `404 Not Found`: Si el ID de la asignatura no existe.

### 3.4 Actualizar una asignatura (Admin)
*   **Método y URL:** `PUT /subjects/{subject_id}`
*   **Cuerpo de la solicitud:** Campos opcionales (código, nombre, año académico, semestre, ECTS, ID de la titulación).
*   **Respuesta:** `200 OK` (objeto actualizado) o `404 Not Found`.

### 3.5 Eliminar una asignatura (Admin)
*   **Método y URL:** `DELETE /subjects/{subject_id}`
*   **Respuesta:** `204 No Content` o `404 Not Found`.

---

## Códigos de error comunes (para todas las API)
*   `401 Unauthorized`: El token falta, está mal formado o ha caducado.
*   `403 Forbidden`: El usuario está autenticado pero no tiene el rol de `admin` (intento de escritura denegado).
*   `422 Unprocessable Entity`: El JSON enviado no cumple con los tipos requeridos (por ejemplo, una cadena de texto en lugar de un número entero) o faltan campos obligatorios.