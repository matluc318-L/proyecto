import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VisitForm, { initialState } from "../components/VisitForm";
import { createVisit } from "../api";

function RegisterPage() {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function onChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const required = Object.entries(formData).filter(([, value]) => !String(value).trim());
    if (required.length > 0) {
      return "Todos los campos son obligatorios.";
    }

    if (!/^\d{8}$/.test(formData.dni)) {
      return "El DNI debe tener 8 digitos numericos.";
    }

    if (!/^\d{9,15}$/.test(formData.celular)) {
      return "El celular debe tener entre 9 y 15 digitos numericos.";
    }

    if (!formData.fecha_visita) {
      return "Debes seleccionar la fecha de visita.";
    }

    const today = new Date();
    const selected = new Date(`${formData.fecha_visita}T00:00:00`);
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (selected < minDate) {
      return "La fecha de visita no puede ser anterior a hoy.";
    }

    if (!formData.hora_visita) {
      return "Debes seleccionar la hora de visita.";
    }

    return "";
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");

    const validationMessage = validate();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      setLoading(true);
      const response = await createVisit(formData);
      navigate(`/comprobante/${response.codigo_visita}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>Formulario de registro de visitante</h1>
      <p>Completa todos los datos para generar tu comprobante con QR.</p>
      {error ? <p className="error">{error}</p> : null}
      <VisitForm formData={formData} onChange={onChange} onSubmit={onSubmit} loading={loading} />
    </main>
  );
}

export default RegisterPage;
