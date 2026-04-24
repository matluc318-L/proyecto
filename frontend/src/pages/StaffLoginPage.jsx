import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { staffLogin } from "../api";

function StaffLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      setLoading(true);
      const result = await staffLogin({ username, password });
      localStorage.setItem("staffToken", result.token);
      localStorage.setItem("staffUser", result.username);
      navigate("/panel-registros");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>Ingreso de secretaria / personal asignado</h1>
      <p>Solo el personal autorizado puede revisar el historial de visitas registradas.</p>
      {error ? <p className="error">{error}</p> : null}
      <form className="card staff-form" onSubmit={onSubmit}>
        <label>
          Usuario
          <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="secretaria" />
        </label>
        <label>
          Contrasena
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="******"
          />
        </label>
        <button className="button" disabled={loading} type="submit">
          {loading ? "Ingresando..." : "Iniciar sesion"}
        </button>
      </form>
    </main>
  );
}

export default StaffLoginPage;
