import { CONTACT, LEGAL } from '../config';

const privacyContact = LEGAL.privacyEmail || CONTACT.email;

// The data protection and cookie sections of the Terms. Shown inside the Terms
// modal (as sections 8 and 9) and on their own at /privacy.
export const PRIVACY_SECTIONS = [
  [
    'Data Protection and NDPA 2023 Compliance',
    'In compliance with the Nigeria Data Protection Act 2023 (NDPA), CAS Diesel collects and processes corporate account data, NMDPRA licensing documentation, driver credentials, and transaction logs strictly for counterparty verification, order fulfillment, and legal compliance. Delivery gate GPS coordinates are restricted to active counterparties and purged upon delivery completion. We do not sell data or engage in behavioral advertising. Inquiries may be directed to ' + (privacyContact ? privacyContact : 'support@casdiesel.com') + '.'
  ],
  [
    'Session Security and Cookie Policy',
    'The platform employs a single encrypted, HttpOnly security session cookie strictly necessary to maintain authenticated login state. We do not use third-party marketing trackers or tracking cookies across external websites.'
  ]
];
