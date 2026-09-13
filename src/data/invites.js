// Mock database of pre-generated and dynamic supplier driver invitation codes
export const INITIAL_INVITES = [
  {
    code: 'MAT-8849',
    supplierId: 'sup-1',
    supplierName: 'Matrix Downstream Distribution Ltd',
    depotName: 'Ijegun Egba Tank Farm Cluster',
    status: 'active', // 'active' | 'used' | 'expired'
    createdAt: '2026-09-12',
    usedBy: null
  },
  {
    code: 'PIN-4412',
    supplierId: 'sup-2',
    supplierName: 'Pinnacle Hydrocarbons FZE',
    depotName: 'Apapa Marine Terminal',
    status: 'active',
    createdAt: '2026-09-12',
    usedBy: null
  },
  {
    code: 'RAI-9921',
    supplierId: 'sup-3',
    supplierName: 'Rainoil Energy Logistics Hub',
    depotName: 'Ijegun Egba Tank Farm Cluster',
    status: 'active',
    createdAt: '2026-09-12',
    usedBy: null
  },
  {
    code: 'NIP-3305',
    supplierId: 'sup-4',
    supplierName: 'NIPCO Bulk Gas & AGO Operations',
    depotName: 'Apapa Marine Terminal',
    status: 'used',
    createdAt: '2026-09-11',
    usedBy: 'Suleiman Tanko (LSR-492-XA)'
  }
];
