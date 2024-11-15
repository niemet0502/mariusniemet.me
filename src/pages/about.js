import React from "react";
import Footer from "../components/Footer";
import Layout from "../components/Layout";

const About = () => {
  return (
    <Layout>
      <div className="page-content">
        <div className="aboutme-section">
          <h1>About me</h1>

          <div className="flex aboutme-section__picture">
            <p>
              <img src="/profile.jpeg" alt="Description" class="float-right" />
              Hi, i'm Marius a software engineer and this is my website. <br />
              <br />
              <br />
              I'm from Pointe-Noire, Congo but i have been living in Dakar,
              Senegal since 2018.
              <br />
              <br />
              Daily I build products for my employer or myself and I love it. In
              the engineering space, I'm passionate about creating well-crafted
              software solutions that solve difficult problems. I'm interested
              in distributed systems, databases, and web development.
              <br />
              <br />
              I occasionally write technical articles about things I learn, for
              me it's a better way to understand them and I find myself coming
              back when I have to relearn something.
              <br />
              <br />
              Outside of work, I like reading books, playing video games, and
              spending quality time with friends.
              <br />
              <br />I love music I'm always listening to something, last year I
              thought it would be nice to learn how to play so I bought a guitar
              that I have barely touched since then ^^
            </p>
          </div>

          <div>
            <h1>What I'm doing now</h1>
            <span className="italic">Updated November 14th, 2024</span>

            <ul>
              <li>
                Reading{" "}
                <a
                  href="https://www.amazon.com/Silo-1-Hugh-Howey/dp/2253183539"
                  target="__blank"
                >
                  Silo
                </a>
              </li>
              <li>
                Building{" "}
                <a
                  href="https://github.com/niemet0502/shirabe"
                  target="__blank"
                >
                  shirabe
                </a>{" "}
              </li>
              <li>Learning Angular</li>
            </ul>
          </div>

          <div className="experiences-section">
            <h1>Professional Experiences</h1>
            <div className="education__item">
              <div className="flex">
                <h3>
                  Software Engineer at{" "}
                  <a href="https://en.fleeti.co/" target="__blank">
                    {" "}
                    Fleeti{" "}
                  </a>
                </h3>
              </div>
              <p>
                July 2020 – Current • Dakar, Senegal <br />I was one of the
                early engineers to join the company, over my time here I have:
              </p>
              <ul>
                <li>
                  Led end-to-end feature development for our product resulting
                  in faster feature delivery.
                </li>
                <li>
                  Collaborated with cross-functional teams to design and
                  implement features.
                </li>
                <li>
                  Built from the ground-up the frontend app used by our
                  technicians, cutting operation time by 60%.
                </li>
                <li>Contributed to code reviews. </li>
                <li>
                  Provided technical support, analysing and fixing bugs reported
                  by internal users.{" "}
                </li>
                <li>
                  Wrote documentation both technical for engineers and
                  non-technical for users.
                </li>
              </ul>
            </div>
            <div className="education__item">
              <div className="flex">
                <h3>
                  FullStack Software Engineer at{" "}
                  <a href="https://6lex.co/" target="__blank">
                    Agence 6lex
                  </a>
                </h3>
              </div>
              <p>January 2019 – June 2020 • Remote</p>
              <ul>
                <li>
                  Developed and maintained web applications using React and
                  TypeScript.
                </li>
                <li>
                  Led the backend development of APIs ensuring scalability.
                </li>
                <li>Wrote automated tests for both frontend and backend.</li>
                <li>
                  Collaborated with cross-functional teams to design and
                  implement features.
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h1>Education</h1>
            <div className="education__item">
              <div className="flex">
                <h3>Master of science - Software Engineering</h3>
                <span>Dakar, Senegal</span>
              </div>
              <span>Institut Supérieur d'informatique</span>
            </div>
            <div className="education__item">
              <div className="flex">
                <h3>Bachelor of science - Software Engineering</h3>
                <span>Dakar, Senegal</span>
              </div>
              <span>Institut Supérieur d'informatique</span>
            </div>
          </div>
        </div>
      </div>

      <Footer customStyle="footer-alignment" />
    </Layout>
  );
};

export default About;
