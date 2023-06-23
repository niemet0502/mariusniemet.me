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
    description: "Software engineer. This is my little corner on the internet",
    siteUrl: `https://www.yourdomain.tld`,
    logo: "https://www.yourdomain.tld/logo.png",
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    `gatsby-plugin-mdx`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        path: `${__dirname}/blog`,
        extensions: [".mdx", "md"],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/blog`,
      },
    },
    `gatsby-transformer-remark`,
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
  ],
};
