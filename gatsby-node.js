const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require("path");

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const blogPage = path.resolve("./src/templates/post.js");

  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.slug,
      component: blogPage,
      context: {
        slug: node.frontmatter.slug,
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
