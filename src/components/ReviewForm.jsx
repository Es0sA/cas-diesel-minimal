import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { api } from '../api';

export function StarRow({ value, size = 'w-4 h-4' }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${size} ${n <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
      ))}
    </span>
  );
}

// Shown on a delivered order. order.review is null for a buyer who has not reviewed yet.
export default function ReviewForm({ order, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (order.status !== 'DELIVERED' || order.review === undefined) return null;

  if (order.review) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 mb-8 shadow-sm">
        <h2 className="text-lg font-bold text-cas-slate mb-2">Your Review</h2>
        <StarRow value={order.review.rating} size="w-5 h-5" />
        {order.review.comment && <p className="text-sm text-cas-muted mt-2">{order.review.comment}</p>}
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError('Choose a star rating.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      await api.reviews.create({ orderId: order.id, rating, comment });
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded-2xl border border-slate-200 mb-8 shadow-sm">
      <h2 className="text-lg font-bold text-cas-slate mb-1">Rate this delivery</h2>
      <p className="text-sm text-cas-muted mb-4">Your review is shown to other buyers on the supplier's listing.</p>
      <div className="flex items-center gap-1 mb-4" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`} aria-pressed={rating === n}>
            <Star className={`w-8 h-8 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={1000}
        rows={3}
        placeholder="Quality, timing, documentation (optional)"
        className="w-full border border-slate-300 rounded-lg p-3 text-sm mb-3"
      />
      {error && <p className="text-sm text-rose-700 mb-3">{error}</p>}
      <button type="submit" disabled={saving} className="px-5 py-2.5 bg-cas-slate text-white text-sm font-bold rounded-lg disabled:opacity-50">
        {saving ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
