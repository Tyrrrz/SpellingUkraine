import { FC } from "react";
import Heading from "~/components/heading";
import Meta from "~/components/meta";

const NotFoundPage: FC = () => {
  return (
    <>
      <Meta title="Not Found" />

      <section>
        <Heading>Not Found</Heading>

        <div className="text-lg">The page you requested does not exist</div>
      </section>
    </>
  );
};

export default NotFoundPage;
