import React from "react";

import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Layout from "../components/Layout";

const Writings = () => {
  return (
    <Layout>
      <div className="page-content">
        <Hero
          title="Writings"
          content="The things i have wrote on engineering, infrastructure, backend or frontend
 also about life in general. You can browse the articles by topic, by date
 or search by keyword below."
        />
      </div>

      <Footer customStyle="footer-alignment" />
    </Layout>
  );
};

export default Writings;
