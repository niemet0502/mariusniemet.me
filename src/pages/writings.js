import React from "react";

import { Link, graphql, useStaticQuery } from "gatsby";
import { useMemo } from "react";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Layout from "../components/Layout";

const Writings = () => {
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

  console.log(data);
  const posts = data.allMarkdownRemark.nodes;
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
              <h3 className="section-title">{key.replaceAll("-", " ")}</h3>

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

export default Writings;
