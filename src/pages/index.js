import { Link, graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import LeftSideBar from "../components/LeftSideBar";
import { projects } from "../data/projectsList";
import { transformDateToMonthYearLetter } from "../utils/Date";
import config from "../utils/config";

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        filter: { frontmatter: { published: { eq: true } } }
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          frontmatter {
            title
            date
            author
            description
            slug
          }
          html
        }
      }
    }
  `);

  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout>
      <Helmet title={config.siteTitle} />
      <div className="content">
        <LeftSideBar />

        <div className="home-page-content">
          <div className="content-container">
            <div className="header">
              <div>
                <h1>Hi, i'm Marius</h1>

                <p>
                  I'm a Congolese Software Engineer living in Dakar, Senegal.
                </p>

                <p>
                  On this site, you can check out all the{" "}
                  <Link to="/projects">technical articles</Link> I've written,
                  read some of my <Link to="/notes">personal notes</Link>, the{" "}
                  <Link to="/reads">books</Link> I've read, or learn more{" "}
                  <Link to="/reads">about me.</Link>
                </p>
              </div>
              <div></div>
            </div>

            <div className="featured-blog-post">
              <div className="blog-post">
                <h2>Articles</h2>
              </div>

              {(posts.slice(0, 5) || []).map((post) => (
                <div className="blog-post">
                  <h3>
                    <Link to={`/${post.frontmatter.slug}`}>
                      <div className="blog-post-link">
                        <span>{post.frontmatter.title}</span>
                        <span className="blog-post-link__date">
                          {transformDateToMonthYearLetter(
                            post.frontmatter.date
                          )}
                        </span>
                      </div>
                    </Link>
                  </h3>
                </div>
              ))}
            </div>

            <h2 className="featured-projects__title">Projects</h2>
            <div className="featured-projects">
              {projects.map((project) => (
                <div className="project-card">
                  <div className="header">
                    <h3>{project.name}</h3>
                    <span>{project.year}</span>
                  </div>
                  <div className="body">
                    <p>{project.description}</p>
                  </div>
                  <div className="footer">
                    <ul>
                      {project.article && (
                        <li>
                          <Link to={project.article}>Article</Link>
                        </li>
                      )}

                      {project.demo && (
                        <li>
                          <a
                            href={project.demo}
                            target="_blank"
                            without
                            rel="noreferrer"
                          >
                            Demo
                          </a>
                        </li>
                      )}

                      {project.source && (
                        <li>
                          <a
                            href={project.source}
                            target="_blank"
                            without
                            rel="noreferrer"
                          >
                            Source
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Footer customStyle="container-align" />
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
