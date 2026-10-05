// Real contact details. Anything left empty is hidden from the site.
export const CONTACT = {
  email: '',
  phone: '',
  address: '',
  hours: ''
};

export const hasContact = Object.values(CONTACT).some(Boolean);
