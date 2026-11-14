# Guía de Flujo de Trabajo en Git, Despliegue con Docker y Organización del Repositorio Único (Proyecto CIMSI)

Esta guía establece el estándar operativo de control de versiones, despliegue con Docker Compose y organización del código para los ocho integrantes del Proyecto CIMSI. Con el fin de evitar conflictos de fusión, garantizar el aislamiento de componentes y mantener la trazabilidad del trabajo individual, el proyecto se estructura en torno a un único repositorio en GitHub dividido en cuatro áreas funcionales, cuatro ramas de desarrollo paralelas y un esquema modular de despliegue.

---

## 1. Arquitectura de Directorios del Repositorio Único

Para asegurar que los desarrollos de infraestructura, backend, frontend y documentación no interfieran entre sí, la rama principal del repositorio organiza el código en cuatro carpetas independientes. Cada área funcional posee una responsabilidad delimitada:

* **`/infra`**: Contiene los ficheros de orquestación global (`docker-compose.yml`), la configuración del proxy inverso Nginx, scripts de automatización Bash (`deploy.sh`) y playbooks de Ansible.
* **`/backend`**: Almacena el código fuente de los microservicios construidos en FastAPI (`auth`, `academic`, `feedback`), los esquemas SQL de PostgreSQL y los ficheros `Dockerfile` individuales de cada servicio.
* **`/frontend`**: Alberga la aplicación web SPA desarrollada en React.js, sus componentes visuales, archivos de configuración de interfaz y activos estáticos.
* **`/docs`**: Reúne la memoria final del proyecto en PDF, la bitácora técnica de trabajo, diagramas de arquitectura y documentos normativos del equipo.

---

## 2. Asignación de Ramas de Desarrollo por Pareja

El trabajo paralelo se gestiona a través de cuatro ramas secundarias alineadas con la división de tareas de los ocho integrantes. Ningún desarrollador debe realizar modificaciones directamente sobre la rama `main`.

| Rama | Pareja Asignada | Ámbito de Trabajo | Carpeta Principal |
| :--- | :--- | :--- | :--- |
| `infra` | Pareja 1 y Pareja 3 (Personas 1, 2, 5, 6) | Infraestructura virtual, Docker Compose, Nginx, automatización y despliegue | `/infra` |
| `backend` | Pareja 2 (Personas 3, 4) | Microservicios FastAPI, esquemas de persistencia PostgreSQL y API REST | `/backend` |
| `frontend` | Pareja 4 - Frontend (Persona 7) | Interfaz de usuario SPA en React.js e integración de consumos REST | `/frontend` |
| `docs` | Pareja 4 - Documentación (Persona 8) | Memoria técnica, bitácora de reuniones y diagramas de red | `/docs` |

---

## 3. Protocolo de Trabajo Diario en Git

Cada sesión de desarrollo debe seguir una secuencia estricta de comandos en terminal para garantizar que el código local esté siempre sincronizado con el repositorio remoto en GitHub.

### Paso 1: Posicionarse en la rama asignada
Antes de comenzar a editar código, verifique que se encuentra en la rama correspondiente a su equipo:

```bash
git checkout <nombre_de_la_rama>
```

### Paso 2: Sincronizar los cambios remotos
Descargue las últimas actualizaciones publicadas por sus compañeros de pareja antes de realizar modificaciones locales:

```bash
git pull origin <nombre_de_la_rama>
```

### Paso 3: Registrar cambios mediante commits atómicos
Realice confirmaciones pequeñas y frecuentes. Los mensajes de commit deben describir con precisión el cambio realizado, siguiendo la convención de tipos (`feat`, `fix`, `docs`, `refactor`):

```bash
git add .
git commit -m "feat(auth): implementar generación de tokens JWT"
```

### Paso 4: Publicar los cambios en el servidor remoto
Envíe sus avances a la rama correspondiente en GitHub:

```bash
git push origin <nombre_de_la_rama>
```

---

## 4. Estrategia de Integración hacia la Rama Main

La rama `main` representa el estado estable del sistema y únicamente se actualiza al completar hitos semanales o entregables funcionales.

