# 📡 API VYNTIA — Resumen Completo
**Base URL:** `http://localhost:3000`  
**Motor:** NestJS + TypeORM + PostgreSQL

---

## 🌎 GEO — División Político-Territorial

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/geo/estados` | Lista los 24 estados de Venezuela |
| GET | `/geo/estados/:id/municipios` | Municipios de un estado |
| GET | `/geo/municipios/:id/parroquias` | Parroquias de un municipio |

**Ejemplo:**
```
GET /geo/estados/16/municipios
→ Devuelve los 21 municipios de Miranda
```

---

## 🏥 ESPECIALIDADES — Catálogo Profesional

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/especialidades` | Lista las 15 especialidades con íconos |

**Ejemplo de respuesta:**
```json
[
  { "id": 1, "nombre": "Medicina General", "icono": "🩺" },
  { "id": 2, "nombre": "Emergencias y Trauma", "icono": "🚑" }
]
```

---

## 👤 VOLUNTARIOS — Directorio Público

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/voluntarios` | Registro público de voluntario |
| GET | `/voluntarios` | Directorio con filtros |
| GET | `/voluntarios/:id` | Ficha individual |

### Filtros disponibles en GET /voluntarios:
```
?estado_id=16
?municipio_id=1607
?parroquia_id=160701
?especialidad_id=1
```
Se pueden combinar:
```
?estado_id=16&especialidad_id=1
```

### Body del POST /voluntarios:
```json
{
  "nombre_completo": "Dr. Juan Pérez",
  "cedula": "V-12345678",
  "email": "juan@example.com",
  "telefono": "+58412345678",
  "whatsapp": "+58412345678",
  "especialidad_id": 1,
  "parroquia_id": 160701,
  "disponibilidad": "tiempo_completo",
  "acepta_presencial": true,
  "acepta_remoto": true,
  "descripcion": "Médico con 8 años de experiencia"
}
```

### Valores de disponibilidad:
- `tiempo_completo`
- `medio_tiempo`
- `fines_de_semana`
- `bajo_demanda`

### Estados de perfil (automáticos):
- `pendiente` → al registrarse
- `activo` → al ser aprobado
- `suspendido` → al ser rechazado
- `inactivo` → al ser inactivado

---

## 🛡️ MODERACIÓN — Backoffice

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/moderacion/voluntarios` | Lista voluntarios pendientes |
| GET | `/moderacion/voluntarios?estado=activo` | Filtra por estado |
| GET | `/moderacion/voluntarios/:id` | Detalle de un voluntario |
| PATCH | `/moderacion/voluntarios/:id/aprobar` | Activa el perfil |
| PATCH | `/moderacion/voluntarios/:id/rechazar` | Suspende el perfil |
| PATCH | `/moderacion/voluntarios/:id/inactivar` | Inactiva el perfil |

---

## 🗂️ Estructura del Proyecto

```
backend/
└── src/
    ├── geo/
    │   ├── entities/
    │   │   ├── estado.entity.ts
    │   │   ├── municipio.entity.ts
    │   │   └── parroquia.entity.ts
    │   ├── geo.controller.ts
    │   ├── geo.service.ts
    │   └── geo.module.ts
    ├── especialidades/
    │   ├── entities/
    │   │   └── especialidad.entity.ts
    │   ├── especialidades.controller.ts
    │   ├── especialidades.service.ts
    │   └── especialidades.module.ts
    ├── voluntarios/
    │   ├── dto/
    │   │   └── crear-voluntario.dto.ts
    │   ├── entities/
    │   │   └── voluntario.entity.ts
    │   ├── voluntarios.controller.ts
    │   ├── voluntarios.service.ts
    │   └── voluntarios.module.ts
    ├── moderacion/
    │   ├── moderacion.controller.ts
    │   ├── moderacion.service.ts
    │   └── moderacion.module.ts
    ├── app.module.ts
    └── main.ts
```

---

## ✅ Estado del Proyecto

| Módulo | Estado |
|--------|--------|
| Base de datos + Schema | ✅ Completo |
| Módulo Geo | ✅ Completo |
| Módulo Especialidades | ✅ Completo |
| Módulo Voluntarios | ✅ Completo |
| Módulo Moderación | ✅ Completo |
| Frontend Next.js | ⏳ Siguiente paso |
| App Mobile Flutter | ⏳ Fase 2 |

---

*VYNTIA · Tu Talento Puede Salvar Vidas 🇻🇪*
