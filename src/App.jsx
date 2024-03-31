// App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute'; // Assurez-vous d'importer correctement ProtectedRoute

const Home = lazy(() => import('./Home'));
const Dashboard = lazy(() => import('./Dashboard'));
const Login = lazy(() => import('./Login'));

const App = () => (
  <Router>
    <AuthProvider>
      <Suspense fallback={<div>Chargement...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Dashboard />} />
            </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  </Router>
);

export default App;
