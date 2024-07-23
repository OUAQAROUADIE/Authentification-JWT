import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HelloWorld from './components/HelloWorld';
import Login from './components/Login';
import UserProfile from './components/UserProfile '; // Importer le nouveau composant

import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome CSS
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/hello" element={<HelloWorld />} />
        <Route path="/" element={<Login />} />
        <Route path="/users/:id" element={<UserProfile />} /> 
      </Routes>
    </Router>
  );
}

export default App;
