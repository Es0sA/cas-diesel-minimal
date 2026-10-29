import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { CONTACT, LEGAL } from '../config';
import { PRIVACY_SECTIONS } from '../lib/legalText';
import { usePageTitle } from '../lib/usePageTitle';

const operator = [LEGAL.entityName, LEGAL.rcNumber && `RC ${LEGAL.rcNumber}`, LEGAL.registeredAddress].filter(Boolean).join(', ');

export default function Privacy({ onOpenTerms }) {
  usePageTitle('Privacy Policy', 'How CAS Diesel collects, uses, shares and retains personal data under the Nigeria Data Protection Act 2023, and the rights you hold.');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className="flex items-center gap-2 text-cas-amberDark text-xs font-bold uppercase tracking-wider mb-3">
        <ShieldCheck className="w-4 h-4" aria-hidden="true" />
        <span>Privacy</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-cas-slate tracking-tight leading-tight">Privacy Policy</h1>
      <p className="mt-3 text-sm text-cas-muted leading-relaxed">
        <span className="font-bold text-cas-slate">Effective date:</span> {LEGAL.lastUpdated}.
        {operator && <span> Operated by {operator}.</span>}
      </p>

      <div className="mt-8 space-y-7">
        {PRIVACY_SECTIONS.map(([title, text]) => (
          <section key={title}>
            <h2 className="text-xl font-bold text-cas-slate leading-tight">{title}</h2>
            <p className="mt-2 text-sm text-cas-muted leading-relaxed">{text}</p>
          </section>
        ))}
      </div>

      <p className="mt-10 pt-6 border-t border-cas-border text-sm text-cas-muted leading-relaxed">
        These sections are part of our{' '}
        <button type="button" onClick={() => onOpenTerms && onOpenTerms('terms')} className="underline underline-offset-2 hover:text-cas-slate font-semibold">Terms &amp; Conditions</button>.
        {CONTACT.email && <> Questions can go to {LEGAL.privacyEmail || CONTACT.email}.</>}{' '}
        <Link to="/" className="underline underline-offset-2 hover:text-cas-slate font-semibold">Back to home</Link>
      </p>
    </div>
  );
}
