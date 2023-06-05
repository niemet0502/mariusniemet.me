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
                Hi, I’m Marius a Software Engineer and Writer living in Dakar,
                Senegal. <br /> Welcome in my little corner on the internet.
              </p>
              <img
                src="/profile.jpg"
                className="profile-picture"
                alt="profile"
              />

              <p>
                <br />
                I really enjoy building products, I can work on the entire stack
                from the database design, to the frontend and backend. I take
                end-to-end ownership across all areas of the software
                development lifecycle, including: designing, building,
                releasing, and monitoring.
                <br />
                <br />
                After joining the MooTools core team, I got my first full-time
                job as a frontend engineer at 18 years old and relocated to San
                Francisco, CA. I started my first company Cloudup in SF which
                was later acquired by Automattic, the company behind WordPress,
                to power their editing and site building technology.
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
            </div>
          </div>

          <div>
            <h1>Experience</h1>

            <div className="experience">
              <h1>Fleeti</h1>
              <span>July 2020 - Present</span>

              <h3>Software Engineer</h3>
              <h3>Webmaster</h3>
            </div>
          </div>
        </div>
      </div>

      <Footer customStyle="footer-alignment" />
    </Layout>
  );
};

export default About;
