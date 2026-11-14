# Contratti API - Academic Service

## Informaciones generales
*   **Base URL (Locale):** `http://localhost:8001/api/academic`
*   **Autorización:** Las solicitudes de lectura (`GET`) solo son accesibles tras la autenticación. Las operaciones de escritura (`POST`, `PUT`, `DELETE`) requieren un token asociado a un usuario llamado `admin`. Si los permisos son insuficientes, el servidor devolverá un error `403 Forbidden`.

---

## 1. Grados (Degrees)

### 1.1 Obtener todos los gradis
*   **Metodo e URL:** `GET /degrees`
*   **Parametros Query (Opcionales):** 
    *   `skip` (int, default 0): .
    *   `limit` (int, default 100): NUmero max de resultados
*   **Respuesta (200 OK):**
    ```json
    [
      {
        "id": "uuid-del-corso",
        "code": "INF01",
        "name": "Ingegneria Informatica",
        "department": "Ingegneria e Architettura",
        "duration_years": 3,
        "created_at": "2023-10-25T10:00:00Z",
        "updated_at": "2023-10-25T10:00:00Z"
      }
    ]
    ```

### 1.2 Crea un nuevo grado (Admin)
*   **Metodo e URL:** `POST /degrees`
*   **Body Request:**
    ```json
    {
      "code": "INF01",
      "name": "Ingegneria Informatica",
      "department": "Ingegneria e Architettura",
      "duration_years": 3
    }
    ```
*   **Respuestas:**
    *   `201 Created`: Devuelve el objeto creado (incluido `id` e timestamp).
    *   `409 Conflict`: Si ya existe otro grado con el mismo `code`.

### 1.3 Actualiza un grado (Admin)
*   **Metodo e URL:** `PUT /degrees/{degree_id}`
*   **Parametri Path:** `degree_id` (UUID del grado).
*   **Body Richiesta:** Cualquier datos se puede no meter, solo los que se van a modificar.
    ```json
    {
      "name": "Ingegneria Informatica e delle Telecomunicazioni"
    }
    ```
*   **Risposte:**
    *   `200 OK`: Devuelve el objeto.
    *   `404 Not Found`: Si l'ID no existe.

### 1.4 Elimina un grado (Admin)
*   **Metodo e URL:** `DELETE /degrees/{degree_id}`
*   **Note:** Esta operación eliminará en cascada todos los temas asociados a este curso.
*   **Risposte:**
    *   `204 No Content`: Eliminacion ok (nessun body).
    *   `404 Not Found`: Si el ID no existe.

---

## 2. docentes (Professors)

### 2.1 Todos los docentes
*   **Metodo e URL:** `GET /professors`
*   **Parametri Query (Opzionali):** `skip` (int), `limit` (int)
*   **Risposta Successo (200 OK):** Lista de obj docentes.

### 2.2 Crea un docente (Admin)
*   **Metodo e URL:** `POST /professors`
*   **Body Richiesta:**
    ```json
    {
      "name": "Mario",
      "surname": "Rossi",
      "email": "mario.rossi@universita.it",
      "department": "Matematica"
    }
    ```
*   **Risposte:** `201 Created`, o `409 Conflict` si ya existe un profe con el mismo correo.

### 2.3 Actualiza un docente (Admin)
*   **Metodo e URL:** `PUT /professors/{professor_id}`
*   **Body Richiesta:** Campos opcionales (name, surname, email, department).
*   **Risposta:** `200 OK` (obj actualizado) o `404 Not Found`.

### 2.4 Elimina un docente (Admin)
*   **Metodo e URL:** `DELETE /professors/{professor_id}`
*   **Note:** También elimina la asignación de todas las materias que impartían.
*   **Risposta:** `204 No Content` o `404 Not Found`.

---

## 3. Asignaturas (Subjects)

### 3.1 Todas las asignaturas (con filtri)
*   **Metodo e URL:** `GET /subjects`
*   **Parametri Query (Opzionali):**
    *   `skip` (int), `limit` (int)
    *   `degree_id` (UUID): Filtrar por grado.
    *   `academic_year` (int 1-4): Filtrar por año
    *(Esempio: `/subjects?degree_id=123-abc&academic_year=2`)*
*   **Risposta Successo (200 OK):**
    ```json
    [
      {
        "id": "uuid-materia",
        "code": "MAT01",
        "name": "Analisi I",
        "academic_year": 1,
        "semester": 1,
        "ects": 9,
        "degree_id": "uuid-del-corso",
        "created_at": "...",
        "updated_at": "..."
      }
    ]
    ```

### 3.2 Crea una materia (Admin)
*   **Metodo e URL:** `POST /subjects`
*   **Body Richiesta:**
    ```json
    {
      "code": "MAT01",
      "name": "Analisi I",
      "academic_year": 1,
      "semester": 1,
      "ects": 9,
      "degree_id": "uuid-del-corso-esistente"
    }
    ```
*   **Risposte:** `201 Created`, o `409 Conflict` (mismo code).

### 3.3 Asignar profesores a una asignatura (Administrador)
*   **Método y URL:** `POST /subjects/{subject_id}/professors`
*   **Descripción:** Reemplaza los profesores asignados a la asignatura por los indicados en este array.
*   **Cuerpo de la petición:**
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

### 3.4 Actualizar una asignatura (Administrador)
*   **Método y URL:** `PUT /subjects/{subject_id}`
*   **Cuerpo de la petición:** Campos opcionales (código, nombre, año académico, semestre, ECTS, ID de la titulación).
*   **Respuesta:** `200 OK` (objeto actualizado) o `404 Not Found`.

### 3.5 Eliminar una asignatura (Administrador)
*   **Método y URL:** `DELETE /subjects/{subject_id}`
*   **Respuesta:** `204 No Content` o `404 Not Found`.

---

## Códigos de error comunes (para todas las API)
*   `401 Unauthorized`: El token falta, está mal formado o ha caducado.
*   `403 Forbidden`: El usuario está autenticado pero no tiene el rol de `admin` (intento de escritura denegado).
*   `422 Unprocessable Entity`: El JSON enviado no cumple con los tipos requeridos (por ejemplo, una cadena de texto en lugar de un número entero) o faltan campos obligatorios.