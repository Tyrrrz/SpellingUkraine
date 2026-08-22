import { FC, PropsWithChildren, useMemo } from "react";
import FadeIn from "react-fade-in";
import { FiChevronLeft, FiGitCommit, FiHeart, FiMoon, FiOctagon, FiSun } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { getRepoFileUrl } from "../utils/repo";
import Analytics from "./analytics";
import ButtonLink from "./buttonLink";
import Image from "./image";
import Inline from "./inline";
import Link from "./link";
import Meta from "./meta";

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
  const { pathname } = useLocation();

  if (pathname === "/") {
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
  // Re-initialize the fade when the page changes
  const { pathname } = useLocation();
  const fadeKey = useMemo(() => pathname, [pathname]);

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
      <Link
        variant="discreet"
        href={getRepoFileUrl("", { ref: import.meta.env.BUILD_ID || "prime" })}
      >
        <Inline>
          <FiGitCommit />
          <div className="font-mono">{import.meta.env.BUILD_ID?.substring(0, 7) || "prime"}</div>
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
