'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Users, Heart, Phone } from 'lucide-react';
import { getEstados, getEspecialidades } from '../lib/api';
import Link from 'next/link';

export default function Home() {
  const [estados, setEstados] = useState<any[]>([]);
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [estadoId, setEstadoId] = useState('');
  const [especialidadId, setEspecialidadId] = useState('');

  useEffect(() => {
    getEstados().then(setEstados);
    getEspecialidades().then(setEspecialidades);
  }, []);

  return (
    <main style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F1F5F9' }}>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)',
        padding: '48px 24px 40px',
        textAlign: 'center',
        color: 'white'
      }}>
        <Heart size={36} color="#F87171" style={{ margin: '0 auto 12px' }} />
        <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px', lineHeight: 1.2 }}>
          Directorio de Voluntarios Venezuela
        </h1>
        <p style={{ fontSize: '14px', color: '#BFDBFE', marginBottom: '6px' }}>
          Conectamos profesionales con quienes más los necesitan
        </p>
        <span style={{
          display: 'inline-block',
          backgroundColor: '#DC2626',
          color: 'white',
          fontSize: '11px',
          fontWeight: '700',
          padding: '4px 12px',
          borderRadius: '999px',
          marginTop: '8px',
          letterSpacing: '0.5px'
        }}>
          EMERGENCIA · 24 JUNIO
        </span>
      </section>

      {/* BUSCADOR */}
      <section style={{ padding: '20px 16px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={17} color="#1D4ED8" />
            Buscar profesional disponible
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '6px' }}>
                ESTADO
              </label>
              <select
                style={{
                  width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '12px',
                  padding: '12px 14px', fontSize: '14px', backgroundColor: '#F8FAFC',
                  outline: 'none', appearance: 'none'
                }}
                value={estadoId}
                onChange={(e) => setEstadoId(e.target.value)}
              >
                <option value="">Selecciona un estado</option>
                {estados.map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '6px' }}>
                ESPECIALIDAD
              </label>
              <select
                style={{
                  width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '12px',
                  padding: '12px 14px', fontSize: '14px', backgroundColor: '#F8FAFC',
                  outline: 'none', appearance: 'none'
                }}
                value={especialidadId}
                onChange={(e) => setEspecialidadId(e.target.value)}
              >
                <option value="">Todas las especialidades</option>
                {especialidades.map((esp) => (
                  <option key={esp.id} value={esp.id}>
                    {esp.icono} {esp.nombre}
                  </option>
                ))}
              </select>
            </div>

            <Link
              href={`/directorio?${estadoId ? `estado_id=${estadoId}` : ''}${especialidadId ? `&especialidad_id=${especialidadId}` : ''}`}
              style={{
                display: 'block', textAlign: 'center',
                backgroundColor: '#1D4ED8', color: 'white',
                fontWeight: '700', fontSize: '15px',
                padding: '14px', borderRadius: '14px',
                textDecoration: 'none', marginTop: '4px'
              }}
            >
              Buscar voluntarios
            </Link>
          </div>
        </div>

        {/* ACCESOS RÁPIDOS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
          <Link href="/registro" style={{
            backgroundColor: 'white', borderRadius: '18px',
            padding: '20px 16px', textAlign: 'center',
            textDecoration: 'none', color: 'inherit',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <Users size={26} color="#1D4ED8" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontWeight: '700', fontSize: '13px' }}>Soy voluntario</p>
            <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>Registra tu perfil</p>
          </Link>

          <Link href="/directorio" style={{
            backgroundColor: 'white', borderRadius: '18px',
            padding: '20px 16px', textAlign: 'center',
            textDecoration: 'none', color: 'inherit',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <MapPin size={26} color="#1D4ED8" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontWeight: '700', fontSize: '13px' }}>Ver directorio</p>
            <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>Todos los profesionales</p>
          </Link>
        </div>

        {/* LÍNEA DE EMERGENCIA */}
        <div style={{
          backgroundColor: '#FEF2F2', border: '1.5px solid #FECACA',
          borderRadius: '16px', padding: '16px', marginTop: '16px',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <Phone size={20} color="#DC2626" />
          <div>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#DC2626' }}>LÍNEA DE EMERGENCIA</p>
            <p style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Protección Civil: 0800-CIVIL-00</p>
          </div>
        </div>

        {/* FOOTER */}
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#94A3B8', marginTop: '24px', paddingBottom: '24px' }}>
          VYNTIA · Tu Talento Puede Salvar Vidas · Código Abierto
        </p>
      </section>

    </main>
  );
}
