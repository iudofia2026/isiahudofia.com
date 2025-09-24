'use client';

import { useEffect } from 'react';

export default function Analytics() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // Placeholder hook for Vercel Analytics or Plausible.
      console.debug('Analytics placeholder ready to be wired to your provider.');
    }
  }, []);

  return null;
}
