# Especificaciones del Frontend: Buzón de Sugerencias

## Introducción

Este documento detalla la arquitectura, diseño y flujo de la aplicación frontend para el "Buzón de Sugerencias Público". La aplicación permite a los visitantes enviar sugerencias y ver las aprobadas, mientras que un administrador puede iniciar sesión para gestionar todas las sugerencias.

## 1. Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
/
├── public/
│   └── (Archivos estáticos si los hubiera, ej: favicon.ico)
├── src/
│   ├── components/
│   │   ├── icons/
│   │   │   ├── CheckIcon.tsx
│   │   │   ├── ShieldCheckIcon.tsx
│   │   │   └── TrashIcon.tsx
│   │   ├── AdminLoginModal.tsx
│   │   ├── ConfirmationModal.tsx
│   │   ├── Header.tsx
│   │   ├── SuggestionForm.tsx
│   │   ├── SuggestionItem.tsx
│   │   └── SuggestionList.tsx
│   ├── App.tsx
│   ├── constants.ts
│   ├── index.tsx
│   └── types.ts
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── (tsconfig.json)
└── (tailwind.config.js)
└── SPECIFICATIONS.md (este archivo)
```

**Descripción de Archivos y Carpetas Clave:**

*   **`index.html`**: Punto de entrada HTML principal, carga Tailwind CSS y el script de la aplicación.
*   **`metadata.json`**: Metadatos de la aplicación.
*   **`src/index.tsx`**: Punto de entrada de la aplicación React, renderiza el componente `App`.
*   **`src/App.tsx`**: Componente raíz de la aplicación, maneja el estado global, la lógica de la API y el enrutamiento de vistas (implícito).
*   **`src/components/`**: Contiene todos los componentes reutilizables de React.
    *   **`icons/`**: Componentes SVG de iconos.
    *   **`AdminLoginModal.tsx`**: Modal para el inicio de sesión del administrador.
    *   **`ConfirmationModal.tsx`**: Modal genérico para confirmaciones de acciones (ej. eliminación).
    *   **`Header.tsx`**: Encabezado de la aplicación, muestra el título y el botón de login/logout de admin.
    *   **`SuggestionForm.tsx`**: Formulario para que los usuarios envíen nuevas sugerencias.
    *   **`SuggestionItem.tsx`**: Muestra una única sugerencia, con opciones de admin si aplica.
    *   **`SuggestionList.tsx`**: Muestra una lista de sugerencias.
*   **`src/types.ts`**: Definiciones de tipos TypeScript (ej. `Suggestion`, `SuggestionStatus`).
*   **`src/constants.ts`**: Constantes globales de la aplicación (ej. `API_BASE_URL`, `LOCAL_STORAGE_KEY_ADMIN_TOKEN`).

## 2. Componentes Principales y su Jerarquía

La aplicación se compone de varios componentes reutilizables:

*   **`App`**: Orquestador principal.
    *   **`Header`**: Muestra el título y el estado de login/logout del admin.
    *   **`SuggestionForm`**: (Visible para todos) Permite enviar nuevas sugerencias.
    *   **`SuggestionList`**: Muestra las sugerencias.
        *   **`SuggestionItem`**: Renderiza cada sugerencia individualmente.
    *   **`AdminLoginModal`**: Modal para el inicio de sesión del administrador.
    *   **`ConfirmationModal`**: Modal para confirmar acciones (ej. borrar).

**Diagrama de Jerarquía de Componentes (Simplificado):**

```
App
├── Header
├── SuggestionForm (si no es admin o si es admin y el modal de login está abierto)
├── SuggestionList
│   └── SuggestionItem (múltiples instancias)
├── AdminLoginModal (condicional)
└── ConfirmationModal (condicional)
```

## 3. Flujo de Datos (Alto Nivel)

1.  **Carga Inicial:**
    *   `App` verifica `localStorage` por `adminToken`.
    *   Si hay token, se considera admin logueado (backend debe verificar el token). Se solicitan `/api/suggestions/admin`.
    *   Si no hay token, se solicitan `/api/suggestions/public`.
    *   Los datos de sugerencias se almacenan en el estado de `App` y se pasan a `SuggestionList`.
2.  **Envío de Sugerencia (Usuario):**
    *   Usuario interactúa con `SuggestionForm`.
    *   Al enviar, `SuggestionForm` llama a `handleSuggestionSubmit` en `App`.
    *   `App` realiza una llamada `POST` a `/api/suggestions`.
    *   Tras éxito/error, `App` recarga las sugerencias y actualiza la UI.
3.  **Login de Admin:**
    *   Usuario hace clic en "Admin Login" en `Header`.
    *   `App` muestra `AdminLoginModal`.
    *   Admin ingresa contraseña. `AdminLoginModal` llama a `handleAdminLogin` en `App`.
    *   `App` realiza `POST` a `/api/auth/login`.
    *   Si es exitoso, el backend devuelve un token. `App` guarda el token en `localStorage` y estado, actualiza `isAdminLoggedIn`, cierra el modal y recarga las sugerencias como admin.
4.  **Acciones de Admin (Aprobar/Eliminar):**
    *   Admin interactúa con botones en `SuggestionItem`.
    *   `SuggestionItem` llama a `handleApproveSuggestion` o `handleDeleteSuggestion` en `App`.
    *   `App` realiza llamadas `PUT` o `DELETE` a los endpoints correspondientes (`/api/suggestions/admin/:id/approve` o `/api/suggestions/admin/:id`).
    *   Tras éxito/error, `App` recarga las sugerencias y actualiza la UI.
5.  **Logout de Admin:**
    *   Admin hace clic en "Admin Logout" en `Header`.
    *   `App` llama a `handleAdminLogout`.
    *   `App` (opcionalmente) llama `POST` a `/api/auth/logout`.
    *   `App` elimina el token de `localStorage` y estado, actualiza `isAdminLoggedIn` y recarga las sugerencias como público.

**Almacenamiento:**
*   **`localStorage`**: Se utiliza para persistir el `adminToken` entre sesiones.

## 4. Wireframes / Vistas Principales

(Representaciones textuales simplificadas)

**A. Vista Pública / Visitante:**

```
+-------------------------------------------------------------------+
| [Public Suggestion Box]                     [Admin Login Button]  | Header
+-------------------------------------------------------------------+
|                                                                   |
| [Got a Suggestion?]                                               | SuggestionForm
| [Textarea para la sugerencia...]                                  |
| [Submit Suggestion Button]                                        |
|                                                                   |
+-------------------------------------------------------------------+
|                                                                   |
| [Approved Suggestions]                                            | SuggestionList
| +---------------------------------------------------------------+ |
| | [Texto de la sugerencia aprobada 1]           [Submitted: DD/MM/YYYY] | SuggestionItem
| +---------------------------------------------------------------+ |
| | [Texto de la sugerencia aprobada 2]           [Submitted: DD/MM/YYYY] | SuggestionItem
| +---------------------------------------------------------------+ |
| ...                                                               |
|                                                                   |
+-------------------------------------------------------------------+
| © Suggestion Box App                                              | Footer
+-------------------------------------------------------------------+
```

**B. Vista de Administrador (Logueado):**

```
+-------------------------------------------------------------------+
| [Public Suggestion Box]                    [Admin Logout Button]  | Header
+-------------------------------------------------------------------+
|                                                                   |
| [All Suggestions]                                                 | SuggestionList
| +---------------------------------------------------------------+ |
| | [Texto de sugerencia 1 (PENDING)]        [Submitted: DD/MM/YYYY] | SuggestionItem
| |                                     [Approve Button] [Delete Button]  |
| +---------------------------------------------------------------+ |
| | [Texto de sugerencia 2 (APPROVED)]       [Submitted: DD/MM/YYYY] | SuggestionItem
| |                                                   [Delete Button]  |
| +---------------------------------------------------------------+ |
| ...                                                               |
|                                                                   |
+-------------------------------------------------------------------+
| © Suggestion Box App                                              | Footer
+-------------------------------------------------------------------+
```

**C. Modal de Login de Administrador:**

```
+----------------------------------------+
|           Admin Login                  |
|                                        |
| [Password Input Field ]                |
|                                        |
| [Error Message (if any)]               |
|                                        |
| [Cancel Button]      [Login Button]    |
+----------------------------------------+
```

**D. Modal de Confirmación (Ej. para Eliminar):**

```
+----------------------------------------+
|       Delete Suggestion?               |
|                                        |
| Are you sure you want to delete this   |
| suggestion? This action cannot be      |
| undone.                                |
|                                        |
| [Cancel Button]      [Confirm Delete Button] |
+----------------------------------------+
```

## 5. Flujos de Usuario

**Flujo 1: Visitante Envía una Sugerencia**

1.  **Inicio**: El visitante llega a la página principal.
2.  **Ver**: El visitante ve el encabezado, el formulario para enviar sugerencias y la lista de sugerencias ya aprobadas.
3.  **Escribir**: El visitante escribe su idea en el área de texto del `SuggestionForm`.
4.  **Enviar**: El visitante hace clic en el botón "Submit Suggestion".
    *   **Frontend**: Se muestra un indicador de carga. Se realiza una llamada API (`POST /api/suggestions`) con el texto.
    *   **Backend**: Recibe la sugerencia, la guarda con estado "PENDING" y un ID único. Responde con la sugerencia creada o un estado de éxito.
5.  **Feedback**:
    *   **Éxito**: El indicador de carga desaparece. El formulario se limpia. La lista de sugerencias (si es admin) se actualiza para mostrar la nueva sugerencia pendiente. Se puede mostrar un mensaje de "Sugerencia enviada con éxito".
    *   **Error**: Se muestra un mensaje de error (ej. "No se pudo enviar la sugerencia").

**Flujo 2: Administrador Gestiona Sugerencias**

1.  **Inicio**: El administrador llega a la página principal.
2.  **Acceder a Login**: El administrador hace clic en el botón "Admin Login" en el `Header`.
3.  **Modal de Login**: Se muestra el `AdminLoginModal`.
4.  **Ingresar Credenciales**: El administrador introduce la contraseña.
5.  **Autenticar**: El administrador hace clic en el botón "Login".
    *   **Frontend**: Se muestra un indicador de carga. Se realiza una llamada API (`POST /api/auth/login`) con la contraseña.
    *   **Backend**: Valida la contraseña. Si es correcta, genera un token JWT y lo devuelve. Si no, devuelve un error.
6.  **Acceso Concedido / Denegado**:
    *   **Éxito**: El token se guarda en `localStorage`. El modal se cierra. El `Header` cambia para mostrar "Admin Logout". La lista de sugerencias (`SuggestionList`) se recarga para mostrar TODAS las sugerencias (pendientes y aprobadas), obtenidas de `/api/suggestions/admin`. Cada `SuggestionItem` ahora muestra botones de "Approve" (para pendientes) y "Delete".
    *   **Error**: El modal de login muestra un mensaje de error (ej. "Contraseña incorrecta").
7.  **Gestionar Sugerencias**:
    *   **Aprobar Sugerencia**:
        1.  Admin hace clic en "Approve" en una sugerencia pendiente.
        2.  **Frontend**: Indicador de carga en el item. Llamada `PUT /api/suggestions/admin/:id/approve`.
        3.  **Backend**: Cambia el estado de la sugerencia a "APPROVED". Responde con la sugerencia actualizada o éxito.
        4.  **Frontend**: La lista se actualiza, la sugerencia ahora aparece como aprobada.
    *   **Eliminar Sugerencia**:
        1.  Admin hace clic en "Delete" en cualquier sugerencia.
        2.  **Frontend**: Se muestra `ConfirmationModal` ("¿Está seguro?").
        3.  Admin confirma.
        4.  **Frontend**: Indicador de carga. Llamada `DELETE /api/suggestions/admin/:id`.
        5.  **Backend**: Elimina la sugerencia. Responde con éxito.
        6.  **Frontend**: La lista se actualiza, la sugerencia desaparece. El modal de confirmación se cierra.
8.  **Cerrar Sesión (Logout)**:
    1.  Admin hace clic en "Admin Logout" en el `Header`.
    2.  **Frontend**: (Opcional) Llamada `POST /api/auth/logout` para invalidar el token en el servidor. Se elimina el token de `localStorage`. El estado `isAdminLoggedIn` se pone a `false`.
    3.  La vista vuelve a ser la pública: el `Header` muestra "Admin Login", y la `SuggestionList` solo muestra sugerencias aprobadas.

## 6. Endpoints del Backend Esperados (Resumen)

El frontend espera que el backend exponga los siguientes endpoints. Para detalles sobre cuerpos de solicitud y respuestas esperadas, consultar los comentarios `// JULES_BACKEND_INTEGRATION:` en `src/App.tsx`.

