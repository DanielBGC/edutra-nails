import { motion as Motion } from 'framer-motion';

import alongamentoImg from '../assets/portfolio/alongamento-unha-uberaba.jpg';
import banhoDeGelImg from '../assets/portfolio/banho-de-gel-uberaba.jpg';
import blindagemImg from '../assets/portfolio/blindagem-unha-uberaba.jpg';
import esmaltaçãoEmGelImg from '../assets/portfolio/esmaltação-em-gel-uberaba.jpg';
import aplicaçãoDePostiçaImg from '../assets/portfolio/unha-postiça-uberaba.jpg';
import manicureImg from '../assets/portfolio/manicure-uberaba.jpg';

const Portfolio = () => {
  const items = [
    { id: 1, img: alongamentoImg, category: 'Alongamento' },
    { id: 2, img: banhoDeGelImg, category: 'Banho de Gel' },
    { id: 3, img: blindagemImg, category: 'Blindagem' },
    { id: 4, img: esmaltaçãoEmGelImg, category: 'Esmaltação em Gel' },
    { id: 5, img: aplicaçãoDePostiçaImg, category: 'Aplicação de Postiça' },
    { id: 6, img: manicureImg, category: 'Manicure & Pedicure' },
  ];

  return (
    <section id="portfolio" className="portfolio reveal">
      <div className="container">
        <h2 className="section-title">Serviços</h2>
        <div className="portfolio-grid">
          {items.map((item) => (
            <Motion.div
              key={item.id}
              className="portfolio-item"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={item.img}
                alt={`${item.category} feito por Edutra Nails em Uberaba`}
              />
              <div className="portfolio-overlay">
                <span>{item.category}</span>
              </div>
            </Motion.div>
          ))}
        </div>
      </div>

      <style jsx="true">{`
        .portfolio {
          padding: var(--section-padding);
          background-color: var(--color-sand);
        }
        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }
        .portfolio-item {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          aspect-ratio: 1/1;
          cursor: pointer;
        }
        .portfolio-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .portfolio-item:hover img {
          transform: scale(1.1);
        }
        .portfolio-overlay {
          position: absolute;
          inset: 0;
          background: rgba(45, 41, 38, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .portfolio-item:hover .portfolio-overlay {
          opacity: 1;
        }
        .portfolio-overlay span {
          color: white;
          font-family: var(--font-serif);
          font-size: 1.5rem;
          padding: 10px 20px;
          border: 1px solid white;
        }
        @media (max-width: 992px) {
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 576px) {
          .portfolio-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Portfolio;
