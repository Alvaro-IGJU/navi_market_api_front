import React, { useEffect, useState } from 'react';
import api from '../api';  
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async () => {
    try {
      // Crea un objeto de parámetros dinámicamente
      const params = {
        location: locationFilter,
        position: positionFilter,
        sector: sectorFilter,
        limit: limit,
        offset: offset,
      };

      // Agrega el parámetro "search" solo si tiene un valor
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await api.get('/get-users/', { params });
      setUsers(response.data.results);
      setTotalUsers(response.data.count);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, locationFilter, positionFilter, sectorFilter, limit, offset]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setOffset(0); // Reiniciar el offset al realizar una nueva búsqueda
  };

  const handleLocationFilter = (e) => {
    setLocationFilter(e.target.value);
    setOffset(0); // Reiniciar el offset al aplicar un nuevo filtro
  };

  const handlePositionFilter = (e) => {
    setPositionFilter(e.target.value);
    setOffset(0); // Reiniciar el offset al aplicar un nuevo filtro
  };

  const handleSectorFilter = (e) => {
    setSectorFilter(e.target.value);
    setOffset(0); // Reiniciar el offset al aplicar un nuevo filtro
  };

  const handleLimitChange = (e) => {
    setLimit(e.target.value);
    setOffset(0); // Reiniciar el offset al cambiar el límite
  };

  const handleNextPage = () => {
    setOffset((prev) => prev + limit);
  };

  const handlePreviousPage = () => {
    setOffset((prev) => Math.max(prev - limit, 0));
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <TextField
          label="Buscar por nombre"
          value={searchQuery}
          onChange={handleSearch}
          variant="outlined"
        />
        <TextField
          label="Filtrar por ubicación"
          value={locationFilter}
          onChange={handleLocationFilter}
          variant="outlined"
        />
        <TextField
          label="Filtrar por posición"
          value={positionFilter}
          onChange={handlePositionFilter}
          variant="outlined"
        />
        <TextField
          label="Filtrar por sector"
          value={sectorFilter}
          onChange={handleSectorFilter}
          variant="outlined"
        />
        <FormControl variant="outlined" style={{ minWidth: '120px' }}>
          <InputLabel>Mostrar</InputLabel>
          <Select value={limit} onChange={handleLimitChange} label="Mostrar">
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Empresa</TableCell>
              <TableCell>Posición</TableCell>
              <TableCell>Sector</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.username}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.location}</TableCell>
                <TableCell>{user.company}</TableCell>
                <TableCell>{user.position_title}</TableCell>
                <TableCell>{user.sector_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button onClick={handlePreviousPage} disabled={offset === 0}>
          Anterior
        </Button>
        <Typography>
          Página {Math.floor(offset / limit) + 1} de {Math.ceil(totalUsers / limit)}
        </Typography>
        <Button onClick={handleNextPage} disabled={offset + limit >= totalUsers}>
          Siguiente
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;