*   **Autenticación:**
    *   `POST /api/auth/login`
        *   Body: `{ password: "admin_password" }`
        *   Respuesta Exitosa: `{ token: "jwt_token" }`
    *   `POST /api/auth/logout` (Opcional, para invalidación de token en servidor)
        *   Headers: `Authorization: Bearer <token>`
        *   Respuesta Exitosa: `200 OK` o `204 No Content`
*   **Sugerencias:**
    *   `GET /api/suggestions/public`
        *   Respuesta Exitosa: `Suggestion[]` (solo sugerencias con `status: 'APPROVED'`)
    *   `GET /api/suggestions/admin`
        *   Headers: `Authorization: Bearer <token>`
        *   Respuesta Exitosa: `Suggestion[]` (todas las sugerencias)
    *   `POST /api/suggestions`
        *   Body: `{ text: "texto de la sugerencia" }`
        *   Respuesta Exitosa: `Suggestion` (la sugerencia recién creada, con id, status PENDING, submittedAt)
    *   `PUT /api/suggestions/admin/:id/approve`
        *   Headers: `Authorization: Bearer <token>`
        *   Respuesta Exitosa: `Suggestion` (la sugerencia actualizada con status APPROVED) o `200 OK / 204 No Content`
    *   `DELETE /api/suggestions/admin/:id`
        *   Headers: `Authorization: Bearer <token>`
        *   Respuesta Exitosa: `200 OK` o `204 No Content`

