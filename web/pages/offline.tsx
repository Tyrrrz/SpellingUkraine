import { FC } from "react";
import Heading from "~/components/heading";
import Meta from "~/components/meta";

const OfflinePage: FC = () => {
  return (
    <>
      <Meta title="Offline" />

      <section>
        <Heading>Offline</Heading>

        <div className="text-lg">Your device is currently offline</div>
        <div>Please reconnect to the network to view this page</div>
      </section>
    </>
  );
};

export default OfflinePage;
