import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../adminStandsPage.css";

const AdminStandsPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stands, setStands] = useState([]);
  const [events, setEvents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [newStand, setNewStand] = useState({
    event: "",
    company: "",
    name: "",
    description: "",
    position: "", // Campo de posición añadido
    type: "",
    catalog_pdf: null,
    prompts_pdf: null,
    url_video: "",
    url_web: "",
  });
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

        const eventsResponse = await api.get("/events/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(eventsResponse.data);

        const companiesResponse = await api.get("/companies/admin/companies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(companiesResponse.data);

        const standsResponse = await api.get("/events/stands/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStands(standsResponse.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setMessage("Error al cargar datos.");
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStand((prevData) => ({ ...prevData, [name]: value }));
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
        setNewStand((prevData) => ({
          ...prevData,
          [fieldName]: base64Data,
        }));
      };

      reader.onerror = () => {
        console.error("Error al leer el archivo:", reader.error);
        alert("Hubo un problema al leer el archivo. Intenta de nuevo.");
      };

      reader.readAsDataURL(file);
    }
  };

  const handleStandSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!newStand.catalog_pdf || !newStand.prompts_pdf) {
      setMessage("Los archivos Catálogo y Prompts son obligatorios y deben ser PDFs.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      const response = await api.post("/events/stands/create/", newStand, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStands((prevStands) => [...prevStands, response.data]);
      setMessage("Stand creado con éxito.");
      setNewStand({
        event: "",
        company: "",
        name: "",
        description: "",
        position: "",
        type: "",
        catalog_pdf: null,
        prompts_pdf: null,
        url_video: "",
        url_web: "",
      });
    } catch (error) {
      console.error("Error al crear el stand:", error);
      setMessage("Error al crear el stand.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.delete(`/events/stands/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStands((prevStands) => prevStands.filter((stand) => stand.id !== id));
      setMessage("Stand eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar el stand:", error);
      setMessage("Error al eliminar el stand.");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Gestión de Stands</h1>
        {message && <p className="text-red-500">{message}</p>}

        <h2 className="section-title">Crear Nuevo Stand</h2>
        <form onSubmit={handleStandSubmit} className="form-group">
          <div className="form-group">
            <label>Evento</label>
            <select
              name="event"
              value={newStand.event}
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
          <div className="form-group">
            <label>Empresa</label>
            <select
              name="company"
              value={newStand.company}
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
          <div className="form-group">
            <label>Tipo de Stand</label>
            <select
              name="type"
              value={newStand.type}
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
          <div className="form-group">
            <label>Nombre del Stand</label>
            <input
              type="text"
              name="name"
              value={newStand.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={newStand.description}
              onChange={handleInputChange}
              rows="4"
            ></textarea>
          </div>
          <div className="form-group">
            <label>Posición</label> {/* Campo añadido */}
            <input
              type="number"
              name="position"
              value={newStand.position}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Archivo Catálogo (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, "catalog_pdf")}
            />
          </div>
          <div className="form-group">
            <label>Archivo Prompts (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, "prompts_pdf")}
            />
          </div>
          <div className="form-group">
            <label>URL del Video</label>
            <input
              type="url"
              name="url_video"
              value={newStand.url_video}
              onChange={handleInputChange}
              placeholder="https://example.com/video"
            />
          </div>
          <div className="form-group">
            <label>URL de la WEB</label>
            <input
              type="url"
              name="url_web"
              value={newStand.url_web}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>
          <button type="submit" className="form-button">
            Crear Stand
          </button>
        </form>

        <h2 className="section-title">Listado de Stands</h2>
        <ul className="stands-list">
          {stands.map((stand) => (
            <li key={stand.id} className="stand-item">
              <strong>{stand.name}</strong> - Evento: {stand.event.name} - Empresa: {stand.company.name} - Posición: {stand.position} {/* Posición añadida */}
              <p>{stand.description}</p>
              {stand.url_video && (
                <p>
                  <a href={stand.url_video} target="_blank" rel="noopener noreferrer">
                    Ver Video
                  </a>
                </p>
              )}
              <button
                onClick={() => navigate(`/admin/stands/edit/${stand.id}`)}
                className="edit-button"
              >
                Editar
              </button>
              <button onClick={() => handleDelete(stand.id)} className="delete-button">
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminStandsPage;
