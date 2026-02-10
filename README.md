# TechInventory - Proyecto Vue 3 (2ª Evaluación)

Aplicación de Gestión de Inventario de Productos Tecnológicos desarrollada con Vue 3, Vuetify y Node.js.

## Credenciales de Prueba

Para acceder al panel de administración, puedes registrar un nuevo usuario o usar las siguientes credenciales (si ya existen en la BD):

- **Usuario**: `admin`
- **Contraseña**: `123456`

> **Nota**: Al iniciar la aplicación por primera vez, la base de datos estará vacía. Debes registrarte primero en `/auth/register`.

## Cómo Ejecutar

La aplicación está dockerizada para facilitar su despliegue.

### Requisitos

- Docker y Docker Compose instalados.

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
