// Loading depots a vendor can load from. Each entry is placed at a known location by at least two independent
// sources (regulator and industry reports, plus depot price listings). Add more only once they are confirmed.
export const DEPOTS = [
  { id: 'honeywell', name: 'Honeywell Oil & Gas (HOGL Energy)', hub: 'Apapa', area: 'Apapa', state: 'Lagos' },
  { id: 'ibeto', name: 'Ibeto Petrochemical Industries', hub: 'Ibafon, Apapa', area: 'Apapa', state: 'Lagos' },
  { id: 'aiteo', name: 'Aiteo Group', hub: 'Apapa', area: 'Apapa', state: 'Lagos' },
  { id: 'wosbab', name: 'Wosbab Energy Solutions', hub: 'Ijegun-Egba, Satellite Town', area: 'Ijegun-Egba', state: 'Lagos' },
  { id: 'emadeb', name: 'Emadeb Energy Services', hub: 'Ijegun-Egba, Satellite Town', area: 'Ijegun-Egba', state: 'Lagos' },
  { id: 'mao', name: 'MAO Petroleum', hub: 'Ijegun-Egba, Satellite Town', area: 'Ijegun-Egba', state: 'Lagos' },
  { id: 'menj', name: 'Menj Oil', hub: 'Ijegun-Egba, Satellite Town', area: 'Ijegun-Egba', state: 'Lagos' },
  { id: 'oceanpride', name: 'Ocean Pride Energy Services', hub: 'Ijegun-Egba, Satellite Town', area: 'Ijegun-Egba', state: 'Lagos' },
  { id: 'aarano', name: 'A.A. Rano Energy', hub: 'Ijegun-Egba, Satellite Town', area: 'Ijegun-Egba', state: 'Lagos' },
  { id: 'rainoil', name: 'Rainoil', hub: 'Ijegun-Egba, Satellite Town', area: 'Ijegun-Egba', state: 'Lagos' },
];

// Depot ids saved before this list was confirmed
export const LEGACY_DEPOTS = {
  ijegun: 'Ijegun-Egba tank farms, Satellite Town',
};

export const depotName = (id) => DEPOTS.find((d) => d.id === id)?.name || LEGACY_DEPOTS[id] || id;
