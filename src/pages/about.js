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
          <div className="flex">
            <div className="flex-1">
              <p>
                Hi, my name is Marius, i'm a software engineer and writer from
                Congo currently living in Dakar Senegal. <br /> Welcome in my
                little corner on the internet. <br /> <br /> I wanted this place
                to feel like a human being website not only as a engineer one,
                that why you can find the playlists that i created since i
                really love music and you can also find here the things i have
                recently read.
              </p>
            </div>
            <div>
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
                I sometimes write about what I've learned in my day-to-day work,
                experiences, or something that interests me to improve my
                knowledge base.
                <br />
                <br />
                On a daily basis I build products for my own needs or for my
                employer and i like and enjoy it, I can work on the entire stack
                from the database design, to the frontend and backend. I take
                end-to-end ownership across all areas of the software
                development lifecycle, including: designing, building,
                releasing, and monitoring.
                <br />
                <br />
                To do all those things I use:
                <ul>
                  <li>Languages: Javascript (Typescript), Java</li>
                  <li>Framework: React, Nestjs, ExpressJs, Spring-boot</li>
                  <li> DBMS: MySQL, PostgreSQL, MongoDB </li>
                  <li> Infrastructure: Docker, Kubernetes </li>
                  <li> Caching: Redis</li>
                  <li> Messaging: Kafka</li>
                  <li>Monitoring:</li>
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
            <span className="italic">Updated June 15th, 2023</span>

            <ul>
              <li>Reading Bersek currently on the second Volume</li>
              <li>Reading the Harry potter serie current on the 5th Book</li>
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
