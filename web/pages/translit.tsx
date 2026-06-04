import { FC, useMemo, useState } from "react";
import Heading from "../components/heading";
import Link from "../components/link";
import Meta from "../components/meta";
import { getRepoFileUrl } from "../utils/repo";
import { translit } from "../utils/translit";

const TranslitPage: FC = () => {
  const [source, setSource] = useState("");
  const output = useMemo(() => translit(source), [source]);

  return (
    <>
      <Meta title="Transliterate" />

      <section>
        <Heading>Transliterate</Heading>

        <div className="text-lg">
          Use this page to transliterate any Ukrainian text according to the{" "}
          <Link href={getRepoFileUrl("data/vocabulary#transliteration-system")}>
            official transliteration system
          </Link>
          .
        </div>
      </section>

      <section>
        <div className="hover:border-ukraine-blue mt-8 rounded border border-neutral-400 text-lg">
          <textarea
            className="w-full appearance-none bg-transparent p-4 focus:outline-none"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Type in Ukrainian here"
            rows={5}
            autoFocus
          />
        </div>

        <div className="hover:border-ukraine-blue mt-4 rounded border border-neutral-400 bg-neutral-100 text-lg dark:bg-neutral-800">
          <textarea
            className="w-full appearance-none bg-transparent p-4 focus:outline-none"
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
