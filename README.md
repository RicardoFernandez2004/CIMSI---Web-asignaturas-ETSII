# Proyecto CIMSI — Plataforma Web Distribuida de Valoración de Asignaturas

Plataforma web distribuida desarrollada para la evaluación y valoración de asignaturas académicas en la Escuela Técnica Superior de Ingeniería Informática (ETSII) de la Universidad de Sevilla. El sistema utiliza una arquitectura modular de microservicios con bases de datos PostgreSQL aisladas, un proxy inverso Nginx y despliegue automatizado mediante contenedores Docker y máquinas virtuales Proxmox.

---

## 📁 Estructura del Repositorio

El código del proyecto se organiza dentro de un único repositorio estructurado en cuatro directorios principales:

* **`/infra`**: Fichero unificado `docker-compose.yml`, configuración del proxy inverso Nginx, scripts de despliegue Bash (`deploy.sh`) y playbooks de Ansible.
* **`/backend`**: Código fuente de los microservicios en FastAPI (`auth`, `academic`, `feedback`), esquemas de persistencia PostgreSQL y sus correspondientes `Dockerfile`.
* **`/frontend`**: Interfaz de usuario en formato SPA desarrollada con React.js.
* **`/docs`**: Memoria del proyecto, diagramas de arquitectura, bitácora técnica y la [Guía de Flujo de Trabajo en Git](docs/guia-flujo-git-proyecto.md).

---

## 🌿 Organización de Ramas y Guía de Git

El desarrollo del proyecto está repartido entre cuatro parejas de trabajo que desarrollan en paralelo sobre ramas dedicadas:

| Rama | Ámbito de Trabajo | Directorio Principal |
| :--- | :--- | :--- |
| `infra` | Infraestructura, Docker Compose, Nginx, Proxmox y automatización | `/infra` |
| `backend` | Microservicios FastAPI, esquemas SQL y bases de datos PostgreSQL | `/backend` |
| `frontend` | Interfaz de usuario SPA en React.js e integración REST | `/frontend` |
| `docs` | Memoria técnica, diagramas y documentación | `/docs` |

> 📖 **Documento de Referencia:** Antes de realizar aportaciones al repositorio, consulta la **[Guía de Flujo de Trabajo en Git](docs/guia-flujo-git-proyecto.md)** situada en la carpeta `/docs`. En ella se detalla la secuencia de comandos diarios, la política de commits, la estrategia de integración hacia la rama `main` y la gestión segura de variables de entorno (`.env`).

---

## 📋 Hitos y Seguimiento del Proyecto (Checklist)

A continuación se detallan las normas oficiales del trabajo y la lista de hitos semanales a cumplir para ir actualizando el progreso (`- [ ]` a `- [x]`) conforme se completen las tareas.

### 📜 Normas Oficiales y Criterios de Evaluación
- **Límite de Plagio:** El documento PDF final será analizado con herramientas antiplagio. Un índice de plagio **> 30%** implica la calificación de **NO ENTREGADO** [11].
- **Formato de la Memoria:** PDF con texto seleccionable/inspeccionable (no se admiten PDFs compuestos únicamente por imágenes escaneadas) [10].
- **Fecha Límite de Entrega:** **13 de diciembre (23:59)** vía Enseñanza Virtual [11].
- **Entregables Obligatorios el 13 de Diciembre:**
  1. Memoria técnica en PDF (siguiendo las secciones oficiales de la rúbrica M1–M6) [10, 11, 33].
  2. Archivo de diapositivas de la presentación en PDF [11].
  3. **Vídeo de Presentación Teórica:** Máximo **20 minutos** con la participación de los 8 miembros [11, 34].
  4. **Vídeo de Demostración Funcional:** Máximo **10 minutos** mostrando el sistema en marcha y las pruebas de resiliencia [11, 34].
  5. Scripts de automatización y código funcional [11].
- **Defensa Presencial:** **17 de diciembre** (exposición de 10 minutos por grupo y turno de preguntas del tribunal) [11].

---

### 📅 Control Semanal de Hitos (Roadmap)

#### 🔹 Semana 1: Cimientos y Entorno Base
- [x] **Git & Estructura:** Repositorio único con carpetas `/infra`, `/backend`, `/frontend`, `/docs` y ramas de trabajo (`infra`, `backend`, `frontend`, `docs`) [2, 26].
- [x] **Infraestructura Base:** Borrador inicial del `docker-compose.yml` unificado y la Guía de Git [26].
- [ ] **MVs & Red (Proxmox):** Desplegar las 4 MVs (MV1 Gateway, MV2 Backend, MV3 BBDD, MV4 Réplica) con IPs fijas (`192.168.120.54` a `192.168.120.66`), claves SSH y cortafuegos `ufw` [2, 15].
- [x] **BBDD & API Contracts:** Esquemas relacionales independientes en PostgreSQL (`backend/init-scripts/`) y contratos de API (`docs/contratos/`) definidos [2, 20, 23].
- [x] **Frontend SPA Base:** Proyecto React con vistas Login, Asignaturas y Reseñas (`frontend/src/pages/`) [2, 31].
- [ ] **Documentación:** Plantilla oficial de la Memoria en PDF/LaTeX con el índice de la rúbrica y redacción de la Introducción [2, 33].

