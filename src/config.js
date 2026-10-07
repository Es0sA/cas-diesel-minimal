// Real contact details. Anything left empty is hidden from the site.
export const CONTACT = {
  email: '',
  phone: '',
  address: '',
  hours: ''
};

export const hasContact = Object.values(CONTACT).some(Boolean);

// Legal identity shown in the Terms and Privacy Policy. Fill these in once the
// operating company is registered. Empty values are left out of the text.
export const LEGAL = {
  entityName: '',
  rcNumber: '',
  registeredAddress: '',
  privacyEmail: '',
  paymentProvider: '',
  lastUpdated: '7 October 2026'
};
