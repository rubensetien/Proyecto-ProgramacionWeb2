# PW2 - Frontend Svelte 5

Este repositorio contiene la entrega del frontend de la asignatura Programación Web 2 (PW2), desarrollado íntegramente en Svelte 5 (Vite) consumiendo la API proporcionada en la carpeta `backend`.

## Instalación y Ejecución

Para levantar el ecosistema completo del proyecto en entorno de desarrollo local, sigue estos pasos desde la raíz del proyecto.

### 1. Iniciar el Backend (Modo Desarrollo)

Debes tener MongoDB en ejecución localmente (o un clúster de Mongo atlas en la variable `MONGO_URI` del entorno del backend).

```bash
cd backend
npm install
# Levantar el servidor en el puerto 3001
npm run dev
```

> **Nota:** El archivo `.env` en la raíz de `backend` ha sido configurado para conectarse a **MongoDB Atlas** (`mongodb+srv://<usuario>:<password>@cluster0.icpkptx.mongodb.net/catalogoRegma?retryWrites=true&w=majority`) y escuchar en el puerto `3001`.

### 1.5 Interfaz Gráfica Heredada de PW1 y Mejoras
El diseño del nuevo proyecto en Svelte 5 ha **recuperado e integrado con éxito** el diseño de interfaz de usuario de PW1 (incluidas animaciones procedimentales de partículas, tarjetas 3D en la Landing Page, y estilos CSS avanzados) adaptándolos orgánicamente a componentes Svelte.
Además, se ha mejorado sustancialmente el UX con navegación cohesiva cruzada, botones de retroceso flotantes acristalados (frosted glass) y mallas de administración completas para gestionar CRUDS (Productos, Sabores, Formatos).

### 2. Iniciar el Frontend (Svelte 5)

Abre otra terminal desde la raíz del proyecto.

```bash
cd frontend-svelte
npm install
npm run dev
```

El frontend estará disponible en tu navegador en `http://localhost:5173`.

---

## 🛠 Funcionalidades Técnicas: Runas de Svelte 5 Implementadas

Se ha utilizado intensivamente la nueva API Rúnica de Svelte 5 a lo largo de los componentes de la aplicación:

| Runa | Función | Componentes donde se emplea |
|------|---------|-----------------------------|
| **`$state()`** | Manejo reactivo de variables locales y estado global. En los Stores funciona como el único modelo de fuente de verdad para la App. | `src/stores/auth.svelte.js`<br>`src/pages/Login.svelte` (inputs form)<br>`src/pages/Productos.svelte` (lista asíncrona) |
| **`$derived()`** | Calcular valores reactivos a partir de un `$state`. No realiza cálculos ni llamadas innecesarias al servidor. | `src/pages/Productos.svelte` (Búsqueda en el cliente)<br>`src/components/Navigation.svelte` (Cargar usuario activo) |
| **`$effect()`** | Sincronización asíncrona en el ciclo de vida y side-effects como redirecciones protegidas si el token desaparece. | `src/App.svelte` (Llamadas API de hidratación)<br>`src/pages/Perfil.svelte` (Redirect del router SPA) |
| **`$props()`** | Declarar e inyectar atributos a un componente desde su parent. Reemplaza el anterior `export let`. | `src/components/ProductCard.svelte` (Inyección de un producto)<br>`src/components/ProductModal.svelte` |

---

## 🔗 Endpoints del Backend Utilizados

El frontend consume la API del Node.js enviando asíncronamente tokens de **JWT**.

### Productos
- **`GET /api/productos`**: Para listar todo el catálogo completo consumido por `pages/Productos.svelte`.

### Autenticación y Usuarios
- **`POST /api/auth/login`**: Valida credenciales y otorga un JWT, consumido por AuthService desde la ventana de `Login`.
- *(El rol de `usuario` es predeterminado. La respuesta entrega un objeto con id, email, y rol `usuario` que el router en el fontend hidrata para la vista `Perfil`)*.

---

*Nota: La carpeta `frontend` contiene una versión legada en React (de PW1) que ha sido expresamente ignorada para esta entrega de Svelte.*
