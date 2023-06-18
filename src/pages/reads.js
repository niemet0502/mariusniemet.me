import React from "react";

import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Layout from "../components/Layout";

import { books } from "../data/booksList";

const Reads = () => {
  return (
    <Layout>
      <div className="page-content">
        <Hero
          title="Reads"
          content="The things that I have read and I think can be useful, it can be 
          technical books, science-fiction, personal development or manga."
        />

        <div className="books-container">
          {books.map((book) => (
            <div className="book-card" key={book.id}>
              <a href={book.link} target="_blank" without rel="noreferrer">
                <img src={`/books/${book.image}`} alt={`${book.title}-cover`} />
                <span>
                  {book.title}{" "}
                  {book.stars && (
                    <span className="vote-counter">🔥 {book.stars}</span>
                  )}
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
