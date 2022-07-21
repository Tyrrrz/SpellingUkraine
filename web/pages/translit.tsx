import classNames from 'classnames';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Box from '../components/box';
import Link from '../components/link';
import Meta from '../components/meta';
import { transliterate } from '../utils/translit';

const TranslitPage: NextPage = () => {
  const [source, setSource] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => setOutput(transliterate(source)), [source]);

  return (
    <>
      <Meta title="Transliterate" />

      <Box classes={['text-3xl']}>Transliterate</Box>
      <Box classes={['mt-2', 'text-lg']}>
        Use this page to transliterate any Ukrainian text according to the{' '}
        <Link href="https://github.com/Tyrrrz/SpellingUkraine/tree/master/data/vocabulary#transliteration-system">
          official transliteration system
        </Link>
        .
      </Box>

      <Box
        classes={[
          'mt-8',
          'border',
          'border-neutral-600',
          'hover:border-ukraine-blue',
          'rounded',
          'bg-white',
          'text-lg'
        ]}
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
      </Box>

      <Box
        classes={[
          'mt-4',
          'border',
          'border-neutral-600',
          'hover:border-ukraine-blue',
          'rounded',
          'bg-neutral-100',
          'text-lg'
        ]}
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
      </Box>
    </>
  );
};

export default TranslitPage;
