'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, User, MapPin, Briefcase, ClipboardCheck } from 'lucide-react';
import { getEstados, getMunicipios, getParroquias, getEspecialidades, registrarVoluntario } from '../../lib/api';
import Link from 'next/link';

const PASOS = ['Identidad', 'Ubicación', 'Perfil', 'Confirmar'];

// Convierte 04262344033 → +584262344033
const formatearTelefono = (valor: string): string => {
  const solo = valor.replace(/\D/g, '');
  if (solo.startsWith('0')) return '+58' + solo.slice(1);
  if (solo.startsWith('58')) return '+' + solo;
  if (solo.startsWith('4') && solo.length >= 10) return '+58' + solo;
  return valor;
};

export default function Registro() {
  const [paso, setPaso] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');

  const [estados, setEstados] = useState<any[]>([]);
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [parroquias, setParroquias] = useState<any[]>([]);
  const [especialidades, setEspecialidades] = useState<any[]>([]);

  const [form, setForm] = useState({
    nombre_completo: '',
    cedula_tipo: 'V',
    cedula_numero: '',
    email: '',
    telefono: '',
    whatsapp: '',
    estado_id: '',
    municipio_id: '',
    parroquia_id: '',
    especialidad_id: '',
    numero_colegiatura: '',
    descripcion: '',
    disponibilidad: 'bajo_demanda',
    acepta_presencial: true,
    acepta_remoto: true,
  });

  useEffect(() => {
    getEstados().then(setEstados);
    getEspecialidades().then(setEspecialidades);
  }, []);

  useEffect(() => {
    if (form.estado_id) {
      setMunicipios([]);
      setParroquias([]);
      getMunicipios(Number(form.estado_id)).then(setMunicipios);
    }
  }, [form.estado_id]);

  useEffect(() => {
    if (form.municipio_id) {
      setParroquias([]);
      getParroquias(Number(form.municipio_id)).then(setParroquias);
    }
  }, [form.municipio_id]);

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const handleTelefono = (key: string, valor: string) => {
    const solo = valor.replace(/\D/g, '');
    set(key, solo);
  };

  const telefonoFormateado = (valor: string) => {
    if (!valor) return '';
    if (valor.startsWith('0')) return '+58' + valor.slice(1);
    if (valor.length >= 10) return '+58' + valor;
    return valor;
  };

  const cedulaCompleta = form.cedula_numero
    ? `${form.cedula_tipo}-${form.cedula_numero}`
    : '';

  const validarPaso = () => {
    if (paso === 0) {
      if (!form.nombre_completo.trim()) return 'El nombre completo es obligatorio';
      if (!form.email.trim() || !form.email.includes('@')) return 'El correo electrónico no es válido';
      if (form.cedula_numero && !/^\d{6,8}$/.test(form.cedula_numero)) return 'El número de cédula debe tener entre 6 y 8 dígitos';
    }
    if (paso === 1) {
      if (!form.estado_id) return 'Selecciona un estado';
      if (!form.municipio_id) return 'Selecciona un municipio';
      if (!form.parroquia_id) return 'Selecciona una parroquia';
    }
    if (paso === 2) {
      if (!form.especialidad_id) return 'Selecciona una especialidad';
    }
    return '';
  };

  const siguiente = () => {
    const err = validarPaso();
    if (err) { setError(err); return; }
    setError('');
    setPaso((p) => p + 1);
  };

  const enviar = async () => {
    setEnviando(true);
    setError('');
    try {
      await registrarVoluntario({
        nombre_completo: form.nombre_completo,
        cedula: cedulaCompleta || undefined,
        email: form.email,
        telefono: form.telefono ? telefonoFormateado(form.telefono) : undefined,
        whatsapp: form.whatsapp ? telefonoFormateado(form.whatsapp) : undefined,
        especialidad_id: Number(form.especialidad_id),
        parroquia_id: Number(form.parroquia_id),
        numero_colegiatura: form.numero_colegiatura || undefined,
        descripcion: form.descripcion || undefined,
        disponibilidad: form.disponibilidad,
        acepta_presencial: form.acepta_presencial,
        acepta_remoto: form.acepta_remoto,
      });
      setExito(true);
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Ocurrió un error, intenta de nuevo');
    } finally {
      setEnviando(false);
    }
  };

  const estiloInput = {
    width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '12px',
    padding: '12px 14px', fontSize: '14px', backgroundColor: '#F8FAFC',
    outline: 'none', fontFamily: 'inherit'
  };

  const estiloLabel = {
    fontSize: '12px', fontWeight: '600' as const,
    color: '#64748B', display: 'block' as const, marginBottom: '6px'
  };

  if (exito) return (
    <main style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Check size={40} color="#16A34A" />
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>¡Registro exitoso!</h2>
        <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
          Tu perfil está en revisión. El equipo de VYNTIA lo validará y activará en breve. ¡Gracias por tu talento!
        </p>
        <Link href="/" style={{
          display: 'block', backgroundColor: '#1D4ED8', color: 'white',
          padding: '14px', borderRadius: '14px', textDecoration: 'none',
          fontWeight: '700', fontSize: '15px', textAlign: 'center'
        }}>
          Volver al inicio
        </Link>
      </div>
    </main>
  );

  return (
    <main style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F1F5F9' }}>

      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)',
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <Link href="/" style={{ color: 'white', display: 'flex' }}>
          <ArrowLeft size={22} />
        </Link>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>Registro de Voluntario</span>
      </div>

      {/* PROGRESO */}
      <div style={{ backgroundColor: 'white', padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          {PASOS.map((nombre, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: i < paso ? '#16A34A' : i === paso ? '#1D4ED8' : '#E2E8F0',
                color: i <= paso ? 'white' : '#94A3B8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: '700', marginBottom: '4px'
              }}>
                {i < paso ? <Check size={14} /> : i + 1}
              </div>
              <span style={{ fontSize: '10px', color: i === paso ? '#1D4ED8' : '#94A3B8', fontWeight: i === paso ? '700' : '400' }}>
                {nombre}
              </span>
            </div>
          ))}
        </div>
        <div style={{ height: '4px', backgroundColor: '#E2E8F0', borderRadius: '999px' }}>
          <div style={{ height: '100%', backgroundColor: '#1D4ED8', borderRadius: '999px', width: `${(paso / (PASOS.length - 1)) * 100}%`, transition: 'width 0.3s' }} />
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

          {/* PASO 0 — IDENTIDAD */}
          {paso === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <User size={18} color="#1D4ED8" />
                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Datos de identidad</h3>
              </div>

              <div>
                <label style={estiloLabel}>NOMBRE COMPLETO *</label>
                <input style={estiloInput} placeholder="Ej: María González" value={form.nombre_completo} onChange={(e) => set('nombre_completo', e.target.value)} />
              </div>

              {/* CÉDULA CON SELECTOR DE TIPO */}
              <div>
                <label style={estiloLabel}>CÉDULA DE IDENTIDAD <span style={{ color: '#94A3B8', fontWeight: '400' }}>(opcional)</span></label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    style={{ ...estiloInput, width: '80px', flexShrink: 0 }}
                    value={form.cedula_tipo}
                    onChange={(e) => set('cedula_tipo', e.target.value)}
                  >
                    <option value="V">V</option>
                    <option value="E">E</option>
                    <option value="J">J</option>
                  </select>
                  <input
                    style={estiloInput}
                    placeholder="12345678"
                    value={form.cedula_numero}
                    onChange={(e) => set('cedula_numero', e.target.value.replace(/\D/g, ''))}
                    maxLength={8}
                    inputMode="numeric"
                  />
                </div>
                {form.cedula_numero && (
                  <p style={{ fontSize: '11px', color: '#16A34A', marginTop: '4px', fontWeight: '600' }}>
                    ✓ Se guardará como: {form.cedula_tipo}-{form.cedula_numero}
                  </p>
                )}
              </div>

              <div>
                <label style={estiloLabel}>CORREO ELECTRÓNICO *</label>
                <input style={estiloInput} type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
              </div>

              {/* TELÉFONO CON AUTOFORMATO */}
              <div>
                <label style={estiloLabel}>TELÉFONO <span style={{ color: '#94A3B8', fontWeight: '400' }}>(opcional)</span></label>
                <input
                  style={estiloInput}
                  placeholder="04121234567"
                  value={form.telefono}
                  onChange={(e) => handleTelefono('telefono', e.target.value)}
                  inputMode="numeric"
                  maxLength={11}
                />
                {form.telefono.length >= 10 && (
                  <p style={{ fontSize: '11px', color: '#16A34A', marginTop: '4px', fontWeight: '600' }}>
                    ✓ Formato internacional: {telefonoFormateado(form.telefono)}
                  </p>
                )}
              </div>

              <div>
                <label style={estiloLabel}>WHATSAPP <span style={{ color: '#94A3B8', fontWeight: '400' }}>(opcional)</span></label>
                <input
                  style={estiloInput}
                  placeholder="04121234567"
                  value={form.whatsapp}
                  onChange={(e) => handleTelefono('whatsapp', e.target.value)}
                  inputMode="numeric"
                  maxLength={11}
                />
                {form.whatsapp.length >= 10 && (
                  <p style={{ fontSize: '11px', color: '#16A34A', marginTop: '4px', fontWeight: '600' }}>
                    ✓ Formato internacional: {telefonoFormateado(form.whatsapp)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* PASO 1 — UBICACIÓN */}
          {paso === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <MapPin size={18} color="#1D4ED8" />
                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Tu ubicación</h3>
              </div>
              <div>
                <label style={estiloLabel}>ESTADO *</label>
                <select style={estiloInput} value={form.estado_id} onChange={(e) => { set('estado_id', e.target.value); set('municipio_id', ''); set('parroquia_id', ''); }}>
                  <option value="">Selecciona un estado</option>
                  {estados.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>
              </div>
              <div>
                <label style={estiloLabel}>MUNICIPIO *</label>
                <select style={estiloInput} value={form.municipio_id} onChange={(e) => { set('municipio_id', e.target.value); set('parroquia_id', ''); }} disabled={!form.estado_id}>
                  <option value="">{form.estado_id ? 'Selecciona un municipio' : 'Primero selecciona un estado'}</option>
                  {municipios.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>
              </div>
              <div>
                <label style={estiloLabel}>PARROQUIA *</label>
                <select style={estiloInput} value={form.parroquia_id} onChange={(e) => set('parroquia_id', e.target.value)} disabled={!form.municipio_id}>
                  <option value="">{form.municipio_id ? 'Selecciona una parroquia' : 'Primero selecciona un municipio'}</option>
                  {parroquias.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* PASO 2 — PERFIL */}
          {paso === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Briefcase size={18} color="#1D4ED8" />
                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Perfil profesional</h3>
              </div>
              <div>
                <label style={estiloLabel}>ESPECIALIDAD *</label>
                <select style={estiloInput} value={form.especialidad_id} onChange={(e) => set('especialidad_id', e.target.value)}>
                  <option value="">Selecciona tu especialidad</option>
                  {especialidades.map((esp) => <option key={esp.id} value={esp.id}>{esp.icono} {esp.nombre}</option>)}
                </select>
              </div>
              <div>
                <label style={estiloLabel}>
                  NÚMERO DE COLEGIATURA <span style={{ color: '#94A3B8', fontWeight: '400' }}>(opcional)</span>
                </label>
                <input style={estiloInput} placeholder="Ej: CVM-12345" value={form.numero_colegiatura} onChange={(e) => set('numero_colegiatura', e.target.value)} />
                <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                  Ayuda a verificar tu identidad profesional
                </p>
              </div>
              <div>
                <label style={estiloLabel}>DISPONIBILIDAD</label>
                <select style={estiloInput} value={form.disponibilidad} onChange={(e) => set('disponibilidad', e.target.value)}>
                  <option value="tiempo_completo">Tiempo completo</option>
                  <option value="medio_tiempo">Medio tiempo</option>
                  <option value="fines_de_semana">Fines de semana</option>
                  <option value="bajo_demanda">Bajo demanda</option>
                </select>
              </div>
              <div>
                <label style={estiloLabel}>DESCRIPCIÓN BREVE <span style={{ color: '#94A3B8', fontWeight: '400' }}>(opcional)</span></label>
                <textarea
                  style={{ ...estiloInput, minHeight: '80px', resize: 'none' } as any}
                  placeholder="Cuéntanos tu experiencia y cómo puedes ayudar..."
                  value={form.descripcion}
                  onChange={(e) => set('descripcion', e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.acepta_presencial} onChange={(e) => set('acepta_presencial', e.target.checked)} />
                  Presencial
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.acepta_remoto} onChange={(e) => set('acepta_remoto', e.target.checked)} />
                  Remoto
                </label>
              </div>
            </div>
          )}

          {/* PASO 3 — CONFIRMAR */}
          {paso === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <ClipboardCheck size={18} color="#1D4ED8" />
                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Revisa tu información</h3>
              </div>
              {[
                { label: 'Nombre', valor: form.nombre_completo },
                { label: 'Cédula', valor: cedulaCompleta || 'No indicada' },
                { label: 'Correo', valor: form.email },
                { label: 'Teléfono', valor: form.telefono ? telefonoFormateado(form.telefono) : 'No indicado' },
                { label: 'WhatsApp', valor: form.whatsapp ? telefonoFormateado(form.whatsapp) : 'No indicado' },
                { label: 'Especialidad', valor: especialidades.find(e => e.id == form.especialidad_id)?.nombre || '' },
                { label: 'Disponibilidad', valor: form.disponibilidad.replace(/_/g, ' ') },
                { label: 'Colegiatura', valor: form.numero_colegiatura || 'No indicada' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>{item.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', maxWidth: '60%', textAlign: 'right' }}>{item.valor}</span>
                </div>
              ))}
              <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '8px', lineHeight: 1.5 }}>
                Al enviar, aceptas que tu información sea visible en el directorio público de VYNTIA para fines humanitarios.
              </p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 14px', marginTop: '12px' }}>
              <p style={{ color: '#DC2626', fontSize: '13px', fontWeight: '600' }}>{error}</p>
            </div>
          )}

          {/* BOTONES */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {paso > 0 && (
              <button onClick={() => { setPaso((p) => p - 1); setError(''); }} style={{
                flex: 1, padding: '13px', backgroundColor: '#F1F5F9',
                border: 'none', borderRadius: '14px', fontSize: '14px',
                fontWeight: '600', color: '#64748B', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                fontFamily: 'inherit'
              }}>
                <ArrowLeft size={16} /> Atrás
              </button>
            )}
            {paso < 3 ? (
              <button onClick={siguiente} style={{
                flex: 1, padding: '13px', backgroundColor: '#1D4ED8',
                border: 'none', borderRadius: '14px', fontSize: '14px',
                fontWeight: '700', color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                fontFamily: 'inherit'
              }}>
                Continuar <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={enviar} disabled={enviando} style={{
                flex: 1, padding: '13px',
                backgroundColor: enviando ? '#93C5FD' : '#16A34A',
                border: 'none', borderRadius: '14px', fontSize: '14px',
                fontWeight: '700', color: 'white', cursor: enviando ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                fontFamily: 'inherit'
              }}>
                {enviando ? 'Enviando...' : <><Check size={16} /> Enviar registro</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
