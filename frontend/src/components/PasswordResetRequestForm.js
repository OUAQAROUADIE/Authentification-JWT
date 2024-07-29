import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Assurez-vous d'importer Bootstrap CSS

const PasswordResetRequestForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/user/resetpassword', null, { params: { email } });
      setMessage(response.data.message); // Afficher le message de succès
      setEmail(''); // Réinitialiser le champ email
    } catch (error) {
      console.error('There was an error sending the password reset request!', error);
      setError('Failed to send password reset request.'); // Afficher le message d'erreur
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="card-title mb-0">Reset Password</h4>
            </div>
            <div className="card-body">
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Reset Password</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequestForm;