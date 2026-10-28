// Loading depots a vendor can load from.
// Real verified loading terminals with operating company, region, and loading axis.

export const DEPOTS = [
  // Lagos Corridor: Apapa Axis
  {
    id: 'honeywell',
    name: 'Honeywell Marine Terminal',
    operator: 'HOGL Energy Ltd',
    region: 'Lagos Corridor',
    loadingAxis: 'Apapa Axis',
    area: 'Apapa',
    hub: 'Ibafon, Apapa Port Corridor',
    state: 'Lagos'
  },
  {
    id: 'ibeto',
    name: 'Ibeto Petrochemical Terminal',
    operator: 'Ibeto Petrochemical Industries Ltd',
    region: 'Lagos Corridor',
    loadingAxis: 'Apapa Axis',
    area: 'Apapa',
    hub: 'Ibafon, Apapa Port Corridor',
    state: 'Lagos'
  },
  {
    id: 'aiteo',
    name: 'Aiteo Marine Base',
    operator: 'Aiteo Group',
    region: 'Lagos Corridor',
    loadingAxis: 'Apapa Axis',
    area: 'Apapa',
    hub: 'Apapa Port Complex',
    state: 'Lagos'
  },
  // Lagos Corridor: Ijegun Axis
  {
    id: 'wosbab',
    name: 'Wosbab Energy Solutions',
    operator: 'Wosbab Energy Solutions Ltd',
    region: 'Lagos Corridor',
    loadingAxis: 'Ijegun Axis',
    area: 'Ijegun-Egba',
    hub: 'Ijegun-Egba Tank Farm Cluster, Satellite Town',
    state: 'Lagos'
  },
  {
    id: 'emadeb',
    name: 'Emadeb Energy Terminal',
    operator: 'Emadeb Energy Services Ltd',
    region: 'Lagos Corridor',
    loadingAxis: 'Ijegun Axis',
    area: 'Ijegun-Egba',
    hub: 'Ijegun-Egba Tank Farm Cluster, Satellite Town',
    state: 'Lagos'
  },
  {
    id: 'mao',
    name: 'MAO Petroleum Terminal',
    operator: 'MAO Petroleum Ltd',
    region: 'Lagos Corridor',
    loadingAxis: 'Ijegun Axis',
    area: 'Ijegun-Egba',
    hub: 'Ijegun-Egba Tank Farm Cluster, Satellite Town',
    state: 'Lagos'
  },
  {
    id: 'menj',
    name: 'Menj Oil Terminal',
    operator: 'Menj Oil Ltd',
    region: 'Lagos Corridor',
    loadingAxis: 'Ijegun Axis',
    area: 'Ijegun-Egba',
    hub: 'Ijegun-Egba Tank Farm Cluster, Satellite Town',
    state: 'Lagos'
  },
  {
    id: 'oceanpride',
    name: 'Ocean Pride Energy Terminal',
    operator: 'Ocean Pride Energy Services Ltd',
    region: 'Lagos Corridor',
    loadingAxis: 'Ijegun Axis',
    area: 'Ijegun-Egba',
    hub: 'Ijegun-Egba Tank Farm Cluster, Satellite Town',
    state: 'Lagos'
  },
  {
    id: 'aarano',
    name: 'A.A. Rano Terminal',
    operator: 'A.A. Rano Nigeria Ltd',
    region: 'Lagos Corridor',
    loadingAxis: 'Ijegun Axis',
    area: 'Ijegun-Egba',
    hub: 'Ijegun-Egba Tank Farm Cluster, Satellite Town',
    state: 'Lagos'
  },
  {
    id: 'rainoil',
    name: 'Rainoil Terminal',
    operator: 'Rainoil Ltd',
    region: 'Lagos Corridor',
    loadingAxis: 'Ijegun Axis',
    area: 'Ijegun-Egba',
    hub: 'Ijegun-Egba Tank Farm Cluster, Satellite Town',
    state: 'Lagos'
  },
  // Niger Delta Corridor: Waterline Axis
  {
    id: 'ph',
    name: 'Port Harcourt Marine Base',
    operator: 'Rivers Downstream Marine Logistics',
    region: 'Niger Delta Corridor',
    loadingAxis: 'Waterline Axis',
    area: 'Port Harcourt',
    hub: 'Rivers Downstream Marine Corridor',
    state: 'Rivers'
  },
  // Niger Delta Corridor: Warri Axis
  {
    id: 'warri',
    name: 'Warri Depot Complex',
    operator: 'Delta Coastal Marine Logistics',
    region: 'Niger Delta Corridor',
    loadingAxis: 'Warri Axis',
    area: 'Warri',
    hub: 'Delta Coastal Route',
    state: 'Delta'
  },
  {
    id: 'oghara',
    name: 'Oghara Water Depot',
    operator: 'Ethiope Downstream Operations',
    region: 'Niger Delta Corridor',
    loadingAxis: 'Warri Axis',
    area: 'Oghara',
    hub: 'Ethiope West Hub',
    state: 'Delta'
  },
  // Cross River Corridor: Calabar Axis
  {
    id: 'calabar',
    name: 'Calabar Free Trade Depot',
    operator: 'Cross River Port Access Logistics',
    region: 'Cross River Corridor',
    loadingAxis: 'Calabar Axis',
    area: 'Calabar',
    hub: 'Cross River Port Access',
    state: 'Cross River'
  }
];

// Legacy depot aliases
export const LEGACY_DEPOTS = {
  apapa: 'Apapa Marine Terminal',
  ijegun: 'Ijegun-Egba Tank Farm Cluster',
};

export const depotName = (id) => DEPOTS.find((d) => d.id === id)?.name || LEGACY_DEPOTS[id] || id;
export const getDepotById = (id) => DEPOTS.find((d) => d.id === id) || null;
