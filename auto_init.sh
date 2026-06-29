#!/bin/bash

echo "🚀 Iniciando automatización para: directorio-voluntariados-ve..."

# 1. Crear la estructura de carpetas (Monorepo)
echo "📁 Creando estructura de directorios..."
mkdir -p backend/src
mkdir -p frontend/src
mkdir -p mobile/lib
mkdir -p database/seeds
mkdir -p .github/ISSUE_TEMPLATE

# 2. Crear archivos base vacíos necesarios
echo "📄 Creando archivos de configuración inicial..."
touch backend/README.md
touch frontend/README.md
touch database/schema.sql
touch .env.example

# 3. Crear el .gitignore global
cat << 'EOF' > .gitignore
# Dependencias
node_modules/
.pnpm-store/
/dist
/build

# Variables de entorno y llaves
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.pem
*.key

# Sistemas operativos
.DS_Store
Thumbs.db

# IDEs
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
EOF

# 4. Crear el archivo README.md principal estructurado
cat << 'EOF' > README.md
# 🇻🇪 Directorio Centralizado de Voluntarios Profesionales - VYNTIA


---
## 🚀 Módulos del Sistema
1. **Módulo de Registro:** Captación geográfica estandarizada por Estados, Municipios y Parroquias.
2. **Búsqueda Inteligente:** Directorio optimizado para conexiones inestables o de bajo ancho de banda.
3. **Panel de Moderación:** Control de calidad y validación básica de credenciales profesionales.

## 🛠️ Stack Tecnológico General
- **Frontend Web:** Next.js / React.js (SSR enfocado en velocidad de carga).
- **Base de Datos:** PostgreSQL + PostGIS (Geolocalización).
- **Mobile:** Flutter / React Native (Compilación nativa ligera).

---

## 🤝 ¿Cómo puedes contribuir?

¡Damos la bienvenida a toda la comunidad de tecnología! Necesitamos:
- **Diseñadores UI/UX:** Optimización de flujos Mobile-First para redes 3G/4G.
- **QA / Project Managers:** Gestión de tareas, issues y control de calidad.

### Pasos para iniciar:
1. Haz un **Fork** de este repositorio.
2. Crea una rama para tu característica: `git checkout -b feature/increible-mejora`.
3. Sube tus cambios: `git commit -m 'Añade funcionalidad X'`.
4. Haz un **Push** a tu rama: `git push origin feature/increible-mejora`.
5. Abre un **Pull Request** detallando tus cambios apuntando a la rama `main`.

---

## 📧 Contacto y Coordinación

Si quieres aportar tu talento para generar un impacto real en quienes más lo necesitan, escríbenos directamente a:
📩 **vyntiadev@gmail.com** *Asunto: Voluntariado Código Abierto - [Tu Rol Técnico]*

**Atentamente,**
**Ing. Sebastian Blanca**
*CEO & Lead Developer en VYNTIA*
EOF

# 5. Crear la plantilla para reportes de Bugs en GitHub
cat << 'EOF' > .github/ISSUE_TEMPLATE/bug_report.md
- **Programadores:** Frontend, Backend y Mobile.
---
- **Backend API:** Node.js (NestJS / Express) o PHP (Laravel).
name: 🐛 Reporte de Bug
about: Describe un error para ayudarnos a mejorar la plataforma.

title: '[BUG] '
labels: bug, triage
assignees: ''
---

**Descripción del Bug**
Una descripción clara y concisa de lo que es el error.

**Pasos para reproducirlo**
> **Tu talento puede salvar vidas.** Ante las situaciones de contingencia en Venezuela, la ayuda profesional suele dispersarse en el caos de las redes sociales. Este proyecto pro-bono y de código abierto busca conectar la ayuda humanitaria de forma hiperlocal, directa y sin intermediarios.
1. Ve a '...'

2. Haz clic en '...'
3. Mira el error '...'


**Comportamiento esperado**
¿Qué debería pasar en condiciones normales?

**Capturas de pantalla / Logs**
Si aplica, añade capturas o errores de la consola.
EOF


# 6. Inicializar repositorio de Git localmente
echo "🔧 Inicializando repositorio Git..."
git init
git add .
git commit -m "chore: estructura base automatizada por VYNTIA"
git branch -M main

echo "✅ ¡Estructura creada con éxito! Ahora puedes vincular tu origen remoto de GitHub."
EOF
