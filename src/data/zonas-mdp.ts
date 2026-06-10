/**
 * Real Mar del Plata neighborhoods/zones with approximate coordinates.
 * Coordinates are centered on each area for map display purposes.
 */

export interface ZonaMdP {
  id: string;
  nombre: string;
  slug: string;
  coordenadas: { lat: number; lng: number };
  descripcion: string;
}

export const zonasMdP: ZonaMdP[] = [
  {
    id: 'zona-centro',
    nombre: 'Centro',
    slug: 'centro',
    coordenadas: { lat: -38.0042, lng: -57.5505 },
    descripcion: 'Zona céntrica con la mayor concentración de servicios, comercios y transporte público.',
  },
  {
    id: 'zona-la-perla',
    nombre: 'La Perla',
    slug: 'la-perla',
    coordenadas: { lat: -37.9955, lng: -57.5470 },
    descripcion: 'Barrio residencial costero al norte del centro, con playas tranquilas y arbolado.',
  },
  {
    id: 'zona-constitucion',
    nombre: 'Constitución',
    slug: 'constitucion',
    coordenadas: { lat: -37.9985, lng: -57.5560 },
    descripcion: 'Barrio residencial tradicional, tranquilo, con buena conectividad al centro.',
  },
  {
    id: 'zona-los-troncos',
    nombre: 'Los Troncos',
    slug: 'los-troncos',
    coordenadas: { lat: -38.0070, lng: -57.5390 },
    descripcion: 'Uno de los barrios más exclusivos de la ciudad, con casonas y amplios jardines.',
  },
  {
    id: 'zona-playa-grande',
    nombre: 'Playa Grande',
    slug: 'playa-grande',
    coordenadas: { lat: -38.0210, lng: -57.5340 },
    descripcion: 'Zona costera emblemática, con acceso a playas, restaurantes y paseo costero.',
  },
  {
    id: 'zona-guemes',
    nombre: 'Güemes',
    slug: 'guemes',
    coordenadas: { lat: -38.0130, lng: -57.5420 },
    descripcion: 'Barrio bohemio y cultural, con ferias artesanales y gastronomía variada.',
  },
  {
    id: 'zona-punta-mogotes',
    nombre: 'Punta Mogotes',
    slug: 'punta-mogotes',
    coordenadas: { lat: -38.0530, lng: -57.5330 },
    descripcion: 'Zona de balnearios familiares al sur de la ciudad, con complejo turístico.',
  },
  {
    id: 'zona-san-jose',
    nombre: 'San José',
    slug: 'san-jose',
    coordenadas: { lat: -38.0180, lng: -57.5610 },
    descripcion: 'Barrio residencial de clase media, con comercios de cercanía y plazas.',
  },
  {
    id: 'zona-puerto',
    nombre: 'Puerto',
    slug: 'puerto',
    coordenadas: { lat: -38.0340, lng: -57.5310 },
    descripcion: 'Zona portuaria con identidad propia, gastronomía de mar y barrio de pescadores.',
  },
  {
    id: 'zona-don-bosco',
    nombre: 'Don Bosco',
    slug: 'don-bosco',
    coordenadas: { lat: -37.9890, lng: -57.5580 },
    descripcion: 'Barrio residencial al norte, con parques y cercanía a la costa.',
  },
  {
    id: 'zona-san-carlos',
    nombre: 'San Carlos',
    slug: 'san-carlos',
    coordenadas: { lat: -37.9800, lng: -57.5650 },
    descripcion: 'Barrio familiar en la zona norte de la ciudad, con espacios verdes.',
  },
  {
    id: 'zona-san-juan',
    nombre: 'San Juan',
    slug: 'san-juan',
    coordenadas: { lat: -38.0250, lng: -57.5600 },
    descripcion: 'Barrio residencial amplio con avenidas arboladas y buena conectividad.',
  },
  {
    id: 'zona-nueva-pompeya',
    nombre: 'Nueva Pompeya',
    slug: 'nueva-pompeya',
    coordenadas: { lat: -38.0150, lng: -57.5700 },
    descripcion: 'Barrio de clase media con servicios esenciales y transporte público.',
  },
  {
    id: 'zona-las-avenidas',
    nombre: 'Las Avenidas',
    slug: 'las-avenidas',
    coordenadas: { lat: -38.0080, lng: -57.5630 },
    descripcion: 'Zona cercana al centro, con comercios sobre las avenidas principales.',
  },
  {
    id: 'zona-bosque-alegre',
    nombre: 'Bosque Alegre',
    slug: 'bosque-alegre',
    coordenadas: { lat: -37.9750, lng: -57.5700 },
    descripcion: 'Barrio verde en la periferia norte, con forestación y calles tranquilas.',
  },
  {
    id: 'zona-chapadmalal',
    nombre: 'Chapadmalal',
    slug: 'chapadmalal',
    coordenadas: { lat: -38.1700, lng: -57.6350 },
    descripcion: 'Localidad al sur con playas agrestes, hoteles sindicales y naturaleza.',
  },
  {
    id: 'zona-sierra-padres',
    nombre: 'Sierra de los Padres',
    slug: 'sierra-de-los-padres',
    coordenadas: { lat: -37.9430, lng: -57.7780 },
    descripcion: 'Zona serrana a 25 km del centro, con lago, naturaleza y aire puro.',
  },
  {
    id: 'zona-camet',
    nombre: 'Camet',
    slug: 'camet',
    coordenadas: { lat: -37.9300, lng: -57.5350 },
    descripcion: 'Barrio costero al norte, con canchas deportivas y acceso a la ruta.',
  },
  {
    id: 'zona-norte',
    nombre: 'Zona Norte',
    slug: 'zona-norte',
    coordenadas: { lat: -37.9600, lng: -57.5500 },
    descripcion: 'Amplia zona al norte de la ciudad con barrios residenciales y comerciales.',
  },
  {
    id: 'zona-oeste',
    nombre: 'Zona Oeste',
    slug: 'zona-oeste',
    coordenadas: { lat: -38.0100, lng: -57.5800 },
    descripcion: 'Zona en expansión al oeste, con nuevos desarrollos y barrios residenciales.',
  },
];
