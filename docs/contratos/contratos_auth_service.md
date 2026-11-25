# Contratos de API - Servicio de Autenticación (Auth)

## Información general

* **URL base (local):** `http://localhost:8000/api/auth`
* **Autenticación:** El registro y el inicio de sesión son endpoints públicos. Las demás rutas (como la obtención del perfil) requieren un token JWT (Bearer Token) válido en la cabecera (`Authorization: Bearer <token>`).
* **Autorización y seguridad:** 
  * Los roles permitidos son gestionados en la creación de la cuenta (ej. `student`, `admin`).
  * Las contraseñas deben ser seguras y se almacenan cifradas (hash) en la base de datos.

---

## 1. Autenticación de Usuarios

### 1.1 Registrar un nuevo usuario

* **Método y URL:** `POST /register`
* **Cuerpo de la solicitud:**
  ```json
  {
    "email": "mario.rossi@alum.us.es",
    "password": "PasswordSicura123!",
    "name": "Mario",
    "surname": "Rossi",
    "date_of_birth": "1998-05-14"
  }
  ```
* **Respuestas:**
  * `201 Created`: Devuelve el objeto del usuario creado junto con el token de acceso.
    ```json
    {
      "user": {
        "id": "uuid-1234-5678-90ab",
        "email": "mario.rossi@alum.us.es",
        "name": "Mario",
        "surname": "Rossi",
        "date_of_birth": "1998-05-14"
        "created_at": "2026-11-12T19:14:00Z"
      },
      "token": {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "token_type": "bearer",
        "expires_in": 3600
      }
    }
    ```
  * `400 Bad Request`: Si los datos proporcionados no son válidos (ej. formato de email incorrecto, contraseña débil) o si el email ya está en uso.

### 1.2 Iniciar sesión (Login)

* **Método y URL:** `POST /login`
* **Cuerpo de la solicitud:**
  ```json
  {
    "email": "mario.rossi@alum.us.es",
    "password": "PasswordSicura123!"
  }
  ```
* **Respuestas:**
  * `200 OK`: Devuelve el token de acceso JWT para ser utilizado en futuras peticiones.
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "bearer",
      "expires_in": 3600
    }
    ```
  * `401 Unauthorized`: Si las credenciales proporcionadas (email o contraseña) son incorrectas. *(Nota: Corregido respecto al documento original que mostraba un token en la respuesta 401 por un aparente error tipográfico).*

### 1.3 Obtener el perfil del usuario actual (Me)

* **Método y URL:** `GET /me`
* **Autenticación:** Requiere un token de tipo Bearer válido.
* **Respuestas:**
  * `200 OK`: Devuelve los datos del usuario autenticado basándose en la información del token.
    ```json
    {
      "id": "uuid-1234-5678-90ab",
      "email": "mario.rossi@alum.us.es",
      "name": "Mario",
      "surname": "Rossi",
      "date_of_birth": "1998-05-14",
      "role": "student"
    }
    ```
  * `401 Unauthorized`: Si el token proporcionado está ausente, ha expirado o es inválido.
### 1.4 Registrar un nuevo administrador (Staff)

* **Método y URL:** `POST /staff`
* **Autenticación:** Requiere un token de tipo Bearer válido perteneciente a un usuario con rol `admin`.
* **Cuerpo de la solicitud:**
  ```json
  {
    "email": "admin.nuevo@ateneo.it",
    "password": "PasswordAdmin123!",
    "name": "Luigi",
    "surname": "Verdi",
    "date_of_birth": "1985-08-20"
  }
