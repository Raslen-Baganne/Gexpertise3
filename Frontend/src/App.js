import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import Home from "./components/UserDashboard/Pages/Home/Home";
import CalculSDP from "./components/UserDashboard/Pages/CalculSDP/CalculSDP";
import CalculTA from "./components/UserDashboard/Pages/CalculTA/CalculTA";
import Ressources from "./components/UserDashboard/Pages/Ressources/Ressources";
import Contact from "./components/UserDashboard/Pages/Contact/Contact";
import ParametreCompte from "./components/UserDashboard/Pages/parametre_compte/parametre_compte";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirection par défaut vers la page de connexion */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Route Admin (protégée) */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Route Utilisateur avec sous-routes (protégées) */}
        <Route 
          path="/user-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="calcul-sdp" element={<CalculSDP />} />
          <Route path="calcul-ta" element={<CalculTA />} />
          <Route path="ressources" element={<Ressources />} />
          <Route path="contact" element={<Contact />} />
          <Route path="parametre_compte" element={<ParametreCompte />} />
        </Route>

        {/* Redirection pour les routes inconnues */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
