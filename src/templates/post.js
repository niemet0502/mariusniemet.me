import { Link } from "gatsby";
import React from "react";
import Layout from "../components/Layout";

export default function PostTemplate() {
  // const { html, frontmatter } = data.markdownRemark;

  return (
    <Layout>
      <div className="page-content">
        <div className="blog-post-container">
          <div className="flex-1 post-content">
            {/* <div className="post-content__head">
              <h1>{frontmatter.title}</h1>
              <span>Filled under: {frontmatter.categorie}</span> <br />
              <span>Published: {frontmatter.date}</span>
            </div> */}

            <br />
            {/* <div
              className="post-content__body"
              dangerouslySetInnerHTML={{ __html: html }}
            /> */}
          </div>
          <div className="right-sidebar">
            <h2>About me</h2>

            <img src="/profile.jpg" className="" alt="profile" />

            <p>
              Hi I'm <Link to="/about">Marius</Link> <br />
              Welcome to my little corner on the internet. <br />
              I'm a software Engineer and Writer based in Dakar. I build stuff
              and write about them. I'm intersted in Distributed systems, data
              structure and algorithm. <br />I like chess, books and formula 1.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// export const pageQuery = graphql`
//   query BlogPostBySlug($slug: String!) {
//     markdownRemark(fields: { slug: { eq: $slug } }) {
//       html
//       frontmatter {
//         categorie
//         date(formatString: "YYYY-MM-DD")
//         title
//       }
//     }
//   }
// `;
