import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginUser } from '../services/Api';

export default function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    setError(null)

    try {
      const user = await loginUser(login, password)

      // Si on a notre user, on va pouvoir potentiellement le stocker en localStorage par exemple
      localStorage.setItem('token', user.token)
      localStorage.setItem('userId', user.userId)

      navigate('/dashboard')

    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
    
    // 3. Redirection vers la page d'accueil
    // navigate('/');
  };

  return (

    <form onSubmit={handleLogin}>

      <h2>Se connecter</h2>

      {error && <p style={{color: 'red'}}>{error}</p>}

      <input type="text" disabled={isLoading} name="login" placeholder='Entrez votre login' value={login} onChange={(e) => setLogin(e.target.value)} />
      <input type="password" disabled={isLoading} name="password" placeholder='Entrez votre mot de passe' value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
    </form>
  );
}