/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Marius Niemet`,
    author: {
      name: "Marius Niemet",
    },
    pathPrefix: "/",
    description:
      "Marius Niemet — Software Engineer from Congo based in Dakar, Senegal. Writing about distributed systems, backend development, web engineering, and life.",
    siteUrl: `https://www.mariusniemet.me`,
    logo: "https://www.mariusniemet.me/logo.png",
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/src/blog`,
      },
    },
    `gatsby-transformer-remark`,
    "gatsby-remark-autolink-headers",
    "gatsby-plugin-sharp",
    "gatsby-remark-images",
    "gatsby-remark-relative-images",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    // =======================================================
    // Images and static
    // =======================================================
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "assets",
        path: `${__dirname}/static/`,
      },
    },
    /**
     * SEO
     */
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        query: `
          {
            allSitePage {
              nodes {
                path
              }
            }
          }
        `,
        resolveSiteUrl: () => "https://www.mariusniemet.me",
      },
    },
    /**
     * MARKDOWN
     */
    `gatsby-remark-prismjs`,
    "gatsby-transformer-sharp",
    "gatsby-transformer-remark",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          "gatsby-remark-autolink-headers",
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 800,
              backgroundColor: "transparent",
            },
          },
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
              prompt: {
                user: "root",
                host: "localhost",
                global: true,
              },
            },
          },
        ],
      },
    },
  ],
};
