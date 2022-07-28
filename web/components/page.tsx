import c from 'classnames';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import FadeIn from 'react-fade-in';
import { FiChevronLeft, FiGitCommit, FiGithub, FiHeart } from 'react-icons/fi';
import useDebounce from '../hooks/useDebounce';
import useRouterStatus from '../hooks/useRouterStatus';
import { getBuildId } from '../utils/env';
import { getRepoCommitUrl, getRepoUrl } from '../utils/repo';
import Image from './image';
import Inline from './inline';
import Link from './link';

const Loader: FC = () => {
  const status = useRouterStatus();

  // Only show loading indicator if the navigation takes a while.
  // This prevents indicator from flashing during faster navigation.
  const isVisible = useDebounce(status === 'loading', 300);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const interval = setInterval(() => {
      // Progress is not representative of anything, it's just used
      // to give a sense that something is happening.
      // The value is increased inverse-hyperbolically, so that it
      // slows down and never actually reaches 100%.
      setProgress((progress) => progress + 0.1 * (0.95 - progress) ** 2);
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <div
      className={c('h-1', {
        'bg-ukraine-blue': isVisible
      })}
      style={{
        width: `${progress * 100}%`,
        transitionProperty: 'width',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDuration: '150ms'
      }}
    />
  );
};

const Header: FC = () => {
  return (
    <Link variant="hidden" href="/">
      <header className={c('border-b', 'bg-white', 'hover:bg-neutral-50')}>
        <div
          className={c(
            'flex',
            'w-fit',
            'mx-auto',
            'px-4',
            'py-6',
            'items-center',
            'gap-x-4',
            'sm:gap-x-6'
          )}
        >
          <div className={c('w-[64px]', 'sm:w-[96px]')}>
            <Image src="/logo.svg" alt="Spelling Ukraine" priority />
          </div>

          <div className={c('w-px', 'h-12', 'sm:h-16', 'bg-neutral-400')} />

          <div>
            <div className={c('flex', 'text-3xl', 'sm:text-4xl', 'font-semibold')}>
              <div className={c('p-1', 'pl-2', 'sm:pb-2', 'bg-ukraine-blue', 'text-white')}>
                Spelling
              </div>
              <div className={c('p-1', 'pr-2', 'sm:pb-2', 'bg-ukraine-yellow')}>Ukraine</div>
            </div>

            <div className={c('mt-1', 'text-sm', 'sm:text-xl', 'font-light', 'sm:tracking-wide')}>
              Language is political. Transliterate correctly.
            </div>
          </div>
        </div>
      </header>
    </Link>
  );
};

const Breadcrumb: FC = () => {
  const { route } = useRouter();

  if (route === '/') {
    return null;
  }

  return (
    <div className={c('border-y', 'bg-neutral-100')}>
      <div className={c('container', 'mx-auto', 'my-3', 'px-4')}>
        <Link variant="discreet" href="/">
          <Inline>
            <FiChevronLeft />
            <div>Home</div>
          </Inline>
        </Link>
      </div>
    </div>
  );
};

const Main: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={c('flex-grow', 'bg-white')}>
      <main className={c('container', 'mx-auto', 'mt-6', 'mb-8', 'px-4')}>
        <FadeIn>{children}</FadeIn>
      </main>
    </div>
  );
};

const Footer: FC = () => {
  return (
    <footer
      className={c(
        'flex',
        'flex-wrap',
        'p-4',
        'border-t',
        'bg-neutral-100',
        'gap-3',
        'place-content-center',
        'text-sm',
        'text-neutral-400',
        'font-light'
      )}
    >
      <Link variant="discreet" href={getRepoCommitUrl(getBuildId())}>
        <Inline>
          <FiGitCommit strokeWidth={1} />
          <div className={c('font-mono')}>{getBuildId()}</div>
        </Inline>
      </Link>

      <div>•</div>

      <Link variant="discreet" href={getRepoUrl()}>
        <Inline>
          <FiGithub strokeWidth={1} />
          <div>Source</div>
        </Inline>
      </Link>

      <div>•</div>

      <Link variant="discreet" href="https://tyrrrz.me/donate">
        <Inline>
          <FiHeart strokeWidth={1} />
          <div>Donate</div>
        </Inline>
      </Link>
    </footer>
  );
};

type PageProps = PropsWithChildren;

const Page: FC<PageProps> = ({ children }) => {
  return (
    <div className={c('flex', 'flex-col', 'min-h-screen', 'bg-neutral-50')}>
      <Loader />
      <Header />
      <Breadcrumb />
      <Main>{children}</Main>
      <Footer />
    </div>
  );
};

export default Page;
