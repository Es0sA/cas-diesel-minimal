import React from 'react';
import { Link } from 'react-router-dom';
import { ABOUT_INTRO, PILLARS } from '../lib/aboutContent';
import { usePageTitle } from '../lib/usePageTitle';

export default function About() {
  usePageTitle('About CAS Diesel', "CAS Diesel is Nigeria's enterprise diesel marketplace: escrow-protected payments, geofenced gate delivery and a verified fleet.");

  return (
    <section className="bg-white py-14 sm:py-20 border-b border-cas-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 mb-2">About CAS Diesel</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-cas-slate tracking-tight leading-tight">
            Nigeria&apos;s enterprise diesel marketplace.
          </h1>
          <p className="text-base text-cas-muted mt-4 leading-relaxed">{ABOUT_INTRO}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-cas-border bg-cas-canvas p-6">
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="font-extrabold text-cas-slate text-xl leading-tight">{title}</h2>
              <p className="text-sm text-cas-muted mt-2 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-cas-muted leading-relaxed">
          <Link to="/depots" className="underline underline-offset-2 hover:text-cas-slate font-semibold">Browse loading terminals</Link>
          {' '}or read our{' '}
          <Link to="/terms" className="underline underline-offset-2 hover:text-cas-slate font-semibold">Terms &amp; Conditions</Link>.
        </p>
      </div>
    </section>
  );
}
