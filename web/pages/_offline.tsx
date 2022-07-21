import type { NextPage } from 'next';
import Box from '../components/box';
import Meta from '../components/meta';

const OfflinePage: NextPage = () => {
  return (
    <>
      <Meta title="Offline" />

      <Box classes={['text-3xl']}>Offline</Box>
      <Box classes={['mt-2', 'text-lg']}>Your device is currently offline</Box>
      <Box>Please reconnect to the network to view this page</Box>
    </>
  );
};

export default OfflinePage;
