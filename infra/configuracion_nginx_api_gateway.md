server {
    # Escucha tráfico web HTTP normal por el puerto 80 (IPv4 e IPv6)
    listen 80 default_server;
    listen [::]:80 default_server;

    # Carpeta donde se guardarán los archivos compilados de React (Frontend)
    root /var/www/html;
    index index.html;

    # Responde a cualquier dominio o IP que llegue al Nodo 1
    server_name _;

    # 1. FRONTEND (React SPA)
    # Si el usuario recarga una ruta interna, entrega index.html en vez de dar 404
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 2. MICROSERVICIO AUTH -> Redirige internamente al Nodo 2 (puerto 8001)
    location /api/auth/ {
        proxy_pass http://192.168.120.58:8001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 3. MICROSERVICIO ACADEMIC -> Redirige internamente al Nodo 2 (puerto 8002)
    location /api/academic/ {
        proxy_pass http://192.168.120.58:8002/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 4. MICROSERVICIO FEEDBACK -> Redirige internamente al Nodo 2 (puerto 8003)
    location /api/feedback/ {
        proxy_pass http://192.168.120.58:8003/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}