#### 🔹 Semana 2: Despliegue e Integración
- [x] **Persistencia (MV3):** `docker-compose.yml` y scripts SQL de inicialización con datos de prueba listos (despliegue en MV3 pendiente) [2, 24].
- [x] **Backend (MV2):** 3 microservicios FastAPI (`auth`, `academic`, `feedback`) con `Dockerfile`, modelos, esquemas y CRUD listos para contenedorizar [2, 21].
- [x] **API Gateway (MV1):** `nginx.conf` con proxy inverso (`/api/auth/`, `/api/academic/`, `/api/feedback/`) y balanceo `upstream` HA para Feedback [2, 18].
- [x] **Frontend Conectado:** `services/api.js` con integración real a las APIs (alternable a datos simulados) y gestión de token JWT [2, 31].
- [x] **Automatización (M8):** Script `deploy.sh` y playbooks de Ansible para despliegue distribuido [2, 26].
- [ ] **Memoria PDF:** Inventario de MVs, tabla de IPs, reglas de cortafuegos y capítulo de Arquitectura [2, 16, 33].

#### 🔹 Semana 3: Requisitos Avanzados (M8–M11)
- [x] **Nodo Réplica & HA (M11):** Balanceo `upstream` en Nginx entre MV2 y MV4 y playbook de despliegue del nodo réplica (sin validar en MVs reales) [2, 19, 27].
- [ ] **Escalabilidad (M10):** Procedimiento técnico reproducible para añadir nuevos nodos al clúster [2, 27].
- [x] **Monitorización (M9):** Stack Prometheus + Grafana + blackbox-exporter + node-exporter + cadvisor con reglas de alerta [2, 29].
- [ ] **Frontend Compilado:** `npm run build` y estáticos publicados en Nginx [2, 32].
- [ ] **Memoria PDF:** Capturas de Swagger, esquemas de BBDD y apartados de Automatización, Monitorización y Escalado [2, 34].

#### 🔹 Semana 4: Estabilización, Pruebas de Carga y Vídeo Demo
- [ ] **Congelación de Código:** Congelar cambios en infraestructura, red y backend [2, 17, 22].
- [ ] **Pruebas de Estrés & Resiliencia (M11):** Simular caída de nodo en vivo y verificar conmutación al nodo réplica [2, 19, 27].
- [ ] **Precarga de Datos:** Cargar conjunto completo de datos realistas (grados, asignaturas US y reseñas) para la demo [2, 25].
- [ ] **Vídeo de Demostración (Máx. 10 min):** Demo funcional y prueba de caída de nodo [2, 32, 34].
- [ ] **Borrador de Memoria:** Redacción íntegra de la Memoria en PDF [2, 34].

#### 🔹 Semana 5: Cierre, Vídeo Teórico, Entrega y Defensa
- [ ] **Vídeo de Presentación (Máx. 20 min):** Intervenciones de los 8 miembros y montaje del vídeo teórico [2, 34].
- [ ] **Control de Plagio & PDF:** Texto seleccionable e índice de plagio `< 30%` [11, 34].
- [ ] **Entrega Final (13 de Diciembre - 23:59):** Memoria PDF, diapositivas, 2 vídeos y scripts/código en Enseñanza Virtual [1, 11, 34].
- [ ] **Defensa Presencial (17 de Diciembre):** Exposición de 10 minutos y preguntas del tribunal [1, 11].

---

## 🚀 Despliegue en Entorno de Desarrollo

### Requisitos previos
* Docker y Docker Compose
* Git

### Instrucciones de inicio rápido
1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd CIMSI---Web-asignaturas-ETSII
   ```

2. Desplegar la infraestructura de contenedores (bases de datos y microservicios):
   ```bash
   docker-compose -f infra/docker-compose.yml up -d
   ```

3. Comprobar el estado de los contenedores:
   ```bash
   docker-compose -f infra/docker-compose.yml ps
   ```

---

## 🔐 Seguridad

Las claves secretas, contraseñas de las bases de datos y tokens JWT no deben subirse al repositorio Git. Utiliza los archivos `.env.example` presentes en cada directorio como plantilla para crear tus ficheros `.env` locales.

---

## 📜 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Para más detalles, consulta el archivo LICENSE.
