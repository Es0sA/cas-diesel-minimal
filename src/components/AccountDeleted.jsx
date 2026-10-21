import React from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../lib/usePageTitle';

export default function AccountDeleted() {
  usePageTitle('Account deleted', 'Your CAS Energy account was deleted.');
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-cas-slate">Your account was deleted</h1>
      <p className="mt-3 text-sm text-cas-muted max-w-md">Your files will be erased in 30 days. If you sign up again with the same email before then, you get them back. Past orders are kept for our records. We sent a confirmation to your email.</p>
      <Link to="/" className="mt-6 px-5 py-2.5 rounded-xl bg-cas-slate text-white text-sm font-bold">Back to home</Link>
    </div>
  );
}
