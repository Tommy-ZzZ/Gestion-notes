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
    <div>
      <h2>Connexion</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* CAPTCHA CONDITIONNEL */}
        {!DEMO_MODE && (
          <div>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LdAlPMrAAAAAB1nduSsoFbVjxQrFVN-lviJKtFl"
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p>
        Pas de compte ? <Link to="/register">S'inscrire</Link>
      </p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;
