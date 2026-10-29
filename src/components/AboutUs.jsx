import React from 'react';
import { ABOUT_INTRO, PILLARS } from '../lib/aboutContent';

export default function AboutUs() {
  return (
    <section id="about-us" className="bg-white py-14 sm:py-20 border-b border-cas-border scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 mb-2">About CAS Diesel</div>
          <h2 className="text-3xl font-bold text-cas-slate tracking-tight leading-tight">
            Nigeria&apos;s enterprise diesel marketplace.
          </h2>
          <p className="text-base text-cas-muted mt-4 leading-relaxed">
            {ABOUT_INTRO}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-cas-border bg-cas-canvas p-6">
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-extrabold text-cas-slate text-xl leading-tight">{title}</h3>
              <p className="text-sm text-cas-muted mt-2 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
