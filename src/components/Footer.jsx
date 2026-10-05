import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { CONTACT, hasContact } from '../config';

const LEGAL_LINKS = [
  { key: 'terms', label: 'Terms of Service' },
  { key: 'privacy', label: 'Privacy Policy' },
  { key: 'refund', label: 'Refunds and Disputes' },
  { key: 'cookies', label: 'Cookie Policy' }
];

export default function Footer({ onOpenLegalModal }) {
  return (
    <footer className="bg-cas-slate text-slate-300 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center border-2 border-cas-amber">
                <span className="font-extrabold text-lg text-cas-amber">CAS</span>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">CAS Energy</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A wholesale diesel marketplace. Payment is held in escrow and released when delivery is confirmed at your gate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {hasContact && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">Contact</h2>
                <div className="space-y-2 text-xs text-slate-400">
                  {CONTACT.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-cas-amber shrink-0" aria-hidden="true" />
                      <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{CONTACT.phone}</a>
                    </div>
                  )}
                  {CONTACT.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-cas-amber shrink-0" aria-hidden="true" />
                      <a href={`mailto:${CONTACT.email}`} className="hover:text-white transition-colors">{CONTACT.email}</a>
                    </div>
                  )}
                  {CONTACT.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-cas-amber shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{CONTACT.address}</span>
                    </div>
                  )}
                  {CONTACT.hours && <div className="pt-2 border-t border-slate-800">{CONTACT.hours}</div>}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">Legal</h2>
              <ul className="space-y-2 text-xs">
                {LEGAL_LINKS.map((l) => (
                  <li key={l.key}>
                    <button
                      type="button"
                      onClick={() => onOpenLegalModal(l.key)}
                      className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
          Estimated arrival times depend on depot queues and road conditions. Escrow secures your funds and verifies delivery. It does not guarantee transit speed.
        </p>

        <div className="mt-6 text-xs text-slate-400">&copy; {new Date().getFullYear()} CAS Energy. All rights reserved.</div>
      </div>
    </footer>
  );
}
