import classNames from 'classnames';
import { NextPage } from 'next';
import React from 'react';
import Box from '../components/box';
import Link from '../components/link';
import Meta from '../components/meta';
import Paper from '../components/paper';
import { transliterate } from '../utils/translit';

const TranslitPage: NextPage = () => {
  const [source, setSource] = React.useState('');
  const [output, setOutput] = React.useState('');

  React.useEffect(() => setOutput(transliterate(source)), [source]);

  return (
    <>
      <Meta title="Transliterate" />

      <Paper>
        <Box classes={['text-3xl']}>Transliterate</Box>
        <Box classes={['mt-2', 'text-xl', 'font-light']}>
          Use this page to transliterate any Ukrainian text according to the{' '}
          <Link href="https://github.com/Tyrrrz/SpellingUkraine/tree/master/data/vocabulary#transliteration-system">
            official transliteration system
          </Link>
        </Box>

        <Box
          classes={[
            'mt-4',
            'border-2',
            'border-neutral-400',
            'hover:border-blue-500',
            'rounded',
            'bg-neutral-100',
            'text-xl'
          ]}
        >
          <textarea
            className={classNames(
              'w-full',
              'p-2',
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
            'border-2',
            'border-neutral-400',
            'hover:border-blue-500',
            'rounded',
            'bg-neutral-200',
            'text-xl'
          ]}
        >
          <textarea
            className={classNames(
              'w-full',
              'p-2',
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
      </Paper>
    </>
  );
};

export default TranslitPage;
