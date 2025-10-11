# 🚀 Gestor de Tareas Personales: Centrado en el Humano

## 🎯 Descripción del Proyecto

El **Gestor de Tareas Personales** es una aplicación web full-stack diseñada bajo los principios del **Diseño Centrado en el Humano (DCH)**. A diferencia de las herramientas tradicionales complejas, este proyecto prioriza la **simplicidad, la claridad visual y la eficiencia**.

El objetivo es crear una experiencia fluida donde el usuario pueda crear, organizar y completar tareas rápidamente, cumpliendo estrictamente con los requisitos de usabilidad, incluyendo:

* **Ley de Hick:** Minimizar el tiempo de toma de decisiones, garantizando que las tareas se creen en **menos de tres pasos**.
* **Ley de Fitts:** Botones de acción clave (ej. `+ Agregar Tarea`) grandes y fácilmente accesibles.
* **Ley de Jakob:** Uso de patrones de diseño e íconos universales (check, papelera) para la consistencia.

## 🛠️ Tecnologías Utilizadas

Este proyecto utiliza una arquitectura **Monorepo** (Frontend y Backend separados) para una mejor escalabilidad y mantenimiento.

| Componente | Tecnología | Versión |
| :--- | :--- | :--- |
| **Frontend** | React.js | ^18.x (Vite) |
| **Estilos** | Tailwind CSS (Sugerido) | |
| **Backend** | Node.js / Express | ^4.x |
| **Base de Datos** | MongoDB (NoSQL) | (Mongoose) |
| **Control de Versiones** | Git / GitHub | |

## 🏗️ Arquitectura Lógica

La aplicación sigue un modelo de tres capas que se comunica mediante una API RESTful:

1.  **Capa de Presentación (Frontend):** Desarrollada con React, gestiona la interfaz y las interacciones del usuario.
2.  **Capa de Servidor (Backend):** Desarrollada con Node.js y Express, aloja la lógica de negocio, la autenticación y los controladores.
3.  **Capa de Persistencia (Base de Datos):** Implementada con MongoDB, gestiona el almacenamiento de tareas y categorías.

## ⚙️ Configuración y Ejecución Local

Sigue estos pasos para poner en marcha el proyecto en tu entorno local.

### 1. Clonación del Repositorio

```bash
git clone [https://github.com/JesusAcst/gestor-tareas-personales.git](https://github.com/JesusAcst/gestor-tareas-personales.git)
cd gestor-tareas-personales
````

### 2\. Configuración del Backend

```bash
# Navegar a la carpeta del servidor
cd backend

# Instalar dependencias
npm install

# Crear el archivo de configuración .env (requiere la cadena de conexión a MongoDB)
# TOUCH .env (en Windows) o touch .env (en Linux/Mac)

# Ejecutar el servidor (Comando por definir en la Fase 2)
# npm run dev
```

### 3\. Configuración del Frontend

```bash
# Navegar a la carpeta del cliente
cd ../frontend

# Instalar dependencias
npm install

# Ejecutar la aplicación de desarrollo
npm run dev
```

### 4\. Variables de Entorno

El Backend requiere el archivo `.env` en la carpeta `/backend` con la siguiente estructura:

```
MONGO_URI=tu_cadena_de_conexion_a_mongodb
PORT=5000
```

## 🗺️ Módulos Principales (Flujos de Usabilidad)

El diseño se centra en la facilidad de acceso a las cuatro funciones clave:

| Módulo | Descripción | Interacción Clave |
| :--- | :--- | :--- |
| **Dashboard** | Vista principal de tareas pendientes y próximas. | Botón **FAB "+"** para una creación inmediata. |
| **Creación Rápida** | Formulario modal para añadir una nueva tarea. | **Ley de Hick:** Campos mínimos (Título, Prioridad, Categoría). |
| **Edición/Detalles** | Modal al hacer clic en una tarea para ver/modificar detalles. | Permite la edición en el mismo contexto sin cambiar de pantalla. |
| **Categorías** | Gestión de etiquetas con asignación de **color** para claridad visual. | Garantiza la organización y el filtrado avanzado. |

## 🧪 Pruebas y Control de Calidad

El proyecto incluye pruebas en las siguientes áreas:

  * **Pruebas Unitarias/Integración:** Uso de Jest/Vitest para validar la lógica del servidor y los componentes de React.
  * **Pruebas de Usabilidad:** Evaluación directa del flujo del usuario para confirmar que se cumplen las leyes de DCH y los requisitos de usabilidad.

-----

## 🧑‍💻 Contribución

Si deseas contribuir, por favor, sigue el flujo estándar de Git:

1.  Crea una rama (`git checkout -b feature/nueva-funcionalidad`).
2.  Realiza tus cambios y haz *commit* (` git commit -m "feat: [Descripción]"  `).
3.  Sube la rama (`git push origin feature/nueva-funcionalidad`).
4.  Abre un Pull Request.

