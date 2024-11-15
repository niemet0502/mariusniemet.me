import React from "react";

import { graphql, Link, useStaticQuery } from "gatsby";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Layout from "../components/Layout";
import { SEO } from "../components/Seo";
import { transformDateToMonthYearLetter } from "../utils/Date";
import config from "../utils/config";

const Articles = () => {
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
  const description =
    "The things i have wrote on engineering, infrastructure, backend or frontend also about life in general.";

  return (
    <Layout>
      <Helmet title={`${config.siteTitle} - Articles`} />
      <SEO customDescription={description} />

      <div className="page-content">
        <Hero
          title="Articles"
          content="The things i have wrote on engineering, infrastructure, backend or frontend
 also about life in general. You can browse the articles by topic, by date
 or search by keyword below."
        />
        <div className="flex articles-container">
          <div className="articles">
            {posts
              .filter(({ frontmatter }) => frontmatter.categorie !== "notes")
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

export default Articles;
