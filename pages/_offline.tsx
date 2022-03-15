import type { NextPage } from 'next';
import { Box } from '../components/box';
import { Meta } from '../components/meta';
import { Paper } from '../components/paper';

const OfflinePage: NextPage = () => {
  return (
    <>
      <Meta title="Offline" />

      <Paper>
        <Box classes={['text-3xl']}>Offline</Box>
        <Box classes={['text-xl', 'font-light']}>Your device is currently offline</Box>
        <Box>Please reconnect to the network to view this page</Box>
      </Paper>
    </>
  );
};

export default OfflinePage;
