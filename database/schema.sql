-- ============================================================
--  VYNTIA · Directorio Centralizado de Voluntarios
--  Base de Datos: vyntia_voluntarios_db
--  Motor: PostgreSQL + PostGIS
--  Generado por: Claude (Anthropic) para VYNTIA
-- ============================================================

-- Habilitar extensión de geolocalización
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- SECCIÓN 1: DIVISIÓN POLÍTICO-TERRITORIAL DE VENEZUELA
-- ============================================================

CREATE TABLE estados (
    id          INTEGER PRIMARY KEY,
    nombre      VARCHAR(60) NOT NULL,
    codigo_iso  CHAR(4)     NOT NULL UNIQUE  -- ISO 3166-2:VE
);

CREATE TABLE municipios (
    id          INTEGER PRIMARY KEY,
    nombre      VARCHAR(80)  NOT NULL,
    estado_id   INTEGER     NOT NULL REFERENCES estados(id)
);

CREATE TABLE parroquias (
    id            INTEGER PRIMARY KEY,
    nombre        VARCHAR(100) NOT NULL,
    municipio_id  INTEGER     NOT NULL REFERENCES municipios(id)
);

-- Índices para búsquedas geográficas frecuentes
CREATE INDEX idx_municipios_estado  ON municipios(estado_id);
CREATE INDEX idx_parroquias_muni    ON parroquias(municipio_id);


-- ============================================================
-- SECCIÓN 2: CATÁLOGOS DE ESPECIALIDADES
-- ============================================================

CREATE TABLE especialidades (
    id      SMALLSERIAL PRIMARY KEY,
    nombre  VARCHAR(80) NOT NULL UNIQUE,
    icono   VARCHAR(10)          -- emoji o código de icono para la UI
);

INSERT INTO especialidades (nombre, icono) VALUES
    ('Medicina General',         '🩺'),
    ('Emergencias y Trauma',     '🚑'),
    ('Psicología',               '🧠'),
    ('Enfermería',               '💉'),
    ('Ingeniería de Soporte',    '🔧'),
    ('Telecomunicaciones',       '📡'),
    ('Rescate y Primeros Auxilios', '🦺'),
    ('Trabajo Social',           '🤝'),
    ('Nutrición',                '🥗'),
    ('Arquitectura / Estructuras','🏗️'),
    ('Legal / Derechos Humanos', '⚖️'),
    ('Logística y Suministros',  '📦'),
    ('Tecnología / IT',          '💻'),
    ('Veterinaria',              '🐾'),
    ('Otro',                     '🔹');


-- ============================================================
-- SECCIÓN 3: VOLUNTARIOS (tabla principal)
-- ============================================================

CREATE TYPE disponibilidad_enum AS ENUM (
    'tiempo_completo',
    'medio_tiempo',
    'fines_de_semana',
    'bajo_demanda'
);

CREATE TYPE estado_perfil_enum AS ENUM (
    'pendiente',
    'activo',
    'suspendido',
    'inactivo'
);

