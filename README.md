# Better World Challenge

Demo frontend funcional de una plataforma de retos de sostenibilidad.

## Cómo ejecutar

Abre el proyecto mediante un servidor local para que los módulos JavaScript funcionen correctamente. Por ejemplo:

- VS Code + Live Server
- `python -m http.server 5500`

Luego abre `http://localhost:5500/`.

## Credenciales de demostración

### Participantes
- `ashley@demo.local` / `demo`
- `daniel@demo.local` / `demo`
- `sofia@demo.local` / `demo`
- `mateo@demo.local` / `demo`

### Moderador
En `login.html`, usa **“Abrir moderador — modo demo”**.

## Qué funciona en la demo

- Registro de participantes.
- Inicio de sesión.
- Hash SHA-256 para contraseñas de cuentas creadas, únicamente como demostración.
- Dashboard personal.
- Tres desafíos editables en `js/app.js`.
- Selección, vista previa y subida de fotografías.
- Evidencias `pending`, `approved` y `rejected`.
- Moderación manual.
- Comentarios de rechazo.
- Progreso automático 0/3 → 3/3.
- Pantalla final de celebración.
- Dashboard administrativo.
- Estadísticas dinámicas.
- Listado de usuarios.
- Historial de evidencias.
- Búsqueda y filtros.
- Modal de revisión de evidencias y perfil.
- Reinicio de datos de demostración.
- Diseño responsive.

## Limitaciones de esta versión

Esta aplicación NO debe utilizarse como sistema real de autenticación o moderación. `localStorage` se usa para simular la base de datos y guardar temporalmente las fotografías como Data URLs.

Para producción:

1. Firebase Authentication para registro, login y Google OAuth.
2. Firestore para usuarios, desafíos, evidencias, estados y progreso.
3. Firebase Storage para fotografías.
4. Reglas de seguridad de Firebase y validación en servidor.
5. Roles/claims de administrador gestionados en backend, nunca confiando en `localStorage`.
6. Validaciones de tamaño/tipo de archivos también en backend.
7. URLs de Storage en vez de guardar fotografías completas en `localStorage`.

No se incluyen claves privadas ni credenciales secretas.
