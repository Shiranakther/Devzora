// src/components/Footer.jsx
import React from 'react';
import '../css/course/userComponet/footerComponent.css'; 
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
    
        <div className="footer-section about">
          <h2 className="logo"><span>Dev</span>Zora</h2>
          <p>A modern platform for online learning and knowledge sharing.</p>
        </div>

      
        <div className="footer-section">
          <h3>PLATFORM</h3>
          <ul>
            <li>Courses</li>
            <li>Posts</li>
            <li>Assignments</li>
            <li>Certificates</li>
            <li>Forum</li>
          </ul>
        </div>

        
        <div className="footer-section">
          <h3>SUPPORT</h3>
          <ul>
            <li>Help Center</li>
            <li>FAQ</li>
            <li>Contact Us</li>
          </ul>
        </div>

        
        <div className="footer-section">
          <h3>LEGAL</h3>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookie Policy</li>
          </ul>
        </div>

        
        <div className="footer-section connect">
          <h3>CONNECT</h3>
          <div className="social-icons">
            <FaTwitter />
            <FaGithub />
            <FaLinkedin />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 DevZora. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
