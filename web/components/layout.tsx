import Image from '@/components/image';
import Inline from '@/components/inline';
import Link from '@/components/link';
import Meta from '@/components/meta';
import Tracker from '@/components/tracker';
import useDebounce from '@/hooks/useDebounce';
import useRouterStatus from '@/hooks/useRouterStatus';
import { getBuildId } from '@/utils/env';
import { getRepoCommitUrl, getRepoUrl } from '@/utils/repo';
import c from 'classnames';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import FadeIn from 'react-fade-in';
import { FiChevronLeft, FiGitCommit, FiGithub, FiHeart, FiOctagon } from 'react-icons/fi';

const Loader: FC = () => {
  // Only show loading indicator if the navigation takes a while.
  // This prevents indicator from flashing during faster navigation.
  const isVisible = useDebounce(useRouterStatus() === 'loading', 300);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
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
      <header
        className={c(
          'flex',
          'px-4',
          'py-6',
          'border-b',
          'bg-white',
          'hover:bg-neutral-50',
          'items-center',
          'place-content-center',
          'gap-x-6'
        )}
      >
        <div className={c('hidden', 'sm:block', 'w-20')}>
          <Image src="/logo.svg" alt="Spelling Ukraine" priority />
        </div>

        <div className={c('hidden', 'sm:block', 'w-px', 'h-16', 'bg-neutral-400')} />

        <div className={c('flex', 'flex-col', 'items-center', 'sm:items-start')}>
          <div className={c('flex', 'text-4xl', 'font-semibold')}>
            <div className={c('p-1', 'pl-2', 'pb-2', 'bg-ukraine-blue', 'text-white')}>
              Spelling
            </div>
            <div className={c('p-1', 'pr-2', 'pb-2', 'bg-ukraine-yellow')}>Ukraine</div>
          </div>

          <div className={c('mt-1', 'text-xl', 'text-center', 'font-light', 'sm:tracking-wide')}>
            Language is political. Transliterate correctly.
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
            <span>Home</span>
          </Inline>
        </Link>
      </div>
    </div>
  );
};

const Main: FC<PropsWithChildren> = ({ children }) => {
  // Below is a hack to re-initialize the fade when the page changes
  const router = useRouter();
  const fadeKey = useMemo(() => Math.random().toString() + router.pathname, [router.pathname]);

  return (
    <div className={c('flex-grow', 'bg-white')}>
      <main className={c('container', 'mx-auto', 'mt-6', 'mb-8', 'px-4')}>
        <FadeIn key={fadeKey}>{children}</FadeIn>
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
          <span className={c('font-mono')}>{getBuildId()}</span>
        </Inline>
      </Link>

      <div>•</div>

      <Link variant="discreet" href={getRepoUrl()}>
        <Inline>
          <FiGithub strokeWidth={1} />
          <span>Source</span>
        </Inline>
      </Link>

      <div>•</div>

      <Link variant="discreet" href="https://reddit.com/u/SpellingUkraine">
        <Inline>
          <FiOctagon strokeWidth={1} />
          <span>Reddit Bot</span>
        </Inline>
      </Link>

      <div>•</div>

      <Link variant="discreet" href="https://twitter.com/SpellingUkraine">
        <Inline>
          <FiOctagon strokeWidth={1} />
          <span>Twitter Bot</span>
        </Inline>
      </Link>

      <div>•</div>

      <Link variant="discreet" href="https://tyrrrz.me/donate">
        <Inline>
          <FiHeart strokeWidth={1} />
          <span>Donate</span>
        </Inline>
      </Link>
    </footer>
  );
};

type LayoutProps = PropsWithChildren;

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className={c('flex', 'flex-col', 'min-h-screen', 'bg-neutral-50')}>
      <Meta />
      <Tracker />

      <Loader />

      <Header />
      <Breadcrumb />
      <Main>{children}</Main>
      <Footer />
    </div>
  );
};

export default Layout;
