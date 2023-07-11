const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require("path");

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const blogPage = path.resolve("./src/templates/post.js");

  const result = await graphql(
    `
      {
        allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
          nodes {
            html
            frontmatter {
              title
              slug
              date(formatString: "YYYY-MM-DD")
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    throw result.errors;
  }

  const all = result.data.allMarkdownRemark.nodes;

  all.forEach((post, i) => {
    createPage({
      path: post.frontmatter.slug,
      component: blogPage,
      context: {
        slug: post.frontmatter.slug,
      },
    });
  });
};

const createNodes = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === "Mdx") {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};

exports.createPages = createPages;
exports.onCreateNode = createNodes;
