import { depotName } from '../data/depots';

// Maps the /companies/suppliers API response onto the shape the marketplace cards use.
export function normalizeSuppliers(data) {
  const list = Array.isArray(data) ? data : data?.suppliers || [];
  return list.map((s) => ({
    ...s,
    primaryDepot: s.depotId ? depotName(s.depotId) : 'Depot not set',
    nmdpraLicense: s.registrationNumber || 'Not provided',
    pricePerLitre: s.pricePerLitre ?? 0,
    minOrderVolume: s.minOrderVolume ?? 0,
  }));
}
