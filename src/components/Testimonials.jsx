const Testimonials = () => {
  const reviews = [
    { name: "Maria Clara", text: "Melhor experiência que eu já tive! O studio é lindo, organizado e aconchegante, e minhas unhas ficaram bem naturais e resistentes.", rating: 5 },
    { name: "Bruna Morais", text: "Uma profissional muito atenciosa e talentosa, com uma grande atenção aos detalhes.", rating: 5 },
    { name: "Ana Carolina", text: "Minha blindagem durou muito mais do que o normal. Profissional excelente e muito cuidadosa.", rating: 5 },
  ];

  return (
    <section id="testimonials" className="testimonials reveal">
      <div className="container">
        <h2 className="section-title">O que dizem nossas clientes</h2>
        <div className="testimonials-grid">
          {reviews.map((rev, i) => (
            <div key={i} className="testi-card glass">
              <div className="stars">{"★".repeat(rev.rating)}</div>
              <p>"{rev.text}"</p>
              <h4>{rev.name}</h4>
            </div>
          ))}
        </div>
      </div>

      <style jsx="true">{`
        .testimonials {
          padding: var(--section-padding);
          background-color: var(--color-off-white);
        }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }
        .testi-card {
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          transition: transform 0.3s ease;
        }
        .testi-card:hover {
          transform: translateY(-10px);
        }
        .stars {
          color: var(--color-gold);
          margin-bottom: 20px;
          font-size: 1.2rem;
        }
        .testi-card p {
          font-style: italic;
          color: var(--color-text-light);
          margin-bottom: 20px;
          font-size: 1rem;
        }
        .testi-card h4 {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: var(--color-text);
        }
        @media (max-width: 992px) {
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
