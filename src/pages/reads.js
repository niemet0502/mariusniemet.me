import React from "react";

import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Layout from "../components/Layout";

const Reads = () => {
  const cells = Array(12).fill(null);
  return (
    <Layout>
      <div className="page-content">
        <Hero
          title="Reads"
          content="The things that I have read and I think can be useful, it can be 
          technical books, science-fiction, personal development or manga."
        />

        <div className="books-container">
          {cells.map((index, key) => (
            <div className="book-card">
              <a
                href="https://www.amazon.fr/Alchemist-Paulo-Coelho/dp/0008283648/ref=sr_1_1?keywords=the+alchemist&qid=1686241491&sprefix=the+alceh%2Caps%2C149&sr=8-1"
                target="_blank"
                without
                rel="noreferrer"
              >
                <img src="/books/harrypotter.jpg" alt="harrypotter-cover" />
                <span>
                  Harry Potter Books <span className="vote-counter">🔥 3</span>
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>

      <Footer customStyle="footer-alignment" />
    </Layout>
  );
};

export default Reads;
