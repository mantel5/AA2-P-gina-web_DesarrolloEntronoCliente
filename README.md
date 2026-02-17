### Pasos

1.  Abrir una terminal en la raíz del proyecto.
2.  Ejecutar el siguiente comando:

```bash
docker-compose up --build
```

3.  Acceder a la aplicación en: `http://localhost:8080`
4.  El backend estará disponible en: `http://localhost:3000`

## Estructura del Proyecto

- `/frontend`: Código fuente de la aplicación Vue 3.
- `/backend`: API REST con Node.js y Express.
- `docker-compose.yml`: Orquestación de contenedores.

## Funcionalidades

- **Autenticación**: Registro y Login con JWT.
- **Gestión de Productos**: CRUD completo con imágenes y asignación de categoría.
- **Gestión de Categorías**: CRUD completo.
- **Dashboard**: Vista general del administrador.
