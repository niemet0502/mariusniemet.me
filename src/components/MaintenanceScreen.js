import * as React from "react";
import { Helmet } from "react-helmet";

const MaintenanceScreen = () => {
  return (
    <>
      <Helmet>
        <title>away...</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="maintenance-page">
        <p className="maintenance-page__text">away...</p>
      </main>
    </>
  );
};

export default MaintenanceScreen;
