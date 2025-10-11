import React, { useState } from "react";
import "../styles/Home.css";
import OurServices from "../components/Acheivements";
import { useNavigate } from "react-router-dom";
import Kaasim from '../assets/kaasim.jpg'
import Irfaan from '../assets/irfaan.jpg'
import Asmila from '../assets/asmila.jpg'

const Home = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  let navigate = useNavigate()

  // Team member data
  const teamMembers = [
    {
      id: 2,
      name: "Asmila",
      role: "Secretary",
      bio: "Manages the critical logistics of blood requests, coordinates timely donor matching, and maintains the integrity of the donor database.",
      img: Asmila,
      social: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
        instagram: "#",
      },
    },
    {
      id: 1,
      name: "Mohammed Kasim",
      role: "President",
      bio: "Oversees the club's vision and impact. Leads strategic partnerships with hospitals and drives community engagement to ensure a steady, reliable donor base.",
      img: Kaasim,
      social: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
        instagram: "#",
      },
    },
    {
      id: 3,
      name: "Mohammed Irfan",
      role: "Joint Secretary",
      bio: "Focuses on organizing blood drives and awareness campaigns. Connects with new volunteers and handles all public communications.",
      img: Irfaan,
      social: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
        instagram: "#",
      },
    },
  ];

  return (
    <div className="overflow-x-hidden">
      <div className="decoration top-right-blob">
        <img src="/assets/corner-ill.png" alt="corner-ill" />
      </div>
      <div className="decoration bottom-left-blob">
        <img src="/assets/bot-corner-ill.png" alt="bot-corner-ill" />
      </div>

      {/* Navbar */}
      <header className="navbar">
        <div className="logo-container">
          <div className="logo-circle">
            <img
              className="rounded-full"
              src="/assets/cbd-logo.png"
              alt="cbd-logo"
              height="80px"
              width="80px"
            />
          </div>
        </div>

        <nav className={`nav-links ${isNavOpen ? "nav-open" : ""}`}>
          <a href="#about" onClick={() => setIsNavOpen(false)}>
            ABOUT US
          </a>
          <a href="#members" onClick={() => setIsNavOpen(false)}>
            MEMBERS
          </a>
          <a href="#achivement" onClick={() => setIsNavOpen(false)}>
            ACHIEVEMENTS
          </a>
          <a href="#testimonial" onClick={() => setIsNavOpen(false)}>
            TESTIMONIALS
          </a>
        </nav>

        <button
          className="menu-toggle"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <i className={`fas ${isNavOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <h1 className="main-title">
            DONATE BLOOD,
            <br />
            SAVE LIVES
          </h1>
          <p className="subtitle">
            Connecting donors with those in need instantly
          </p>
          <div className="cta-buttons">
            <a href="/donate" className="btn btn-primary">
              Become a Donor
            </a>
            <a href="/donate" className="btn btn-secondary">
              Need Blood
            </a>
          </div>
          <div className="playstore-link">
            <i className="fab fa-google-play"></i>
            <span>Playstore Link ( Coming Soon )</span>
          </div>
        </div>

        <div className="hero-illustration">
          <img
            src="/assets/Blood donation-ill.png"
            alt="Blood Donation Scene Illustration"
            className="illustration-image"
          />
        </div>
      </main>

      <section>
        <div className="decoration top-bg-wave"></div>
        <div className="content-wrapper">
          {/* About Section */}
          <section id="about" className="section about-us-section">
            <div className="about-content">
              <div className="text-block">
                <h2 className="section-title">ABOUT US</h2>
                <p>
                  The Crescent Blood Donors Club is a student-founded group
                  established on April 1st, 2014, by just five students. Today,
                  it’s a thriving community of over 100 dedicated members united
                  by a commitment to saving lives and serving society.
                </p>
                <div>
                  <span className="font-bold text-[#d93b4e] text-lg">
                    Join Us in Transforming Lives
                  </span>
                  <p>
                    By donating blood, you become part of a life-saving mission,
                    helping those in emergencies and ongoing treatments.
                  </p>
                  <span className="font-bold text-[#d93b4e] text-lg">
                    Our Mission
                  </span>
                  <ul className="text-[#164476]">
                    <li>Bridge the Gap Between Donors and Recipients.</li>
                    <li>Ensure Seamless Emergency Support.</li>
                    <li>
                      Empower Disabled Students by volunteering as scribes.
                    </li>
                    <li>Organize Awareness Programs.</li>
                    <li>Raise Awareness About Blood Donation.</li>
                    <li>Engage Communities Through Outreach Programs.</li>
                    <li>Empower Students as Changemakers.</li>
                  </ul>
                </div>
              </div>
              <div className="image-block">
                <img
                  src="/assets/blood-donation.png"
                  alt="Hands holding a red heart near blood donation equipment"
                />
              </div>
            </div>
          </section>

          {/* Impact Dashboard */}
          <section className="section impact-section">
            <h3 className="impact-title">Live Impact Dashboard</h3>
            <div className="impact-cards">
              <div className="card impact-card">
                <p className="impact-number">15,000+</p>
                <p className="impact-label">Total Donations</p>
              </div>
              <div className="card impact-card highlighted">
                <p className="impact-number">8,200+</p>
                <p className="impact-label">Active Donors</p>
              </div>
              <div className="card impact-card">
                <p className="impact-number">6,500+</p>
                <p className="impact-label">Requests Fulfilled</p>
              </div>
            </div>
          </section>

          {/* Achievements Section */}
          <section
            id="achivement"
            className="section achievements-section relative"
          >
            <h3 className="impact-title">Achievements</h3>
            <OurServices />
          </section>

          {/* Meet Our Team Section */}
          <section id="members" className="section team-section">
            <h2 className="section-title meet-title">Meet Our Team</h2>
            <div className="team-grid">
              {teamMembers.map((member) => (
                <div className="card team-card" key={member.id}>
                  <div className="profile-pic">
                    <img src={member.img} alt={`Team Member ${member.name}`} />
                  </div>
                  <div className="team-details">
                    <p className="member-role">{member.role}</p>
                    <p className="member-name">{member.name}</p>
                    <p className="member-bio">{member.bio}</p>
                  </div>
                  <div className="social-links">
                    <a href={member.social.facebook}>
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href={member.social.twitter}>
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href={member.social.linkedin}>
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href={member.social.instagram}>
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonial" className="section testimonials-section">
            <i className="fas fa-quote-left quote-icon"></i>
            <h2 className="story-title">Stories of Hope</h2>
            <p className="tagline">
              Read stories from donors and recipients who have experienced the
              life-changing impact of blood donation through our community.
            </p>

            <div className="testimonials-grid">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div className="card testimonial-card" key={item}>
                  <div className="rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <p className="quote-text">
                    "Thanks to Crescent Blood Donors, I received the blood
                    transfusion I needed during my surgery. Their quick response
                    saved my life. I'm forever grateful!"
                  </p>
                  <div className="reviewer">
                    <div className="reviewer-avatar"></div>
                    <p className="reviewer-name">Chris Johan</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="story-share-card">
              <h4 className="story-share-title">Share Your Story</h4>
              <p className="story-share-description">
                Have you been helped by our blood donation network? We'd love to
                hear your story and inspire others.
              </p>
              <a href="https://forms.gle/YrNsgGQ4M1hV8W3W8" className="submit-testimonial-link" target="blank">
                Submit Your Testimonial &rarr;
              </a>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-grid">
            <div className="footer-column logo-column">
              <div className="footer-logo">
                <img
                  src="/assets/cbd-logo.png"
                  alt="cbd-logo"
                  height="70px"
                  width="70px"
                />
                <p>CBD</p>
              </div>
              <div className="social-icons">
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h4>About</h4>
              <ul>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="#">Our Team</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Services</h4>
              <ul>
                <li>
                  <a href="#">Donor Registration</a>
                </li>
                <li>
                  <a href="#">Need Blood</a>
                </li>
                <li>
                  <a href="#">Blood Drives</a>
                </li>
                <li>
                  <a href="#">Testimonials</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Licenses</a>
                </li>
                <li>
                  <a href="#">Security</a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default Home;
