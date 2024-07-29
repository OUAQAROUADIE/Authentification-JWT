import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Assurez-vous d'importer Bootstrap CSS

const UpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromQuery = params.get('token');
        if (tokenFromQuery) {
            setToken(tokenFromQuery);
        } else {
            setError('Token is missing from the URL');
        }
    }, [location.search]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post('http://localhost:8080/user/passwordupdate', 
                { newPassword: password },
                { params: { token } }
            );
            setSuccess('Password updated successfully');
            setTimeout(() => navigate('/'), 3000);
        } catch (error) {
            setError('Failed to update password');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h4 className="card-title mb-0">Update Password</h4>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}
                            <form onSubmit={handlePasswordChange}>
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">New Password:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        className="form-control"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary mt-3">Update Password</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePassword;
