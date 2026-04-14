import React from 'react';
import { Instagram, Mail, Phone } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

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

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <Link to="/" className="logo" style={{ color: 'white' }} rel="noopener noreferrer">
            Edutra <span>Nails</span>
          </Link>


          <p>Onde a beleza encontra a sofisticação. Sua melhor versão começa pelas suas mãos.</p>
          <div className="social-icons">
            <a href="https://instagram.com/edutra_nails" target="_blank" rel="noopener noreferrer" className="social-link"><Instagram size={20} /></a>
            <a href="mailto:contato@edutranails.com" className="social-link"><Mail size={20} /></a>

          </div>
        </div>
        
        <div className="footer-links">
          <h4>Links Úteis</h4>
          <ul>
            <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')} rel="noopener noreferrer">Sobre Mim</a></li>
            <li><a href="#portfolio" onClick={(e) => handleNavClick(e, '#portfolio')} rel="noopener noreferrer">Portfólio</a></li>
            <li><a href="#testimonials" onClick={(e) => handleNavClick(e, '#testimonials')} rel="noopener noreferrer">Depoimentos</a></li>
            <li><Link to="/blog" rel="noopener noreferrer">Blog</Link></li>

          </ul>
        </div>
        
        <div className="footer-contact">
          <h4>Contato</h4>
          <p><Phone size={16} /> (34) 99317-4178</p>
          <p><Mail size={16} /> contato@edutranails.com</p>

          <p>Uberaba, MG - Brasil</p>
          <p>Bairro Zeca Mendes</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2026 Edutra Nails. Todos os direitos reservados.</p>

        </div>
      </div>

      <style jsx="true">{`
        .footer {
          background-color: var(--color-text);
          color: white;
          padding: 80px 0 0;
        }
        .footer-container {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
        }
        .footer-brand p {
          color: #bdbdbd;
          margin: 20px 0;
          max-width: 300px;
        }
        .logo span {
          color: var(--color-gold);
        }
        .social-icons {
          display: flex;
          gap: 15px;
        }
        .social-link {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          color: white;
        }
        .social-link:hover {
          background-color: var(--color-gold);
          border-color: var(--color-gold);
          transform: translateY(-3px);
        }
        .footer-links h4, .footer-contact h4 {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          margin-bottom: 25px;
        }
        .footer-links ul {
          list-style: none;
        }
        .footer-links li {
          margin-bottom: 12px;
        }
        .footer-links a, .footer-links Link {
          color: #bdbdbd;
        }
        .footer-links a:hover {
          color: var(--color-gold);
          padding-left: 5px;
        }
        .footer-contact p {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #bdbdbd;
          margin-bottom: 15px;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 30px 0;
          text-align: center;
          font-size: 0.9rem;
          color: #888;
        }
        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 50px;
            text-align: center;
          }
          .footer-brand p {
            margin: 20px auto;
            font-size: 1.1rem;
          }
          .social-icons {
            justify-content: center;
            gap: 20px;
          }
          .footer-contact p {
            justify-content: center;
            font-size: 1.25rem;
            margin-bottom: 20px;
          }
          .footer-links h4, .footer-contact h4 {
            font-size: 1.8rem;
            margin-bottom: 30px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
