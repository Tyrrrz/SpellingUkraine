import classNames from 'classnames';
import type { NextPage } from 'next';
import { Link } from '../components/link';
import { Meta } from '../components/meta';

const AttributionsPage: NextPage = () => {
  return (
    <>
      <Meta title="Attribution" />

      <div className={classNames('my-2', 'text-2xl', 'leading-wide')}>Attribution</div>

      <div className={classNames('text-lg', 'font-light')}>
        This website uses the following publicly available external assets:
      </div>

      <ul className={classNames('my-2', 'list-disc', 'px-8')}>
        <li>
          <Link href="https://flaticon.com/free-icon/ukraine_197572">Ukraine icon by Freepik</Link>{' '}
          (Flaticon license)
        </li>
        <li>
          <Link href="https://openstreetmap.org/copyright">
            Map data by OpenStreetMap contributors
          </Link>{' '}
          (Open Database License)
        </li>
      </ul>
    </>
  );
};

export default AttributionsPage;
