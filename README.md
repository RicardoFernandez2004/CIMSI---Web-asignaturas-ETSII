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
- [x] **Git & Estructura:** Crear repositorio único con carpetas `/infra`, `/backend`, `/frontend`, `/docs` y ramas de trabajo (`infra`, `backend`, `frontend`, `docs`) [2, 26].
- [x] **Infraestructura Base:** Borrador inicial del `docker-compose.yml` unificado y la Guía de Git [26].
- [ ] **MVs & Red (Proxmox):** Desplegar las 4 MVs (MV1 Gateway, MV2 Backend, MV3 BBDD, MV4 Réplica) con IPs fijas (`10.0.0.10` a `10.0.0.13`), claves SSH y cortafuegos `ufw` [2, 15].
- [ ] **BBDD & API Contracts:** Diseñar esquemas relacionales independientes en PostgreSQL y contratos JSON de los microservicios FastAPI (Auth, Academic, Feedback) [2, 20, 23].
- [ ] **Frontend SPA Base:** Crear proyecto React inicial con vistas simples (Login, Asignaturas, Reseñas) y datos simulados [2, 31].
- [ ] **Documentación:** Crear plantilla oficial de la Memoria en PDF/LaTeX con el índice de la rúbrica y redactar la Introducción [2, 33].

#### 🔹 Semana 2: Despliegue e Integración
- [ ] **Persistencia (MV3):** Levantar los 3 contenedores PostgreSQL aislados con volúmenes persistentes y cargar datos iniciales de prueba [2, 24].
- [ ] **Backend (MV2):** Desplegar los 3 microservicios FastAPI en contenedores Docker y validar tokens JWT [2, 21].
- [ ] **API Gateway (MV1):** Configurar Nginx como proxy inverso (`/api/auth/`, `/api/academic/`, `/api/feedback/`) y servir la SPA compilada en React [2, 18].
- [ ] **Frontend Conectado:** Conectar React con las APIs reales a través de Nginx y gestionar el token JWT en el cliente [2, 31].
- [ ] **Automatización (M8):** Iniciar empaquetado de scripts Bash (`deploy.sh`) / playbooks de Ansible para automatizar el despliegue sin pasos manuales [2, 26].
- [ ] **Memoria PDF:** Documentar inventario de MVs, tabla de IPs, reglas de cortafuegos y capítulo de Arquitectura [2, 16, 33].

#### 🔹 Semana 3: Requisitos Avanzados (M8–M11)
- [ ] **Nodo Réplica & HA (M11):** Desplegar réplica de Feedback Service en MV4 y configurar balanceo `upstream` en Nginx desde MV1 [2, 19, 27].
- [ ] **Escalabilidad (M10):** Probar y redactar el procedimiento técnico reproducible para añadir nuevos nodos al clúster [2, 27].
- [ ] **Monitorización (M9):** Desplegar agentes y paneles (Prometheus/Grafana) para medir consumo de CPU, RAM, tráfico HTTP y estado de contenedores [2, 29].
- [ ] **Frontend Compilado:** Generar `npm run build` y publicar estáticos finales en Nginx [2, 32].
- [ ] **Memoria PDF:** Integrar capturas de Swagger, esquemas de BBDD y apartados de Automatización, Monitorización y Escalado [2, 34].

#### 🔹 Semana 4: Estabilización, Pruebas de Carga y Vídeo Demo
- [ ] **Congelación de Código:** Congelar cambios en infraestructura, red y backend para garantizar la estabilidad [2, 17, 22].
- [ ] **Pruebas de Estrés & Resiliencia (M11):** Simular caída de nodo en vivo (apagar MV2) y verificar que la MV4 mantiene el servicio activo [2, 19, 27].
- [ ] **Precarga de Datos:** Cargar conjunto completo de datos realistas (grados, asignaturas US y reseñas) para la demo [2, 25].
- [ ] **Vídeo de Demostración (Máx. 10 min):** Grabar y editar la demo funcional de la web y la prueba de caída de nodo [2, 32, 34].
- [ ] **Borrador de Memoria:** Completar la redacción íntegra de la Memoria en PDF [2, 34].

#### 🔹 Semana 5: Cierre, Vídeo Teórico, Entrega y Defensa
- [ ] **Vídeo de Presentación (Máx. 20 min):** Grabar las intervenciones de 2-3 min por miembro y montar el vídeo de presentación teórica [2, 34].
- [ ] **Control de Plagio & PDF:** Verificar que el texto sea seleccionable y que el índice de plagio sea `< 30%` [11, 34].
- [ ] **Entrega Final (13 de Diciembre - 23:59):** Subir a Enseñanza Virtual la Memoria PDF, PDF de Diapositivas, los 2 Vídeos y los Scripts/Código limpios [1, 11, 34].
- [ ] **Defensa Presencial (17 de Diciembre):** Presentación y turno de preguntas del tribunal (10 min) [1, 11].

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
