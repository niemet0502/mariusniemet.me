import { Link, graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import { AiTwotoneStar } from "react-icons/ai";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import LeftSideBar from "../components/LeftSideBar";
import { projects } from "../data/projectsList";

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark {
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
      <div className="content">
        <LeftSideBar />

        <div className="home-page-content">
          <div className="content-container">
            <div className="header">
              <div>
                <h1>Hi, i'm Marius</h1>
                <h3>Welcome to my little corner on the internet. </h3>

                <p>
                  A Congolese software Engineer and Writer based in Dakar,
                  Senegal. I <Link to="/creations">build</Link> stuff and{" "}
                  <Link to="/writings">write</Link> about them.
                </p>
              </div>
              <div></div>
            </div>

            <div className="featured-blog-post">
              <div className="blog-post">
                <h2>Last articles</h2>
              </div>

              {(posts.slice(0, 5) || []).map((post) => (
                <div className="blog-post">
                  <h3>
                    <Link to={`/${post.frontmatter.slug}`}>
                      {post.frontmatter.title}
                    </Link>
                  </h3>
                </div>
              ))}
            </div>

            <div className="featured-projects">
              <h2>Featured creations</h2>

              {projects.map((project) => (
                <div className="project-card">
                  <div className="header">
                    <h3>{project.name}</h3>
                    <span>
                      {project.year} - 2 <AiTwotoneStar />
                    </span>
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
