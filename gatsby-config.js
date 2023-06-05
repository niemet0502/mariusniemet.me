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
    "gatsby-plugin-mdx",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
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

    // animation
    {
      resolve: `gatsby-plugin-scroll-reveal`,
      options: {
        threshold: 0.5, // Percentage of an element's area that needs to be visible to launch animation
        once: true, // Defines if animation needs to be launched once
        disable: false, // Flag for disabling animations

        // Advanced Options
        selector: "[data-sal]", // Selector of the elements to be animated
        animateClassName: "sal-animate", // Class name which triggers animation
        disabledClassName: "sal-disabled", // Class name which defines the disabled state
        rootMargin: "0% 50%", // Corresponds to root's bounding box margin
        enterEventName: "sal:in", // Enter event name
        exitEventName: "sal:out", // Exit event name
      },
    },
  ],
};
