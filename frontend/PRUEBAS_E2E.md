Hacerlas con la web desplegada en la MV 1 y el backend levantado.


 1 Registrar un usuario nuevo. Entra directamente a Asignaturas 
 2 Cerrar sesión e iniciar sesión con ese usuario. Entra a Asignaturas
 3 Iniciar sesión con contraseña incorrecta. "Correo o contraseña incorrectos" 
 4 Recargar la página con sesión abierta. Se mantiene la sesión
 5 Filtrar asignaturas por grado y por curso. La lista y el contador cambian
 6 Entrar a una asignatura y publicar una reseña. Aparece en la lista y se actualiza la nota media
 7 Reseñar la misma asignatura otra vez. "Ya has valorado esta asignatura" 
| 8 | Publicar una reseña anónima. No aparece el nombre del autor

Cómo generar el build
    cd frontend
    npm install
    npm run build

Creo la carpeta `dist/`, que se entrega al Integrante 2 para publicarla en la MV 1.