1. **Revisión y validación previa**: Antes de fusionar, asegúrese de que el código compila y ejecuta sin errores en el entorno local.
2. **Creación de Pull Request o Fusión Directa**: La pareja responsable inicia la fusión hacia `main` mediante la interfaz de GitHub o mediante comandos locales de Git:
   ```bash
   git checkout main
   git pull origin main
   git merge <nombre_de_la_rama>
   git push origin main
   ```
3. **Mantenimiento del aislamiento**: Debido a que cada pareja trabaja exclusivamente en su carpeta designada, la fusión automática de Git se ejecutará sin generar conflictos en la mayoría de los casos.

---

## 5. Buenas Prácticas de Despliegue con Docker Compose y Perfiles (`profiles`)

Para permitir tanto el desarrollo completo en local como el despliegue distribuido en las 4 Máquinas Virtuales sobre Proxmox VE sin duplicar archivos de configuración, se utiliza un archivo unificado ubicado en `/infra/docker-compose.yml`.

### Resolución de Rutas Relativas
* Docker Compose resuelve las rutas relativas en función de la ubicación del propio fichero `docker-compose.yml` (`/infra/`), no del directorio desde donde se lanza la terminal.
* Por ello, las referencias al backend utilizan `../backend` como contexto de compilación (ej. `context: ../backend`) y `../backend/persistencia/init_auth.sql` para los scripts de inicio SQL.

### Uso de Perfiles (`profiles`) para Despliegue por Nodos
El archivo define tres perfiles principales para modularizar la ejecución:

* **Despliegue de la Capa de Persistencia (MV 3 - IP `10.0.0.12`):**
  ```bash
  docker compose --profile db up -d
  ```
  *(Inicia únicamente los contenedores PostgreSQL: `auth-db`, `academic-db` y `feedback-db`).*

* **Despliegue de la Capa de Backend (MV 2 - IP `10.0.0.11` y MV 4 - IP `10.0.0.13`):**
  ```bash
  docker compose --profile backend up -d
  ```
  *(Inicia únicamente los microservicios FastAPI: `auth-service`, `academic-service` y `feedback-service`).*

* **Despliegue Completo en Desarrollo Local (Todos los componentes):**
  ```bash
  docker compose --profile full up -d
  ```
  *(Inicia la arquitectura completa dentro de una sola máquina para pruebas de integración).*

### Tolerancia a Fallos y Valores por Defecto
* **Variables con fallback:** Los parámetros de entorno usan la sintaxis `${VARIABLE:-default}` (ejemplo: `${POSTGRES_USER:-cimsi_user}`), lo que asegura que los contenedores arranquen aunque no exista el archivo `.env` en local.
* **Comprobaciones de salud (`healthcheck`):** Los microservicios esperan a que las bases de datos reporten estado saludable (`service_healthy`) antes de iniciar, evitando caídas por fallos de conexión al arrancar.

---

## 6. Gestión de Credenciales y Seguridad (.env)

Para evitar la filtración accidental de claves y contraseñas en el repositorio público de GitHub, el equipo debe aplicar las siguientes políticas de seguridad:

* **Exclusión obligatoria en `.gitignore`**: Los ficheros `.env` que contengan contraseñas de bases de datos, claves secretas JWT o tokens API nunca deben subirse al control de versiones.
* **Uso de plantillas públicas (`.env.example`)**: En cada carpeta de módulo (`/infra`, `/backend/auth`, etc.) se debe incluir un fichero `.env.example` con las variables requeridas pero con valores ficticios o vacíos.
* **Configuración en entorno local**: Cada integrante creará su propio fichero `.env` en local copiando la plantilla `.env.example` y asignando los valores correspondientes.

---

## 7. Resolución de Conflictos

En caso de que se produzca un conflicto durante el `git pull` o `git merge`:

1. Identifique los archivos en conflicto reportados por Git en la consola.
2. Abra cada fichero afectado y examine las marcas de conflicto (`<<<<<<< HEAD`, `=======`, `>>>>>>>`).
3. Coordine con el compañero involucrado para seleccionar el código correcto.
4. Guarde el archivo, añádalo al área de preparación con `git add <archivo>` y complete el commit de resolución con `git commit -m "fix: resolver conflicto en módulo auth"`.
