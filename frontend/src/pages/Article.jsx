import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaBox, FaBars, FaTimes, FaArrowRight } from 'react-icons/fa';
import './Article.css';
import './Landing.css';

export default function Article() {
  const location = useLocation();
  const article = location.state?.article;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!article) {
    return (
      <div className="landing">
        {/* Navigation */}
        <nav className="nav">
          <div className="nav-container">
            <div className="nav-content">
              <Link to="/" className="nav-logo">
                <FaBox className="nav-logo-icon" />
                <span>Aid Express</span>
              </Link>

              <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                <a href="#features">Features</a>
                <a href="#solutions">Solutions</a>
                <a href="#faq">FAQ</a>
                <a href="#partners">Partners</a>
                <a href="#articles">Articles</a>
              </div>

              <div className="nav-actions">
                <Link to="/login" className="btn btn-secondary">Login</Link>
                <Link to="/signup" className="btn btn-primary">Get Started</Link>
              </div>

              <button 
                className="nav-mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </nav>

        <div className="article-page">
          <div className="article-header">
            <div className="container">
              <Link to="/" className="back-link">
                <FaArrowLeft />
                Back to Home
              </Link>
              <h1>Article Not Found</h1>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-section">
                <div className="footer-logo">
                  <FaBox />
                  <span>Aid Express</span>
                </div>
                <p className="footer-description">
                  Reliable shipping solutions with real-time tracking and nationwide coverage.
                </p>
              </div>

              <div className="footer-section">
                <h4 className="footer-title">Product</h4>
                <ul className="footer-links">
                  <li><a href="#features">Features</a></li>
                  <li><a href="#solutions">Solutions</a></li>
                  <li><a href="#pricing">Pricing</a></li>
                  <li><Link to="/book-shipment">Get a Quote</Link></li>
                </ul>
              </div>

              <div className="footer-section">
                <h4 className="footer-title">Company</h4>
                <ul className="footer-links">
                  <li><a href="#about">About Us</a></li>
                  <li><a href="#careers">Careers</a></li>
                  <li><a href="#partners">Partners</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>

              <div className="footer-section">
                <h4 className="footer-title">Resources</h4>
                <ul className="footer-links">
                  <li><a href="#articles">Blog</a></li>
                  <li><a href="#faq">FAQ</a></li>
                  <li><a href="#support">Support</a></li>
                  <li><a href="#docs">Documentation</a></li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <p>&copy; 2025 Aid Express. All rights reserved.</p>
              <div className="footer-bottom-links">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-content">
            <Link to="/" className="nav-logo">
              <FaBox className="nav-logo-icon" />
              <span>Aid Express</span>
            </Link>

            <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
              <a href="#features">Features</a>
              <a href="#solutions">Solutions</a>
              <a href="#faq">FAQ</a>
              <a href="#partners">Partners</a>
              <a href="#articles">Articles</a>
            </div>

            <div className="nav-actions">
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/signup" className="btn btn-primary">Get Started</Link>
            </div>

            <button 
              className="nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      <div className="article-page">
        <div className="article-header">
          <div className="container">
            <Link to="/" className="back-link">
              <FaArrowLeft />
              Back to Home
            </Link>
            <span className="article-category-tag">{article.category}</span>
            <h1 className="article-title">{article.title}</h1>
            <div className="article-meta">
              Published on {article.date}
            </div>
          </div>
        </div>
        <div className="article-body">
          {article.content ? article.content.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          )) : <p>{article.excerpt}</p>}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <div className="footer-logo">
                <FaBox />
                <span>Aid Express</span>
              </div>
              <p className="footer-description">
                Reliable shipping solutions with real-time tracking and nationwide coverage.
              </p>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Product</h4>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#solutions">Solutions</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><Link to="/book-shipment">Get a Quote</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Company</h4>
              <ul className="footer-links">
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#partners">Partners</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Resources</h4>
              <ul className="footer-links">
                <li><a href="#articles">Blog</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#support">Support</a></li>
                <li><a href="#docs">Documentation</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 Aid Express. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}