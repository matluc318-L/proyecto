import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <main className="container">
      <section className="landing-hero card">
        <span className="badge">Sistema institucional</span>
        <h1>Registro de visitas a la institucion educativa</h1>
        <p>
          Registra visitantes de forma rapida y ordenada. Al finalizar, el sistema genera un comprobante con
          codigo QR para control y verificacion.
        </p>

        <div className="hero-actions">
          <Link className="button" to="/registro">
            Comenzar registro
          </Link>
          <a className="button secondary" href="#vista-previa">
            Ver vista previa
          </a>
        </div>
      </section>

      <section className="card steps-grid">
        <article className="step-item">
          <h3>1. Completa el formulario</h3>
          <p>Ingresa DNI, celular, nombres y datos de la visita.</p>
        </article>
        <article className="step-item">
          <h3>2. Guardado automatico</h3>
          <p>La informacion se registra en la base de datos institucional.</p>
        </article>
        <article className="step-item">
          <h3>3. Comprobante con QR</h3>
          <p>Obtienes codigo de visita, QR y opciones para imprimir o descargar.</p>
        </article>
      </section>

      <section id="vista-previa" className="card">
        <h2>Lo que veras en la siguiente pagina</h2>
        <p>Asi lucira el formulario de registro y el comprobante final:</p>
        <div className="preview-grid">
          <article className="preview-card">
            <h3>Formulario de visitante</h3>
            <ul>
              <li>Campos obligatorios validados.</li>
              <li>Seleccion de tipo de persona, grado y seccion.</li>
              <li>Boton de registro con respuesta inmediata.</li>
            </ul>
          </article>
          <article className="preview-card">
            <h3>Comprobante generado</h3>
            <ul>
              <li>Codigo unico de visita.</li>
              <li>Fecha y hora de entrada.</li>
              <li>Codigo QR + imprimir + descargar.</li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
