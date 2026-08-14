import { CalendarDays, CircleUserRound, MessageCircle } from 'lucide-react';
import { getWhatsappUrl } from '../helpers/getWhatsappUrl';

const packages = [
  {
    name: 'Alongamento Molde F1',
    description: 'Para manter o alongamento sempre impecável.',
    plans: [
      {
        services: '2 serviços',
        price: 'R$ 145,00',
        details: 'Apenas manutenção',
      },
      {
        services: '4 serviços',
        price: 'R$ 180,00',
        details: 'Manutenção + Pedicure',
      },
    ],
  },
  {
    name: 'Manicure e pedicure',
    description: 'O cuidado tradicional para mãos e pés durante o mês.',
    plans: [
      {
        services: '4 serviços',
        price: 'R$ 100,00',
        details: 'Pacote mensal',
      },
      {
        services: '6 serviços',
        price: 'R$ 160,00',
        details: 'Pacote mensal',
      },
    ],
  },
];

const packagesWhatsappMessage =
  'Olá! Vi os pacotes no site da Edutra Nails e gostaria de saber mais detalhes.';

const Packages = () => {
  const whatsappUrl = getWhatsappUrl(packagesWhatsappMessage);

  return (
    <section id="packages" className="packages reveal">
      <div className="container">
        <div className="packages-intro">
          <span className="packages-eyebrow">Cuidado que cabe na rotina</span>
          <h2 className="section-title">Pacotes mensais</h2>
          <p>
            O pacote é uma forma de você cuidar das unhas com mais economia e
            praticidade. Em vez de pagar cada serviço avulso, você garante um
            combo com preço especial e ainda tem prioridade no agendamento.
          </p>
        </div>

        <div className="packages-grid">
          {packages.map((item, packageIndex) => (
            <article className="package-card" key={item.name}>
              <div className="package-number" aria-hidden="true">
                0{packageIndex + 1}
              </div>
              <div className="package-heading">
                <span>Pacote mensal</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>

              <div className="package-plans">
                {item.plans.map((plan) => (
                  <div className="package-plan" key={plan.services}>
                    <div>
                      <strong>{plan.services}</strong>
                      <span>{plan.details}</span>
                    </div>
                    <p>{plan.price}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="packages-footer">
          <div className="package-notes" aria-label="Condições dos pacotes">
            <div>
              <CalendarDays size={22} aria-hidden="true" />
              <p>
                <strong>Validade de 30 dias</strong>
                <span>Use os serviços dentro desse período.</span>
              </p>
            </div>
            <div>
              <CircleUserRound size={22} aria-hidden="true" />
              <p>
                <strong>Pessoal e intransferível</strong>
                <span>O uso é exclusivo da cliente que comprou o pacote.</span>
              </p>
            </div>
          </div>

          <div className="packages-contact">
            <p>Quer entender qual pacote combina mais com a sua rotina?</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
              aria-label="Saber mais sobre os pacotes pelo WhatsApp"
            >
              <MessageCircle size={19} aria-hidden="true" />
              Quero saber mais
            </a>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .packages {
          padding: var(--section-padding);
          background-color: var(--color-off-white);
        }
        .packages-intro {
          max-width: 760px;
          margin: 0 auto 50px;
          text-align: center;
        }
        .packages-eyebrow,
        .package-heading > span {
          color: var(--color-gold);
          text-transform: uppercase;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 2px;
        }
        .packages-intro .section-title {
          margin: 8px 0 22px;
          font-size: clamp(2.3rem, 5vw, 3.4rem);
        }
        .packages-intro > p {
          color: var(--color-text-light);
          font-size: 1.05rem;
          line-height: 1.8;
        }
        .packages-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 30px;
        }
        .package-card {
          position: relative;
          overflow: hidden;
          padding: 42px;
          border: 1px solid rgba(197, 160, 89, 0.35);
          border-radius: 24px;
          background: var(--color-white);
          box-shadow: 0 18px 45px rgba(45, 41, 38, 0.07);
        }
        .package-number {
          position: absolute;
          top: 14px;
          right: 26px;
          color: var(--color-sand);
          font-family: var(--font-serif);
          font-size: 5.5rem;
          font-weight: 600;
          line-height: 1;
          pointer-events: none;
        }
        .package-heading {
          position: relative;
          padding-right: 48px;
        }
        .package-heading h3 {
          margin: 8px 0 10px;
          color: var(--color-text);
          font-size: clamp(1.7rem, 3vw, 2.2rem);
        }
        .package-heading p {
          min-height: 52px;
          color: var(--color-text-light);
        }
        .package-plans {
          margin-top: 28px;
          border-top: 1px solid var(--color-sand);
        }
        .package-plan {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 22px 0;
          border-bottom: 1px solid var(--color-sand);
        }
        .package-plan div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .package-plan strong {
          color: var(--color-text);
          font-size: 1rem;
        }
        .package-plan span {
          color: var(--color-text-light);
          font-size: 0.85rem;
        }
        .package-plan > p {
          flex-shrink: 0;
          color: var(--color-gold);
          font-family: var(--font-serif);
          font-size: 1.45rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .packages-footer {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: center;
          margin-top: 34px;
          padding: 28px 32px;
          border-radius: 20px;
          background: var(--color-sand);
        }
        .package-notes {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 26px;
        }
        .package-notes > div {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .package-notes svg {
          flex-shrink: 0;
          margin-top: 3px;
          color: var(--color-gold);
        }
        .package-notes p {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .package-notes strong {
          color: var(--color-text);
          font-size: 0.95rem;
        }
        .package-notes span {
          color: var(--color-text-light);
          font-size: 0.8rem;
          line-height: 1.5;
        }
        .packages-contact {
          padding-left: 34px;
          border-left: 1px solid rgba(197, 160, 89, 0.35);
        }
        .packages-contact p {
          margin-bottom: 14px;
          color: var(--color-text);
          font-family: var(--font-serif);
          font-size: 1.1rem;
          line-height: 1.4;
        }
        @media (max-width: 900px) {
          .packages-grid,
          .packages-footer {
            grid-template-columns: 1fr;
          }
          .packages-contact {
            padding: 26px 0 0;
            border-top: 1px solid rgba(197, 160, 89, 0.35);
            border-left: 0;
            text-align: center;
          }
        }
        @media (max-width: 600px) {
          .packages-intro {
            margin-bottom: 34px;
          }
          .packages-intro > p {
            font-size: 0.98rem;
            line-height: 1.7;
          }
          .package-card {
            padding: 32px 24px;
          }
          .package-number {
            top: 18px;
            right: 18px;
            font-size: 4rem;
          }
          .package-heading {
            padding-right: 34px;
          }
          .package-heading p {
            min-height: auto;
          }
          .package-plan {
            align-items: flex-start;
            gap: 16px;
          }
          .package-plan > p {
            font-size: 1.25rem;
          }
          .packages-footer {
            padding: 26px 22px;
          }
          .package-notes {
            grid-template-columns: 1fr;
          }
          .packages-contact .btn {
            justify-content: center;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default Packages;
