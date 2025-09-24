'use client';

import { DefaultSeo } from 'next-seo';
import defaultSEO from '../next-seo.config';

export default function DefaultSeoConfig() {
  return <DefaultSeo {...defaultSEO} />;
}
