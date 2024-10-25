// IMPORTACIONES
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';

// AUTH 0
import { useAuth0 } from '@auth0/auth0-react';

// VERIFICA SI EL USARIO ESTÁ AUTORIZAD|O PARA ENTRAR A OTRA RUTA QUE NO SEA EL LOGIN
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? children : <Navigate to="/" />;
};

// TODAS LAS RUTAS
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* HOME */}
      <Route
        path="home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;

