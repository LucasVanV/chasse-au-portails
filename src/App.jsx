import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './screens/Home';
import Menu from './screens/Menu';
import Compass from './screens/Compass';

function App() {
  return (
    <Router>
      {/* Navigation si tu veux la garder */}
      {/* <nav>
        <Link to="/">Accueil</Link>
        <Link to="/menu">Menu</Link>
      </nav> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/compass" element={<Compass />} />
      </Routes>
    </Router>
  )
}

export default App
