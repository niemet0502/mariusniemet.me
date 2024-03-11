import React from "react";
import Footer from "../components/Footer";
import Layout from "../components/Layout";

const About = () => {
  return (
    <Layout>
      {/* <LeftSideBar /> */}
      <div className="page-content">
        <div className="aboutme-section">
          <h1>About me</h1>
          <div className="flex aboutme-section__picture">
            <div className="flex-1">
              <p>
                Hi i'm Marius a Congolese software engineer and writer living in
                Dakar Senegal. <br /> I wanted this place to feel like a human
                being website not only as a engineer one, that why you can find
                my playlists and reads since i'm a music and books lover.
                <br /> I sometimes write about what I've learned in my
                day-to-day work, experiences, or something that interests me to
                improve my knowledge base. <br />
              </p>
            </div>
            <div className="flex">
              <img
                src="/profile.jpg"
                className="profile-picture"
                alt="profile"
              />
            </div>
          </div>
          <div>
            <div>
              <p>
                <br />
                Daily I build products for my own needs or my employer and I
                like and enjoy it. I can work on the entire stack from the
                database design, to the frontend, backend and take end-to-end
                ownership across all areas of the software development
                lifecycle, including: designing, building, releasing, and
                monitoring.
                <br />
                <br />
                To do all those things I use:
                <ul>
                  <li>Languages: Javascript (Typescript), Java, Go</li>
                  <li> DBMS: MySQL, PostgreSQL </li>
                  <li> Infrastructure: Docker, Kubernetes </li>
                  <li> Messaging: Redis Pub/Sub</li>
                  <li> Cloud provider: AWS</li>
                  <li>
                    Monitoring: Grafana stack (Loki, Tempo, Grafana, Promtail),
                    OpenTelemetry, Prometheus
                  </li>
                </ul>
              </p>

              <p>
                Outside of building and writing, I enjoy: <br />
                <ul>
                  <li> Reading books technical or not</li>
                  <li> Playing guitar, chess, and piano</li>
                  <li> Watching manga, basketball, and Formula 1</li>
                  <li> Spending quality time with people I love</li>
                </ul>
              </p>

              <p>
                <br />
                If you have a question or just want to say hi, feel free to
                reach out over email or find me on any social media.
              </p>
            </div>
          </div>

          <div>
            <h1>What I'm doing now</h1>
            <span className="italic">Updated March 11th, 2023</span>

            <ul>
              <li>Reading Hunger games the 2nd book</li>
              <li>Reading Distributed systems with Nodejs</li>
              <li>Playing the Last of us part 1</li>
              <li>Writing about Docker and containerization</li>
            </ul>
          </div>

          <div className="experiences-section">
            <h1>Experiences</h1>

            <ul className="experiences-list">
              <li>
                <div className="experience">
                  <div
                    className="flex align-items-center"
                    style={{ marginBottom: "-25px" }}
                  >
                    <h1 className="flex align-items-center gap-10">
                      Fleeti
                      <span className="italic">· July 2020 - present</span>
                    </h1>
                  </div>

                  <ul className="experience-postes  bullet">
                    <li>
                      <h3>Software Engineer</h3>
                      <span className="italic">Dec 2020 - present</span>
                      <ul>
                        <li>
                          Features implementation by working closely with
                          stakeholders and the design team
                        </li>
                        <li>Build the frontend design system.</li>
                        <li>Build the frontend platform</li>
                        <li>
                          Support product launches, write documentation, and fix
                          bugs reported by internal users
                        </li>
                      </ul>
                    </li>
                    <li>
                      <h3>Webmaster</h3>
                      <span className="italic">July 2020 - Dec 2020</span>
                      <ul>
                        <li>Template customization to match the Design</li>
                        <li>SEO optimization</li>
                        <li>Performance optimization</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer customStyle="footer-alignment" />
    </Layout>
  );
};

export default About;
