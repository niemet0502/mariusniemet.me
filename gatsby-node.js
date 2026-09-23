const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require("path");
const {
  MAINTENANCE_MODE,
  BLOCKED_STATIC_PATHS,
} = require("./src/utils/maintenance");

const createMaintenanceRedirects = (actions, slugs) => {
  const { createRedirect } = actions;

  const redirect = (fromPath) => {
    createRedirect({
      fromPath,
      toPath: "/",
      isPermanent: false,
      redirectInBrowser: true,
    });
  };

  BLOCKED_STATIC_PATHS.forEach((pagePath) => {
    redirect(pagePath);
    redirect(`${pagePath}/`);
  });

  slugs.forEach((slug) => {
    redirect(`/${slug}`);
    redirect(`/${slug}/`);
  });
};

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

  const slugs = [];

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    slugs.push(node.frontmatter.slug);

    createPage({
      path: node.frontmatter.slug,
      component: blogPage,
      context: {
        slug: node.frontmatter.slug,
      },
    });
  });

  if (MAINTENANCE_MODE) {
    createMaintenanceRedirects(actions, slugs);
  }
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
