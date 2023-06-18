import { Link } from "gatsby";
import * as React from "react";
import { AiTwotoneStar } from "react-icons/ai";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import LeftSideBar from "../components/LeftSideBar";
import { projects } from "../data/projectsList";

const IndexPage = () => {
  return (
    <Layout>
      <div className="content">
        <LeftSideBar />

        <div className="home-page-content">
          <div className="content-container">
            <div className="header">
              <div>
                <h1>Hi, i'm Marius</h1>
                <h3>Welcome in my little corner on the internet. </h3>

                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </p>
              </div>
              <div></div>
            </div>

            <div className="featured-blog-post">
              <div className="blog-post">
                <h2>Last articles</h2>
              </div>
              <div className="blog-post">
                <h3>Writing Unit Tests for your Nestjs Rest API</h3>
              </div>
              <div className="blog-post">
                <h3>
                  Building your first Rest API with Nestjs and TypeORM and test
                  it with Postman
                </h3>
              </div>
              <div className="blog-post">
                <h3>2022 Year in Review</h3>
              </div>
              <div className="blog-post">
                <h3>DSA 10# Depth-First Search of a Binary Tree</h3>
              </div>
              <div className="blog-post">
                <h3>DSA 11# Graph explained</h3>
              </div>
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
