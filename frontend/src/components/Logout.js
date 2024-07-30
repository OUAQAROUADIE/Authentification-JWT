import React from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Faire une requête POST pour la déconnexion
      await axios.post('http://localhost:8080/logout'); // Vérifiez l'URL du endpoint

      // Supprimer le token JWT de localStorage
      localStorage.removeItem('authToken');

      // Rediriger l'utilisateur vers la page de connexion
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
}

export default Logout;
