import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <header className="bg-gray-800 text-white h-20 shadow-lg">
      {/* Added shadow-lg for the shadow effect */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between h-full">
        <Link to="/" className="text-lg font-bold text-yellow-400">
          NAVI MARKET
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex space-x-4">
                <Link
                  to="/events"
                  className="text-sm text-yellow-400 hover:underline"
                >
                  Eventos
                </Link>
                {user?.role === "Company" && (
                  <Link
                    to="/dashboard"
                    className="text-sm text-yellow-400 hover:underline"
                  >
                    Dashboard
                  </Link>
                )}
                {user?.is_superuser && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="text-sm text-yellow-400 hover:underline"
                    >
                      Dashboard Admin
                    </Link>
                    <Link
                      to="/admin/stands"
                      className="text-sm text-yellow-400 hover:underline"
                    >
                      Stands
                    </Link>
                    <Link
                      to="/admin/create-company-user"
                      className="text-sm text-yellow-400 hover:underline"
                    >
                      Create Company User
                    </Link>
                  </>
                )}
              </div>
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={closeDropdown}
              >
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={user?.profile_picture || '/default-avatar.png'}
                    alt="Perfil"
                    className="w-8 h-8 rounded-full border border-yellow-400"
                  />
                  <span className="text-sm">
                    {user?.first_name
                      ? `${user.first_name} ${user.last_name || ''}`
                      : 'Usuario'}
                  </span>
                </button>
                <ul
                  className={`absolute right-0 mt-2 w-48 bg-gray-700 text-white rounded shadow-lg transition-all ${
                    dropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}
                  style={{ zIndex: 9999 }} // Se añadió el z-index alto

                >
                  <li className="border-b border-gray-600">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-600"
                      onClick={closeDropdown}
                    >
                      Perfil
                    </Link>
                  </li>
                  {user?.is_superuser && (
                    <li className="border-b border-gray-600">
                      <Link
                        to="/admin"
                        className="block px-4 py-2 hover:bg-gray-600"
                        onClick={closeDropdown}
                      >
                        Administración
                      </Link>
                    </li>
                  )}
                  {user?.role === "Company" && (
                    <li className="border-b border-gray-600">
                      <Link
                        to="/company"
                        className="block px-4 py-2 hover:bg-gray-600"
                        onClick={closeDropdown}
                      >
                        Mi empresa
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => {
                        closeDropdown();
                        logout();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link to="/auth" className="text-sm text-yellow-400 hover:underline">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
