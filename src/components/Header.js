import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Home, Calendar, LayoutDashboard, LogIn, User, Building2, Settings } from 'lucide-react';

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
    <header className="backdrop-blur-md text-[#FFC28F] shadow-lg fixed top-0 w-full z-50 font-['Poppins']">
      <nav className="backdrop-blur-md px-4 lg:px-6 py-1.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <NavLink
            to="/"
            className="flex items-center no-underline transform transition hover:scale-105"
          >
            <img
              src='/multimedia/images/FINAL LOGO.png'
              alt="Logo"
              className="self-center h-10 transition-transform duration-300 hover:scale-105"
            />
          </NavLink>

          <div className="flex items-center space-x-4 lg:order-2">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none transform transition-all duration-300 hover:scale-105"
                >
                  <img
                    src={user?.profile_picture || '/multimedia/images/default-avatar.jpg'}
                    alt="Perfil"
                    className="w-9 h-9 rounded-full border-2 border-[#FFC28F] transition-all duration-300 hover:border-yellow-300 hover:shadow-lg"
                  />
                  <span className="hidden lg:block text-sm truncate max-w-[120px] font-medium">
                    <b>{user?.username ? `${user.username}` : 'Usuario'}</b>
                  </span>
                </button>
                <ul
                  className={`absolute right-0 p-2 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl transition-all duration-300 transform ${
                    dropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                  }`}
                >
                  <li className="flex justify-center items-center w-full">
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `flex items-center gap-2 w-full px-4 py-2 no-underline rounded-md transition-all duration-200 ease-in-out ${
                          isActive
                            ? 'bg-gray-700 text-yellow-300'
                            : 'text-[#FFC28F] hover:bg-gray-700 hover:text-yellow-300'
                        }`
                      }
                      onClick={closeDropdown}
                    >
                      <User size={16} />
                      Perfil
                    </NavLink>
                  </li>
                  {user?.is_superuser && (
                    <li className="flex justify-center items-center w-full">
                      <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                          `flex items-center gap-2 w-full px-4 py-2 no-underline rounded-md transition-all duration-200 ease-in-out ${
                            isActive
                              ? 'bg-gray-700 text-yellow-300'
                              : 'text-[#FFC28F] hover:bg-gray-700 hover:text-yellow-300'
                          }`
                        }
                        onClick={closeDropdown}
                      >
                        <Settings size={16} strokeWidth={2.5}/>
                        Administración
                      </NavLink>
                    </li>
                  )}
                  {user?.role === 'Company' && (
                    <li className="flex justify-center items-center w-full">
                      <NavLink
                        to="/company"
                        className={({ isActive }) =>
                          `flex items-center gap-2 w-full px-4 py-2 no-underline rounded-md transition-all duration-200 ease-in-out ${
                            isActive
                              ? 'bg-gray-700 text-yellow-300'
                              : 'text-[#FFC28F] hover:bg-gray-700 hover:text-yellow-300'
                          }`
                        }
                        onClick={closeDropdown}
                      >
                        <Building2 size={16} />
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
                      className="flex items-center gap-2 w-full text-center px-4 py-2 text-[#FFC28F] hover:bg-gray-700 rounded-md transition-all duration-200 ease-in-out hover:text-yellow-300"
                    >
                      <LogIn size={16} className="rotate-180" />
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <NavLink
                to="/auth"
                className={({ isActive }) =>
                  `flex items-center gap-2 py-1 px-3 no-underline transition-all duration-300 transform hover:scale-105 relative ${
                    isActive
                      ? 'text-yellow-300 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-300'
                      : 'text-[#FFC28F] hover:text-yellow-300 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-300 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300'
                  }`
                }
              >
                <LogIn size={18} />
                Iniciar Sesión
              </NavLink>
            )}
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="inline-flex items-center p-1.5 ml-1 text-sm text-[#FFC28F] rounded-lg lg:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`w-5 h-5 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="https://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className={`w-5 h-5 absolute transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="https://www.w3.org/2000/svg"
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
            } justify-between items-center w-full lg:flex lg:w-auto lg:order-1 transition-all duration-300`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-2 font-medium lg:flex-row lg:space-x-6 lg:mt-0">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center gap-2 py-1 pr-3 pl-2 no-underline transition-all duration-300 transform hover:scale-105 relative ${
                      isActive
                        ? 'text-yellow-300 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-300'
                        : 'text-[#FFC28F] hover:text-[#FFC28F] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#FFC28F] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300'
                    }`
                  }
                >
                  <Home size={18} />
                  Home
                </NavLink>
              </li>
              {isAuthenticated && (
                <li>
                  <NavLink
                    to="/events"
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-1 pr-3 pl-2 no-underline transition-all duration-300 transform hover:scale-105 relative ${
                        isActive
                          ? 'text-yellow-300 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-300'
                          : 'text-[#FFC28F] hover:text-[#FFC28F] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#FFC28F] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300'
                      }`
                    }
                  >
                    <Calendar size={18} />
                    Eventos
                  </NavLink>
                </li>
              )}
              {user?.role === 'Company' && (
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-1 pr-3 pl-2 no-underline transition-all duration-300 transform hover:scale-105 relative ${
                        isActive
                          ? 'text-yellow-300 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-300'
                          : 'text-[#FFC28F] hover:text-[#FFC28F] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#FFC28F] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300'
                      }`
                    }
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </NavLink>
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