import { Link } from 'react-router-dom';

function Menu() {
  // Récupérer l'historique depuis le localStorage
  const historique = JSON.parse(localStorage.getItem('historique')) || [];

  return (
    <div className="menu-container">
      <h2 className="menu-title">
        <span className="menu-back-arrow">←</span> Historique des découvertes
      </h2>
      <ul className="menu-history-list">
        {historique.length === 0 ? (
          <li className="menu-history-empty">Aucune découverte pour l’instant.</li>
        ) : (
          historique.map((item, idx) => (
            <li className="menu-history-item" key={idx}>
              <span className="menu-history-icon" role="img" aria-label="étoile">
                {/* Icône étoile stylisée */}
                <svg width="32" height="32" viewBox="0 0 32 32">
                  <polygon points="16,2 20,12 31,12 22,18 25,29 16,22 7,29 10,18 1,12 12,12"
                    fill="#FF6B35" stroke="#222" strokeWidth="2"/>
                </svg>
              </span>
              <span className="menu-history-text">Lille – {item}</span>
            </li>
          ))
        )}
      </ul>
      <footer className="footer-menu">
        <Link to="/" className="footer-btn">≡</Link>
        <a href="https://ynov.com" target="_blank" rel="noopener noreferrer" className="footer-link">ynov.com</a>
        <button className="footer-btn">i</button>
      </footer>
    </div>
  );
}

export default Menu;