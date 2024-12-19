import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";

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
    position: "",
    type: "",
    pdf: null, // Campo para almacenar el PDF en base64
  });
  const [message, setMessage] = useState("");

  const standTypes = [
    { value: "basic", label: "Básico" },
    { value: "premium", label: "Premium" },
    { value: "vip", label: "VIP" },
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Archivo seleccionado:", file);
      console.log("Tipo de archivo:", file.type);
      if (file.type !== "application/pdf") {
        alert("Por favor, selecciona un archivo PDF.");
        return;
      }

      // Límite de tamaño (5 MB)
      // if (file.size > 5 * 1024 * 1024) {

      //   alert("El archivo es demasiado grande. Selecciona uno de menos de 5 MB.");
      //   return;
      // }

      const reader = new FileReader();

      // Mensaje para depurar el proceso
      console.log("Iniciando lectura del archivo...");

      reader.onload = () => {
        console.log("Lectura completada. Resultado Base64:");
        console.log(reader.result); // Muestra el resultado completo para depuración
        const base64Data = reader.result.split(",")[1];
        console.log("Base64 sin encabezado:", base64Data);

        setNewStand((prevData) => ({
          ...prevData,
          pdf: base64Data,
        }));
      };

      reader.onerror = () => {
        console.error("Error al leer el archivo:", reader.error);
        alert("Hubo un problema al leer el archivo. Intenta de nuevo.");
      };

      reader.readAsDataURL(file); // Convierte el archivo a Base64
    }
  };

  const handleStandSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("accessToken");
      console.log("Datos enviados:", newStand);

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
        pdf: null,
      });
    } catch (error) {
      console.error("Error al crear el stand:", error);
      setMessage(error.response?.data?.detail || "Error al crear el stand.");
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
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg mt-4">
        <h1 className="text-3xl font-bold mb-6 text-[#C7AA68]">Gestión de Stands</h1>
        {message && <p className="text-red-500">{message}</p>}

        <h2 className="text-2xl font-bold text-[#C7AA68] mt-4">Crear Nuevo Stand</h2>
        <form onSubmit={handleStandSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-200">Evento</label>
            <select
              name="event"
              value={newStand.event}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded"
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
          <div className="mb-4">
            <label className="block text-gray-200">Empresa</label>
            <select
              name="company"
              value={newStand.company}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded"
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
          <div className="mb-4">
            <label className="block text-gray-200">Tipo de Stand</label>
            <select
              name="type"
              value={newStand.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded"
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
          <div className="mb-4">
            <label className="block text-gray-200">Nombre del Stand</label>
            <input
              type="text"
              name="name"
              value={newStand.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200">Descripción</label>
            <textarea
              name="description"
              value={newStand.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded"
              rows="4"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-200">Posición</label>
            <input
              type="number"
              name="position"
              value={newStand.position}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200">Archivo Catálogo (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-[#C7AA68] text-gray-900 py-2 rounded hover:bg-[#9E8A52] transition duration-300"
          >
            Crear Stand
          </button>
        </form>

        <h2 className="text-2xl font-bold text-[#C7AA68] mt-4">Listado de Stands</h2>
        <ul>
          {stands.map((stand) => (
            <li key={stand.id} className="bg-gray-700 p-4 mb-2 rounded">
              <strong>{stand.name}</strong> - Evento: {stand.event.name} - Empresa: {stand.company.name} - Tipo: {stand.type} - Posición: {stand.position}
              <p>{stand.description}</p>
              <button
                onClick={() => handleDelete(stand.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 mt-2"
              >
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
