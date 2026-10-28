// Real contact details. Anything left empty is hidden from the site.
export const CONTACT = {
  email: 'info@casdiesel.com',
  phone: '',
  address: 'Lagos, Nigeria',
  hours: 'Mon - Fri: 8:00 AM - 6:00 PM WAT'
};

export const hasContact = Object.values(CONTACT).some(Boolean);

// Legal identity shown in the Terms and Privacy Policy. Fill these in once the
// operating company is registered. Empty values are left out of the text.
export const LEGAL = {
  entityName: 'CAS Diesel Logistics Ltd',
  rcNumber: '',
  registeredAddress: 'Lagos, Nigeria',
  privacyEmail: 'privacy@casdiesel.com',
  paymentProvider: '',
  lastUpdated: '17 October 2026'
};

// Waitlist configuration.
// When enabled is true, the homepage renders the dedicated waitlist portal.
export const WAITLIST = {
  enabled: import.meta.env.VITE_WAITLIST_ENABLED !== 'false',
  // Cloudflare Worker proxy that validates, rate limits and forwards to the sheet
  apiUrl: import.meta.env.VITE_WAITLIST_API_URL || 'https://waitlist.casdiesel.com',
  storageKey: 'cas_diesel_waitlist_signups',
  lastSubmitKey: 'cas_diesel_waitlist_last_submit',
  failedKey: 'cas_diesel_waitlist_failed_signups'
};
