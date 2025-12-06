import { Analytics } from '@vercel/analytics/react';
import c from 'classnames';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import FadeIn from 'react-fade-in';
import { FiChevronLeft, FiGitCommit, FiHeart, FiMoon, FiOctagon, FiSun } from 'react-icons/fi';
import ButtonLink from '~/components/buttonLink';
import Image from '~/components/image';
import Inline from '~/components/inline';
import Link from '~/components/link';
import Meta from '~/components/meta';
import useDebounce from '~/hooks/useDebounce';
import useRouterStatus from '~/hooks/useRouterStatus';
import useTheme from '~/hooks/useTheme';
import { getBuildId } from '~/utils/env';
import { getRepoFileUrl } from '~/utils/repo';

const Loader: FC = () => {
  // Only show the loading indicator if the navigation takes a while.
  // This prevents the indicator from flashing during faster navigation.
  const { value: isVisible } = useDebounce(useRouterStatus() === 'loading', 300);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const interval = setInterval(() => {
      // Progress is not representative of anything, it's just used
      // to give a sense that something is happening.
      // The value is increased inverse-hyperbolically, so that it
      // gradually slows down and never actually reaches 100%.
      setProgress((progress) => progress + 0.1 * (0.95 - progress) ** 2);
    }, 100);

    return () => {
      clearInterval(interval);
      setProgress(0);
    };
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
          'dark:border-neutral-800',
          'items-center',
          'place-content-center',
          'gap-6'
        )}
      >
        {/* Logo */}
        <div className={c('hidden', 'sm:block', 'w-20')}>
          <Image src="/logo.svg" alt="SpellingUkraine" priority />
        </div>

        {/* Separator */}
        <div
          className={c(
            'hidden',
            'sm:block',
            'w-px',
            'h-16',
            'bg-neutral-400',
            'dark:bg-neutral-600'
          )}
        />

        {/* Title & tagline */}
        <div className={c('flex', 'flex-col', 'items-center', 'sm:items-start')}>
          <div className={c('flex', 'text-4xl', 'font-semibold')}>
            <div className={c('p-1', 'pl-2', 'pb-2', 'bg-ukraine-blue', 'text-neutral-200')}>
              Spelling
            </div>
            <div className={c('p-1', 'pr-2', 'pb-2', 'bg-ukraine-yellow', 'dark:text-neutral-900')}>
              Ukraine
            </div>
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
    <div
      className={c('border-b', 'dark:border-neutral-800', 'bg-neutral-100', 'dark:bg-neutral-800')}
    >
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
  // Below is a hack to re-initialize the fade when the page changes
  const router = useRouter();
  const fadeKey = useMemo(() => router.pathname, [router.pathname]);

  return (
    <div className={c('flex-grow')}>
      <main className={c('container', 'mx-auto', 'mt-6', 'mb-8', 'px-4')}>
        <FadeIn key={fadeKey}>{children}</FadeIn>
      </main>
    </div>
  );
};

const Footer: FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <footer
      className={c(
        'flex',
        'flex-wrap',
        'p-4',
        'border-t',
        'dark:border-neutral-800',
        'bg-neutral-100',
        'dark:bg-neutral-800',
        'gap-3',
        'place-content-center',
        'text-sm',
        'text-neutral-400',
        'font-light'
      )}
    >
      {/* Git tree */}
      <Link variant="discreet" href={getRepoFileUrl('', { ref: getBuildId() })}>
        <Inline>
          <FiGitCommit />
          <div className={c('font-mono')}>{getBuildId()}</div>
        </Inline>
      </Link>

      <div>&bull;</div>

      {/* Discord Bot */}
      <Link
        variant="discreet"
        href="https://discord.com/api/oauth2/authorize?client_id=1065742890820706406&permissions=3072&scope=bot"
      >
        <Inline>
          <FiOctagon />
          <div>Discord Bot</div>
        </Inline>
      </Link>

      <div>&bull;</div>

      {/* Reddit Bot */}
      <Link variant="discreet" href="https://reddit.com/u/SpellingUkraine">
        <Inline>
          <FiOctagon />
          <div>Reddit Bot</div>
        </Inline>
      </Link>

      <div>&bull;</div>

      {/* Twitter Bot */}
      <Link variant="discreet" href="https://twitter.com/SpellingUkraine">
        <Inline>
          <FiOctagon />
          <div>Twitter Bot</div>
        </Inline>
      </Link>

      <div>&bull;</div>

      {/* Donate */}
      <Link variant="discreet" href="https://tyrrrz.me/donate">
        <Inline>
          <FiHeart />
          <div>Donate</div>
        </Inline>
      </Link>

      <div>&bull;</div>

      {/* Theme switcher */}
      <ButtonLink variant="hidden" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        <div className={c('text-ukraine-blue', 'dark:text-ukraine-yellow')}>
          <Inline>
            {theme === 'dark' ? <FiMoon /> : <FiSun />}
            <div className={c('capitalize')}>{theme}</div>
          </Inline>
        </div>
      </ButtonLink>
    </footer>
  );
};

const Page: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div
      className={c({
        dark: theme === 'dark',
        light: theme === 'light'
      })}
    >
      <div
        className={c(
          'flex',
          'flex-col',
          'min-h-screen',
          'bg-neutral-50',
          'dark:bg-neutral-900',
          'dark:text-neutral-200'
        )}
      >
        <Loader />
        <Header />
        <Breadcrumb />
        <Main>{children}</Main>
        <Footer />
      </div>
    </div>
  );
};

type LayoutProps = PropsWithChildren;

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Meta />
      <Analytics />
      <Page>{children}</Page>
    </>
  );
};

export default Layout;
