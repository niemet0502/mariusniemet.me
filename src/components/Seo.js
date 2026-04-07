import React from "react";
import Helmet from "react-helmet";

import config from "../utils/config";

export const SEO = ({ postNode, postPath, postSEO, customDescription }) => {
  let title;
  let description;
  let image = config.siteLogo;
  let postURL;
  let canonicalUrl = config.siteUrl;

  if (postSEO) {
    const postMeta = postNode.frontmatter;
    title = `${postMeta.title} — Marius Niemet`;
    description = postNode.excerpt || customDescription || config.description;

    if (postMeta.thumbnail) {
      image = postMeta.thumbnail.childImageSharp.fixed.src;
    }

    postURL = `${config.siteUrl}/${postPath}`;
    canonicalUrl = postURL;
  } else {
    title = config.siteTitle;
    description = customDescription || config.description;
  }

  image = `${config.siteUrl}${image}`;

  // Base WebSite schema — helps Google understand site identity
  const schemaOrgJSONLD = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: config.siteUrl,
      name: "Marius Niemet",
      alternateName: "Marius NIEMET",
      description: config.description,
    },
    // Person schema — the most important one for "search my name" discoverability
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Marius Niemet",
      alternateName: "Marius NIEMET",
      url: config.siteUrl,
      image: `${config.siteUrl}/profile.jpeg`,
      jobTitle: "Software Engineer",
      worksFor: {
        "@type": "Organization",
        name: "Socium",
        url: "https://socium.link/",
      },
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Institut Supérieur d'Informatique",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Dakar",
          addressCountry: "SN",
        },
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dakar",
        addressRegion: "Dakar",
        addressCountry: "SN",
      },
      nationality: {
        "@type": "Country",
        name: "Congo",
      },
      sameAs: [
        "https://github.com/niemet0502",
      ],
      knowsAbout: [
        "Software Engineering",
        "Distributed Systems",
        "Backend Development",
        "Web Development",
        "React",
        "TypeScript",
        "NestJS",
        "Docker",
        "Kubernetes",
      ],
    },
  ];

  if (postSEO) {
    schemaOrgJSONLD.push(
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id": config.siteUrl,
              name: "Home",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@id": `${config.siteUrl}/articles`,
              name: "Articles",
            },
          },
          {
            "@type": "ListItem",
            position: 3,
            item: {
              "@id": postURL,
              name: title,
            },
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": postURL,
        },
        url: postURL,
        name: title,
        headline: title,
        image: {
          "@type": "ImageObject",
          url: image,
        },
        description,
        author: {
          "@type": "Person",
          name: "Marius Niemet",
          url: config.siteUrl,
        },
        publisher: {
          "@type": "Person",
          name: "Marius Niemet",
          logo: {
            "@type": "ImageObject",
            url: `${config.siteUrl}/logo.png`,
          },
        },
      }
    );
  }

  return (
    <Helmet>
      {/* Language */}
      <html lang="en" />

      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="image" content={image} />
      <meta name="author" content="Marius Niemet" />
      <meta
        name="keywords"
        content="Marius Niemet, software engineer, developer, distributed systems, backend, web development, Congo, Dakar, Senegal, blog, technical articles"
      />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={postSEO ? "article" : "website"} />
      <meta property="og:url" content={postSEO ? postURL : config.siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Marius Niemet" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
