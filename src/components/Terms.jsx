import React from 'react';
import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { LEGAL } from '../config';
import { TERMS_SECTIONS } from '../lib/legalText';
import { usePageTitle } from '../lib/usePageTitle';

const operator = [LEGAL.entityName, LEGAL.rcNumber && `RC ${LEGAL.rcNumber}`, LEGAL.registeredAddress].filter(Boolean).join(', ');

export default function Terms() {
  usePageTitle('Terms & Conditions', 'The terms that govern escrow, delivery verification, disputes and liability for buyers, vendors and drivers on CAS Diesel.');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className="flex items-center gap-2 text-cas-amberDark text-xs font-bold uppercase tracking-wider mb-3">
        <Scale className="w-4 h-4" aria-hidden="true" />
        <span>Terms</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-cas-slate tracking-tight leading-tight">Terms &amp; Conditions</h1>
      <p className="mt-3 text-sm text-cas-muted leading-relaxed">
        <span className="font-bold text-cas-slate">Effective date:</span> {LEGAL.lastUpdated}.
        {operator && <span> Operated by {operator}.</span>}
      </p>

      <div className="mt-8 space-y-7">
        {TERMS_SECTIONS.map(([title, text]) => (
          <section key={title}>
            <h2 className="text-xl font-bold text-cas-slate leading-tight">{title}</h2>
            <p className="mt-2 text-sm text-cas-muted leading-relaxed">{text}</p>
          </section>
        ))}
      </div>

      <p className="mt-10 pt-6 border-t border-cas-border text-sm text-cas-muted leading-relaxed">
        Read how we handle personal data in our{' '}
        <Link to="/privacy" className="underline underline-offset-2 hover:text-cas-slate font-semibold">Privacy Policy</Link>.{' '}
        <Link to="/" className="underline underline-offset-2 hover:text-cas-slate font-semibold">Back to home</Link>
      </p>
    </div>
  );
}
