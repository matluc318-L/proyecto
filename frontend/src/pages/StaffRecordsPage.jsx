import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getAllVisits } from "../api";

function StaffRecordsPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("staffToken");
  const staffUser = localStorage.getItem("staffUser");

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        const data = await getAllVisits(token);
        if (!ignore) setRows(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (token) {
      load();
    }
    return () => {
      ignore = true;
    };
  }, [token]);

  function logout() {
    localStorage.removeItem("staffToken");
    localStorage.removeItem("staffUser");
    navigate("/login-personal");
  }

  if (!token) {
    return <Navigate to="/login-personal" replace />;
  }

  return (
    <main className="container">
      <div className="records-header">
        <div>
          <h1>Registros de visita</h1>
          <p>Usuario activo: {staffUser}</p>
        </div>
        <button className="button secondary" onClick={logout}>
          Cerrar sesion
        </button>
      </div>

      {loading ? <p>Cargando registros...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error ? (
        <div className="card table-wrap">
          <table className="visits-table">
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Visitante</th>
                <th>DNI</th>
                <th>Motivo</th>
                <th>Fecha visita</th>
                <th>Hora visita</th>
                <th>Registrado</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="7">No hay visitas registradas.</td>
                </tr>
              ) : (
                rows.map((row) => {
                  const scheduled = row.scheduled_visit_at ? new Date(row.scheduled_visit_at) : null;
                  return (
                    <tr key={row.id}>
                      <td>{row.codigo_visita}</td>
                      <td>
                        {row.nombres} {row.apellidos}
                      </td>
                      <td>{row.dni}</td>
                      <td>{row.motivo}</td>
                      <td>{scheduled ? scheduled.toLocaleDateString("es-PE") : "-"}</td>
                      <td>{scheduled ? scheduled.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                      <td>{new Date(row.fecha_hora_entrada).toLocaleString("es-PE")}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </main>
  );
}

export default StaffRecordsPage;
