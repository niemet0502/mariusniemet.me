import React from "react";

import { graphql, Link, useStaticQuery } from "gatsby";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Layout from "../components/Layout";
import { transformDateToMonthYearLetter } from "../utils/Date";

const Notes = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        filter: { frontmatter: { published: { eq: true } } }
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          frontmatter {
            title
            date
            author
            description
            slug
            categorie
          }
          html
        }
      }
    }
  `);

  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout>
      <div className="page-content">
        <Hero
          title="Notes"
          content="Personal notes about life, music, art, projects, and everything else I want to write about."
        />
        <div className="flex articles-container">
          <div className="articles">
            {posts
              .filter(({ frontmatter }) => frontmatter.categorie === "notes")
              .map((post) => (
                <div className="flex blog-post" key={post.id}>
                  <h3>
                    <Link to={`/${post.frontmatter.slug}`}>
                      {post.frontmatter.title}
                    </Link>
                  </h3>
                  <span className="blog-post-link__date">
                    {transformDateToMonthYearLetter(post.frontmatter.date)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <Footer customStyle="footer-alignment" />
    </Layout>
  );
};

export default Notes;
