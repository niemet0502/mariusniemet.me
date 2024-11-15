import { Link } from "gatsby";
import React from "react";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Layout from "../components/Layout";
import { SEO } from "../components/Seo";
import { projects } from "../data/projectsList";
import config from "../utils/config";

const Projects = () => {
  const description = "Open source projects i have built";

  return (
    <Layout>
      <Helmet title={`${config.siteTitle} - Projects`} />
      <SEO customDescription={description} />

      <div className="page-content">
        <Hero
          title="Projects"
          content="I love building stuff in my spare time I find it the best way to explore new topics, learn, and continue to grow as an engineer. You'll see that it is mostly web-oriented. "
        />
      </div>
      <div className="projects-section">
        {projects.map((project) => (
          <div className="project-container">
            <div className="project flex gap-10">
              <div className="flex flex-1 flex-column">
                <h3>
                  {project.name} <span>{project.date}</span>
                </h3>
                <div>
                  <p>{project.description}</p>
                  <p>{project.subtitle}</p>
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

              <img src={`/projects/${project.image}`} alt={project.name} />
            </div>
          </div>
        ))}
      </div>
      <Footer customStyle="footer-alignment" />
    </Layout>
  );
};

export default Projects;
