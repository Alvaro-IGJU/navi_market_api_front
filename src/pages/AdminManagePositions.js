import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import '../adminManageSectors.css';
import '../adminManagePositions.css';

const AdminManagePositions = () => {
  const { user, isLoading, renewAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isLoading) {
      if (!user || !user.is_superuser) {
        navigate('/');
      }
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user?.is_superuser) {
      fetchPositions();
    }
  }, [user]);

  const fetchPositions = async () => {
    try {
      let accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
      }

      const response = await api.get('/users/admin/positions/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setPositions(response.data);
      setFilteredPositions(response.data);
    } catch (error) {
      Swal.fire('Error', 'Error al cargar las posiciones.', 'error');
    }
  };

  const handleCreateOrEditPosition = async (position) => {
    const isEdit = !!position?.id;

    const { value: formValues } = await Swal.fire({
      title: isEdit ? 'Editar Posición' : 'Crear Posición',
      html: `<input id="swal-input-title" class="swal2-input" placeholder="Nombre de la Posición" value="${position?.title || ''}" />`,
      showCancelButton: true,
      preConfirm: () => {
        const title = document.getElementById('swal-input-title').value;
        if (!title) {
          Swal.showValidationMessage('El nombre no puede estar vacío.');
        }
        return { title };
      },
    });

    if (formValues) {
      try {
        let accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
        }

        if (isEdit) {
          await api.put(`/users/admin/positions/${position.id}/`, formValues, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        } else {
          await api.post('/users/admin/positions/', formValues, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        }

        Swal.fire('Éxito', isEdit ? 'Posición actualizada' : 'Posición creada', 'success');
        fetchPositions();
      } catch (error) {
        Swal.fire('Error', 'No se pudo guardar la posición.', 'error');
      }
    }
  };

  const handleDeletePosition = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la posición de forma permanente.',
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

        await api.delete(`/users/admin/positions/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        Swal.fire('Eliminado', 'Posición eliminada con éxito.', 'success');
        fetchPositions();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la posición.', 'error');
      }
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    setFilteredPositions(
      positions.filter((position) => position.title.toLowerCase().includes(searchTerm))
    );
  };

  if (isLoading) return <p className="text-center">Cargando...</p>;

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Administrar Posiciones</h1>
        <input
          type="text"
          className="admin-search"
          placeholder="Buscar posiciones"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button
          className="admin-button"
          onClick={() => handleCreateOrEditPosition(null)}
        >
          Crear Posición
        </button>
        {filteredPositions.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPositions.map((position) => (
                <tr key={position.id}>
                  <td>{position.id}</td>
                  <td>{position.title}</td>
                  <td className="admin-table-actions">
                    <button
                      className="admin-edit"
                      onClick={() => handleCreateOrEditPosition(position)}
                    >
                      Editar
                    </button>
                    <button
                      className="admin-delete"
                      onClick={() => handleDeletePosition(position.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No se encontraron posiciones.</p>
        )}
      </div>
    </div>
  );
};

export default AdminManagePositions;
