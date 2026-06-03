import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "~/components/layout";
import NotFoundPage from "~/pages/404";
import EntryPage from "~/pages/entry";
import HomePage from "~/pages/index";
import OfflinePage from "~/pages/offline";
import TranslitPage from "~/pages/translit";

const App = () => {
  return (
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/i/:id" element={<EntryPage />} />
            <Route path="/translit" element={<TranslitPage />} />
            <Route path="/offline" element={<OfflinePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
