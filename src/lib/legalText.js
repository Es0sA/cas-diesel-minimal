import { CONTACT, LEGAL } from '../config';

const privacyContact = LEGAL.privacyEmail || CONTACT.email || 'support@casdiesel.com';
const contactLine = [CONTACT.email, CONTACT.phone].filter(Boolean).join(' or ');

// The Terms and Conditions. Shown in the modal and on their own at /terms.
export const TERMS_SECTIONS = [
  [
    '1. Platform Scope and Marketplace Operation',
    'CAS Diesel is an institutional marketplace platform connecting corporate buyers of Automotive Gas Oil (AGO, diesel) with accredited downstream vendors and calibrated fleet drivers across Nigerian loading terminals. We operate the technological and escrow coordination infrastructure. We are not the seller of the fuel, the physical owner of the cargo, or the carrier. The contract of sale is formed directly between the buyer and the accredited vendor, with dispatch carried out by the vendor or its assigned calibrated fleet driver.'
  ],
  [
    '2. Counterparty Requirements and NMDPRA Accreditation',
    'Platform participation is restricted to incorporated corporate buyers, licensed petroleum marketers and vendors holding valid NMDPRA (Nigerian Midstream and Downstream Petroleum Regulatory Authority) operating credentials, and fleet drivers possessing verified driver licences and calibrated tanker charts. All participants must provide genuine, verifiable documentation. CAS Diesel verifies credentials prior to depot accreditation and reserves the right to suspend or remove any entity that fails ongoing compliance checks.'
  ],
  [
    '3. Ex-Depot Pricing and Escrow Settlement Protocol',
    'Accredited vendors publish indicative ex-depot spot rates per liter. When a corporate buyer places an order, the agreed price is fixed upon escrow funding. Buyer funds are held securely in institutional escrow custody and are never disbursed prior to confirmed delivery. Payment is released to the vendor only when the buyer completes gate inspection and delivery sign-off, or pursuant to a formal dispute determination. Platform transaction fees, where applicable, are transparently itemized prior to payment.'
  ],
  [
    '4. Gantry Dispatch and Discharge Gate Delivery Verification',
    'Following loading and terminal seal application at the designated depot, the vendor dispatches a calibrated tanker. The platform provides waypoint tracking and arrival perimeter detection as an operational aid. The driver must arrive with intact depot seals and a certified waybill. Delivery is officially completed only when the buyer confirms physical receipt at the discharge gate.'
  ],
  [
    '5. Product Quality Standards, Inspection and Dispute Resolution',
    'All Automotive Gas Oil supplied through the platform must strictly conform to official NMDPRA product specifications. If a buyer identifies short delivery or off-spec product, a dispute must be formally opened through the order console prior to discharge. Parties must preserve official loading samples, retain lab analysis reports, and maintain waybill records. CAS Diesel coordinates evidence review, which may include joint independent re-testing, to direct the final release or refund of escrowed funds.'
  ],
  [
    '6. Cancellation and Refund Policy',
    'An order may be cancelled prior to gantry dispatch upon mutual agreement of both buyer and vendor through the platform, prompting an immediate full refund of escrow funds to the buyer. Once a tanker is loaded and sealed in transit, cancellation cannot be unilaterally executed. A buyer who unlawfully refuses an on-specification delivery remains liable for reasonable logistics and terminal handling expenses incurred by the vendor.'
  ],
  [
    '7. Demurrage and Detention Terms',
    'CAS Diesel does not assess, collect, or enforce haulage demurrage or site detention charges. Any allowable waiting-time provisions or detention thresholds must be agreed in writing between the buyer and the vendor before truck dispatch.'
  ],
  [
    '8. Delivery Verification, Dispute Window and Escalation',
    'Delivery is verified by the buyer at the discharge gate, and the recorded quantity and quality result form the basis of payment. When the buyer records a verification and the vendor accepts it or does not contest it within 72 hours, the escrowed amount for the verified quantity releases to the vendor and any balance refunds to the buyer. When a dispute is opened, either party may propose a settlement split, and if the other party accepts, funds release according to that agreement. When a dispute is unverified, suspended or remains contested past the 72-hour resolution window, funds do not release automatically and the matter escalates to CAS Diesel Administrators for manual review. Administrators decide on the evidence submitted by both parties, and their determination on the release or refund of escrowed funds is final as between the parties within the platform.'
  ],
  [
    '9. Intellectual Property',
    'The CAS Diesel name, logo, website, software, interface designs, databases and all related content are owned by CAS Diesel or its licensors and are protected by applicable intellectual property laws. Participants receive a limited, non-exclusive, non-transferable right to use the platform for its intended purpose and may not copy, modify, reverse engineer, scrape or resell any part of it. Documents and data that a participant uploads remain the property of that participant, who grants CAS Diesel a licence to store, process and display them as needed to operate the platform, verify counterparties and resolve disputes.'
  ],
  [
    '10. Data Protection and Cookies',
    'How we collect and use personal data, who processes it for us and the rights you hold under the Nigeria Data Protection Act 2023 are set out in our Privacy Policy at casdiesel.com/privacy, which forms part of these Terms. The platform uses a single HttpOnly session cookie that is strictly necessary to keep you signed in. Privacy enquiries may be sent to ' + privacyContact + '.'
  ],
  [
    '11. Limitation of Liability',
    'The platform is provided on an institutional as-available basis. CAS Diesel is a technology and escrow coordination provider. It is not the seller, the carrier or the owner of the fuel and is not liable for transit delays, queue times at depots, road conditions, vehicle breakdowns, product quality or any act or omission of a buyer, a vendor or a driver. Estimated arrival times are operational aids and are not guarantees. To the maximum extent permitted under applicable law, CAS Diesel liability is limited strictly to the transaction fees received for the specific transaction in question, and CAS Diesel is not liable for indirect or consequential loss, loss of profit or loss of business.'
  ],
  [
    '12. Force Majeure',
    'Neither CAS Diesel nor any participant is liable for a failure or delay in performing an obligation under these Terms where it is caused by events beyond reasonable control. These include acts of God, flood, fire, civil unrest, strikes, terminal or port closures, government or regulatory action, fuel supply shortages, road closures, power or telecommunications failure and failure of third-party infrastructure. The affected party must notify the other parties through the platform as soon as reasonably possible. Funds already held in escrow remain locked while the event continues and are then released or refunded under sections 5, 6 and 8, or by the decision of CAS Diesel Administrators.'
  ],
  [
    '13. Governing Law and Jurisdiction',
    'These Terms and Conditions are governed exclusively by the laws of the Federal Republic of Nigeria, with jurisdiction vested in Nigerian courts of competent authority. Participants agree to raise any dispute through the platform dispute process in sections 5 and 8 before starting court proceedings.'
  ],
  [
    '14. Official Contact',
    contactLine ? 'Official inquiries regarding these Terms and Conditions may be addressed to: ' + contactLine + '.' : 'Official inquiries may be directed to info@casdiesel.com.'
  ]
];

