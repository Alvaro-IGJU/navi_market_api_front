import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordPage = () => {
  const { token } = useParams(); // Obtener el token desde la URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true); // Nuevo estado para verificar el token

  useEffect(() => {
    // Verificar si el token es válido
    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/users/verify-token/${token}/`
        );

        if (response.status !== 200) {
          setIsTokenValid(false); // El token no es válido
        }
      } catch (error) {
        setIsTokenValid(false); // Si hay un error en la verificación, el token no es válido
      }
    };

    verifyToken();
  }, [token]);

  // Si el token no es válido, redirigir a la página principal
  useEffect(() => {
    if (!isTokenValid) {
      navigate('/'); // Redirige a la página de inicio si el token no es válido
    }
  }, [isTokenValid, navigate]);

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `http://localhost:8000/api/users/reset-password/${token}/`, // URL de tu API para restablecer la contraseña
        { password: newPassword }
      );

      if (response.status === 200) {
        // Si todo salió bien, redirigir al login o mostrar un mensaje de éxito
        alert('Contraseña restablecida con éxito. Puedes iniciar sesión ahora.');
        navigate('/auth'); // Redirigir a la página de login
      }
    } catch (error) {
      setError('Hubo un error al restablecer la contraseña. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center' }}>Restablecer Contraseña</h2>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {/* Solo mostrar el formulario si el token es válido */}
      {isTokenValid ? (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '5px' }}>
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#C7AA68',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', color: 'red' }}>
          <p>El token es inválido o ha expirado. Redirigiendo a la página de inicio...</p>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordPage;
