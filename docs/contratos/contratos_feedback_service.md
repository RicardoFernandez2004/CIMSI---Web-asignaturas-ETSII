# Contratos de API - Servicio de opiniones (Feedback)

## Información general

* **URL base (local):** `http://localhost:8002/api/feedback`
* **Autenticación:** Todas las API requieren un token JWT (Bearer Token) válido en la cabecera (`Authorization: Bearer <token>`).
* **Autorización y seguridad:** 
  * La creación de opiniones está restringida al rol `student` (estudiante).
  * La modificación o eliminación de una opinión solo está permitida para su autor o para un usuario con rol `admin` (administrador).
  * La lectura de opiniones está abierta a todos los usuarios autenticados.

---

## 1. Opiniones (Reviews)

### 1.1 Obtener todas las reseñas (con filtros)

* **Método y URL:** `GET /reviews`
* **Parámetros de consulta (opcionales):**
  * `skip` (int, valor predeterminado: 0)
  * `limit` (int, valor predeterminado: 100)
  * `subject_id` (UUID): Para obtener las reseñas de una asignatura específica.
  * `student_id` (UUID): Para obtener el historial de reseñas realizadas por un estudiante específico.
* **Nota sobre privacidad:** Si `is_anonymous` es `true`, el servidor devolverá el campo `student_id` como `null`.
* **Respuesta exitosa (200 OK):**
  ```json
  [
    {
      "id": "review-uuid",
      "subject_id": "subject-uuid",
      "student_grade": 8,
      "general_rating": 4,
      "difficulty_rating": 3,
      "teaching_rating": 5,
      "comments": "Curso bien estructurado; el profesor explica las cosas con mucha claridad.",
      "is_anonymous": false,
      "student_id": "student-uuid", 
      "created_at": "2023-11-20T10:00:00Z",
      "updated_at": "2023-11-20T10:00:00Z"
    }
  ]
  ```

### 1.2 Crear una nueva reseña (solo para estudiantes)

* **Método y URL:** `POST /reviews`
* **Seguridad:** El ID del estudiante no debe incluirse en el cuerpo de la solicitud; el servidor lo extrae de forma segura a partir del token. * **Cuerpo de la solicitud:**
  ```json
  {
    "subject_id": "uuid-subject",
    "student_grade": 8,
    "general_rating": 4,
    "difficulty_rating": 3,
    "teaching_rating": 5,
    "comments": "Curso bien estructurado; el profesor explica las cosas con mucha claridad.",
    "is_anonymous": false
  }
  ```
* **Respuestas:**
  * `201 Created`: Devuelve el objeto creado.
  * `403 Forbidden`: Si el usuario que realiza la solicitud no es un estudiante.
  * `409 Conflict`: Si el estudiante ya ha evaluado esta asignatura en particular (prevención de spam).
  * `422 Unprocessable Entity`: Si las valoraciones se encuentran fuera del rango permitido (por ejemplo, si las puntuaciones no están entre 0 y 5).

### 1.3 Actualizar una reseña (Autor o Administrador)

* **Método y URL:** `PUT /reviews/{review_id}`
* **Cuerpo de la solicitud:** Todos los campos son opcionales. Envía únicamente los campos que desees actualizar. El ID del sujeto (`subject_id`) no puede modificarse.
  ```json
  {
    "general_rating": 5,
    "comments": "He revisado los apuntes; el curso es realmente excepcional."
  }
  ```
* **Respuestas:**
  * `200 OK`: Devuelve el objeto actualizado.
  * `403 Forbidden`: Si un usuario intenta modificar la reseña de otra persona sin ser administrador.
  * `404 Not Found`: Si el ID no existe.

### 1.4 Eliminar una reseña (Autor o Administrador)

* **Método y URL:** `DELETE /reviews/{review_id}`
* **Respuestas:**
  * `204 No Content`: Eliminación realizada con éxito.
  * `403 Forbidden`: Si un usuario intenta eliminar la reseña de otra persona.
  * `404 Not Found`: Si el ID no existe.

---

## 2. Resolución de nombres de usuario (Integración con el Servicio de Autenticación)

Para mostrar los nombres de los autores en las reseñas que no son anónimas, el cliente debe recopilar los valores `student_id` y realizar una consulta al Servicio de Autenticación (Auth Service).

* **URL base:** `http://localhost:8000/api/auth`

### 2.1 Obtención de nombres de forma masiva

* **Método y URL:** `POST /users/bulk`
* **Autenticación:** Requiere un token de tipo Bearer válido (cualquier rol).
* **Cuerpo de la solicitud:**
  ```json
  {
    "user_ids": [
      "uuid-student-1",
      "uuid-student-2"
    ]
  }
  ```
* **Respuesta exitosa (200 OK):**
  ```json
  [
    {
      "id": "uuid-student-1",
      "name": "Giulia",
      "surname": "Bianchi"
    },
    {
      "id": "uuid-student-2",
      "name": "Marco",
      "surname": "Verdi"
    }
  ]
  ```