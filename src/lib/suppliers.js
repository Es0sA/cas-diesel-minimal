import { DEPOTS } from '../data/depots';

// Maps the /companies/suppliers API response onto the shape the marketplace cards use.
export function normalizeSuppliers(data) {
  const list = Array.isArray(data) ? data : data?.suppliers || [];
  return list.map((s) => ({
    ...s,
    primaryDepot: DEPOTS.find((d) => d.id === s.depotId)?.name || s.depotId || 'Depot not set',
    nmdpraLicense: s.registrationNumber || 'Not provided',
    pricePerLitre: s.pricePerLitre ?? 0,
    minOrderVolume: s.minOrderVolume ?? 0,
    fleetSize: s.fleetSize ?? 0
  }));
}
