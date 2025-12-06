import { FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = ({ siteName = 'NELLORIENS.IN', tagline = 'Your trusted gateway to explore Nellore - connecting you with opportunities, news, and destinations.' }) => {
  const isHub = siteName === 'NELLOREHUB.IN';
  
  const quickLinks1 = [
    { label: 'Jobs', path: isHub ? '/hub/jobs' : '/jobs' },
    { label: 'Latest News', path: isHub ? '/hub/news' : '/news' },
    { label: 'Exam Results', path: isHub ? '/hub/results' : '/results' },
  ];

  const quickLinks2 = [
    { label: 'Updates & Info', path: isHub ? '/hub/updates' : '/updates' },
    { label: 'Notifications', path: isHub ? '/hub/notifications' : '/notifications' },
    { label: 'Sports News', path: isHub ? '/hub/sports' : '/sports' },
  ];

  const quickLinks3 = isHub ? [
    { label: 'Tourism', path: '/hub/tourism' },
    { label: 'Contact Us', path: '/hub/contact' },
    { label: 'About Us', path: '/hub/about' },
  ] : [
    { label: 'Tourism', path: '/tourism' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'About Us', path: '/about' },
  ];

  return (
    <footer className="main-footer">
      <div className="container-fluid">
        <div className="footer-content">
          <div className="footer-section footer-info">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="logo-circle">
                <FaGlobe className="logo-icon" />
              </div>
              <h3 className="footer-site-title">{siteName}</h3>
            </div>
            <p className="footer-description">{tagline}</p>
            <div className="social-icons">
              <a href="#" aria-label="Facebook" className="social-icon">
                <FaFacebook />
              </a>
              <a href="#" aria-label="Twitter" className="social-icon">
                <FaTwitter />
              </a>
              <a href="#" aria-label="Instagram" className="social-icon">
                <FaInstagram />
              </a>
              {!isHub && (
                <a href="#" aria-label="YouTube" className="social-icon">
                  <FaYoutube />
                </a>
              )}
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks1.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>• {link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks2.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>• {link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks3.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>• {link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-contact">
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <div>
              <h5>Email Us</h5>
              <p>contact@nelloriens.in</p>
            </div>
          </div>
          <div className="contact-item">
            <FaPhone className="contact-icon" />
            <div>
              <h5>Call Us</h5>
              <p>8341540001 • 8367600045</p>
            </div>
          </div>
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <div>
              <h5>Location</h5>
              <p>Nellore, Andhra Pradesh</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