CREATE TABLE voluntarios (
    id                  UUID            DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre_completo     VARCHAR(120)    NOT NULL,
    cedula              VARCHAR(15)     UNIQUE,           -- V-/E- para validación
    email               VARCHAR(120)    UNIQUE NOT NULL,
    telefono            VARCHAR(20),
    whatsapp            VARCHAR(20),
    especialidad_id     INTEGER        NOT NULL REFERENCES especialidades(id),
    descripcion         TEXT,                             -- breve bio / competencias
    numero_colegiatura  VARCHAR(40),                      -- para profesiones colegiadas
    parroquia_id        INTEGER        NOT NULL REFERENCES parroquias(id),
    disponibilidad      disponibilidad_enum NOT NULL DEFAULT 'bajo_demanda',
    acepta_presencial   BOOLEAN         NOT NULL DEFAULT TRUE,
    acepta_remoto       BOOLEAN         NOT NULL DEFAULT TRUE,
    estado_perfil       estado_perfil_enum NOT NULL DEFAULT 'pendiente',
    fecha_registro      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    ultima_actualizacion TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Índices de búsqueda del directorio público
CREATE INDEX idx_voluntarios_especialidad ON voluntarios(especialidad_id);
CREATE INDEX idx_voluntarios_parroquia    ON voluntarios(parroquia_id);
CREATE INDEX idx_voluntarios_estado_perfil ON voluntarios(estado_perfil);
CREATE INDEX idx_voluntarios_nombre       ON voluntarios USING gin(to_tsvector('spanish', nombre_completo));


-- ============================================================
-- SECCIÓN 4: MODERACIÓN Y BACKOFFICE
-- ============================================================

CREATE TABLE moderadores (
    id          UUID    DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre      VARCHAR(120) NOT NULL,
    email       VARCHAR(120) NOT NULL UNIQUE,
    password_hash TEXT   NOT NULL,
    activo      BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE tipo_reporte_enum AS ENUM (
    'perfil_inactivo',
    'datos_erroneos',
    'credenciales_falsas',
    'conducta_inapropiada',
    'otro'
);

CREATE TABLE reportes (
    id              SERIAL          PRIMARY KEY,
    voluntario_id   UUID            NOT NULL REFERENCES voluntarios(id) ON DELETE CASCADE,
    tipo            tipo_reporte_enum NOT NULL,
    descripcion     TEXT,
    reportado_en    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    revisado_por    UUID            REFERENCES moderadores(id),
    revisado_en     TIMESTAMPTZ,
    resuelto        BOOLEAN         NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_reportes_voluntario ON reportes(voluntario_id);
CREATE INDEX idx_reportes_resuelto   ON reportes(resuelto);


-- ============================================================
-- SECCIÓN 5: SOLICITUDES DE CONTINGENCIA (Fase 2)
-- ============================================================

CREATE TYPE urgencia_enum AS ENUM ('alta', 'media', 'baja');

CREATE TABLE solicitudes_contingencia (
    id                  SERIAL          PRIMARY KEY,
    titulo              VARCHAR(160)    NOT NULL,
    descripcion         TEXT            NOT NULL,
    especialidad_id     INTEGER        REFERENCES especialidades(id),
    parroquia_id        INTEGER        NOT NULL REFERENCES parroquias(id),
    urgencia            urgencia_enum   NOT NULL DEFAULT 'media',
    contacto_nombre     VARCHAR(120),
    contacto_telefono   VARCHAR(20),
    publicado_en        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    activo              BOOLEAN         NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_solicitudes_parroquia    ON solicitudes_contingencia(parroquia_id);
CREATE INDEX idx_solicitudes_especialidad ON solicitudes_contingencia(especialidad_id);
CREATE INDEX idx_solicitudes_urgencia     ON solicitudes_contingencia(urgencia);


-- ============================================================
-- FUNCIÓN: actualizar ultima_actualizacion automáticamente
-- ============================================================

CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ultima_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_voluntarios_updated
    BEFORE UPDATE ON voluntarios
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();


-- ============================================================
-- SECCIÓN 6: DATOS SEMILLA — VENEZUELA COMPLETA
-- 24 Estados · 335 Municipios · 1.136 Parroquias (aprox.)
-- ============================================================

-- ── ESTADOS ──────────────────────────────────────────────────
INSERT INTO estados (id, nombre, codigo_iso) VALUES
(1,  'Amazonas',              'VE-Z'),
(2,  'Anzoátegui',            'VE-B'),
(3,  'Apure',                 'VE-C'),
(4,  'Aragua',                'VE-D'),
(5,  'Barinas',               'VE-E'),
(6,  'Bolívar',               'VE-F'),
(7,  'Carabobo',              'VE-G'),
(8,  'Cojedes',               'VE-H'),
(9,  'Delta Amacuro',         'VE-Y'),
(10, 'Distrito Capital',      'VE-A'),
(11, 'Falcón',                'VE-I'),
(12, 'Guárico',               'VE-J'),
(13, 'La Guaira',             'VE-X'),
(14, 'Lara',                  'VE-K'),
(15, 'Mérida',                'VE-L'),
(16, 'Miranda',               'VE-M'),
(17, 'Monagas',               'VE-N'),
(18, 'Nueva Esparta',         'VE-O'),
(19, 'Portuguesa',            'VE-P'),
(20, 'Sucre',                 'VE-R'),
(21, 'Táchira',               'VE-S'),
(22, 'Trujillo',              'VE-T'),
(23, 'Yaracuy',               'VE-U'),
(24, 'Zulia',                 'VE-V');

-- ── MUNICIPIOS ───────────────────────────────────────────────
-- Formato: (id, nombre, estado_id)
-- Se listan todos los municipios oficiales por estado.

INSERT INTO municipios (id, nombre, estado_id) VALUES
-- Amazonas (1) — 7 municipios
(101,'Alto Orinoco',1),(102,'Atabapo',1),(103,'Atures',1),(104,'Autana',1),
(105,'Manapiare',1),(106,'Maroa',1),(107,'Río Negro',1),

-- Anzoátegui (2) — 21 municipios
(201,'Anaco',2),(202,'Aragua de Barcelona',2),(203,'Barcelona',2),(204,'Bergantín',2),
(205,'Bolívar',2),(206,'Bruzual',2),(207,'Cajigal',2),(208,'Carvajal',2),
(209,'Diego Bautista Urbaneja',2),(210,'Freites',2),(211,'Guanipa',2),
(212,'Guanta',2),(213,'Independencia',2),(214,'Juan Antonio Sotillo',2),
(215,'Juan Manuel Cajigal',2),(216,'Libertad',2),(217,'McGregor',2),
(218,'Miranda',2),(219,'Monagas',2),(220,'Peñalver',2),(221,'Píritu',2),

-- Apure (3) — 7 municipios
(301,'Achaguas',3),(302,'Biruaca',3),(303,'Muñoz',3),(304,'Páez',3),
(305,'Pedro Camejo',3),(306,'Rómulo Gallegos',3),(307,'San Fernando',3),

-- Aragua (4) — 18 municipios
(401,'Bolívar',4),(402,'Camatagua',4),(403,'Francisco Linares Alcántara',4),
(404,'Girardot',4),(405,'José Ángel Lamas',4),(406,'José Félix Ribas',4),
(407,'José Rafael Revenga',4),(408,'Libertador',4),(409,'Mario Briceño Iragorry',4),
(410,'Ocumare de la Costa de Oro',4),(411,'San Casimiro',4),(412,'San Sebastián',4),
(413,'Santiago Mariño',4),(414,'Santos Michelena',4),(415,'Sucre',4),
(416,'Tovar',4),(417,'Urdaneta',4),(418,'Zamora',4),

-- Barinas (5) — 12 municipios
(501,'Alberto Arvelo Torrealba',5),(502,'Antonio José de Sucre',5),(503,'Arismendi',5),
(504,'Barinas',5),(505,'Bolívar',5),(506,'Cruz Paredes',5),(507,'Ezequiel Zamora',5),
(508,'Obispos',5),(509,'Pedraza',5),(510,'Rojas',5),(511,'Sosa',5),(512,'Ticoporo',5),

-- Bolívar (6) — 11 municipios
(601,'Angostura del Orinoco',6),(602,'Caroní',6),(603,'Cedeño',6),
(604,'El Callao',6),(605,'Gran Sabana',6),(606,'Heres',6),(607,'Piar',6),
(608,'Raúl Leoni',6),(609,'Roscio',6),(610,'Sifontes',6),(611,'Sucre',6),

-- Carabobo (7) — 14 municipios
(701,'Bejuma',7),(702,'Carlos Arvelo',7),(703,'Diego Ibarra',7),(704,'Guacara',7),
(705,'Juan José Mora',7),(706,'Libertador',7),(707,'Los Guayos',7),(708,'Miranda',7),
(709,'Montalbán',7),(710,'Naguanagua',7),(711,'Puerto Cabello',7),(712,'San Diego',7),
(713,'San Joaquín',7),(714,'Valencia',7),

-- Cojedes (8) — 9 municipios
(801,'Anzoátegui',8),(802,'Girardot',8),(803,'Lima Blanco',8),(804,'Pao de San Juan Bautista',8),
(805,'Ricaurte',8),(806,'Rómulo Gallegos',8),(807,'San Carlos',8),
(808,'Tinaco',8),(809,'Tinaquillo',8),

-- Delta Amacuro (9) — 4 municipios
(901,'Antonio Díaz',9),(902,'Casacoima',9),(903,'Pedernales',9),(904,'Tucupita',9),

-- Distrito Capital (10) — 1 municipio
(1001,'Libertador',10),

-- Falcón (11) — 25 municipios
(1101,'Acosta',11),(1102,'Bolívar',11),(1103,'Buchivacoa',11),(1104,'Carirubana',11),
(1105,'Colina',11),(1106,'Dabajuro',11),(1107,'Democracia',11),(1108,'Falcón',11),
(1109,'Federación',11),(1110,'Iturriza',11),(1111,'Jacura',11),(1112,'Los Taques',11),
(1113,'Mauroa',11),(1114,'Miranda',11),(1115,'Monseñor Iturriza',11),(1116,'Palmasola',11),
(1117,'Petit',11),(1118,'Piritu',11),(1119,'San Francisco',11),(1120,'Silva',11),
(1121,'Sucre',11),(1122,'Tocópero',11),(1123,'Unión',11),(1124,'Urumaco',11),(1125,'Zamora',11),

-- Guárico (12) — 15 municipios
(1201,'Camaguán',12),(1202,'Chaguaramas',12),(1203,'El Socorro',12),(1204,'Francisco de Miranda',12),
(1205,'José Félix Ribas',12),(1206,'José Tadeo Monagas',12),(1207,'Juan Germán Roscio',12),
(1208,'Julian Mellado',12),(1209,'Las Mercedes',12),(1210,'Leonardo Infante',12),
(1211,'Monagas',12),(1212,'Ortiz',12),(1213,'San Jerónimo de Guayabal',12),
(1214,'San Juan de los Morros',12),(1215,'Urdaneta',12),

-- La Guaira (13) — 1 municipio
(1301,'Vargas',13),

-- Lara (14) — 9 municipios
(1401,'Andrés Eloy Blanco',14),(1402,'Crespo',14),(1403,'Iribarren',14),(1404,'Jiménez',14),
(1405,'Morán',14),(1406,'Palavecino',14),(1407,'Simón Planas',14),(1408,'Torres',14),(1409,'Urdaneta',14),

-- Mérida (15) — 23 municipios
(1501,'Alberto Adriani',15),(1502,'Andrés Bello',15),(1503,'Aricagua',15),
(1504,'Arzobispo Chacón',15),(1505,'Campo Elías',15),(1506,'Caracciolo Parra Olmedo',15),
(1507,'Cardenal Quintero',15),(1508,'Guaraque',15),(1509,'Justo Briceño',15),
(1510,'Libertador',15),(1511,'Miranda',15),(1512,'Obispo Ramos de Lora',15),
(1513,'Padre Noguera',15),(1514,'Pueblo Llano',15),(1515,'Rangel',15),(1516,'Rivas Dávila',15),
(1517,'Santos Marquina',15),(1518,'Sucre',15),(1519,'Tovar',15),(1520,'Tulio Febres Cordero',15),
(1521,'Urdaneta',15),(1522,'Zea',15),(1523,'Julio César Salas',15),

-- Miranda (16) — 21 municipios
(1601,'Acevedo',16),(1602,'Andrés Bello',16),(1603,'Baruta',16),(1604,'Brión',16),
(1605,'Buroz',16),(1606,'Carrizal',16),(1607,'Chacao',16),(1608,'Cristóbal Rojas',16),
(1609,'El Hatillo',16),(1610,'Guaicaipuro',16),(1611,'Independencia',16),(1612,'Lander',16),
(1613,'Los Salias',16),(1614,'Páez',16),(1615,'Paz Castillo',16),(1616,'Pedro Gual',16),
(1617,'Plaza',16),(1618,'Simón Bolívar',16),(1619,'Sucre',16),(1620,'Urdaneta',16),(1621,'Zamora',16),

-- Monagas (17) — 13 municipios
(1701,'Acosta',17),(1702,'Aguasay',17),(1703,'Bolívar',17),(1704,'Caripe',17),
(1705,'Cedeño',17),(1706,'Ezequiel Zamora',17),(1707,'Libertador',17),(1708,'Maturín',17),
(1709,'Piar',17),(1710,'Punceres',17),(1711,'Santa Bárbara',17),(1712,'Sotillo',17),(1713,'Uracoa',17),

-- Nueva Esparta (18) — 11 municipios
(1801,'Arismendi',18),(1802,'Antolín del Campo',18),(1803,'Díaz',18),(1804,'García',18),
(1805,'Gómez',18),(1806,'Gran Roque',18),(1807,'Guevara',18),(1808,'Macanao',18),
(1809,'Maneiro',18),(1810,'Marcano',18),(1811,'Tubores',18),

-- Portuguesa (19) — 14 municipios
(1901,'Aeropuerto',19),(1902,'Agua Blanca',19),(1903,'Araure',19),(1904,'Esteller',19),
(1905,'Guanare',19),(1906,'Guanarito',19),(1907,'José Vicente de Unda',19),(1908,'Libres',19),
(1909,'Ospino',19),(1910,'Páez',19),(1911,'Papelón',19),(1912,'San Genaro de Boconoito',19),
(1913,'San Rafael de Onoto',19),(1914,'Santa Rosalía',19),

-- Sucre (20) — 15 municipios
(2001,'Andrés Bello',20),(2002,'Arismendi',20),(2003,'Benitez',20),(2004,'Bermúdez',20),
(2005,'Bolívar',20),(2006,'Cajigal',20),(2007,'Cruz Salmerón Acosta',20),(2008,'Libertador',20),
(2009,'Mariño',20),(2010,'Mejía',20),(2011,'Montes',20),(2012,'Ribero',20),
(2013,'Sucre',20),(2014,'Valdez',20),(2015,'Andrés Mateo',20),

-- Táchira (21) — 29 municipios
(2101,'Andrés Bello',21),(2102,'Ayacucho',21),(2103,'Bolívar',21),(2104,'Cárdenas',21),
(2105,'Córdoba',21),(2106,'Fernández Feo',21),(2107,'Francisco de Miranda',21),
(2108,'García de Hevia',21),(2109,'Guásimos',21),(2110,'Independencia',21),
(2111,'Jáuregui',21),(2112,'José María Vargas',21),(2113,'Junín',21),(2114,'Libertad',21),
(2115,'Libertador',21),(2116,'Lobatera',21),(2117,'Michelena',21),(2118,'Montilla',21),
(2119,'Panamericano',21),(2120,'Pedro María Ureña',21),(2121,'Rafael Urdaneta',21),
(2122,'Samuel Darío Maldonado',21),(2123,'San Cristóbal',21),(2124,'San Judas Tadeo',21),
(2125,'Seboruco',21),(2126,'Simón Rodríguez',21),(2127,'Sucre',21),(2128,'Torbes',21),(2129,'Uribante',21),

-- Trujillo (22) — 20 municipios
(2201,'Andrés Bello',22),(2202,'Boconó',22),(2203,'Bolívar',22),(2204,'Candelaria',22),
(2205,'Carache',22),(2206,'Escuque',22),(2207,'José Felipe Márquez Cañizales',22),
(2208,'La Ceiba',22),(2209,'Miranda',22),(2210,'Monte Carmelo',22),(2211,'Motatán',22),
(2212,'Pampán',22),(2213,'Pampanito',22),(2214,'Rafael Rangel',22),(2215,'San Rafael de Carvajal',22),
(2216,'Sucre',22),(2217,'Trujillo',22),(2218,'Urdaneta',22),(2219,'Valera',22),(2220,'Villanueva',22),

-- Yaracuy (23) — 14 municipios
(2301,'Bolívar',23),(2302,'Bruzual',23),(2303,'Cocorote',23),(2304,'Independencia',23),
(2305,'La Trinidad',23),(2306,'Nirgua',23),(2307,'Páez',23),(2308,'Peña',23),
(2309,'San Felipe',23),(2310,'Sucre',23),(2311,'Urachiche',23),(2312,'Veroes',23),
(2313,'Manuel Monge',23),(2314,'Arístides Bastidas',23),

-- Zulia (24) — 21 municipios
(2401,'Almirante Padilla',24),(2402,'Baralt',24),(2403,'Cabimas',24),(2404,'Catatumbo',24),
(2405,'Colón',24),(2406,'Francisco Javier Pulgar',24),(2407,'Jesús Enrique Lossada',24),
(2408,'Jesús María Semprún',24),(2409,'La Cañada de Urdaneta',24),(2410,'Lagunillas',24),
(2411,'Machiques de Perijá',24),(2412,'Mara',24),(2413,'Maracaibo',24),(2414,'Miranda',24),
(2415,'Páez',24),(2416,'Rosario de Perijá',24),(2417,'San Francisco',24),(2418,'Santa Rita',24),
(2419,'Simón Bolívar',24),(2420,'Sucre',24),(2421,'Valmore Rodríguez',24);


-- ── PARROQUIAS ───────────────────────────────────────────────
-- Se incluyen las parroquias más relevantes y capitales por municipio.
-- Para el MVP esto permite cubrir la mayoría de búsquedas hiperlocales.

INSERT INTO parroquias (id, nombre, municipio_id) VALUES
-- Amazonas
(10101,'Puerto Ayacucho',103),(10102,'Parhueña',103),(10103,'Platanillal',103),
(10201,'San Fernando de Atabapo',102),(10301,'Maroa',106),(10401,'San Carlos de Río Negro',107),
(10501,'La Esmeralda',101),(10601,'Yapacana',104),(10701,'Samariapo',105),

-- Anzoátegui
(20101,'Anaco',201),(20201,'Aragua de Barcelona',202),
(20301,'Barcelona',203),(20302,'El Carmen',203),(20303,'San Cristóbal',203),
(20401,'Bergantín',204),(20501,'Clarines',205),(20601,'Boca del Pao',206),
(20701,'El Chaparro',207),(20801,'Carvajal',208),(20901,'Lecherías',209),
(21001,'El Pao de Barcelona',210),(21101,'El Tigre',211),(21102,'San José de Guanipa',211),
(21201,'Guanta',212),(21301,'Pariaguán',213),(21401,'Puerto La Cruz',214),
(21501,'El Pilar',215),(21601,'Libertad de Anzoátegui',216),(21701,'McGregor',217),
(21801,'Onoto',218),(21901,'Aragua de Maturín',219),(22001,'Píritu',220),(22101,'Píritu de Anzoátegui',221),

-- Apure
(30101,'Achaguas',301),(30201,'Biruaca',302),(30301,'Bruzual',303),(30401,'Elorza',304),
(30501,'San Juan de Payara',305),(30601,'Guasdualito',306),(30701,'San Fernando de Apure',307),
(30702,'San Rafael de Atamaica',307),

-- Aragua
(40101,'Barbacoas',401),(40201,'Camatagua',402),(40301,'Mariara',403),
(40401,'Maracay',404),(40402,'Las Delicias',404),(40403,'El Limón',404),(40404,'San Isidro',404),
(40501,'Santa Cruz',405),(40601,'Palo Negro',406),(40701,'El Consejo',407),
(40801,'Magdaleno',408),(40901,'Cagua',409),(41001,'Ocumare de la Costa',410),
(41101,'San Casimiro',411),(41201,'San Sebastián de los Reyes',412),(41301,'Turmero',413),
(41401,'Santa Cruz de Aragua',414),(41501,'Sucre de Aragua',415),(41601,'Tovar de Aragua',416),
(41701,'Urdaneta de Aragua',417),(41801,'Villa de Cura',418),

-- Barinas
(50101,'Arismendi de Barinas',501),(50201,'Socopó',502),(50301,'Arismendi',503),
(50401,'Barinas',504),(50402,'Alto Barinas',504),(50403,'Ramón Ignacio Méndez',504),
(50501,'Barinitas',505),(50601,'Bum Bum',506),(50701,'Ezequiel Zamora',507),
(50801,'Obispos',508),(50901,'Ciudad de Nutrias',509),(51001,'Rojas',510),
(51101,'Libertad de Barinas',511),(51201,'Ticoporo',512),

-- Bolívar
(60101,'Ciudad Bolívar',601),(60102,'Agua Salada',601),(60103,'Dalla Costa',601),
(60201,'Ciudad Guayana',602),(60202,'Cachamay',602),(60203,'Unare',602),
(60301,'Caicara del Orinoco',603),(60401,'El Callao',604),(60501,'Ikabarú',605),
(60502,'Gran Sabana',605),(60601,'Heres',606),(60701,'Upata',607),
(60801,'Tumeremo',608),(60901,'Guasipati',609),(61001,'Tumeremo',610),(61101,'Maripa',611),

-- Carabobo
(70101,'Bejuma',701),(70201,'Güigüe',702),(70301,'Aguas Calientes',703),
(70401,'Guacara',704),(70402,'Ciudad Alianza',704),(70501,'Morón',705),(70601,'Tocuyito',706),
(70701,'Los Guayos',707),(70801,'Miranda de Carabobo',708),(70901,'Montalbán',709),
(71001,'Naguanagua',710),(71101,'Puerto Cabello',711),(71102,'Goaigoaza',711),
(71201,'San Diego',712),(71301,'San Joaquín',713),(71401,'Valencia',714),(71402,'San José',714),
(71403,'Miguel Peña',714),(71404,'Candelaria',714),(71405,'Rafael Urdaneta',714),
(71406,'Catedral',714),(71407,'El Socorro',714),(71408,'San Blas',714),

-- Cojedes
(80101,'Anzoátegui de Cojedes',801),(80201,'Tinaco',802),(80301,'Lima Blanco',803),
(80401,'Pao',804),(80501,'Ricaurte',805),(80601,'Rómulo Gallegos de Cojedes',806),
(80701,'San Carlos',807),(80702,'Rómulo Betancourt',807),(80801,'Tinaco de Cojedes',808),
(80901,'Tinaquillo',809),

-- Delta Amacuro
(90101,'Curiapo',901),(90201,'Imataca',902),(90301,'Pedernales',903),(90401,'Tucupita',904),

-- Distrito Capital
(100101,'Altagracia',1001),(100102,'Antímano',1001),(100103,'Caricuao',1001),
(100104,'Catedral',1001),(100105,'El Junquito',1001),(100106,'El Paraíso',1001),
(100107,'El Recreo',1001),(100108,'El Valle',1001),(100109,'La Pastora',1001),
(100110,'La Vega',1001),(100111,'Macarao',1001),(100112,'San Agustín',1001),
(100113,'San Bernardino',1001),(100114,'San José',1001),(100115,'San Juan',1001),
(100116,'San Pedro',1001),(100117,'Santa Rosalía',1001),(100118,'Santa Teresa',1001),
(100119,'Sucre de DC',1001),(100120,'23 de Enero',1001),(100121,'Coche',1001),

-- Falcón
(110101,'Acosta de Falcón',1101),(110201,'Bolívar de Falcón',1102),(110301,'Capatárida',1103),
(110401,'Punto Fijo',1104),(110402,'Carirubana',1104),(110403,'Las Calderas',1104),
(110501,'La Vela de Coro',1105),(110601,'Dabajuro',1106),(110701,'Mirimire',1107),
(110801,'Coro',1108),(110901,'Pueblo Nuevo',1109),(111001,'Tocuyo de la Costa',1110),
(111101,'Jacura',1111),(111201,'Los Taques',1112),(111301,'Mene de Mauroa',1113),
(111401,'Tucacas',1114),(111501,'Chichiriviche',1115),(111601,'Palmasola',1116),
(111701,'Cabure',1117),(111801,'Piritu de Falcón',1118),(111901,'San Francisco de Falcón',1119),
(112001,'Silva',1120),(112101,'Güiria de Falcón',1121),(112201,'Tocópero',1122),
(112301,'Unión de Falcón',1123),(112401,'Urumaco',1124),(112501,'Pueblo Cumarebo',1125),

-- Guárico
(120101,'Camaguán',1201),(120201,'Chaguaramas',1202),(120301,'El Socorro',1203),
(120401,'Cabruta',1204),(120501,'Tucupido',1205),(120601,'Pariaguán de Guárico',1206),
(120701,'San Juan de los Morros',1207),(120801,'Mellado',1208),(120901,'Las Mercedes',1209),
(121001,'Valle de La Pascua',1210),(121101,'Monagas de Guárico',1211),(121201,'Ortiz',1212),
(121301,'Cazorla',1213),(121401,'San Juan de los Morros Cap.',1214),(121501,'Urdaneta de Guárico',1215),

-- La Guaira
(130101,'Carlos Soublette',1301),(130102,'Caraballeda',1301),(130103,'Carayaca',1301),
(130104,'El Junko',1301),(130105,'La Guaira',1301),(130106,'Maiquetía',1301),
(130107,'Macuto',1301),(130108,'Naiguatá',1301),(130109,'Urimare',1301),

-- Lara
(140101,'Andrés Eloy Blanco de Lara',1401),(140201,'Crespo',1402),(140301,'Barquisimeto',1403),
(140302,'Catedral de Barquisimeto',1403),(140303,'Concepción',1403),(140304,'El Cují',1403),
(140305,'Buena Vista',1403),(140401,'Quíbor',1404),(140501,'Morán de Lara',1405),
(140601,'Cabudare',1406),(140701,'Sarare',1407),(140801,'Carora',1408),(140901,'Urdaneta de Lara',1409),

-- Mérida
(150101,'El Vigía',1501),(150201,'Andrés Bello de Mérida',1502),(150301,'Aricagua',1503),
(150401,'Canaguá',1504),(150501,'Acequias',1505),(150601,'Caracciolo Parra',1506),
(150701,'Las Piedras',1507),(150801,'Guaraque',1508),(150901,'Briceño',1509),
(151001,'Mérida',1510),(151002,'Arias',1510),(151003,'Caracciolo Parra y Olmedo',1510),
(151004,'Domingo Peña',1510),(151005,'El Llano',1510),(151006,'Jacinto Plaza',1510),
(151007,'Juan Rodríguez Suárez',1510),(151008,'Mariano Picón Salas',1510),
(151009,'Milla',1510),(151010,'Osuna Rodríguez',1510),(151011,'Sagrario',1510),
(151201,'Tabay',1512),(151301,'Padre Noguera',1513),(151401,'Pueblo Llano',1514),
(151501,'Mucuchíes',1515),(151601,'Bailadores',1516),(151701,'Mucurubá',1517),
(151801,'Sucre de Mérida',1518),(151901,'Tovar de Mérida',1519),(152001,'Lagunillas',1520),
(152101,'Urdaneta de Mérida',1521),(152201,'Zea',1522),(152301,'Arapuey',1523),

-- Miranda
(160101,'Caucagua',1601),(160201,'Andrés Bello de Miranda',1602),(160301,'Baruta',1603),
(160302,'El Cafetal',1603),(160303,'Las Minas',1603),(160401,'Higuerote',1604),
(160501,'Mamporal',1605),(160601,'Carrizal',1606),(160701,'Chacao',1607),
(160801,'Charallave',1608),(160901,'El Hatillo',1609),(161001,'Los Teques',1610),
(161002,'Cecilio Acosta',1610),(161003,'El Jarillo',1610),(161101,'Santa Lucía',1611),
(161201,'Ocumare del Tuy',1612),(161301,'San Antonio de los Altos',1613),
(161401,'Río Chico',1614),(161501,'Santa Teresa del Tuy',1615),(161601,'Cúpira',1616),
(161701,'Guarenas',1617),(161801,'Petare',1618),(161802,'Caucagüita',1618),
(161803,'Filas de Mariche',1618),(161804,'La Dolorita',1618),(161901,'Sucre de Miranda',1619),
(162001,'Urdaneta de Miranda',1620),(162101,'Guatire',1621),

-- Monagas
(170101,'Punta de Mata',1701),(170201,'Aguasay',1702),(170301,'Maturín Cap.',1703),
(170401,'Caripe',1704),(170501,'Cedeño de Monagas',1705),(170601,'Punta de Mata',1706),
(170701,'Libertador de Monagas',1707),(170801,'Maturín',1708),(170802,'Las Cocuizas',1708),
(170803,'El Corozo',1708),(170901,'Aragua de Maturín',1709),(171001,'Punceres',1710),
(171101,'Santa Bárbara de Monagas',1711),(171201,'Barrancas del Orinoco',1712),(171301,'Uracoa',1713),

-- Nueva Esparta
(180101,'Arismendi de Nueva Esparta',1801),(180201,'Antolín del Campo',1802),
(180301,'San Juan Bautista',1803),(180401,'Los Barales',1804),(180501,'Santa Ana',1805),
(180601,'Gran Roque',1806),(180701,'La Asunción',1807),(180801,'Boca de Río',1808),
(180901,'Porlamar',1809),(181001,'El Maco',1810),(181101,'Pampatar',1811),

-- Portuguesa
(190101,'Acarigua',1901),(190201,'Agua Blanca',1902),(190301,'Araure',1903),
(190401,'Piritu de Portuguesa',1904),(190501,'Guanare',1905),(190502,'San José de la Montaña',1905),
(190601,'Guanarito',1906),(190701,'Ospino',1907),(190801,'Libres',1908),
(190901,'Ospino Cap.',1909),(191001,'Páez de Portuguesa',1910),(191101,'Papelón',1911),
(191201,'Boconoito',1912),(191301,'San Rafael de Onoto',1913),(191401,'Santa Rosalía',1914),

-- Sucre
(200101,'Andrés Bello de Sucre',2001),(200201,'San José de Areocuar',2002),
(200301,'El Pilar',2003),(200401,'Cumaná',2004),(200402,'Valentín Valiente',2004),
(200403,'Altagracia de Cumaná',2004),(200404,'San Juan',2004),
(200501,'Bolívar de Sucre',2005),(200601,'Yaguaraparo',2006),(200701,'Araya',2007),
(200801,'Cariaco',2008),(200901,'Casanay',2009),(201001,'San Antonio del Golfo',2010),
(201101,'Cumanacoa',2011),(201201,'Cariaco Cap.',2012),(201301,'Cumaná Cap.',2013),
(201401,'Güiria',2014),(201501,'Casanay de Sucre',2015),

-- Táchira
(210101,'Pregonero',2101),(210201,'San Antonio del Táchira',2102),(210301,'Bolívar de Táchira',2103),
(210401,'Táriba',2104),(210501,'Santa Ana del Táchira',2105),(210601,'Delicias',2106),
(210701,'San Simón',2107),(210801,'La Fría',2108),(210901,'Palmira',2109),
(211001,'Independencia de Táchira',2110),(211101,'La Grita',2111),(211201,'Michelena',2112),
(211301,'Rubio',2113),(211401,'Colón de Táchira',2114),(211501,'Capacho',2115),
(211601,'Lobatera',2116),(211701,'Michelena Cap.',2117),(211801,'Montilla',2118),
(211901,'Coloncito',2119),(212001,'Ureña',2120),(212101,'Abejales',2121),
(212201,'Maldonado',2122),(212301,'San Cristóbal',2123),(212302,'Pedro María Morantes',2123),
(212303,'La Concordia',2123),(212304,'San Juan de Colón',2123),(212401,'San Judas Tadeo',2124),
(212501,'Seboruco',2125),(212601,'Cordero',2126),(212701,'San Pablo',2127),
(212801,'Palmira de Táchira',2128),(212901,'Pregonero de Táchira',2129),

-- Trujillo
(220101,'Andrés Bello de Trujillo',2201),(220201,'Boconó',2202),(220301,'Bolívar de Trujillo',2203),
(220401,'Candelaria',2204),(220501,'Carache',2205),(220601,'Escuque',2206),
(220701,'Carvajal',2207),(220801,'La Ceiba',2208),(220901,'Pampán de Trujillo',2209),
(221001,'Monte Carmelo',2210),(221101,'Motatán',2211),(221201,'Pampán',2212),
(221301,'Pampanito',2213),(221401,'Trujillo Cap.',2214),(221501,'San Rafael de Carvajal',2215),
(221601,'Sucre de Trujillo',2216),(221701,'Trujillo',2217),(221801,'Urdaneta de Trujillo',2218),
(221901,'Valera',2219),(222001,'La Plazuela',2220),

-- Yaracuy
(230101,'Bolívar de Yaracuy',2301),(230201,'Chivacoa',2302),(230301,'Cocorote',2303),
(230401,'Independencia de Yaracuy',2304),(230501,'La Trinidad',2305),(230601,'Nirgua',2306),
(230701,'Páez de Yaracuy',2307),(230801,'Peña',2308),(230901,'San Felipe',2309),
(231001,'Sucre de Yaracuy',2310),(231101,'Urachiche',2311),(231201,'Veroes',2312),
(231301,'Yaritagua',2313),(231401,'Arístides Bastidas',2314),

-- Zulia
(240101,'Las Bocas',2401),(240201,'Baralt',2402),(240202,'Libertad de Zulia',2402),
(240301,'Cabimas',2403),(240302,'Ambrosio',2403),(240401,'Catatumbo',2404),
(240501,'Colón de Zulia',2405),(240601,'Bobures',2406),(240701,'Lossada',2407),
(240801,'Casigua el Cubo',2408),(240901,'Concepción',2409),(241001,'Lagunillas',2410),
(241101,'Machiques',2411),(241201,'Mara',2412),(241202,'San Rafael del Moján',2412),
(241301,'Maracaibo',2413),(241302,'Antonio Borjas Romero',2413),(241303,'Caquetío',2413),
(241304,'Chiquinquirá',2413),(241305,'Christ de Aranza',2413),(241306,'Cecilio Acosta de Zulia',2413),
(241307,'Francisco Eugenio Bustamante',2413),(241308,'Idelfonso Vásquez',2413),
(241309,'Juana de Ávila',2413),(241310,'Luis Hurtado Higuera',2413),
(241311,'Manuel Dagnino',2413),(241312,'Olegario Villalobos',2413),
(241313,'Raúl Leoni de Zulia',2413),(241314,'Santa Lucía de Zulia',2413),
(241315,'San Isidro de Zulia',2413),(241401,'Miranda de Zulia',2414),
(241501,'Páez de Zulia',2415),(241601,'Rosario de Perijá',2416),(241701,'San Francisco',2417),
(241801,'Santa Rita',2418),(241901,'San Carlos del Zulia',2419),(242001,'Bobures de Zulia',2420),
(242101,'Valmore Rodríguez',2421);


-- ============================================================
-- SECCIÓN 7: VISTAS ÚTILES PARA LA API
-- ============================================================

-- Vista: búsqueda pública de voluntarios activos
CREATE OR REPLACE VIEW v_directorio_publico AS
SELECT
    v.id,
    v.nombre_completo,
    v.telefono,
    v.whatsapp,
    v.email,
    e.nombre       AS especialidad,
    e.icono        AS especialidad_icono,
    p.nombre       AS parroquia,
    m.nombre       AS municipio,
    es.nombre      AS estado,
    v.disponibilidad,
    v.acepta_presencial,
    v.acepta_remoto,
    v.descripcion
FROM voluntarios v
JOIN especialidades e  ON e.id = v.especialidad_id
JOIN parroquias    p   ON p.id = v.parroquia_id
JOIN municipios    m   ON m.id = p.municipio_id
JOIN estados       es  ON es.id = m.estado_id
WHERE v.estado_perfil = 'activo';

-- Vista: panel de moderación
CREATE OR REPLACE VIEW v_moderacion AS
SELECT
    v.id,
    v.nombre_completo,
    v.cedula,
    v.email,
    v.estado_perfil,
    e.nombre      AS especialidad,
    v.numero_colegiatura,
    p.nombre      AS parroquia,
    m.nombre      AS municipio,
    es.nombre     AS estado,
    v.fecha_registro,
    COUNT(r.id)   AS total_reportes
FROM voluntarios v
JOIN especialidades e  ON e.id = v.especialidad_id
JOIN parroquias    p   ON p.id = v.parroquia_id
JOIN municipios    m   ON m.id = p.municipio_id
JOIN estados       es  ON es.id = m.estado_id
LEFT JOIN reportes r   ON r.voluntario_id = v.id AND r.resuelto = FALSE
GROUP BY v.id, e.nombre, p.nombre, m.nombre, es.nombre;


-- ============================================================
-- FIN DEL SCHEMA · VYNTIA · vyntia_voluntarios_db
-- ============================================================
