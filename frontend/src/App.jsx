import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './components/Login';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Enfants from './components/Enfants';
import EnfantDetail from './components/EnfantDetail';
import Groupes from './components/Groupes';
import GroupeDetail from './components/GroupeDetail';
import Presences from './components/Presences';
import Paiements from './components/Paiements';
import Recu from './components/Recu';

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/enfants" element={<ProtectedRoute><Enfants /></ProtectedRoute>} />
          <Route path="/enfants/:id" element={<ProtectedRoute><EnfantDetail /></ProtectedRoute>} />
          <Route path="/groupes" element={<ProtectedRoute><Groupes /></ProtectedRoute>} />
          <Route path="/groupes/:id" element={<ProtectedRoute><GroupeDetail /></ProtectedRoute>} />
          <Route path="/presences" element={<ProtectedRoute><Presences /></ProtectedRoute>} />
          <Route path="/paiements" element={<ProtectedRoute><Paiements /></ProtectedRoute>} />
          <Route path="/recu/:id" element={<ProtectedRoute><Recu /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;