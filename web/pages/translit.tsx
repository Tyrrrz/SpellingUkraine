import { default as c, default as classNames } from 'classnames';
import { NextPage } from 'next';
import { useMemo, useState } from 'react';
import Heading from '../components/heading';
import Link from '../components/link';
import Meta from '../components/meta';
import Page from '../components/page';
import { getRepoFileUrl } from '../utils/repo';
import { transliterate } from '../utils/translit';

const TranslitPage: NextPage = () => {
  const [source, setSource] = useState('');
  const output = useMemo(() => transliterate(source), [source]);

  return (
    <Page>
      <Meta title="Transliterate" />
      <Heading>Transliterate</Heading>

      <section className={c('text-lg')}>
        Use this page to transliterate any Ukrainian text according to the{' '}
        <Link href={getRepoFileUrl('data/vocabulary#transliteration-system')}>
          official transliteration system
        </Link>
        .
      </section>

      <div
        className={c(
          'mt-8',
          'border',
          'border-neutral-400',
          'hover:border-ukraine-blue',
          'rounded',
          'bg-white',
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
    </Page>
  );
};

export default TranslitPage;
