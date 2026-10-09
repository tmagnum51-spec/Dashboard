import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginUser } from '../services/Api';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const user = await loginUser(login, password);

      localStorage.setItem('token', user.token);
      localStorage.setItem('userId', user.userId);

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || "Identifiants invalides");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Colonne de gauche (Formulaire + Logo) */}
      <div className="login-left-side">
        <div className="login-logo-container">
          <div className="logo-icon">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="logo-text">SPORTSEE</span>
        </div>

        <div className="login-card">
          <h1 className="login-main-title">
            Transformez<br />
            vos stats en résultats
          </h1>

          <form onSubmit={handleLogin} className="login-form">
            <h2>Se connecter</h2>

            {error && <p className="login-error">{error}</p>}

            <div className="input-group">
              <label htmlFor="login">Adresse email</label>
              <input 
                type="text" 
                id="login"
                disabled={isLoading} 
                name="login" 
                placeholder='Entrez votre login' 
                value={login} 
                onChange={(e) => setLogin(e.target.value)} 
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Mot de passe</label>
              <input 
                type="password" 
                id="password"
                disabled={isLoading} 
                name="password" 
                placeholder='Entrez votre mot de passe' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            <button type="submit" disabled={isLoading} className="login-button">
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>

            <div className="login-forgot-password">
              <a href="#forgot">Mot de passe oublié ?</a>
            </div>
          </form>
        </div>
      </div>

      {/* Colonne de droite (Image de fond avec l'image loginImage) */}
      <div 
        className="login-right-side" 
        style={{ backgroundImage: `url('/assets/img/loginImage.jpg')` }}
      >
        <div className="running-badge">
          Analysez vos performances en un clin d'œil, suivez vos progrès et atteignez vos objectifs.
        </div>
      </div>
    </div>
  );
}