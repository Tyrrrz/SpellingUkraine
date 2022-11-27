import { Analytics } from '@vercel/analytics/react';
import { FC } from 'react';
import { isProduction } from '~/utils/env';

const VercelAnalytics: FC = () => {
  if (!isProduction()) {
    return null;
  }

  return <Analytics />;
};

export default VercelAnalytics;
