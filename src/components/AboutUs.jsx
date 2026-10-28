import React from 'react';
import { ShieldCheck, MapPin, Truck } from 'lucide-react';

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Two-sided escrow',
    text: 'The buyer funds the order into escrow before the truck loads. Payment is released to the vendor only after delivery is verified at the buyer\'s gate.'
  },
  {
    icon: MapPin,
    title: 'Geofenced delivery',
    text: 'Each order is tied to the buyer\'s discharge gate. Arrival is confirmed when the tanker enters the 100-metre perimeter, and the delivered quantity is recorded there.'
  },
  {
    icon: Truck,
    title: 'Calibrated fleet',
    text: 'Drivers register under a vendor and submit their licence and truck calibration chart, which are reviewed before they can be dispatched.'
  }
];

export default function AboutUs() {
  return (
    <section id="about-us" className="bg-white py-14 sm:py-20 border-b border-cas-border scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-wider text-cas-amberDark mb-2">About CAS Diesel</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-cas-slate tracking-tight">
            Nigeria&apos;s Enterprise Diesel Marketplace.
          </h2>
          <p className="text-base text-cas-muted mt-4 leading-relaxed">
            CAS Diesel is built to secure the downstream petroleum supply chain. We connect corporate bulk buyers with licensed, verified depot vendors and calibrated fleet drivers. By combining real-time spot pricing, geofenced delivery tracking, and a two-sided escrow system, we ensure that fuel is delivered exactly where it is needed, and funds are only released when the job is done right.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-cas-border bg-cas-canvas p-6">
              <div className="w-11 h-11 rounded-xl bg-cas-amberLight text-cas-amberDark flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-extrabold text-cas-slate text-lg">{title}</h3>
              <p className="text-sm text-cas-muted mt-2 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
