import type { NextPage } from 'next';
import { Box } from '../components/box';
import { Link } from '../components/link';
import { Meta } from '../components/meta';

const AttributionsPage: NextPage = () => {
  return (
    <>
      <Meta title="Attribution" />

      <Box classes={['p-6', 'border-2', 'border-neutral-400', 'rounded', 'bg-neutral-100']}>
        <Box classes={['text-3xl', 'leading-wide']}>Attribution</Box>
        <Box classes={['mt-2', 'text-xl', 'font-light']}>
          This website uses the following publicly available external assets:
        </Box>

        <Box type="ul" classes={['mt-2', 'list-disc', 'px-8']}>
          <Box type="li">
            <Link href="https://flaticon.com/free-icon/ukraine_197572">
              Ukraine icon by Freepik
            </Link>{' '}
            (Flaticon license)
          </Box>

          <Box type="li">
            <Link href="https://openstreetmap.org/copyright">
              Map data by OpenStreetMap contributors
            </Link>{' '}
            (Open Database License)
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AttributionsPage;
