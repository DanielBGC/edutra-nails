import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getWhatsappUrl } from '../helpers/getWhatsappUrl';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const whatsappUrl = getWhatsappUrl();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      if (pathname === '/') {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/' + href);
      }
    }
  };

  const navLinks = [
    { name: 'Sobre', href: '#about' },
    { name: 'Portfólio', href: '#portfolio' },
    { name: 'Depoimentos', href: '#testimonials' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <header
      className={`header ${isScrolled || pathname !== '/' ? 'scrolled glass' : ''}`}
    >
      <div className="container header-container">
        <Link to="/" className="logo" rel="noopener noreferrer">
          Edutra <span>Nails</span>
        </Link>

        <nav className="nav">
          <ul>
            {navLinks.map((link) => (
              <li key={link.name}>
                {link.href.startsWith('#') ? (
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    rel="noopener noreferrer"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link to={link.href} rel="noopener noreferrer">
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-cta">
          <Link
            to="/agendamento"
            className="btn btn-gold"
            style={{ fontSize: '0.9rem' }}
          >
            Agendar Agora
          </Link>
        </div>
      </div>

      <style jsx="true">{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 90px;
          display: flex;
          align-items: center;
          z-index: 1000;
          transition: all 0.4s ease;
          background: transparent;
        }
        .header.scrolled {
          height: 70px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .logo {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: -1px;
          color: var(--color-text);
        }
        .logo span {
          color: var(--color-gold);
          font-style: italic;
          font-weight: 400;
        }
        .nav ul {
          display: flex;
          gap: 40px;
          list-style: none;
        }
        .nav a {
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.5px;
          color: var(--color-text);
          position: relative;
        }
        .nav a::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--color-gold);
          transition: width 0.3s ease;
        }
        .nav a:hover::after {
          width: 100%;
        }
        @media (max-width: 992px) {
          .nav,
          .header-cta {
            display: none;
          }
        }
        @media (max-width: 768px) {
          .header {
            height: 80px;
          }
          .logo {
            font-size: 2.2rem;
            letter-spacing: -0.5px;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
