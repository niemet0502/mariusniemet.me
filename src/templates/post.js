import { graphql } from "gatsby";
import React from "react";
import { Helmet } from "react-helmet";
import Layout from "../components/Layout";
import { SEO } from "../components/Seo";
import config from "../utils/config";

export default function PostTemplate({ data }) {
  const post = data.markdownRemark;

  const { html, frontmatter } = data.markdownRemark;

  return (
    <Layout>
      <Helmet title={`${config.siteTitle} - ${frontmatter.title}`} />
      <SEO postPath={frontmatter.slug} postNode={post} postSEO />

      <div className="page-content">
        <div className="blog-post-container">
          <div className="post-content">
            <div className="post-content__head">
              <h1>{frontmatter.title}</h1>
            </div>

            <br />
            <div
              className="post-content__body"
              dangerouslySetInnerHTML={{ __html: html }}
            />
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
