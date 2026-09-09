import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault();
    // 1. Appel API de connexion...
   console.log(login, password)
    
    // 3. Redirection vers la page d'accueil
    // navigate('/');
  };

  return (

    <form onSubmit={handleLogin}>

      <h2>Connexion</h2>
      <input type="text" name="login" placeholder='Entrez votre login' value={login} onChange={(e) => setLogin(e.target.value)} />
      <input type="password" name="password" placeholder='Entrez votre mot de passe' value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Se connecter</button>
    </form>
  );
}