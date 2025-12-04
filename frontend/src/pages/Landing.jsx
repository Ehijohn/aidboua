import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTruck, 
  FaShieldAlt, 
  FaBolt, 
  FaGlobe, 
  FaChartBar,
  FaCheckCircle,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaArrowRight,
  FaUsers,
  FaClock,
  FaDollarSign,
  FaMapMarkerAlt,
  FaBox
} from 'react-icons/fa';
import './Landing.css';

function Landing() {
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <FaTruck />,
      title: "Real-Time Tracking",
      description: "Track your shipments in real-time with live updates and notifications at every step of the delivery process."
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Delivery",
      description: "End-to-end encryption and secure handling protocols ensure your packages arrive safely every time."
    },
    {
      icon: <FaBolt />,
      title: "Fast Processing",
      description: "Lightning-fast order processing and optimized routing get your deliveries where they need to go, faster."
    },
    {
      icon: <FaGlobe />,
      title: "Global Network",
      description: "Extensive delivery network spanning major cities and regions with local expertise worldwide."
    },
    {
      icon: <FaChartBar />,
      title: "Analytics Dashboard",
      description: "Comprehensive insights into your shipping patterns, costs, and delivery performance metrics."
    },
    {
      icon: <FaDollarSign />,
      title: "Transparent Pricing",
      description: "No hidden fees. Pay only for what you ship with our straightforward pricing structure."
    }
  ];

  const solutions = [
    {
      title: "For Businesses",
      description: "Scale your logistics operations with enterprise-grade shipping solutions, bulk discounts, and dedicated support.",
      benefits: ["Volume discounts", "API integration", "Dedicated account manager", "Custom SLA"],
      icon: <FaUsers />
    },
    {
      title: "For Individuals",
      description: "Simple, affordable shipping for personal packages with the same reliability as our business solutions.",
      benefits: ["Pay per shipment", "Easy booking", "Mobile tracking", "24/7 support"],
      icon: <FaBox />
    },
    {
      title: "For Enterprises",
      description: "Comprehensive logistics solutions for large organizations with advanced features and priority support.",
      benefits: ["Priority processing", "Custom contracts", "Advanced analytics", "Dedicated support team"],
      icon: <FaGlobe />
    }
  ];

  const faqs = [
    {
      question: "How do I track my shipment?",
      answer: "Once your shipment is booked, you'll receive a unique tracking ID via email. You can use this ID in our tracking portal or mobile app to get real-time updates on your package location and estimated delivery time."
    },
    {
      question: "What areas do you cover?",
      answer: "We provide comprehensive coverage across all major cities and regions in Nigeria, with plans to expand to neighboring countries. Our network includes urban centers, suburban areas, and selected rural locations."
    },
    {
      question: "How is pricing calculated?",
      answer: "Pricing is based on package weight, dimensions, delivery distance, and speed of delivery. You can get an instant quote using our cost calculator before booking. Volume discounts are available for businesses."
    },
    {
      question: "What if my package is damaged?",
      answer: "All shipments are insured up to their declared value. If you receive a damaged package, contact our support team within 24 hours with photos. We'll process your claim and provide compensation according to our insurance policy."
    },
    {
      question: "Can I schedule a pickup?",
      answer: "Yes! When booking a shipment, you can schedule a pickup at your preferred location and time. Our courier will arrive within the scheduled window to collect your package."
    }
  ];

  const partners = [
    { name: "TechCorp" },
    { name: "GlobalMart" },
    { name: "ShipFast" },
    { name: "LogiTech" },
    { name: "DeliverNow" },
    { name: "PackPro" }
  ];

  const articles = [
    {
      title: "5 Tips for Packaging Fragile Items",
      excerpt: "Learn the best practices for ensuring your delicate items arrive safely at their destination.",
      content: "Packaging fragile items requires careful attention to detail to prevent damage during transit. Here are five essential tips:\n\n1. Use appropriate cushioning materials like bubble wrap, foam peanuts, or air pillows.\n\n2. Double-box your items for extra protection.\n\n3. Secure items within the box to prevent movement.\n\n4. Label packages as 'Fragile' clearly.\n\n5. Choose the right shipping method for your item's value and fragility.\n\nBy following these guidelines, you can significantly reduce the risk of damage to your shipments.",
      date: "Nov 5, 2025",
      category: "Guide"
    },
    {
      title: "Understanding Shipping Insurance",
      excerpt: "A comprehensive guide to protecting your valuable shipments with the right insurance coverage.",
      content: "Shipping insurance is crucial for protecting valuable items during transit. This guide covers:\n\n- Types of shipping insurance available\n- How to determine the right coverage amount\n- What to do if you need to file a claim\n- Common exclusions and limitations\n\nUnderstanding these aspects will help you make informed decisions about protecting your shipments.",
      date: "Nov 1, 2025",
      category: "Education"
    },
    {
      title: "Same-Day Delivery: Is It Worth It?",
      excerpt: "Exploring the costs and benefits of same-day delivery services for businesses and individuals.",
      content: "Same-day delivery has become increasingly popular, but is it worth the premium price? This article examines:\n\n- The benefits for time-sensitive shipments\n- Cost analysis compared to standard delivery\n- Customer expectations and satisfaction\n- When same-day delivery makes sense for your business\n\nWe'll help you decide if same-day delivery is the right choice for your shipping needs.",
      date: "Oct 28, 2025",
      category: "Analysis"
    }
  ];

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

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Reliable Shipping Solutions <br />
              <span className="hero-title-accent">Delivered with Care</span>
            </h1>
            <p className="hero-description">
              Experience seamless logistics with real-time tracking, secure handling, 
              and nationwide coverage. Your packages, our priority.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Start Shipping <FaArrowRight className="btn-icon" />
              </Link>
              <Link to="/book-shipment" className="btn btn-outline btn-lg">
                Get a Quote
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <FaClock />
                <span><strong>50K+</strong> Deliveries</span>
              </div>
              <div className="stat">
                <FaMapMarkerAlt />
                <span><strong>200+</strong> Locations</span>
              </div>
              <div className="stat">
                <FaUsers />
                <span><strong>10K+</strong> Customers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-description">
              Everything you need for efficient, secure, and reliable shipping
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Solutions for Everyone</h2>
            <p className="section-description">
              Tailored shipping solutions designed for your specific needs
            </p>
          </div>

          <div className="solutions-grid">
            {solutions.map((solution, index) => (
              <div key={index} className="solution-card">
                <div className="solution-icon">{solution.icon}</div>
                <h3 className="solution-title">{solution.title}</h3>
                <p className="solution-description">{solution.description}</p>
                <ul className="solution-benefits">
                  {solution.benefits.map((benefit, i) => (
                    <li key={i}>
                      <FaCheckCircle />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className="solution-cta">
                  Learn More <FaArrowRight className="cta-icon" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-description">
              Quick answers to common questions about our services
            </p>
          </div>

          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  className={`faq-question ${openFaq === index ? 'active' : ''}`}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  <FaChevronDown className={`chevron ${openFaq === index ? 'rotate' : ''}`} />
                </button>
                <div className={`faq-answer ${openFaq === index ? 'active' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Trusted by Leading Brands</h2>
            <p className="section-description">
              Join thousands of businesses that rely on Aid Express
            </p>
          </div>

          <div className="partners-grid">
            {partners.map((partner, index) => (
              <div key={index} className="partner-card">
                <div className="partner-name">{partner.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest Insights</h2>
            <p className="section-description">
              Tips, guides, and industry insights from our experts
            </p>
          </div>

          <div className="articles-grid">
            {articles.map((article, index) => (
              <article key={index} className="article-card">
                <div className="article-image">
                  <FaBox />
                </div>
                <div className="article-content">
                  <div className="article-meta">
                    <span className="article-category">{article.category}</span>
                    <span className="article-date">{article.date}</span>
                  </div>
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <Link to="/article" state={{ article }} className="article-link">
                    Read More <FaArrowRight className="link-icon" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-description">
              Join thousands of satisfied customers shipping with confidence
            </p>
            <Link to="/signup" className="btn btn-primary btn-lg">
              Create Your Account <FaArrowRight className="btn-icon" />
            </Link>
          </div>
        </div>
      </section>

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

export default Landing;
