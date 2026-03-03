import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EtablissementPage from './pages/EtablissementPage';
import ProfesseurPage from './pages/ProfesseurPage';
import EtudiantPage from './pages/EtudiantPage';
import MatierePage from './pages/MatierePage';
import NotePage from './pages/NotePage';
import AuthContext from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/etablissements/*"
            element={
              <ProtectedRoute>
                <EtablissementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/professeurs/*"
            element={
              <ProtectedRoute>
                <ProfesseurPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/etudiants/*"
            element={
              <ProtectedRoute>
                <EtudiantPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matieres/*"
            element={
              <ProtectedRoute>
                <MatierePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/*"
            element={
              <ProtectedRoute>
                <NotePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;