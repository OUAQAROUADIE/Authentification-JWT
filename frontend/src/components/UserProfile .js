import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Assurez-vous d'utiliser le bon import
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Assurez-vous d'importer Bootstrap CSS

const UserProfile = () => {
  const { id } = useParams(); // Récupérer l'ID utilisateur depuis les paramètres de l'URL
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fonction pour vérifier la validité du jeton
    const checkTokenValidity = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decoded = jwtDecode(token); // Décoder le token
          const currentTime = Date.now() / 1000; // Temps actuel en secondes
          if (decoded.exp < currentTime) {
            console.log('Token is expired');
            localStorage.removeItem('authToken');
            window.location.href = '/'; // Redirection vers la page de connexion
          } else {
            // Stocker les données décodées dans le state
            setUserData(decoded);
          }
        } catch (e) {
          console.error('Invalid token', e);
          localStorage.removeItem('authToken');
          window.location.href = '/'; // Redirection en cas de jeton invalide
        }
      }
    };

    checkTokenValidity();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!userData) return <div className="alert alert-info">Loading...</div>;

  // Affichage des informations extraites du JWT
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="card-title mb-0">User Profile</h4>
            </div>
            <div className="card-body">
              <div className="list-group">
                <div className="list-group-item">
                  <strong>Name:</strong> {userData.claims.name}
                </div>
                <div className="list-group-item">
                  <strong>Email:</strong> {userData.claims.username}
                </div>
                <div className="list-group-item">
                  <strong>Role:</strong> {userData.authorities}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
