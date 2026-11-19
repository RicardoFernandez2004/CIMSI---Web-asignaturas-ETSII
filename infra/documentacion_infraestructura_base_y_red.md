# Infraestructura Base, Red y API Gateway (Pareja 1)

## 1. Inventario de Máquinas Virtuales (Subred `192.168.120.0/24`)
| Nodo | Hostname | IP Privada | Rol / Servicios | Puertos Abiertos (`ufw`) |
| :--- | :--- | :--- | :--- | :--- |
| **Nodo 1** | `nodo1` | `192.168.120.54` | API Gateway (Nginx) + Frontend estático (React) | `22` (SSH), `80` (HTTP), `443` (HTTPS) |
| **Nodo 2** | `nodo2` | `192.168.120.58` | Backend Principal (Microservicios FastAPI) | `22` (SSH), subred `192.168.120.0/24` |
| **Nodo 3** | `nodo3` | `192.168.120.62` | Persistencia (Bases de datos MariaDB) | `22` (SSH), `3306-3308` (solo desde `.58` y `.66`), subred |
| **Nodo 4** | `nodo4` | `192.168.120.66` | Nodo Réplica / Alta Disponibilidad (M11) | `22` (SSH), subred `192.168.120.0/24` |

---

## 2. Aprovisionamiento Base (Ejecutado en los 4 nodos)
Actualización de paquetes e instalación de Docker Engine y Docker Compose:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-v2
sudo systemctl enable --now docker && sudo usermod -aG docker $USER
```

---

## 3. Configuración del Cortafuegos (`ufw`)

### Nodo 1 (`192.168.120.54` — API Gateway público)
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### Nodos 2, 3 y 4 (Red interna privada)
```bash
sudo ufw allow 22/tcp
sudo ufw allow from 192.168.120.0/24
sudo ufw --force enable
```

### Reglas específicas de MariaDB en Nodo 3 (`192.168.120.62`)
Acceso restringido al rango de puertos `3306:3308` (`auth-db` en `3306`, `academic-db` en `3307` y `feedback-db` en `3308`) únicamente desde los nodos de Backend:
```bash
sudo ufw allow from 192.168.120.58 to any port 3306:3308 proto tcp
sudo ufw allow from 192.168.120.66 to any port 3306:3308 proto tcp
```

---

## 4. API Gateway (Nginx en Nodo 1)
- **Instalación:**
```bash
sudo apt install -y nginx && sudo systemctl enable --now nginx
```
- **Archivo de configuración:** Alojado en `/etc/nginx/sites-available/default` (ver copia en `infra/nginx-default.conf`).
- **Validación y pruebas:**
  * Sintaxis comprobada mediante `sudo nginx -t` (`syntax is ok`, `test is successful`).
  * Ruta raíz `http://localhost/` verificada con `curl -I` (`200 OK`).
  * Enrutamiento API `http://localhost/api/auth/` verificado con `curl -I` (`502 Bad Gateway` esperado mientras los contenedores FastAPI del Nodo 2 no estén levantados).