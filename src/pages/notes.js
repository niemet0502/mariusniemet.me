import React from "react";
import Hero from "../components/Hero";
import Layout from "../components/Layout";

const Notes = () => {
  return (
    <Layout>
      <div className="page-content">
        <Hero
          title="Notes"
          content="The things that i have created mostly related to software."
        />
      </div>
    </Layout>
  );
};

export default Notes;
