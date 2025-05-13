# TutorMatch - Plataforma de Tutoría Académica

<p align="center">
  Plataforma integral para conectar estudiantes con tutores, facilitando el aprendizaje personalizado.
</p>

## Descripción

TutorMatch es una aplicación backend desarrollada con NestJS que proporciona una API RESTful para conectar estudiantes con tutores. La plataforma permite la gestión de perfiles, cursos, sesiones de tutoría, y facilita la comunicación entre tutores y estudiantes.

## Características

- **Gestión de perfiles**: Usuarios pueden registrarse como estudiantes o tutores
- **Gestión de cursos**: Catálogo de cursos disponibles para tutorías
- **Sesiones de tutoría**: Programación y gestión de sesiones de tutoría
- **Materiales de estudio**: Subida y descarga de materiales para las sesiones
- **Sistema de reseñas**: Calificaciones y comentarios de las sesiones de tutoría
- **Almacenamiento de archivos**: Gestión de avatares y materiales educativos

## Estructura del proyecto

La aplicación sigue una arquitectura hexagonal (puertos y adaptadores) con los siguientes módulos principales:

- **Auth**: Autenticación y autorización de usuarios
- **Profiles**: Gestión de perfiles de usuarios
- **Courses**: Gestión de cursos académicos
- **Semesters**: Gestión de semestres académicos
- **Tutoring**: Gestión de sesiones de tutoría
- **Storage**: Almacenamiento de archivos en Supabase

## Requisitos

- Node.js (v16 o superior)
- npm o yarn
- Supabase (para base de datos y almacenamiento)

## Instalación

```bash
# Clonar el repositorio
$ git clone https://github.com/SkillSwapINC-Funda/TutorMatch-Backend.git

# Entrar al directorio
$ cd tutormatch-platform

# Instalar dependencias
$ npm install
```

## Configuración del entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```
SUPABASE_URL="YOUR_KEY"
SUPABASE_KEY="YOUR_KEY"
SEED_DATABASE=true
FRONTEND_URL="YOUR_KEY"
STRIPE_SECRET_KEY="YOUR_KEY"
```

## Ejecución

```bash
# Modo desarrollo
$ npm run start:dev

# Modo producción
$ npm run start:prod
```

## Documentación API

La documentación de la API está disponible a través de Swagger UI en la ruta `/swagger-ui` una vez que la aplicación esté en ejecución.

## Pruebas

```bash
# Pruebas unitarias
$ npm run test

# Pruebas e2e
$ npm run test:e2e

# Cobertura de pruebas
$ npm run test:cov
```

## Despliegue

Para desplegar la aplicación en producción, puedes utilizar servicios como:

- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- DigitalOcean App Platform

## Contribuir

1. Haz un fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Add some amazing feature'`)
4. Sube tus cambios (`git push origin feature/amazing-feature`)
5. Abre un Pull Request
