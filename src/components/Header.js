import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="backdrop-blur-md text-white shadow-lg fixed top-0 w-full z-50">
      <nav className="backdrop-blur-md px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? 'flex items-center  border-white text-white'
              : 'flex items-center  border-transparent hover:border-white text-white'
          }
        >
          <span className="self-center text-xl font-semibold whitespace-nowrap">
            NAVI MARKET
          </span>
        </NavLink>

          <div className="flex items-center space-x-4 lg:order-2">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <img
                    src={user?.profile_picture || '/multimedia/images/default-avatar.jpg'}
                    alt="Perfil"
                    className="w-11 h-11 rounded-full border border-yellow-400"
                  />
                  <span className="hidden lg:block text-sm truncate max-w-[150px]">
                    <b>{user?.username ? `${user.username}` : 'Usuario'}</b>
                  </span>
                </button>
                <ul
                    className={`absolute right-0 p-0 mt-2 w-48 bg-gray-900 text-white rounded shadow-lg transition-all duration-300 ${
                      dropdownOpen ? 'block' : 'hidden'
                    }`}
                  >
                    <li className="flex justify-center items-center w-full">
                      <NavLink
                        to="/profile"
                        className="block w-full px-4 py-2 text-[#C7AA68] hover:bg-gray-600 rounded text-center"
                        onClick={closeDropdown}
                      >
                        Perfil
                      </NavLink>
                    </li>
                    {user?.is_superuser && (
                      <li className="flex justify-center items-center w-full">
                        <NavLink
                          to="/admin"
                          className="block w-full px-4 py-2 text-[#C7AA68] hover:bg-gray-600 rounded text-center"
                          onClick={closeDropdown}
                        >
                          Administración
                        </NavLink>
                      </li>
                    )}
                    {user?.role === 'Company' && (
                      <li className="flex justify-center items-center w-full">
                        <NavLink
                          to="/company"
                          className="block w-full px-4 py-2 text-[#C7AA68] hover:bg-gray-600 rounded text-center"
                          onClick={closeDropdown}
                        >
                          Mi empresa
                        </NavLink>
                      </li>
                    )}
                    <li className="flex justify-center items-center w-full">
                      <button
                        onClick={() => {
                          closeDropdown();
                          logout();
                        }}
                        className="block w-full text-center px-4 py-2 text-[#C7AA68] hover:bg-gray-600"
                      >
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>


              </div>
            ) : (
              <NavLink
                to="/auth"
                className="text-[#C7AA68] hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              >
                Iniciar Sesión
              </NavLink>
            )}
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`w-6 h-6 ${menuOpen ? 'hidden' : 'block'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className={`w-6 h-6 ${menuOpen ? 'block' : 'hidden'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <div
            className={`${
              menuOpen ? 'flex' : 'hidden'
            } justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
              <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                          ? 'block py-2 pr-4 pl-3 text-[#C7AA68] rounded   lg:bg-transparent lg:p-0 dark:text-[#C7AA68]'
                          : 'block py-2 pr-4 pl-3 text-white hover:bg-gray-50 lg:hover:bg-transparent lg:hover:text-primary-700 lg:p-0 dark:text-white hover:border-white'
                      }
            >
              Home
            </NavLink>
              </li>
              {isAuthenticated  && (
              <li>
                <NavLink
                  to="/events"
                  className={({ isActive }) =>
                    isActive
                          ? 'block py-2 pr-4 pl-3 text-[#C7AA68] rounded lg:bg-transparent lg:p-0 dark:text-[#C7AA68]'
                          : 'block py-2 pr-4 pl-3 text-white hover:bg-gray-50 lg:hover:bg-transparent lg:hover:text-primary-700 lg:p-0 dark:text-white hover:border-white'
                      }
                >
                  Eventos
                </NavLink>
              </li>
              )}
              {user?.role === 'Company' && (
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      isActive
                          ? 'block py-2 pr-4 pl-3 text-[#C7AA68] rounded lg:bg-transparent lg:p-0 dark:text-[#C7AA68]'
                          : 'block py-2 pr-4 pl-3 text-white hover:bg-gray-50 lg:hover:bg-transparent lg:hover:text-primary-700 lg:p-0 dark:text-white hover:border-white'
                      }
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}
              {user?.is_superuser && (
                <>
                  <li>
                    <NavLink
                      to="/admin/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? 'block py-2 pr-4 pl-3 text-[#C7AA68] rounded lg:bg-transparent lg:p-0 dark:text-[#C7AA68]'
                          : 'block py-2 pr-4 pl-3 text-white hover:bg-gray-50 lg:hover:bg-transparent lg:hover:text-primary-700 lg:p-0 dark:text-white hover:border-white'
                      }
                    >
                      Dashboard Admin
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/stands"
                      className={({ isActive }) =>
                        isActive
                          ? 'block py-2 pr-4 pl-3 text-[#C7AA68] rounded lg:bg-transparent lg:p-0 dark:text-[#C7AA68]'
                          : 'block py-2 pr-4 pl-3 text-white hover:bg-gray-50 lg:hover:bg-transparent lg:hover:text-primary-700 lg:p-0 dark:text-white hover:border-white'
                      }
                    >
                      Stands
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/create-company-user"
                      className={({ isActive }) =>
                        isActive
                          ? 'block py-2 pr-4 pl-3 text-[#C7AA68] rounded lg:bg-transparent lg:p-0 dark:text-[#C7AA68]'
                          : 'block py-2 pr-4 pl-3 text-white hover:bg-gray-50 lg:hover:bg-transparent lg:hover:text-primary-700 lg:p-0 dark:text-white hover:border-white'
                      }
                    >
                      Crear Usuario Empresa
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