// The Privacy Policy. Shown on its own at /privacy.
export const PRIVACY_SECTIONS = [
  [
    '1. Who We Are',
    'CAS Diesel Logistics Ltd operates the CAS Diesel platform and is the data controller for the personal data described in this policy. This policy applies under the Nigeria Data Protection Act 2023 (NDPA) and, to the extent still relevant, the Nigeria Data Protection Regulation 2019 (NDPR). It forms part of our Terms and Conditions.'
  ],
  [
    '2. Data We Collect',
    'Account data: email address and a hashed password. Company data: company name, registration number, business and street address, city, state and contact phone. Driver data: name, licence number and truck plate. Verification documents: corporate registration, NMDPRA licence, driver licence and truck calibration charts. Order data: volumes, prices, delivery receiver name, phone and address, gate coordinates, truck location while a delivery is in transit, delivery verification records and chat messages between parties. Waitlist data: name, WhatsApp number and email. Technical data: IP address (used for security and rate limiting) and the session cookie.'
  ],
  [
    '3. Why We Process Data and Our Lawful Basis',
    'Performance of a contract: we process account, company, order and delivery data to run the marketplace, hold and release escrow and track deliveries. Legal obligation: we keep financial and transaction records and carry out counterparty verification to meet tax, accounting and anti-money laundering duties. Legitimate interests: we use limited technical data to secure the platform, prevent fraud and resolve disputes, balanced against your rights. Consent: we send waitlist updates and price alerts only where you have agreed, and you can withdraw consent at any time. We do not sell personal data and we do not use it for behavioural advertising.'
  ],
  [
    '4. Who Processes Data For Us',
    'We use the following processors under written terms. Cloudflare provides DNS, content delivery, the waitlist form proxy and cookie-free web analytics. Render hosts the application servers. Neon hosts the production database. Cloudflare R2 stores uploaded verification documents and certificates. Brevo delivers transactional emails such as verification codes and password resets. These processors act only on our instructions and may not use your data for their own purposes. Counterparties to an order see the business details needed to complete that order.'
  ],
  [
    '5. International Transfers',
    'Some processors store or handle data outside Nigeria, including in the United States and Europe. Where personal data leaves Nigeria we rely on the safeguards recognised by the NDPA, including contractual protections and the security commitments of each processor, and we transfer only the data needed for the service.'
  ],
  [
    '6. How Long We Keep Data',
    'Account and company data is kept while your account is active. When you delete your account we anonymise your profile straight away and erase the messages you sent. Uploaded verification documents and certificates are erased 30 days after deletion, during which a returning user can recover them. Financial and transaction records, including orders, escrow ledger entries, delivery verifications and audit logs, are kept for 7 years to meet tax and regulatory requirements, with delivery contact details and gate coordinates removed once your account is deleted. Delivery gate coordinates are also cleared when an order is completed or cancelled. One-time email codes expire within minutes. Waitlist details are kept until you ask us to remove them.'
  ],
  [
    '7. Your Rights',
    'You have the right to access the personal data we hold about you, to have it corrected, to have it erased, to restrict or object to its processing, to receive a portable copy and to withdraw consent at any time. You can delete your account yourself in Profile Settings, which is not possible while you have orders in progress or open requests for quotes. For any other request write to our privacy contact below. We respond without undue delay and within one month. Erasure is subject to the retention periods in section 6.'
  ],
  [
    '8. Security and Breaches',
    'Passwords are stored as one-way hashes, traffic is encrypted in transit, access to documents uses short-lived signed links and the session cookie is HttpOnly. Where a personal data breach is likely to put your rights at risk we will notify the Nigeria Data Protection Commission within 72 hours of becoming aware and will inform affected users without undue delay.'
  ],
  [
    '9. Cookies and Analytics',
    'The platform sets one HttpOnly session cookie that is strictly necessary to keep you signed in. Cloudflare Web Analytics measures page visits and performance without cookies and without tracking individuals across other sites. We do not use advertising or marketing trackers.'
  ],
  [
    '10. Children',
    'The platform is for businesses and is not directed at anyone under 18. We do not knowingly collect data from children.'
  ],
  [
    '11. Complaints and Contact',
    'Questions, rights requests and complaints can be sent to ' + privacyContact + '. You also have the right to lodge a complaint with the Nigeria Data Protection Commission (NDPC).'
  ],
  [
    '12. Changes to This Policy',
    'We will update this policy when our practices change and will show the new effective date at the top of this page. Material changes will also be notified to registered users by email or in the platform.'
  ]
];
