import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import heroImg from '../assets/hero/profissional-maria-eduarda-dutra-alves.png';

const Hero = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (pathname === '/') {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/' + href);
    }
  };

  return (
    <section className="hero">
      <div className="container hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="hero-badge">Clean Girl Aesthetic</span>
          <h1>Delicadeza e perfeição em cada detalhe das suas mãos.</h1>
          <p>
            Elevando sua autoestima com o cuidado necessário que você merece.
            Levanto conforto e qualidade, realçando a beleza e delicadeza em
            suas unhas.
          </p>

          <div className="hero-btns">
            <Link
              to="/agendamento"
              className="btn btn-primary pulse btn-hero-whatsapp"
            >
              Agende Agora
            </Link>
            <a
              href="#portfolio"
              onClick={(e) => handleNavClick(e, '#portfolio')}
              className="btn btn-hero-portfolio"
              rel="noopener noreferrer"
            >
              Ver Portfólio
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        >
          <div className="image-wrapper">
            <img
              src={heroImg}
              alt="Unhas perfeitas com alongamento de fibra de vidro em Uberaba - Edutra Nails"
            />

            <div className="image-accent"></div>
          </div>
        </motion.div>
      </div>

      <style jsx="true">{`
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: 100px;
          background: linear-gradient(
            135deg,
            var(--color-off-white) 0%,
            var(--color-sand) 100%
          );
          overflow: hidden;
        }
        .hero-container {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .hero-badge {
          display: inline-block;
          padding: 8px 20px;
          background: var(--color-quartz);
          color: var(--color-terracotta);
          border-radius: 20px;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .hero h1 {
          font-size: 4rem;
          margin-bottom: 24px;
          color: var(--color-text);
          line-height: 1.1;
        }
        .hero p {
          font-size: 1.25rem;
          color: var(--color-text-light);
          margin-bottom: 40px;
          max-width: 600px;
          line-height: 1.6;
        }
        .hero-btns {
          display: flex;
          gap: 20px;
          align-items: center;
        }
        .btn-hero-whatsapp {
          padding: 18px 44px;
          font-size: 1.15rem;
        }
        .btn-hero-portfolio {
          padding: 16px 32px;
          font-size: 1.1rem;
          border: 1px solid var(--color-gold);
          color: var(--color-gold);
        }
        .hero-image {
          position: relative;
        }
        .image-wrapper {
          position: relative;
          z-index: 1;
        }
        .image-wrapper img {
          border-radius: 200px 200px 0 0;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
          width: 100%;
          aspect-ratio: 4/5;
          object-fit: cover;
        }
        .image-accent {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 100%;
          height: 100%;
          border: 2px solid var(--color-gold);
          border-radius: 200px 200px 0 0;
          z-index: -1;
        }
        @media (max-width: 992px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 40px 20px;
          }
          .hero h1 {
            font-size: 3.2rem;
          }
          .hero p {
            margin: 0 auto 40px;
            font-size: 1.1rem;
          }
          .hero-btns {
            justify-content: center;
            flex-direction: column;
            gap: 15px;
          }
          .btn-hero-whatsapp,
          .btn-hero-portfolio {
            width: 100%;
            max-width: 350px;
            text-align: center;
          }
          .hero-image {
            max-width: 400px;
            margin: 40px auto 0;
          }
        }
        @media (max-width: 480px) {
          .hero h1 {
            font-size: 3rem;
            line-height: 1.2;
          }
          .hero-badge {
            font-size: 1.1rem;
            padding: 10px 24px;
            margin-bottom: 20px;
          }
          .btn-hero-whatsapp {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 24px;
            font-size: 1.3rem;
            border-radius: 40px;
          }
          .btn-hero-portfolio {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 24px;
            font-size: 1.2rem;
            border-radius: 40px;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
