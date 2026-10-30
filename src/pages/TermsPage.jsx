import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scale, 
  FileText, 
  ShieldCheck, 
  ArrowUp, 
  Printer, 
  ChevronDown, 
  ExternalLink, 
  CheckCircle2 
} from 'lucide-react';
import { TERMS_SECTIONS } from '../lib/legalText';
import { LEGAL, CONTACT } from '../config';
import { usePageTitle } from '../lib/usePageTitle';

export default function TermsPage() {
  usePageTitle(
    'Terms & Conditions',
    'Official terms governing escrow custody, depot dispatch, delivery verification, and counterparty compliance on CAS Diesel.'
  );

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState('section-1');

  // Parse structured data from the legal text tuples
  const sections = useMemo(() => {
    return TERMS_SECTIONS.map(([rawTitle, text], idx) => {
      const match = rawTitle.match(/^(\d+)\.\s*(.*)$/);
      const rawNumber = match ? match[1] : String(idx + 1);
      const heading = match ? match[2] : rawTitle;
      const id = `section-${rawNumber}`;
      return {
        id,
        rawNumber,
        number: rawNumber.padStart(2, '0'),
        heading,
        fullTitle: rawTitle,
        text
      };
    });
  }, []);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const totalHeight = el.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Highlight active section on scroll (scroll spy)
  useEffect(() => {
    const sectionElements = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!sectionElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-10% 0px -65% 0px',
        threshold: 0
      }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // Smooth scroll handler for TOC links
  const handleScrollTo = (e, id) => {
    if (e) e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSectionId(id);
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const operatorInfo = [
    LEGAL.entityName,
    LEGAL.rcNumber && `RC ${LEGAL.rcNumber}`,
    LEGAL.registeredAddress
  ].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen bg-slate-50 font-display text-gray-800">
      {/* Subtle top reading progress bar */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-200/60"
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      >
        <div 
          className="h-full bg-cas-amber transition-[width] duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Header Section */}
      <header className="bg-cas-slate text-white border-b border-slate-800 pt-12 pb-14 sm:pt-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-800 border border-slate-700 text-cas-amber text-xs font-bold uppercase tracking-wider mb-4">
                <Scale className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Institutional Governance</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Terms &amp; Conditions
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
                Official operating agreement governing wholesale AGO transactions, NMDPRA counterparty accreditation, secure escrow custody, and discharge gate delivery verification.
              </p>
            </div>

            {/* Quick action bar in header */}
            <div className="flex items-center gap-3 shrink-0 print:hidden">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
                title="Print official copy"
              >
                <Printer className="w-4 h-4 text-cas-amber" aria-hidden="true" />
                <span>Print Document</span>
              </button>
              <a
                href="/privacy"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-cas-amber" aria-hidden="true" />
                <span>Privacy Policy</span>
              </a>
            </div>
          </div>

          {/* Institutional Metadata strip */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
            <div>
              <span className="block text-slate-500 font-semibold uppercase tracking-wider">Effective / Last Updated</span>
              <span className="text-slate-200 font-medium text-sm mt-0.5 block">{LEGAL.lastUpdated}</span>
            </div>
            <div>
              <span className="block text-slate-500 font-semibold uppercase tracking-wider">Operating Entity</span>
              <span className="text-slate-200 font-medium text-sm mt-0.5 block">{operatorInfo || 'CAS Diesel Logistics Ltd'}</span>
            </div>
            <div>
              <span className="block text-slate-500 font-semibold uppercase tracking-wider">Governing Authority</span>
              <span className="text-slate-200 font-medium text-sm mt-0.5 block">Federal Republic of Nigeria (NMDPRA &amp; NDPA)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Collapsible TOC / Quick Jump Selector */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-cas-border px-4 py-3 shadow-xs print:hidden">
        <label htmlFor="mobile-toc-select" className="sr-only">Jump to section</label>
        <div className="relative">
          <select
            id="mobile-toc-select"
            value={activeSectionId}
            onChange={(e) => handleScrollTo(null, e.target.value)}
            className="w-full h-11 pl-3 pr-10 text-xs font-semibold text-cas-slate bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cas-amber appearance-none truncate"
          >
            {sections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                Section {sec.rawNumber}: {sec.heading}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
          
          {/* Left Column: Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-4 print:hidden">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col">
              <div className="bg-white rounded-2xl border border-cas-border p-5 shadow-xs overflow-hidden flex flex-col max-h-[calc(100vh-12rem)]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cas-slate">
                    <FileText className="w-4 h-4 text-cas-amber" aria-hidden="true" />
                    <span>Table of Contents</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {sections.length} Sections
                  </span>
                </div>

                {/* Scrollable list of sections */}
                <nav aria-label="Table of contents" className="overflow-y-auto pr-1 space-y-1">
                  {sections.map((sec) => {
                    const isActive = activeSectionId === sec.id;
                    return (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        onClick={(e) => handleScrollTo(e, sec.id)}
                        className={`group flex items-start gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                          isActive
                            ? 'bg-amber-50 text-cas-slate font-bold border-l-2 border-cas-amber shadow-2xs'
                            : 'text-slate-600 hover:text-cas-slate hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <span className={`font-mono text-[11px] shrink-0 pt-0.5 ${
                          isActive ? 'text-cas-amberDark font-bold' : 'text-slate-400 group-hover:text-slate-600'
                        }`}>
                          {sec.number}
                        </span>
                        <span className="leading-snug">{sec.heading}</span>
                      </a>
                    );
                  })}
                </nav>

                {/* Back to top link in TOC */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={scrollToTop}
                    className="inline-flex items-center gap-1.5 text-slate-500 hover:text-cas-slate font-medium transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-cas-amber" aria-hidden="true" />
                    <span>Back to top</span>
                  </button>
                  <span className="text-[11px] text-slate-400">
                    {Math.round(scrollProgress)}% read
                  </span>
                </div>
              </div>

              {/* Escrow Custody Assurance Callout */}
              <div className="mt-4 p-4 rounded-xl bg-slate-100/80 border border-slate-200/80 text-xs text-cas-muted space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-cas-slate">
                  <ShieldCheck className="w-4 h-4 text-cas-green" aria-hidden="true" />
                  <span>Escrow Settlement Guarantee</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  Funds remain locked in escrow until the corporate buyer signs off on volume and quality parameters at the discharge gate.
                </p>
              </div>
            </div>
          </aside>

          {/* Right Column: Main Legal Text */}
          <main className="lg:col-span-8 xl:col-span-8">
            <div className="max-w-[76ch]">
              
              {/* Introduction statement banner */}
              <div className="mb-10 p-6 bg-white rounded-2xl border border-cas-border shadow-xs">
                <div className="flex items-center gap-2 text-cas-amberDark text-xs font-bold uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4 text-cas-green" aria-hidden="true" />
                  <span>Binding Institutional Agreement</span>
                </div>
                <p className="text-sm leading-relaxed text-gray-800">
                  Please review these Terms and Conditions carefully prior to participating in the CAS Diesel marketplace. By registering an account, submitting an RFQ, funding escrow, or accepting a dispatch order, you agree to be legally bound by these terms.
                </p>
              </div>

              {/* Legal Sections */}
              <div className="space-y-10">
                {sections.map((sec) => (
                  <article
                    key={sec.id}
                    id={sec.id}
                    className="scroll-mt-28 bg-white p-6 sm:p-8 rounded-2xl border border-cas-border shadow-2xs transition-shadow hover:shadow-xs"
                  >
                    {/* Distinct Section Number Header */}
                    <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-50 text-cas-amberDark border border-amber-200/80">
                          Section {sec.rawNumber}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Protocol Clause
                        </span>
                      </div>
                      <a
                        href={`#${sec.id}`}
                        onClick={(e) => handleScrollTo(e, sec.id)}
                        className="text-xs text-slate-400 hover:text-cas-amberDark font-mono"
                        title="Permanent link to this clause"
                      >
                        #{sec.rawNumber}
                      </a>
                    </div>

                    {/* Section Heading */}
                    <h2 className="text-xl sm:text-2xl font-extrabold text-cas-slate tracking-tight leading-snug mb-4">
                      {sec.heading}
                    </h2>

                    {/* Section Body Text: Plus Jakarta Sans, max width ~70-80 chars, line height 1.6-1.8, text-gray-800 */}
                    <div className="text-gray-800 text-base leading-[1.75] font-normal">
                      <p>{sec.text}</p>
                    </div>
                  </article>
                ))}
              </div>

              {/* Document Closing and Contact */}
              <div className="mt-12 p-6 sm:p-8 bg-slate-100/70 rounded-2xl border border-slate-200 text-sm text-cas-muted space-y-4">
                <h3 className="text-base font-bold text-cas-slate">
                  Related Regulatory Documents and Inquiries
                </h3>
                <p className="leading-relaxed text-gray-800">
                  Data processing safeguards, cookies, and regulatory rights under the Nigeria Data Protection Act 2023 are detailed in our{' '}
                  <a href="/privacy" className="text-cas-amberDark font-bold hover:underline">
                    Privacy Policy
                  </a>.
                </p>
                {CONTACT.email && (
                  <p className="text-xs text-slate-600">
                    For legal notices, compliance audits, or contractual inquiries, reach our legal desk at{' '}
                    <a href={`mailto:${CONTACT.email}`} className="font-semibold text-cas-slate hover:underline">
                      {CONTACT.email}
                    </a>.
                  </p>
                )}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                  <a href="/" className="text-cas-slate font-bold hover:underline">
                    &larr; Return to Home
                  </a>
                  <button
                    type="button"
                    onClick={scrollToTop}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-cas-slate font-medium"
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-cas-amber" aria-hidden="true" />
                    <span>Back to top</span>
                  </button>
                </div>
              </div>

            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
