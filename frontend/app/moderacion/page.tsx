'use client';

import { useState, useEffect } from 'react';
import { Check, X, User, MapPin, Phone, Mail, MessageCircle, Shield, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getVoluntariosMod, aprobarVoluntario, rechazarVoluntario } from '../../lib/api';

const TABS = [
  { key: 'pendiente', label: 'Pendientes', icono: Clock, color: '#F59E0B' },
  { key: 'activo', label: 'Activos', icono: CheckCircle, color: '#16A34A' },
  { key: 'suspendido', label: 'Rechazados', icono: XCircle, color: '#DC2626' },
];

export default function Moderacion() {
  const [tab, setTab] = useState('pendiente');
  const [voluntarios, setVoluntarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [fichaAbierta, setFichaAbierta] = useState<any>(null);
  const [procesando, setProcesando] = useState<string | null>(null);

  const cargar = (estado: string) => {
    setCargando(true);
    getVoluntariosMod(estado)
      .then(setVoluntarios)
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(tab); }, [tab]);

  const aprobar = async (id: string) => {
    setProcesando(id);
    try {
      await aprobarVoluntario(id);
      setFichaAbierta(null);
      cargar(tab);
    } finally { setProcesando(null); }
  };

  const rechazar = async (id: string) => {
    setProcesando(id);
    try {
      await rechazarVoluntario(id);
      setFichaAbierta(null);
      cargar(tab);
    } finally { setProcesando(null); }
  };

  return (
    <main style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F1F5F9' }}>

      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)',
        padding: '20px 16px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <Shield size={22} color="white" />
          <span style={{ color: 'white', fontWeight: '800', fontSize: '18px' }}>Panel de Moderación</span>
        </div>
        <p style={{ color: '#BFDBFE', fontSize: '12px' }}>VYNTIA · Solo administradores</p>
      </div>

      {/* TABS */}
      <div style={{ backgroundColor: 'white', display: 'flex', borderBottom: '1px solid #E2E8F0' }}>
        {TABS.map((t) => {
          const Icono = t.icono;
          const activo = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: '12px 4px', border: 'none', cursor: 'pointer',
              backgroundColor: 'transparent', fontFamily: 'inherit',
              borderBottom: activo ? `3px solid ${t.color}` : '3px solid transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
            }}>
              <Icono size={16} color={activo ? t.color : '#94A3B8'} />
              <span style={{ fontSize: '11px', fontWeight: activo ? '700' : '400', color: activo ? t.color : '#94A3B8' }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* CONTADOR */}
      <div style={{ padding: '12px 16px' }}>
        <p style={{ fontSize: '13px', color: '#64748B' }}>
          {cargando ? 'Cargando...' : `${voluntarios.length} voluntario${voluntarios.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* LISTA */}
      <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {!cargando && voluntarios.length === 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', textAlign: 'center', color: '#64748B' }}>
            <p style={{ fontSize: '28px', marginBottom: '8px' }}>
              {tab === 'pendiente' ? '✅' : tab === 'activo' ? '👥' : '🚫'}
            </p>
            <p style={{ fontWeight: '600', fontSize: '14px' }}>
              {tab === 'pendiente' ? 'No hay voluntarios pendientes' : tab === 'activo' ? 'No hay voluntarios activos' : 'No hay voluntarios rechazados'}
            </p>
          </div>
        )}

        {voluntarios.map((v) => (
          <div key={v.id} onClick={() => setFichaAbierta(v)} style={{
            backgroundColor: 'white', borderRadius: '16px', padding: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <p style={{ fontWeight: '700', fontSize: '14px', marginBottom: '2px' }}>{v.nombre_completo}</p>
                <p style={{ fontSize: '12px', color: '#1D4ED8', fontWeight: '600' }}>
                  {v.especialidad?.icono} {v.especialidad?.nombre}
                </p>
              </div>
              <span style={{
                fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '999px',
                backgroundColor: tab === 'pendiente' ? '#FEF3C7' : tab === 'activo' ? '#D1FAE5' : '#FEE2E2',
                color: tab === 'pendiente' ? '#92400E' : tab === 'activo' ? '#065F46' : '#991B1B',
              }}>
                {tab === 'pendiente' ? 'PENDIENTE' : tab === 'activo' ? 'ACTIVO' : 'RECHAZADO'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B', marginBottom: '10px' }}>
              <MapPin size={11} />
              <span style={{ fontSize: '11px' }}>
                {v.parroquia?.nombre}, {v.parroquia?.municipio?.nombre}
              </span>
            </div>

            {tab === 'pendiente' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={(e) => { e.stopPropagation(); aprobar(v.id); }} disabled={procesando === v.id} style={{
                  flex: 1, padding: '8px', backgroundColor: '#D1FAE5', border: 'none',
                  borderRadius: '10px', color: '#065F46', fontWeight: '700', fontSize: '12px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  fontFamily: 'inherit'
                }}>
                  <Check size={13} /> Aprobar
                </button>
                <button onClick={(e) => { e.stopPropagation(); rechazar(v.id); }} disabled={procesando === v.id} style={{
                  flex: 1, padding: '8px', backgroundColor: '#FEE2E2', border: 'none',
                  borderRadius: '10px', color: '#991B1B', fontWeight: '700', fontSize: '12px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  fontFamily: 'inherit'
                }}>
                  <X size={13} /> Rechazar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FICHA MODAL */}
      {fichaAbierta && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50
        }} onClick={() => setFichaAbierta(null)}>
          <div style={{
            backgroundColor: 'white', borderRadius: '24px 24px 0 0', padding: '24px',
            width: '100%', maxWidth: '480px', maxHeight: '85vh', overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '40px', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '999px', margin: '0 auto 20px' }} />
            <div style={{ fontSize: '28px', textAlign: 'center', marginBottom: '6px' }}>{fichaAbierta.especialidad?.icono}</div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', textAlign: 'center', marginBottom: '2px' }}>{fichaAbierta.nombre_completo}</h2>
            <p style={{ textAlign: 'center', color: '#1D4ED8', fontWeight: '600', fontSize: '13px', marginBottom: '16px' }}>
              {fichaAbierta.especialidad?.nombre}
            </p>

            {[
              { label: 'Cédula', valor: fichaAbierta.cedula || 'No indicada', icono: User },
              { label: 'Ubicación', valor: `${fichaAbierta.parroquia?.nombre}, ${fichaAbierta.parroquia?.municipio?.nombre}`, icono: MapPin },
              { label: 'Teléfono', valor: fichaAbierta.telefono || 'No indicado', icono: Phone },
              { label: 'WhatsApp', valor: fichaAbierta.whatsapp || 'No indicado', icono: MessageCircle },
              { label: 'Correo', valor: fichaAbierta.email, icono: Mail },
            ].map((item) => {
              const Icono = item.icono;
              return (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <Icono size={15} color="#64748B" />
                  <div>
                    <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600' }}>{item.label.toUpperCase()}</p>
                    <p style={{ fontSize: '13px', fontWeight: '600' }}>{item.valor}</p>
                  </div>
                </div>
              );
            })}

            {fichaAbierta.descripcion && (
              <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '12px', margin: '12px 0' }}>
                <p style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', marginBottom: '4px' }}>DESCRIPCIÓN</p>
                <p style={{ fontSize: '13px', color: '#334155' }}>{fichaAbierta.descripcion}</p>
              </div>
            )}

            {fichaAbierta.numero_colegiatura && (
              <div style={{ backgroundColor: '#EFF6FF', borderRadius: '12px', padding: '12px', margin: '12px 0' }}>
                <p style={{ fontSize: '11px', color: '#1D4ED8', fontWeight: '600', marginBottom: '4px' }}>COLEGIATURA</p>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#1E3A8A' }}>{fichaAbierta.numero_colegiatura}</p>
              </div>
            )}

            {tab === 'pendiente' && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button onClick={() => rechazar(fichaAbierta.id)} disabled={!!procesando} style={{
                  flex: 1, padding: '14px', backgroundColor: '#FEE2E2', border: 'none',
                  borderRadius: '14px', color: '#DC2626', fontWeight: '700', fontSize: '14px',
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}>
                  <X size={16} /> Rechazar
                </button>
                <button onClick={() => aprobar(fichaAbierta.id)} disabled={!!procesando} style={{
                  flex: 1, padding: '14px', backgroundColor: '#16A34A', border: 'none',
                  borderRadius: '14px', color: 'white', fontWeight: '700', fontSize: '14px',
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}>
                  <Check size={16} /> {procesando ? 'Procesando...' : 'Aprobar'}
                </button>
              </div>
            )}

            <button onClick={() => setFichaAbierta(null)} style={{
              width: '100%', marginTop: '10px', padding: '13px',
              backgroundColor: '#F1F5F9', border: 'none', borderRadius: '14px',
              fontSize: '14px', fontWeight: '600', color: '#64748B', cursor: 'pointer',
              fontFamily: 'inherit'
            }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
