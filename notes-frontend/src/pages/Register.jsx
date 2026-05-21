import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { register } from '../api/api';
import { Link } from 'react-router-dom';
import { DEMO_MODE } from '../config';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef();
  const navigate = useNavigate();

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
      await register({
        ...formData,
        'g-recaptcha-response': token
      });

      navigate('/login');

    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Inscription</h2>

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
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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
          {loading ? 'Inscription...' : 'S'inscrire'}
        </button>
      </form>

      <p>
        Déjà un compte ? <Link to="/login">Connexion</Link>
      </p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Register;
