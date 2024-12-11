import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import Header from '../components/Header';

const AdminPage = () => {
  const { user, isLoading, renewAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isLoading) {
      if (!user || !user.is_superuser) {
        navigate('/'); // Redirigir a la página principal si no es superusuario
      }
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user?.is_superuser) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      let accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
      }

      if (!accessToken) {
        setMessage('Error: No se pudo autenticar la solicitud.');
        return;
      }

      const headers = { Authorization: `Bearer ${accessToken}` };

      const [usersResponse, positionsResponse, sectorsResponse] = await Promise.all([
        api.get('/admin/users/', { headers }),
        api.get('/admin/positions/', { headers }),
        api.get('/admin/sectors/', { headers }),
      ]);

      setUsers(usersResponse.data);
      setPositions(positionsResponse.data);
      setSectors(sectorsResponse.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setMessage('Error al cargar datos de administración.');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      let accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
      }

      if (!accessToken) {
        setMessage('Error: No se pudo autenticar la solicitud.');
        return;
      }

      await api.delete(`/admin/users/${userId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setMessage('Usuario eliminado con éxito.');
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setMessage('Error al eliminar usuario.');
    }
  };

  const handleAddPosition = async (positionName) => {
    try {
      let accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
      }

      if (!accessToken) {
        setMessage('Error: No se pudo autenticar la solicitud.');
        return;
      }

      const response = await api.post('/admin/positions/', { title: positionName }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setMessage('Cargo añadido con éxito.');
      setPositions([...positions, response.data]);
    } catch (error) {
      console.error('Error al añadir cargo:', error);
      setMessage('Error al añadir cargo.');
    }
  };

  const handleAddSector = async (sectorName) => {
    try {
      let accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
      }

      if (!accessToken) {
        setMessage('Error: No se pudo autenticar la solicitud.');
        return;
      }

      const response = await api.post('/admin/sectors/', { name: sectorName }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setMessage('Sector añadido con éxito.');
      setSectors([...sectors, response.data]);
    } catch (error) {
      console.error('Error al añadir sector:', error);
      setMessage('Error al añadir sector.');
    }
  };

  if (isLoading) {
    return <p>Cargando...</p>; // Mostrar mensaje de carga mientras se verifica el usuario
  }

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Administración</h1>
        {message && <p className="mb-4 text-green-600">{message}</p>}

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-2">Usuarios</h2>
          <ul className="list-disc pl-5">
            {users.map((user) => (
              <li key={user.id} className="mb-2">
                {user.first_name} {user.last_name} ({user.email}){' '}
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-500 hover:underline"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-2">Cargos</h2>
          <ul className="list-disc pl-5">
            {positions.map((position) => (
              <li key={position.id}>{position.title}</li>
            ))}
          </ul>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const positionName = form.positionName.value;
              handleAddPosition(positionName);
              form.reset();
            }}
            className="mt-4"
          >
            <input
              type="text"
              name="positionName"
              placeholder="Nuevo cargo"
              className="px-4 py-2 border rounded"
              required
            />
            <button
              type="submit"
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Añadir Cargo
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Sectores</h2>
          <ul className="list-disc pl-5">
            {sectors.map((sector) => (
              <li key={sector.id}>{sector.name}</li>
            ))}
          </ul>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const sectorName = form.sectorName.value;
              handleAddSector(sectorName);
              form.reset();
            }}
            className="mt-4"
          >
            <input
              type="text"
              name="sectorName"
              placeholder="Nuevo sector"
              className="px-4 py-2 border rounded"
              required
            />
            <button
              type="submit"
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Añadir Sector
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
