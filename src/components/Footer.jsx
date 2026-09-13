import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin, Scale } from 'lucide-react';

export default function Footer({ onOpenLegalModal }) {
  return (
    <footer className="bg-cas-slate text-slate-300 border-t border-slate-800 text-sm">
      {/* Upper Footer: Real Business Credentials */}
      <div className="max-w-7xl mx-auto px-3 sm:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & Corporate Structure */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center border-2 border-cas-amber">
                <span className="font-extrabold text-lg text-cas-amber">CAS</span>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">CAS Energy</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A specialized downstream petroleum logistics subsidiary of CAS Holdings Nigeria. Operating an escrow-guaranteed wholesale AGO trading terminal for corporate entities.
            </p>
            <div className="text-xs text-slate-400 space-y-1 font-mono">
              <div>RC Number: RC 1892041 (CAC Nigeria)</div>
              <div>NMDPRA Downstream AGO Permit: NMDPRA/DW/AGO/2024/092</div>
            </div>
          </div>

          {/* Real Physical Office & Terminal Desks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Registered Physical Locations</h4>
            <div className="flex items-start gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-cas-amber shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong className="text-slate-200 block">Corporate Head Office</strong>
                <span>Plot 14A Adeola Odeku Street, Victoria Island, Lagos State, Nigeria</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-cas-amber shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong className="text-slate-200 block">Port Harcourt Field Office</strong>
                <span>Plot 9 Trans-Amadi Industrial Layout, Port Harcourt, Rivers State</span>
              </div>
            </div>
          </div>

          {/* Operations & Escrow Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Operations & Escrow Desk</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cas-amber shrink-0" aria-hidden="true" />
                <a href="tel:+23418880227" className="hover:text-white transition-colors">
                  +234 (01) 888-0227
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cas-amber shrink-0" aria-hidden="true" />
                <a href="tel:+2348034912289" className="hover:text-white transition-colors font-mono">
                  +234 (0) 700-CAS-ENERGY
                </a>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Mail className="w-4 h-4 text-cas-amber shrink-0" aria-hidden="true" />
                <a href="mailto:escrow@casenergy.ng" className="hover:text-white transition-colors font-mono">
                  escrow@casenergy.ng
                </a>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              Trading Hours: Monday to Saturday, 06:00 to 18:00 West Africa Time.
            </div>
          </div>

          {/* Legal Compliance & Policies Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Compliance & Governance</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('terms')}
                  className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors"
                >
                  Terms of Service & Escrow Rules
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('privacy')}
                  className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors"
                >
                  Privacy Policy & NDPR Compliance
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('refund')}
                  className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors"
                >
                  Refund & Quality Dispute Protocols
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('cookies')}
                  className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors"
                >
                  Cookie Policy & Security
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Regulatory Disclaimers & Truth in Advertising Notice */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed space-y-3">
          <p>
            <strong>Regulatory Statement:</strong> CAS Energy facilitates wholesale spot discovery and fiduciary settlement between licensed downstream marketers and verified institutional buyers. All product loadings are conducted strictly through terminals licensed by the Nigerian Midstream and Downstream Petroleum Regulatory Authority (NMDPRA) under the Petroleum Industry Act 2021.
          </p>
          <p>
            <strong>Realistic Delivery & Traffic Disclaimer:</strong> Estimated arrival and transit times are subject to physical depot gantry queues, terminal loading clearance, regulatory checkpoints, and arterial road transport traffic conditions across Nigerian state transit corridors. CAS Escrow guarantees fund security and delivery verification, not fixed transit speed.
          </p>
        </div>

        {/* Copyright & Sign-Off */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div>
            &copy; 2026 CAS Energy Limited. A CAS Company. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Built for Enterprise Downstream Logistics</span>
            <span>|</span>
            <span>No Unlicensed Stock Assets Used</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
