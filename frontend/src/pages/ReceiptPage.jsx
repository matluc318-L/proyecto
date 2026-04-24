import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { getVisitByCode } from "../api";

function ReceiptPage() {
  const { codigo } = useParams();
  const [visit, setVisit] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchVisit() {
      try {
        setLoading(true);
        const data = await getVisitByCode(codigo);
        if (!ignore) setVisit(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchVisit();
    return () => {
      ignore = true;
    };
  }, [codigo]);

  const qrValue = useMemo(() => {
    if (!visit) return "";
    return JSON.stringify(
      {
        codigo_visita: visit.codigo_visita,
        dni: visit.dni,
        nombres: visit.nombres,
        apellidos: visit.apellidos,
        motivo: visit.motivo,
        fecha_hora_entrada: visit.fecha_hora_entrada
      },
      null,
      0
    );
  }, [visit]);

  function printReceipt() {
    window.print();
  }

  function downloadQR() {
    const canvas = document.getElementById("visit-qr");
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `${codigo}-qr.png`;
    link.click();
  }

  if (loading) {
    return (
      <main className="container">
        <p>Cargando comprobante...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <p className="error">{error}</p>
        <Link className="button" to="/registro">
          Volver al registro
        </Link>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Comprobante de visita</h1>
      <section className="card receipt">
        <p>
          <strong>Codigo de visita:</strong> {visit.codigo_visita}
        </p>
        <p>
          <strong>Visitante:</strong> {visit.nombres} {visit.apellidos}
        </p>
        <p>
          <strong>DNI:</strong> {visit.dni}
        </p>
        <p>
          <strong>Celular:</strong> {visit.celular}
        </p>
        <p>
          <strong>Motivo:</strong> {visit.motivo}
        </p>
        <p>
          <strong>Persona a visitar:</strong> {visit.tipo_persona_visitar} - {visit.nombre_persona_visitar}
        </p>
        <p>
          <strong>Grado y seccion:</strong> {visit.grado} - {visit.seccion}
        </p>
        <p>
          <strong>Fecha y hora de entrada:</strong> {new Date(visit.fecha_hora_entrada).toLocaleString("es-PE")}
        </p>

        <div className="qr-box">
          <QRCodeCanvas id="visit-qr" value={qrValue} size={220} includeMargin />
        </div>
      </section>

      <div className="actions">
        <button className="button" onClick={printReceipt}>
          Imprimir
        </button>
        <button className="button secondary" onClick={downloadQR}>
          Descargar QR
        </button>
        <Link className="button" to="/registro">
          Registrar otra visita
        </Link>
      </div>
    </main>
  );
}

export default ReceiptPage;
