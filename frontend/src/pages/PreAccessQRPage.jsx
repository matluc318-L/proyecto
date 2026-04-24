import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

function PreAccessQRPage() {
  const inicioUrl = `${window.location.origin}${window.location.pathname}#/inicio`;

  return (
    <main className="container center">
      <h1>Acceso al registro</h1>
      <p>Escanea este codigo QR para ir al inicio del sistema y registrar tu visita.</p>
      <div className="card">
        <QRCodeCanvas value={inicioUrl} size={220} includeMargin />
      </div>
      <p className="mono">{inicioUrl}</p>
      <Link className="button" to="/inicio">
        Ir al inicio
      </Link>
    </main>
  );
}

export default PreAccessQRPage;
