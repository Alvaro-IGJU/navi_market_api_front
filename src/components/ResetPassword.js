import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from "../api";
import '../resetPasswordPage.css'; // Archivo CSS específico para la página

const ResetPasswordPage = () => {
  const { token } = useParams(); // Obtener el token desde la URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await api.get(
          `/users/verify-token/${token}/`
        );
        if (response.status !== 200) {
          setIsTokenValid(false);
        }
      } catch (error) {
        setIsTokenValid(false);
      }
    };

    verifyToken();
  }, [token]);

  useEffect(() => {
    if (!isTokenValid) {
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [isTokenValid, navigate]);

  const handlePasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post(
        `/users/reset-password/${token}/`,
        { password: newPassword }
      );

      if (response.status === 200) {
        alert('Contraseña restablecida con éxito. Puedes iniciar sesión ahora.');
        navigate('/auth');
      }
    } catch (error) {
      setError('Hubo un error al restablecer la contraseña. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h2 className="reset-password-title">Restablecer Contraseña</h2>

        {error && <div className="reset-password-error">{error}</div>}

        {isTokenValid ? (
          <form onSubmit={handleSubmit} className="reset-password-form">
            <div className="form-field">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
            </div>

            <button
              type="submit"
              className="reset-password-button"
              disabled={isLoading}
            >
              {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </button>
          </form>
        ) : (
          <div className="reset-password-error">
            <p>El token es inválido o ha expirado. Redirigiendo a la página de inicio...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
