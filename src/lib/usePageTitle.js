import { useEffect } from 'react';

const SITE_NAME = 'CAS Energy';
const DEFAULT_DESCRIPTION = "CAS Energy is Nigeria's bulk diesel marketplace connecting corporate buyers, downstream marketers, and calibrated fleet drivers with escrow-protected settlements and geofenced delivery verification.";

// Sets a per-page <title> and <meta name="description"> and restores the
// previous values on unmount, so each route gets its own tab title and
// (for anything that reads the DOM, including most link-preview crawlers
// that do render JS) its own description.
export function usePageTitle(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Bulk Diesel Marketplace & Escrow Logistics`;

    const meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute('content');
    if (meta) meta.setAttribute('content', description || DEFAULT_DESCRIPTION);

    return () => {
      document.title = prevTitle;
      if (meta && prevDescription != null) meta.setAttribute('content', prevDescription);
    };
  }, [title, description]);
}
