// CSS
import './css/Login.css'; 

// IMPORTACIONES
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// AUTH 0
import { useAuth0 } from '@auth0/auth0-react';

const Login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  return (
    !isAuthenticated && (
      <div className="loginContainer">
        <div className='logoContainer'>
          <img src="../../gifs/feliz Quieto/feliGIF.gif" alt="" />
        </div>
        <button className="buttonLogin"  onClick={() => loginWithRedirect({ connection: 'google-oauth2' })}>
          Iniciar sesión con Google
        </button>
      </div>
    )
  );
};

export default Login;
