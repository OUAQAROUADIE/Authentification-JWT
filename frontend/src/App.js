import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HelloWorld from './components/HelloWorld';
import Login from './components/Login';
import UserProfile from './components/UserProfile '; // Importer le nouveau composant

import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome CSS
import './App.css';
import PasswordResetRequestForm from './components/PasswordResetRequestForm';
import PasswordUpdateForm from './components/PasswordUpdateForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/hello" element={<HelloWorld />} />
        <Route path="/" element={<Login />} />
        <Route path="/users/:id" element={<UserProfile />} /> 
        <Route path='/forgetPassword' element={<PasswordResetRequestForm/>} />
        <Route path='/updatePassword' element={<PasswordUpdateForm/>} />

      </Routes>
    </Router>
  );
}

export default App;
