import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // Verifica esta ruta
import '../Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  console.log('AuthContext in Header:', { isAuthenticated, user, logout });

  return (
    <header>
      <nav className="navbar navbar-expand-lg navy-bg-blue ">
        <div className="container">
          <Link className="navbar-brand" to="/">NAVY MARKET</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {isAuthenticated ? (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={user?.profile_picture || '/default-avatar.png'}
                      alt="Perfil"
                      className="rounded-circle"
                      width="30"
                      height="30"
                    />{' '}
                    {user?.username || 'Usuario'}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li>
                      <a className="dropdown-item" href="/profile">Perfil</a>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={logout}>
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/auth">Iniciar Sesión</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
