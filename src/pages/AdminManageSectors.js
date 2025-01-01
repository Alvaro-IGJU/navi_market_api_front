import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import '../adminManageSectors.css';

const AdminManageSectors = () => {
  const { user, isLoading, renewAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sectors, setSectors] = useState([]);
  const [filteredSectors, setFilteredSectors] = useState([]);
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
      fetchSectors();
    }
  }, [user]);

  const fetchSectors = async () => {
    try {
      let accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
      }

      const response = await api.get('/users/admin/sectors/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setSectors(response.data);
      setFilteredSectors(response.data);
    } catch (error) {
      Swal.fire('Error', 'Error al cargar los sectores.', 'error');
    }
  };

  const handleCreateOrEditSector = async (sector) => {
    const isEdit = !!sector?.id;

    const { value: formValues } = await Swal.fire({
      title: isEdit ? 'Editar Sector' : 'Crear Sector',
      html: `<input id="swal-input-name" class="swal2-input" placeholder="Nombre del Sector" value="${sector?.name || ''}" />`,
      showCancelButton: true,
      preConfirm: () => {
        const name = document.getElementById('swal-input-name').value;
        if (!name) {
          Swal.showValidationMessage('El nombre no puede estar vacío.');
        }
        return { name };
      },
    });

    if (formValues) {
      try {
        let accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
        }

        if (isEdit) {
          await api.put(`/users/admin/sectors/${sector.id}/`, formValues, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        } else {
          await api.post(`/users/admin/sectors/`, formValues, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        }

        Swal.fire('Éxito', isEdit ? 'Sector actualizado' : 'Sector creado', 'success');
        fetchSectors();
      } catch (error) {
        Swal.fire('Error', 'No se pudo guardar el sector.', 'error');
      }
    }
  };

  const handleDeleteSector = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el sector de forma permanente.',
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

        await api.delete(`/users/admin/sectors/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        Swal.fire('Eliminado', 'Sector eliminado con éxito.', 'success');
        fetchSectors();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el sector.', 'error');
      }
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    setFilteredSectors(sectors.filter((sector) => sector.name.toLowerCase().includes(searchTerm)));
  };

  if (isLoading) return <p className="text-center">Cargando...</p>;

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Administrar Sectores</h1>
        <input
          type="text"
          className="admin-search"
          placeholder="Buscar sectores"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button
          className="admin-button"
          onClick={() => handleCreateOrEditSector(null)}
        >
          Crear Sector
        </button>
        {filteredSectors.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSectors.map((sector) => (
                <tr key={sector.id}>
                  <td>{sector.id}</td>
                  <td>{sector.name}</td>
                  <td className="admin-table-actions">
                    <button
                      className="admin-edit"
                      onClick={() => handleCreateOrEditSector(sector)}
                    >
                      Editar
                    </button>
                    <button
                      className="admin-delete"
                      onClick={() => handleDeleteSector(sector.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No se encontraron sectores.</p>
        )}
      </div>
    </div>
  );
};

export default AdminManageSectors;
