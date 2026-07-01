import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── GEO ──────────────────────────────────────────
export const getEstados = () =>
  api.get('/geo/estados').then((r) => r.data);

export const getMunicipios = (estadoId: number) =>
  api.get(`/geo/estados/${estadoId}/municipios`).then((r) => r.data);

export const getParroquias = (municipioId: number) =>
  api.get(`/geo/municipios/${municipioId}/parroquias`).then((r) => r.data);

// ── ESPECIALIDADES ────────────────────────────────
export const getEspecialidades = () =>
  api.get('/especialidades').then((r) => r.data);

// ── VOLUNTARIOS ───────────────────────────────────
export const getVoluntarios = (filtros: {
  estado_id?: number;
  municipio_id?: number;
  parroquia_id?: number;
  especialidad_id?: number;
}) => api.get('/voluntarios', { params: filtros }).then((r) => r.data);

export const getVoluntario = (id: string) =>
  api.get(`/voluntarios/${id}`).then((r) => r.data);

export const registrarVoluntario = (data: any) =>
  api.post('/voluntarios', data).then((r) => r.data);

// ── MODERACIÓN ────────────────────────────────────
export const getVoluntariosMod = (estado = 'pendiente') =>
  api.get('/moderacion/voluntarios', { params: { estado } }).then((r) => r.data);

export const aprobarVoluntario = (id: string) =>
  api.patch(`/moderacion/voluntarios/${id}/aprobar`).then((r) => r.data);

export const rechazarVoluntario = (id: string) =>
  api.patch(`/moderacion/voluntarios/${id}/rechazar`).then((r) => r.data);

export default api;
