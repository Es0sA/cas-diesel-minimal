import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel } from 'lucide-react';
import { usePageTitle } from '../lib/usePageTitle';

export default function NotFound() {
  usePageTitle('Page Not Found', 'This page does not exist on CAS Diesel.');

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-cas-slate flex items-center justify-center mb-5">
        <Fuel className="w-7 h-7" aria-hidden="true" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-cas-slate leading-tight">Page not found</h1>
      <p className="mt-2 text-sm text-cas-muted max-w-sm leading-relaxed">
        The page you're looking for doesn't exist or may have moved. Check the link, or head back to the home page.
      </p>
      <Link
        to="/"
        className="mt-6 px-5 py-2.5 rounded-lg bg-cas-slate hover:bg-black text-white font-bold text-sm transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
