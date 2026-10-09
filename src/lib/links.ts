export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const parts = [
  { id: 'podstawa', label: 'Podstawa', mark: '01', color: '#1D4ED8', description: 'Stanowisko, cykl, pamięć i zderzaki.' },
  { id: 'przekazniki', label: 'Przekaźniki', mark: '02', color: '#B45309', description: 'Od styków do pełnego układu sterowania.' },
  { id: 'ttl', label: 'TTL', mark: '03', color: '#6D28D9', description: 'Funkcje logiczne, NAND i pamięć SR.' },
  { id: 'logo', label: 'LOGO', mark: '04', color: '#047857', description: 'Programowanie opisanego LOGO 230 RC.' },
];
