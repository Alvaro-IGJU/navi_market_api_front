import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import "../adminEditStandPage.css";

const EditStandPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { standId } = useParams();
  const [stand, setStand] = useState(null);
  const [events, setEvents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [message, setMessage] = useState("");

  const standTypes = [
    { value: "bronze", label: "Bronce" },
    { value: "silver", label: "Silver" },
    { value: "gold", label: "Gold" },
  ];

  useEffect(() => {
    if (!user?.is_superuser) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const [standResponse, eventsResponse, companiesResponse] = await Promise.all([
          api.get(`/events/stands/${standId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/events/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/companies/admin/companies", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStand(standResponse.data);
        setEvents(eventsResponse.data);
        setCompanies(companiesResponse.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setMessage("Error al cargar datos del stand.");
      }
    };

    fetchData();
  }, [user, navigate, standId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStand((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Por favor, selecciona un archivo PDF.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        setStand((prevData) => ({ ...prevData, [fieldName]: base64Data }));
      };

      reader.onerror = () => {
        console.error("Error al leer el archivo:", reader.error);
        alert("Hubo un problema al leer el archivo. Intenta de nuevo.");
      };

      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No estás autenticado.");

      await api.put(`/events/stands/${standId}/update/`, stand, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setMessage("Stand actualizado con éxito.");
      navigate("/admin/stands");
    } catch (error) {
      console.error("Error al actualizar el stand:", error);
      setMessage("Error al actualizar el stand.");
    }
  };

  if (!stand) return <p className="edit-stand-loading">Cargando stand...</p>;

  return (
    <div className="edit-stand-page">
      <div className="edit-stand-container">
        <h1 className="edit-stand-title">Editar Stand</h1>
        {message && <p className="edit-stand-message">{message}</p>}
        <form onSubmit={handleUpdate} className="edit-stand-form-grid">
          <div className="edit-stand-form-field">
            <label>Evento</label>
            <select
              name="event"
              value={stand.event || ""}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona un evento</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>
          <div className="edit-stand-form-field">
            <label>Empresa</label>
            <select
              name="company"
              value={stand.company || ""}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona una empresa</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div className="edit-stand-form-field">
            <label>Tipo de Stand</label>
            <select
              name="type"
              value={stand.type || ""}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona un tipo</option>
              {standTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="edit-stand-form-field">
            <label>Nombre del Stand</label>
            <input
              type="text"
              name="name"
              value={stand.name || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="edit-stand-form-field">
            <label>Descripción</label>
            <textarea
              name="description"
              value={stand.description || ""}
              onChange={handleInputChange}
              rows="4"
            ></textarea>
          </div>
          <div className="edit-stand-form-field">
            <label>Posición</label>
            <input
              type="number"
              name="position"
              value={stand.position || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="edit-stand-form-field">
            <label>Archivo Catálogo (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, "catalog_pdf")}
            />
          </div>
          <div className="edit-stand-form-field">
            <label>Archivo Prompts (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, "prompts_pdf")}
            />
          </div>
          <div className="edit-stand-form-field">
            <label>URL del Video</label>
            <input
              type="text"
              name="url_video"
              value={stand.url_video || ""}
              onChange={handleInputChange}
              placeholder="https://example.com/video"
            />
          </div>
          <div className="edit-stand-form-field">
            <label>URL de la WEB</label>
            <input
              type="text"
              name="url_web"
              value={stand.url_web || ""}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>
          <div className="edit-stand-form-buttons">
            <button type="submit" className="edit-stand-form-button">
              Actualizar Stand
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStandPage;
