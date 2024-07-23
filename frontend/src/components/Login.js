import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Importation nommée
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
} from 'mdb-react-ui-kit';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../App.css';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/login/users', {
        username: username,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const token = response.data["access token"];
    console.log('Token received:', token); // Vérifiez le token dans la console
    if (token) {
      localStorage.setItem('authToken', token);

      // Décoder le jeton pour obtenir l'ID utilisateur (ou récupérer l'ID d'une autre manière)
      const decoded = jwtDecode(token);
      console.log("decode::::::::::::",decoded);
      const userId = decoded.claims.id; 
      navigate(`/users/${userId}`);
    } else {
      console.error('Token not found in response');
    }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Invalid email or password. Please try again.');
    }
  };

  return (
    <MDBContainer className="my-5 container">
      <MDBCard>
        <MDBRow className='g-0'>
          <MDBCol md='6'>
            <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp' alt="login form" className='rounded-start w-100'/>
          </MDBCol>
          <MDBCol md='6'>
            <MDBCardBody className='d-flex flex-column'>
              <div className='d-flex flex-row mt-2'>
                <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }}/>
                <span className="h1 fw-bold mb-0">Logo</span>
              </div>
              <h5 className="fw-normal my-4 pb-3" style={{letterSpacing: '1px'}}>Sign into your account</h5>
              {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
              <MDBInput wrapperClass='mb-4' label='Email address' id='formControlEmail' type='email' size="lg" value={username} onChange={(e) => setUsername(e.target.value)}/>
              <MDBInput wrapperClass='mb-4' label='Password' id='formControlPassword' type='password' size="lg" value={password} onChange={(e) => setPassword(e.target.value)}/>
              <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={handleLogin}>Login</MDBBtn>
              <a className="small text-muted" href="#!">Forgot password?</a>
              <p className="mb-5 pb-lg-2" style={{color: '#393f81'}}>Don't have an account? <a href="#!" style={{color: '#393f81'}}>Register here</a></p>
              <div className='d-flex flex-row justify-content-start'>
                <a href="#!" className="small text-muted me-1">Terms of use.</a>
                <a href="#!" className="small text-muted">Privacy policy</a>
              </div>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default Login;
