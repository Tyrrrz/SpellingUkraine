import type { NextPage } from 'next';
import { Box } from '../components/box';
import { Meta } from '../components/meta';

const OfflinePage: NextPage = () => {
  return (
    <>
      <Meta title="Offline" />

      <Box classes={['p-6', 'border-2', 'border-neutral-400', 'rounded', 'bg-neutral-100']}>
        <Box classes={['text-3xl']}>Offline</Box>
        <Box classes={['mt-2', 'text-xl', 'font-light']}>Your device is currently offline</Box>
        <Box classes={['mt-2']}>Please reconnect to the network to view this page</Box>
      </Box>
    </>
  );
};

export default OfflinePage;
