import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import Achievements from "../components/Acheivements";
import WhatWeDo from "../components/WhatWeDo";
import { useNavigate } from "react-router-dom";
import { api } from "../config/Url";
import Kaasim from '../assets/kaasim.jpg'
import Irfaan from '../assets/irfaan.jpg'
import Asmila from '../assets/asmila.jpg'

const Home = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  let navigate = useNavigate()

  const [teamMembers, setTeamMembers] = useState([]);

  // Team member data fallback
  const staticTeamMembers = [
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

  const [testimonials, setTestimonials] = useState([]);

  // Testimonial data fallback
  const staticTestimonials = [
    {
      _id: "static-1",
      rating: 5,
      quoteText: "Thank you so much it was a great favour for me, Today it's quite stable",
      reviewerName: "Rabika"
    },
    {
      _id: "static-2",
      rating: 5,
      quoteText: "Blood Received Sir..Thank you so much sir",
      reviewerName: "Prema V"
    },
    {
      _id: "static-3",
      rating: 5,
      quoteText: "My father needed another unit of blood today (due to complications, he still is in need for blood products) and the blood bank at Apollo refused to give the needed platelets due to in ability to replace the units he used, which currently stands at 54 units. I have been ablento find help to replace 7 units and they need atleast 50% of units given to be replaced. Any help will be greatly appreciated. You have already helped earlier, and I am grateful for that.",
      reviewerName: "Anonymus"
    },
    {
      _id: "static-4",
      rating: 5,
      quoteText: "You have arranged us blood and helped us a lot, Alhamdhulillah!, we include you in our prayer you include us as well",
      reviewerName: "Abdullah"
    },
    {
      _id: "static-5",
      rating: 5,
      quoteText: "Thanks to Crescent Blood Donors, I received the blood transfusion I needed during my surgery. Their quick response saved my life. I'm forever grateful!",
      reviewerName: "Anonymus"
    }
  ];

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await api.get("/team-members");
        if (response.data && response.data.success && response.data.data.length > 0) {
          setTeamMembers(response.data.data);
        } else {
          setTeamMembers(staticTeamMembers);
        }
      } catch (error) {
        console.error("Failed to fetch team members:", error);
        setTeamMembers(staticTeamMembers);
      }
    };
    fetchTeam();
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.get("/testimonials");
        if (response.data && response.data.success && response.data.data.length > 0) {
          setTestimonials(response.data.data);
        } else {
          setTestimonials(staticTestimonials);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        setTestimonials(staticTestimonials);
      }
    };
    fetchTestimonials();
  }, []);

  const getImageUrl = (member) => {
    if (member.img) return member.img; // Static fallback
    if (!member.image) return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    if (member.image.startsWith("http")) return member.image;
    const serverUrl = api.defaults.baseURL.replace('/api', '');
    return `${serverUrl}${member.image}`;
  };

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
              height="100px"
              width="100px"
            />
          </div>
        </div>

        <nav className={`nav-links ${isNavOpen ? "nav-open" : ""}`}>
          <a href="#about" onClick={() => setIsNavOpen(false)}>
            ABOUT US
          </a>
          <a href="#what-we-do" onClick={() => setIsNavOpen(false)}>
            WHAT WE DO
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
                  src="/assets/cbd-about-us.JPG"
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

          {/* What We Do Section */}
          <section
            id="what-we-do"
            className="section what-we-do-section relative"
          >
            <WhatWeDo />
          </section>

          {/* Achievements Section */}
          <section
            id="achivement"
            className="section achievements-section relative"
          >
            <Achievements />
          </section>

          {/* Meet Our Team Section */}
          <section id="members" className="section team-section">
            <h2 className="text-center font-bold text-[#164476] text-4xl mt-10 mb-10 pb-14">MEET OUR TEAM</h2>
            <div className="team-grid">
              {teamMembers.map((member) => (
                <div className="card team-card" key={member._id || member.id}>
                  <div className="profile-pic">
                    <img src={getImageUrl(member)} alt={`Team Member ${member.name}`} />
                  </div>
                  <div className="team-details">
                    <p className="member-role">{member.role}</p>
                    <p className="member-name">{member.name}</p>
                    <p className="member-bio">{member.bio}</p>
                  </div>
                  <div className="social-links">
                    <a href={member.social?.facebook || "#"}>
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href={member.social?.twitter || "#"}>
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href={member.social?.linkedin || "#"}>
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href={member.social?.instagram || "#"}>
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
            <h2 className="text-center font-bold text-[#164476] text-4xl mb-10">STORIES OF HOPES</h2>
            <p className="tagline">
              Read stories from donors and recipients who have experienced the
              life-changing impact of blood donation through our community.
            </p>

            <div className="testimonials-grid">
              {testimonials.map((item) => (
                <div className="card testimonial-card" key={item._id}>
                  <div className="rating">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                  <p className="quote-text">
                    "{item.quoteText}"
                  </p>
                  <div className="reviewer">
                    <div className="reviewer-avatar"></div>
                    <p className="reviewer-name">{item.reviewerName}</p>
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
                  <a href="#about">About Us</a>
                </li>
                <li>
                  <a href="https://forms.gle/4B65aywSgsrLx6MW9">Careers</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="#members">Our Team</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Services</h4>
              <ul>
                <li>
                  <a href="/donate">Donor Registration</a>
                </li>
                <li>
                  <a href="/donate">Need Blood</a>
                </li>
                <li>
                  <a href="#">Blood Drives</a>
                </li>
                <li>
                  <a href="#testimonial">Testimonials</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="https://cbd-backend.onrender.com/uploads/terms.pdf">Privacy Policy</a>
                </li>
                <li>
                  <a href="https://cbd-backend.onrender.com/uploads/terms.pdf">Terms of Service</a>
                </li>
                <li>
                  <a href="https://www.instagram.com/crescentblooddonors/?hl=en">Instagram</a>
                </li>
                <li>
                  <a href="http://facebook.com/crescentblooddonor/">Facebook</a>
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
