import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const easterEggs = [
  {
    name: 'Wazemmes',
    color: '#FF6B35',
    star: '★',
  },
  {
    name: 'Gare Lille Flandres',
    color: '#FFD166',
    star: '★',
  },
];

function Home() {
  const [geoRefused, setGeoRefused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      () => {},
      (err) => {
        if (err.code === 1) setGeoRefused(true); // Permission refusée
      }
    );
  }, []);

  const lancerQuete = (egg) => {
    // Ajoute à l'historique dans le localStorage
    const historique = JSON.parse(localStorage.getItem('historique')) || [];
    historique.push(egg.name);
    localStorage.setItem('historique', JSON.stringify(historique));
    // Redirige vers la page de quête (à créer si besoin)
    alert(`Quête lancée pour ${egg.name} !`);
    // navigate('/quete'); // décommente si tu crées une page de quête
  };

  return (
    <div className="home-container">
      <div className="header">
        <div className="hello-banner">Hello there! <span>↓</span></div>
      </div>
      <div className="concept-box">
        <div className="concept-title">&lt;&lt;&lt; <b>Le concept</b> &gt;&gt;&gt;</div>
        <div className="concept-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-desc">Choisis un easter egg parmi ceux listés</div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-desc">Aide-toi de la boussole pour te guider</div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-desc">Traverse le portail en réalité augmentée et récupère l'easter egg</div>
          </div>
        </div>
      </div>
      <div className="eggs-list">
        {geoRefused ? (
          // Bloc affiché si géoloc refusée
          <div className="egg-card empty-egg-card">
            <div className="egg-ghost" role="img" aria-label="fantôme">
              {/* Tu peux remplacer ce SVG par une image si tu veux */}
              <svg width="60" height="60" viewBox="0 0 60 60">
                <ellipse cx="30" cy="40" rx="20" ry="15" fill="#ffdede" />
                <ellipse cx="22" cy="40" rx="4" ry="6" fill="#fff"/>
                <ellipse cx="38" cy="40" rx="4" ry="6" fill="#fff"/>
                <circle cx="22" cy="42" r="2" fill="#222"/>
                <circle cx="38" cy="42" r="2" fill="#222"/>
              </svg>
            </div>
            <div className="egg-empty-message">
              <b>
                Aïe !<br />
                Autorise l’accès à ta position<br />
                afin de bénéficier d’une<br />
                expérience optimale !
              </b>
            </div>
            <button
              className="egg-btn"
              onClick={() => window.location.reload()}
            >
              Autoriser
            </button>
          </div>
        ) : (
          easterEggs.length === 0 ? (
            <div className="egg-card empty-egg-card">
              {/* Ajoute ici ton illustration si besoin */}
              <div className="egg-ghost" role="img" aria-label="fantôme">
                {/* Tu peux remplacer ce SVG par une image si tu veux */}
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <ellipse cx="30" cy="40" rx="20" ry="15" fill="#ffdede" />
                  <ellipse cx="22" cy="40" rx="4" ry="6" fill="#fff"/>
                  <ellipse cx="38" cy="40" rx="4" ry="6" fill="#fff"/>
                  <circle cx="22" cy="42" r="2" fill="#222"/>
                  <circle cx="38" cy="42" r="2" fill="#222"/>
                </svg>
              </div>
              <div className="egg-empty-message">
                <b>
                  Nous n’avons pas encore<br />
                  disséminé d’easter eggs<br />
                  dans votre ville, mais<br />
                  cela ne saurait tarder !
                </b>
              </div>
              <button className="egg-btn" onClick={() => window.location.reload()}>Actualiser</button>
            </div>
          ) : (
            easterEggs.map((egg, idx) => (
              <div className="egg-card" key={idx}>
                <div className="egg-star" style={{ color: egg.color }}>{egg.star}</div>
                <div className="egg-name">{egg.name}</div>
                <button
                  className="egg-btn"
                  onClick={() => navigate('/compass', { state: { pointName: egg.name } })}
                >
                  choisir
                </button>
                <button className="egg-info">info</button>
              </div>
            ))
          )
        )}
      </div>
      <div className="choose-banner">
        Choisis un easter egg
      </div>
      <footer className="footer-menu">
        <Link to="/menu" className="footer-btn">≡</Link>
        <a href="https://ynov.com" target="_blank" rel="noopener noreferrer" className="footer-link">ynov.com</a>
        <button className="footer-btn">i</button>
      </footer>
    </div>
  );
}

export default Home;