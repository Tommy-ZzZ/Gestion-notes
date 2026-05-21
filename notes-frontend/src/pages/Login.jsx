import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { login } from '../api/api';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { DEMO_MODE } from '../config';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuth } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let token = "demo-token";

    if (!DEMO_MODE) {
      token = recaptchaRef.current.getValue();

      if (!token) {
        setError('Veuillez compléter le CAPTCHA');
        setLoading(false);
        return;
      }
    }

    try {
      const response = await login({
        ...formData,
        'g-recaptcha-response': token
      });

      setAuth(response.data.token);

      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });

    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">

      <div className="relative max-w-md w-full mx-4 animate-fade-in-up">
        <div className="relative bg-white p-8 rounded-3xl shadow-xl">

          <h2 className="text-3xl font-bold text-center mb-6">
            Connexion
          </h2>

          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              type="text"
              name="username"
              placeholder="Nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />

            {/* CAPTCHA uniquement si pas DEMO */}
            {!DEMO_MODE && (
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LdAlPMrAAAAAB1nduSsoFbVjxQrFVN-lviJKtFl"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-3 rounded"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

          </form>

          <p className="text-center mt-4">
            Pas de compte ? <Link to="/register">S'inscrire</Link>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Login;
