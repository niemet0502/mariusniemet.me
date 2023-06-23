import React from "react";

import { Link, graphql } from "gatsby";
import { useMemo } from "react";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Layout from "../components/Layout";

const Writings = ({ data }) => {
  const posts = data.posts.nodes;
  const postsbytopic = useMemo(() => {
    const collection = {};

    for (let i = 0; i < posts.length; i++) {
      collection[posts[i].frontmatter.categorie] = [];
      for (let j = 0; j < posts.length; j++) {
        const { categorie } = posts[j].frontmatter;

        if (posts[i].frontmatter.categorie === categorie) {
          collection[categorie].push(posts[j]);
        }
      }
    }

    return collection;
  }, [posts]);

  console.log(postsbytopic);

  return (
    <Layout>
      <div className="page-content">
        <Hero
          title="Writings"
          content="The things i have wrote on engineering, infrastructure, backend or frontend
 also about life in general. You can browse the articles by topic, by date
 or search by keyword below."
        />
        <h2>Articles by topic</h2>
        <div className="flex articles">
          {Object.keys(postsbytopic).map((key) => (
            <div className="article-container">
              <h3 className="section-title">{key}</h3>

              {postsbytopic[key].map((post) => (
                <div className="blog-post" key={post.id}>
                  <h3>
                    <Link to={`/${post.frontmatter.slug}`}>
                      {post.frontmatter.title}
                    </Link>
                  </h3>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Footer customStyle="footer-alignment" />
    </Layout>
  );
};

export const blogQuery = graphql`
  query BlogQuery {
    posts: allMdx(sort: { frontmatter: { date: DESC } }) {
      nodes {
        id
        body
        frontmatter {
          title
          date
          categorie
          slug
        }
      }
    }
  }
`;

export default Writings;
