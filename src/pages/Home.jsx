import React, { useState } from 'react';
import '../styles/Home.css'
import OurServices from '../components/Acheivements';

const Home = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className='overflow-x-hidden'>

      <div className="decoration top-right-blob">
        <img src="/assets/corner-ill.png" alt="corner-ill" />
      </div>
      <div className="decoration bottom-left-blob">
        <img src="/assets/bot-corner-ill.png" alt="bot-corner-ill" />
      </div>

      <header className="navbar">
        <div className="logo-container">
          <div className="logo-circle">
            <img
              src="/assets/cbd-logo.png"
              alt="cbd-logo"
              height="80px"
              width="80px"
            />
          </div>
        </div>
        {/* The 'nav-open' class is conditionally applied based on state */}
        <nav className={`nav-links ${isNavOpen ? 'nav-open' : ''}`}>
          <a href="#about" onClick={() => setIsNavOpen(false)}>ABOUT US</a>
          <a href="#members" onClick={() => setIsNavOpen(false)}>MEMBERS</a>
          <a href="#achivement" onClick={() => setIsNavOpen(false)}>ACHIEVEMENTS</a>
          <a href="#testimonial" onClick={() => setIsNavOpen(false)}>TESTIMONIALS</a>
        </nav>
        {/* The onClick handler toggles the state */}
        <button className="menu-toggle" onClick={() => setIsNavOpen(!isNavOpen)}>
          {/* Dynamically change the icon based on the menu state */}
          <i className={`fas ${isNavOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </header>

      <main className="hero-section">
        <div className="hero-content">
          <h1 className="main-title">DONATE BLOOD,<br />SAVE LIVES</h1>
          <p className="subtitle">Connecting donors with those in need instantly</p>
          <div className="cta-buttons">
            {/* You can replace '#' with your actual links, e.g., '/donor-form' */}
            <a href="#" className="btn btn-primary">Become a Donor</a>
            <a href="#" className="btn btn-secondary">Need Blood</a>
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
          <section id="about" className="section about-us-section">
            <div className="about-content">
              <div className="text-block">
                <h2 className="section-title">ABOUT US</h2>
                <p>
                  The Crescent Blood Donors Club is a student-founded group founded on April 1st, 2014, by just five students, the Crescent Blood Donors Club has since blossomed into a thriving community of over 100 dedicated members united by a commitment to saving lives and serving society. Operated by the students of  B.S. Abdur Rahman Crescent University, Vandalur, this initiative has become a beacon of hope and solidarity, making a significant impact not only through coordinated blood donations but also through various social service activities. From emergency blood drives to community outreach, the Crescent Blood Donors are working together and  inspiring others to join their mission to make a lasting difference in the world.
                </p>
                <div>
                    <span className='font-bold text-[#d93b4e] text-lg'> Join Us in Transforming Lives</span>
                    <p>Every day, our amazing donors, volunteers, and members come together to make a difference. By donating blood, you become part of a life-saving mission, helping those in emergency and ongoing medical situations.</p>
                    <span className='font-bold text-[#d93b4e] text-lg'>Our Mission</span>
                    <ul className='text-[#164476]'>
                      <li>Bridge the Gap Between Donors and Recipients. </li>
                      <li>Ensure Seamless Emergency Support.</li>
                      <li>Empower Disabled Students by volunteering as scribes.</li>
                      <li>Organize Awareness Programs.</li>
                      <li>Raise Awareness About Blood Donation.</li> 
                      <li>Engage Communities Through Outreach Programs</li> 
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
                <p className="impact-label">Request Fullfilled</p>
              </div>
            </div>
          </section>

          <section id="achivement" className="section achievements-section relative">
            <h3 className="impact-title">Achievements</h3>
            <OurServices />
          </section>

          <section id="members" className="section team-section">
            <h2 className="section-title meet-title">Meet Our Team</h2>
            <div className="team-grid">
              {/* Team Member Card - Repeated for demonstration */}
              {[1, 2, 3].map((item) => (
                <div className="card team-card" key={item}>
                  <div className="profile-pic">
                    <img src="/assets/ui-face.jpg" alt="Team Member Chris Johan" />
                  </div>
                  <div className="team-details">
                    <p className="member-role">Team Member</p>
                    <p className="member-name">Chris Johan</p>
                    <p className="member-bio">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                      do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>
                  <div className="social-links">
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="testimonial" className="section testimonials-section">
            <i className="fas fa-quote-left quote-icon"></i>
            <h2 className="story-title">Stories of Hope</h2>
            <p className="tagline">
              Read stories from donors and recipients who have experienced the
              life-changing impact of blood donation through our community.
            </p>
            <div className="testimonials-grid">
               {/* Testimonial Card - Repeated for demonstration */}
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div className="card testimonial-card" key={item}>
                  <div className="rating">
                    <i className="fas fa-star"></i><i className="fas fa-star"></i>
                    <i className="fas fa-star"></i><i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <p className="quote-text">
                    "Thanks to Crescent Blood Donors, I received the blood
                    transfusion I needed during my surgery. The quick response and
                    professional handling saved my life. I'm forever grateful to
                    this organization and all the donors."
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
                hear your story and inspire others to join our life-saving
                community.
              </p>
              <a href="#" className="submit-testimonial-link">
                Submit Your Testimonial &rarr;
              </a>
            </div>
          </section>
        </div>
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
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div className="footer-column">
              <h4>About</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Our Team</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Services</h4>
              <ul>
                <li><a href="#">Donor Registration</a></li>
                <li><a href="#">Need Blood</a></li>
                <li><a href="#">Blood Drives</a></li>
                <li><a href="#">Testimonials</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Licenses</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default Home;