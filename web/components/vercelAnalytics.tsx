import { isProduction } from '@/utils/env';
import { Analytics } from '@vercel/analytics/react';
import { FC } from 'react';

const VercelAnalytics: FC = () => {
  if (!isProduction()) {
    return null;
  }

  return <Analytics />;
};

export default VercelAnalytics;
