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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Inscription
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
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
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>

        </form>

        <p className="text-center mt-4">
          Déjà un compte ? <Link to="/login">Connexion</Link>
        </p>

      </div>

    </div>
  );
}

export default Register;
