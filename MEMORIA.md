# Memoria del Proyecto: Migración de Frontend E-Commerce a Svelte 5 (PW2)

## 1. Introducción y Objetivos
Esta memoria documenta exclusivamente el trabajo desarrollado para la asignatura de Programación Web 2 (PW2), que consistió en la **migración completa y reescritura desde cero** del frontend del proyecto "Regma", abandonando tecnologías anteriores (React) en favor de un stack moderno basado en **Svelte 5** y **Vite**.

El objetivo fundamental ha sido construir una Arquitectura de Página Única (SPA) de altísimo rendimiento, que recupere la rica y compleja identidad visual lograda anteriormente (PW1), sumando además reactividad avanzada, gestión de rutas fluida, y un sistema de administración robusto sin recurrir a dependencias de estado pesadas.

---

## 2. Puntos Trabajados y Soluciones Implementadas

### 2.1. Arquitectura Base y Reactividad (Runes)
Se ha configurado un ecosistema moderno con Svelte 5, estructurado bajo directorios semánticos (`pages/`, `components/`, `services/`, `stores/`, `styles/`).
*   **Gestión de Estado Ligera:** En lugar de sistemas como Redux o Context API, se implementó el nuevo sistema de reactividad (Runas).
    *   Se desarrollaron Stores globales (`auth.svelte.js`, `router.svelte.js`) haciendo uso intensivo de **`$state`** para tener una única fuente de verdad.
    *   Se han aprovechado las runas **`$derived`** y **`$derived.by`** para realizar cálculos complejos, como el agrupado y filtrado síncrono de categorías en el Catálogo en el cliente, evitando saturar el backend con múltiples peticiones de búsqueda.
    *   Se sustituyeron los antiguos export lets por la moderna directiva de props funcionales **`$props()`**.

### 2.2. Enrutamiento Personalizado SPA
*   **Solución Local:** Al no haber un SvelteKit de base, se ha construido un Router cliente que observa los cambios del `window.location`.
*   **Rutas Protegidas:** Mediante el uso reactivo de **`$effect()`**, se ha implementado un sistema que evalúa instintivamente los tokens almacenados en JS y en `localStorage`. Si un usuario que no tiene permisos de administración intenta acceder a un Dashboard protegido o añadir productos al carrito sin sesión, es instantáneamente expulsado y redirigido a `/login`.

### 2.3. Migración de la Identidad Visual (Pixel-Perfect)
Uno de los mayores retos (y logros) ha sido adaptar visualmente la Aplicación:
*   **Estéticas Complejas:** Se portó exitosamente el estilo inmersivo, extrayendo las mecánicas de "Partículas Procedimentales Flotantes" presentes ahora en las vistas de Login y Registro. El Landing Page sigue conservando sus fondos desenfocados, scroll asíncrono y video de fondo Hero (`hero-video-bg`).
*   **Interactividad Dinámica UX:** Implementamos novedades exclusivas orientadas a la experiencia ("UX Polish"), destacando la inclusión de un **Efecto Linterna (Glow/Flashlight)** sutil en la vista del Catálogo de Productos (`pages/Productos.svelte`). Mediante la directiva `onmousemove` de Svelte, un orbe luminoso se desliza radialmente persiguiendo el ratón por detrás de las tarjetas 3D en la capa de fondo (`z-index: 0`).
*   **Diseño "Mobile First":** Absolutamente todas las pantallas, incluyendo las mallas de los paneles de administrador, se encuentran protegidas contra la ruptura de resolución gracias al amplio uso de breakpoints (`@media max-width`).
*   **Navegación Intuitiva:** Se sustituyeron los enlaces de la estructura previa por botones traslúcidos (*frosted glass* con `backdrop-filter`) flotantes en las esquinas, que permiten interconectar coherentemente páginas estáticas (Login -> Home, Registro -> Home, Cliente -> Productos).

### 2.4. Refactorización del Panel de Administración (CRUDs)
Se portó el complejo panel de mando diseñado anteriormente a un `AdminDashboard.svelte` con enlaces directos para la visualización e inyección condicional de paneles. Adicionalmente, todo el abanico de Gestión ha sido encapsulado en Svelte:
*   **Gestión de Productos (`pages/admin/GestionProductos.svelte`)**: Completamente enlazado a la API `GET`, `POST`, `PUT`, `DELETE`.
*   **Gestión de Sabores y Variantes (`GestionVariantes.svelte`)**: Abordado con un enfoque minimalista que expone modales ágiles para el control inmediato.
*   **Gestión de Formatos (`GestionFormatos.svelte`)**: Extensión complementaria para administrar capacidades y unidades, todo funcionando de bajo impacto de latencia usando `await fetch()`.

### 2.5. Autenticación, JWT y Registro
*   El backend responde con tokens validables, y nuestro `auth.js` intercepta cada inicio de sesión, parsea al usuario para ver qué rol ostenta, y se enruta de forma segura.
*   En esta entrega **se incorporó desde cero** una nueva página completa `/registro` para dar de alta clientes de comercio en tiempo real, replicando todas las normativas exigentes de las contraseñas ("mayúsculas, números") evaluadas estéticamente dentro del front.

---

## 3. Conclusión
La migración de una solución a escala como la previa, hacia un framework tan joven como Svelte 5 (Vite), ha permitido pulir la base de la programación funcional e imperativa. Se ha obtenido finalmente una solución mucho más cohesiva en el DOM, donde componentes visuales complejos interaccionan orgánicamente con un motor e-commerce completo.
