import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

// Coordonnées des points
const points = {
  'Wazemmes': { lat: 50.6266, lng: 3.0420 },
  'Gare Lille Flandres': { lat: 50.6361, lng: 3.0676 },
  // Ajoute d'autres points ici
};

// Calcul de distance (en mètres)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calcul du cap (bearing) en degrés
function getBearing(lat1, lon1, lat2, lon2) {
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const λ1 = lon1 * Math.PI/180;
  const λ2 = lon2 * Math.PI/180;
  const y = Math.sin(λ2-λ1) * Math.cos(φ2);
  const x = Math.cos(φ1)*Math.sin(φ2) -
            Math.sin(φ1)*Math.cos(φ2)*Math.cos(λ2-λ1);
  let θ = Math.atan2(y, x);
  θ = θ * 180 / Math.PI;
  return (θ + 360) % 360;
}

function Compass() {
  const location = useLocation();
  const { pointName } = location.state || {};
  const [distance, setDistance] = useState(null);
  const [bearing, setBearing] = useState(null);
  const [heading, setHeading] = useState(0); // Cap du téléphone
  const [error, setError] = useState(null);

  const target = points[pointName];

  // Géolocalisation + calcul du cap vers la cible
  useEffect(() => {
    if (!target) return;
    let watchId = null;
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setDistance(Math.round(getDistance(latitude, longitude, target.lat, target.lng)));
        setBearing(getBearing(latitude, longitude, target.lat, target.lng));
      },
      (err) => setError('Impossible de récupérer la position'),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [target]);

  // Orientation du téléphone (DeviceOrientation)
  useEffect(() => {
    function handleOrientation(event) {
      // Sur mobile, event.alpha donne le cap magnétique (0 = nord)
      // Sur iOS, il faut parfois utiliser event.webkitCompassHeading
      let headingValue = event.alpha;
      if (typeof event.webkitCompassHeading !== "undefined") {
        headingValue = event.webkitCompassHeading;
      } else if (event.absolute === true && typeof event.alpha === "number") {
        headingValue = 360 - event.alpha; // Android
      }
      setHeading(headingValue || 0);
    }
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  if (!pointName) return <div>Point inconnu</div>;

  // Calcul de l'angle à afficher (différence entre la direction cible et le cap du téléphone)
  const arrowAngle = bearing !== null && heading !== null
    ? (bearing - heading + 360) % 360
    : 0;

  return (
    <div className="compass-container">
      <h2>Direction : {pointName}</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <div className="compass">
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r="42" fill="#fff" stroke="#222" strokeWidth="4"/>
          <g style={{ transform: `rotate(${arrowAngle}deg)`, transformOrigin: '45px 45px' }}>
            {/* Flèche rouge */}
            <polygon points="45,18 40,50 45,42 50,50" fill="#FF6B35" stroke="#222" strokeWidth="2"/>
          </g>
          {/* Nord */}
          <text x="45" y="15" textAnchor="middle" fontSize="12" fill="#222" fontWeight="bold">N</text>
        </svg>
      </div>
      <div className="distance-info">
        {distance !== null ? (
          <span>Distance : {distance} m</span>
        ) : (
          <span>Calcul de la distance...</span>
        )}
      </div>
      <Link to="/" className="egg-btn" style={{marginTop: 24}}>Retour</Link>
    </div>
  );
}

export default Compass;