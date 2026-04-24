const initialState = {
  dni: "",
  celular: "",
  nombres: "",
  apellidos: "",
  motivo: "",
  tipo_persona_visitar: "",
  nombre_persona_visitar: "",
  grado: "",
  seccion: ""
};

export { initialState };

function VisitForm({ formData, onChange, onSubmit, loading }) {
  return (
    <form className="form card" onSubmit={onSubmit}>
      <h2 className="section-title">Datos del visitante</h2>
      <label>
        DNI
        <input name="dni" value={formData.dni} onChange={onChange} placeholder="12345678" />
      </label>

      <label>
        Celular
        <input name="celular" value={formData.celular} onChange={onChange} placeholder="999111222" />
      </label>

      <label>
        Nombres
        <input name="nombres" value={formData.nombres} onChange={onChange} placeholder="Juan" />
      </label>

      <label>
        Apellidos
        <input name="apellidos" value={formData.apellidos} onChange={onChange} placeholder="Perez" />
      </label>

      <h2 className="section-title">Datos de la visita</h2>
      <label>
        Motivo
        <input
          name="motivo"
          value={formData.motivo}
          onChange={onChange}
          placeholder="Entrega de documentos"
        />
      </label>

      <label>
        Tipo de persona a visitar
        <select
          name="tipo_persona_visitar"
          value={formData.tipo_persona_visitar}
          onChange={onChange}
        >
          <option value="">Selecciona una opcion</option>
          <option value="Docente">Docente</option>
          <option value="Coordinador">Coordinador</option>
          <option value="Direccion">Direccion</option>
          <option value="Administrativo">Administrativo</option>
        </select>
      </label>

      <label>
        Nombre de la persona a visitar
        <input
          name="nombre_persona_visitar"
          value={formData.nombre_persona_visitar}
          onChange={onChange}
          placeholder="Diego"
        />
      </label>

      <label>
        Grado
        <select name="grado" value={formData.grado} onChange={onChange}>
          <option value="">Selecciona un grado</option>
          <option value="Inicial">Inicial</option>
          <option value="1ro Primaria">1ro Primaria</option>
          <option value="2do Primaria">2do Primaria</option>
          <option value="3ro Primaria">3ro Primaria</option>
          <option value="4to Primaria">4to Primaria</option>
          <option value="5to Primaria">5to Primaria</option>
          <option value="6to Primaria">6to Primaria</option>
          <option value="1ro Secundaria">1ro Secundaria</option>
          <option value="2do Secundaria">2do Secundaria</option>
          <option value="3ro Secundaria">3ro Secundaria</option>
          <option value="4to Secundaria">4to Secundaria</option>
          <option value="5to Secundaria">5to Secundaria</option>
        </select>
      </label>

      <label>
        Seccion
        <select name="seccion" value={formData.seccion} onChange={onChange}>
          <option value="">Selecciona seccion</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </label>

      <button className="button" type="submit" disabled={loading}>
        {loading ? "Registrando..." : "Registrar visita"}
      </button>
    </form>
  );
}

export default VisitForm;
