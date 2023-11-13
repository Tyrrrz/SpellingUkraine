import { default as c, default as classNames } from 'classnames';
import { NextPage } from 'next';
import { useMemo, useState } from 'react';
import Heading from '~/components/heading';
import Link from '~/components/link';
import Meta from '~/components/meta';
import { getRepoFileUrl } from '~/utils/repo';
import { translit } from '~/utils/translit';

const TranslitPage: NextPage = () => {
  const [source, setSource] = useState('');
  const output = useMemo(() => translit(source), [source]);

  return (
    <>
      <Meta title="Transliterate" />

      <section>
        <Heading>Transliterate</Heading>

        <div className={c('text-lg')}>
          Use this page to transliterate any Ukrainian text according to the{' '}
          <Link href={getRepoFileUrl('data/vocabulary#transliteration-system')}>
            official transliteration system
          </Link>
          .
        </div>
      </section>

      <section>
        <div
          className={c(
            'mt-8',
            'border',
            'border-neutral-400',
            'hover:border-ukraine-blue',
            'rounded',
            'text-lg'
          )}
        >
          <textarea
            className={classNames(
              'w-full',
              'p-4',
              'appearance-none',
              'focus:outline-none',
              'bg-transparent'
            )}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Type in Ukrainian here"
            rows={5}
            autoFocus
          />
        </div>

        <div
          className={c(
            'mt-4',
            'border',
            'border-neutral-400',
            'hover:border-ukraine-blue',
            'rounded',
            'bg-neutral-100',
            'dark:bg-neutral-800',
            'text-lg'
          )}
        >
          <textarea
            className={classNames(
              'w-full',
              'p-4',
              'appearance-none',
              'focus:outline-none',
              'bg-transparent'
            )}
            value={output}
            placeholder="Output will be here"
            rows={5}
            readOnly
          />
        </div>
      </section>
    </>
  );
};

export default TranslitPage;
