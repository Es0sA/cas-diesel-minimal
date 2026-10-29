import { ShieldCheck, MapPin, Truck } from 'lucide-react';

// Shared by the About section on the home page and the standalone /about page
export const ABOUT_INTRO = "CAS Diesel is built to secure the downstream petroleum supply chain. We connect corporate bulk buyers with licensed, verified depot vendors and calibrated fleet drivers. By combining real-time spot pricing, geofenced delivery tracking, and a two-sided escrow system, we ensure that fuel is delivered exactly where it is needed, and funds are only released when the job is done right.";

export const PILLARS = [
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
