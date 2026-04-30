import { Analytics } from "@vercel/analytics/react";
import { clsx } from "clsx";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, useEffect, useMemo, useState } from "react";
import FadeIn from "react-fade-in";
import { FiChevronLeft, FiGitCommit, FiHeart, FiMoon, FiOctagon, FiSun } from "react-icons/fi";
import ButtonLink from "~/components/buttonLink";
import Image from "~/components/image";
import Inline from "~/components/inline";
import Link from "~/components/link";
import Meta from "~/components/meta";
import useDebounce from "~/hooks/useDebounce";
import useRouterStatus from "~/hooks/useRouterStatus";
import useTheme from "~/hooks/useTheme";
import { getBuildId } from "~/utils/env";
import { getRepoFileUrl } from "~/utils/repo";

const Loader: FC = () => {
  // Only show the loading indicator if the navigation takes a while.
  // This prevents the indicator from flashing during faster navigation.
  const { value: isVisible } = useDebounce(useRouterStatus() === "loading", 300);
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
      className={clsx("h-1", { "bg-ukraine-blue": isVisible })}
      style={{
        width: `${progress * 100}%`,
        transitionProperty: "width",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDuration: "150ms",
      }}
    />
  );
};

const Header: FC = () => {
  return (
    <Link variant="hidden" href="/">
      <header className="flex place-content-center items-center gap-6 border-b px-4 py-6 dark:border-neutral-800">
        {/* Logo */}
        <div className="hidden w-20 sm:block">
          <Image src="/logo.svg" alt="SpellingUkraine" priority />
        </div>

        {/* Separator */}
        <div className="hidden h-16 w-px bg-neutral-400 sm:block dark:bg-neutral-600" />

        {/* Title & tagline */}
        <div className="flex flex-col items-center sm:items-start">
          <div className="flex text-4xl font-semibold">
            <div className="bg-ukraine-blue p-1 pb-2 pl-2 text-neutral-200">Spelling</div>
            <div className="bg-ukraine-yellow p-1 pr-2 pb-2 dark:text-neutral-900">Ukraine</div>
          </div>

          <div className="mt-1 text-center text-xl font-light sm:tracking-wide">
            Language is political. Transliterate correctly.
          </div>
        </div>
      </header>
    </Link>
  );
};

const Breadcrumb: FC = () => {
  const { route } = useRouter();

  if (route === "/") {
    return null;
  }

  return (
    <div className="border-b bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800">
      <div className="container mx-auto my-3 px-4">
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
    <div className="grow">
      <main className="container mx-auto mt-6 mb-8 px-4">
        <FadeIn key={fadeKey}>{children}</FadeIn>
      </main>
    </div>
  );
};

const Footer: FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="flex flex-wrap place-content-center gap-3 border-t bg-neutral-100 p-4 text-sm font-light text-neutral-400 dark:border-neutral-800 dark:bg-neutral-800">
      {/* Git tree */}
      <Link variant="discreet" href={getRepoFileUrl("", { ref: getBuildId() || "prime" })}>
        <Inline>
          <FiGitCommit />
          <div className="font-mono">{getBuildId()?.substring(0, 7) || "prime"}</div>
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
      <ButtonLink variant="hidden" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        <div className="text-ukraine-blue dark:text-ukraine-yellow">
          <Inline>
            {theme === "dark" ? <FiMoon /> : <FiSun />}
            <div className="capitalize">{theme}</div>
          </Inline>
        </div>
      </ButtonLink>
    </footer>
  );
};

const Page: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={theme}>
      <div className="flex min-h-screen flex-col bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-200">
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
