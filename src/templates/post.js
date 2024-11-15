import { graphql, Link } from "gatsby";
import React from "react";
import Layout from "../components/Layout";

export default function PostTemplate({ data }) {
  const { html, frontmatter } = data.markdownRemark;

  return (
    <Layout>
      <div className="page-content">
        <div className="blog-post-container">
          <div className="flex-1 post-content">
            <div className="post-content__head">
              <h1>{frontmatter.title}</h1>
            </div>

            <br />
            <div
              className="post-content__body"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
          <div className="right-sidebar">
            <h2>About me</h2>

            <p>
              Hello and thanks for visiting!. I'm{" "}
              <Link to="/about">Marius</Link> <br />a software Engineer and
              Writer based in Dakar. I like building stuff and writing about
              them.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        categorie
        date(formatString: "YYYY-MM-DD")
        title
      }
    }
  }
`;
