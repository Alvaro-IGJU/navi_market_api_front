import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import Header from '../components/Header';

const AdminPage = () => {
  const { user, isLoading, renewAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [filteredSectors, setFilteredSectors] = useState([]);
  const [searchTermPositions, setSearchTermPositions] = useState('');
  const [searchTermSectors, setSearchTermSectors] = useState('');

  useEffect(() => {
    if (!isLoading) {
      if (!user || !user.is_superuser) {
        navigate('/'); // Redirigir si no es superusuario
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
        Swal.fire('Error', 'No se pudo autenticar la solicitud.', 'error');
        return;
      }

      const headers = { Authorization: `Bearer ${accessToken}` };

      const [positionsResponse, sectorsResponse] = await Promise.all([
        api.get('/users/admin/positions/', { headers }),
        api.get('/users/admin/sectors/', { headers }),
      ]);

      setPositions(positionsResponse.data);
      setFilteredPositions(positionsResponse.data);
      setSectors(sectorsResponse.data);
      setFilteredSectors(sectorsResponse.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire('Error', 'Error al cargar datos de administración.', 'error');
    }
  };

  const handleDelete = async (id, type) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Esta acción eliminará permanentemente el ${type === 'positions' ? 'cargo' : 'sector'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        let accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
        }

        if (!accessToken) {
          Swal.fire('Error', 'No se pudo autenticar la solicitud.', 'error');
          return;
        }

        await api.delete(`/users/admin/${type}/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        Swal.fire('Eliminado', `${type === 'positions' ? 'Cargo' : 'Sector'} eliminado con éxito.`, 'success');
        fetchData(); // Recargar datos después de eliminar
      } catch (error) {
        Swal.fire('Error', `Error al eliminar el ${type === 'positions' ? 'cargo' : 'sector'}.`, 'error');
      }
    }
  };

  const handleEditOrCreate = async (item, type) => {
    const isEdit = !!item?.id;

    const { value: formValues } = await Swal.fire({
      title: isEdit
        ? `Editar ${type === 'positions' ? 'Cargo' : 'Sector'}`
        : `Crear nuevo ${type === 'positions' ? 'Cargo' : 'Sector'}`,
      html: `
        <input id="swal-input-title" class="swal2-input" placeholder="Título" value="${item?.title || item?.name || ''}" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: isEdit ? 'Actualizar' : 'Crear',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const title = document.getElementById('swal-input-title').value;
        if (!title) {
          Swal.showValidationMessage('El título no puede estar vacío.');
        }
        return { title };
      },
    });

    if (formValues) {
      const data = { ...item, title: formValues.title, name: formValues.title };

      try {
        let accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
        }

        if (!accessToken) {
          Swal.fire('Error', 'No se pudo autenticar la solicitud.', 'error');
          return;
        }

        if (isEdit) {
          await api.put(`/users/admin/${type}/${item.id}/`, data, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          Swal.fire('Éxito', `${type === 'positions' ? 'Cargo' : 'Sector'} actualizado con éxito.`, 'success');
        } else {
          await api.post(`/users/admin/${type}/`, data, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          Swal.fire('Éxito', `${type === 'positions' ? 'Cargo' : 'Sector'} creado con éxito.`, 'success');
        }

        fetchData();
      } catch (error) {
        Swal.fire('Error', `Error al guardar el ${type === 'positions' ? 'cargo' : 'sector'}.`, 'error');
      }
    }
  };

  const handleSearch = (e, type) => {
    const searchTerm = e.target.value.toLowerCase();
    if (type === 'positions') {
      setSearchTermPositions(searchTerm);
      setFilteredPositions(
        positions.filter((position) =>
          position.title.toLowerCase().includes(searchTerm)
        )
      );
    } else if (type === 'sectors') {
      setSearchTermSectors(searchTerm);
      setFilteredSectors(
        sectors.filter((sector) =>
          sector.name.toLowerCase().includes(searchTerm)
        )
      );
    }
  };

  const renderTable = (items, type, searchTerm) => (
    <div className="mb-8">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e, type)}
        placeholder={`Buscar ${type === 'positions' ? 'Cargos' : 'Sectores'}`}
        className="mb-2 px-4 py-2 border rounded w-full"
      />
      <button
        onClick={() => handleEditOrCreate(null, type)}
        className="mb-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Crear {type === 'positions' ? 'Cargo' : 'Sector'}
      </button>
      <div className="max-h-96 min-h-[12rem] overflow-y-auto border border-gray-300 rounded-lg">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Nombre</th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.title || item.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                <div className="flex justify-around">
                  <button
                    onClick={() => handleEditOrCreate(item, type)}
                    className="text-blue-500 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, type)}
                    className="text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Administración</h1>
        <section>
          <h2 className="text-xl font-bold mb-2">Cargos</h2>
          {renderTable(filteredPositions, 'positions', searchTermPositions)}
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">Sectores</h2>
          {renderTable(filteredSectors, 'sectors', searchTermSectors)}
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
