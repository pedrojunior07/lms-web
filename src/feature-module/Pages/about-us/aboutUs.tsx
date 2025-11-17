import Faq from "../faq/faq";
import Testimonials from "../testimonials/testimonials";
import AboutSection from "./section/aboutSection";
import Benefits from "./section/benefits";
import Counter from "./section/counter";
import Institution from "./section/institution";

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Mission, Vision, Values */}
      <section className="mission-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="isax isax-eye fs-48 text-primary"></i>
                  </div>
                  <h4 className="text-primary mb-3">Nossa Visão</h4>
                  <p>
                    Ser a principal plataforma global de educação sustentável,
                    inspirando uma geração de líderes conscientes que
                    transformarão o mundo através do conhecimento responsável.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="isax isax-heart fs-48 text-success"></i>
                  </div>
                  <h4 className="text-success mb-3">Nossa Missão</h4>
                  <p>
                    Democratizar o acesso à educação de qualidade através de
                    tecnologia sustentável, eliminando barreiras geográficas e
                    ambientais, enquanto contribuímos ativamente para a
                    preservação do planeta.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="isax isax-star-1 fs-48 text-warning"></i>
                  </div>
                  <h4 className="text-warning mb-3">Nossos Valores</h4>
                  <ul className="list-unstyled text-start">
                    <li className="mb-2">
                      🌱 <strong>Sustentabilidade:</strong> Em tudo que fazemos
                    </li>
                    <li className="mb-2">
                      🎓 <strong>Excelência:</strong> Educação de qualidade
                      superior
                    </li>
                    <li className="mb-2">
                      🤝 <strong>Inclusão:</strong> Acesso para todos
                    </li>
                    <li className="mb-2">
                      💡 <strong>Inovação:</strong> Tecnologia a serviço do bem
                    </li>
                    <li>
                      🌍 <strong>Impacto:</strong> Transformação positiva global
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Environmental Benefits */}
      <Benefits />

      {/* Environmental Impact Counter */}
      <Counter />

      {/* Sustainability FAQ */}
      <Faq />

      {/* Sustainable Partners */}
      <Institution />

      {/* Green Testimonials */}
      <Testimonials />

      {/* Call to Action */}
      <section className="cta-section bg-gradient-primary py-5">
        <div className="container">
          <div className="row align-items-center text-center text-white">
            <div className="col-12">
              <h2 className="mb-3">
                Junte-se à Revolução da Educação Sustentável
              </h2>
              <p className="lead mb-4">
                Faça parte de uma comunidade que aprende, cresce e protege o
                planeta. Cada novo membro fortalece nosso impacto ambiental
                positivo.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button className="btn btn-light btn-lg">
                  <i className="isax isax-user-add me-2"></i>
                  Criar Conta Gratuita
                </button>
                <button className="btn btn-outline-light btn-lg">
                  <i className="isax isax-book-1 me-2"></i>
                  Explorar Cursos
                </button>
              </div>
              <div className="mt-4">
                <small className="opacity-75">
                  🌱 Ao se cadastrar, você evita ~1.2kg de CO₂ vs. processo
                  presencial
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