**Formato de `Suggestion` esperado del backend:**
```typescript
interface Suggestion {
  id: string;         // Generado por el backend
  text: string;
  status: 'PENDING' | 'APPROVED'; // Controlado por el backend
  submittedAt: number; // Timestamp Unix (milisegundos) generado por el backend
}
```

## 7. Tecnologías Utilizadas

*   **React 19** (con Hooks)
*   **TypeScript**
*   **Tailwind CSS** (para estilizado)
*   **Heroicons** (para iconos SVG)
*   **ESM.sh** (para la importación de módulos en el navegador sin build step local)

## 8. Consideraciones Adicionales

*   **Manejo de Errores**: La aplicación muestra errores de API generales y errores específicos de login en la UI.
*   **Estados de Carga**: Se utilizan indicadores visuales (spinners, texto en botones) durante las llamadas API para mejorar la UX.
*   **Accesibilidad (ARIA)**: Se han utilizado atributos ARIA básicos. Se recomienda una revisión más exhaustiva para cumplimiento completo.
*   **Responsividad**: La aplicación utiliza clases de Tailwind CSS para asegurar un diseño responsivo en diferentes tamaños de pantalla.
*   **Seguridad**: El token de administrador se envía en el header `Authorization` como `Bearer token`. La validación de la contraseña y la generación/verificación del token son responsabilidad del backend. No se almacena la contraseña en el frontend.

---
Este documento debería proporcionar una base sólida para la integración con el backend.
Para cualquier pregunta específica sobre la implementación de un endpoint, por favor referirse a los comentarios `JULES_BACKEND_INTEGRATION` en el archivo `src/App.tsx`.
```