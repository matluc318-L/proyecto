const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "";
const STAFF_USER = process.env.STAFF_USER || "secretaria";
const STAFF_PASS = process.env.STAFF_PASS || "123456";
const allowedOrigins = FRONTEND_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const activeTokens = new Set();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origen no permitido por CORS."));
    }
  })
);
app.use(express.json());

const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS visitas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo_visita TEXT UNIQUE NOT NULL,
      dni TEXT NOT NULL,
      celular TEXT NOT NULL,
      nombres TEXT NOT NULL,
      apellidos TEXT NOT NULL,
      motivo TEXT NOT NULL,
      tipo_persona_visitar TEXT NOT NULL,
      nombre_persona_visitar TEXT NOT NULL,
      grado TEXT NOT NULL,
      seccion TEXT NOT NULL,
      scheduled_visit_at TEXT,
      slot_key TEXT,
      fecha_hora_entrada TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.run("ALTER TABLE visitas ADD COLUMN scheduled_visit_at TEXT", () => {});
  db.run("ALTER TABLE visitas ADD COLUMN slot_key TEXT", () => {});
  db.run("CREATE UNIQUE INDEX IF NOT EXISTS idx_visitas_slot_key ON visitas(slot_key)");
});

function generarCodigoVisita() {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const random4 = String(Math.floor(1000 + Math.random() * 9000));
  return `V-${yyyy}${mm}${dd}-${random4}`;
}

function validarPayload(payload) {
  const requiredFields = [
    "dni",
    "celular",
    "nombres",
    "apellidos",
    "motivo",
    "tipo_persona_visitar",
    "nombre_persona_visitar",
    "grado",
    "seccion",
    "fecha_visita",
    "hora_visita"
  ];

  for (const field of requiredFields) {
    if (!payload[field] || String(payload[field]).trim() === "") {
      return `El campo "${field}" es obligatorio.`;
    }
  }

  if (!/^\d{8}$/.test(payload.dni)) {
    return "El DNI debe tener exactamente 8 digitos numericos.";
  }

  if (!/^\d{9,15}$/.test(payload.celular)) {
    return "El celular debe tener entre 9 y 15 digitos numericos.";
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.fecha_visita)) {
    return "La fecha de visita no es valida.";
  }

  if (!/^\d{2}:00$/.test(payload.hora_visita)) {
    return "La hora debe estar en formato de hora exacta.";
  }

  const hour = Number(payload.hora_visita.split(":")[0]);
  if (hour < 10 || hour > 17) {
    return "La hora de visita debe estar entre las 10:00 y 18:00.";
  }

  return null;
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token || !activeTokens.has(token)) {
    return res.status(401).json({ error: "No autorizado." });
  }
  return next();
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/staff/login", (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "").trim();

  if (username !== STAFF_USER || password !== STAFF_PASS) {
    return res.status(401).json({ error: "Credenciales incorrectas." });
  }

  const token = crypto.randomBytes(24).toString("hex");
  activeTokens.add(token);
  return res.json({ token, username });
});

app.post("/api/visitas", (req, res) => {
  const payload = {
    dni: String(req.body.dni || "").trim(),
    celular: String(req.body.celular || "").trim(),
    nombres: String(req.body.nombres || "").trim(),
    apellidos: String(req.body.apellidos || "").trim(),
    motivo: String(req.body.motivo || "").trim(),
    tipo_persona_visitar: String(req.body.tipo_persona_visitar || "").trim(),
    nombre_persona_visitar: String(req.body.nombre_persona_visitar || "").trim(),
    grado: String(req.body.grado || "").trim(),
    seccion: String(req.body.seccion || "").trim(),
    fecha_visita: String(req.body.fecha_visita || "").trim(),
    hora_visita: String(req.body.hora_visita || "").trim()
  };

  const validationError = validarPayload(payload);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const fechaHoraEntrada = new Date().toISOString();
  const scheduledVisitAt = new Date(`${payload.fecha_visita}T${payload.hora_visita}:00`).toISOString();
  const slotKey = `${payload.fecha_visita} ${payload.hora_visita}`;
  const codigoVisita = generarCodigoVisita();

  const sql = `
    INSERT INTO visitas (
      codigo_visita, dni, celular, nombres, apellidos, motivo,
      tipo_persona_visitar, nombre_persona_visitar, grado, seccion, scheduled_visit_at, slot_key, fecha_hora_entrada
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    codigoVisita,
    payload.dni,
    payload.celular,
    payload.nombres,
    payload.apellidos,
    payload.motivo,
    payload.tipo_persona_visitar,
    payload.nombre_persona_visitar,
    payload.grado,
    payload.seccion,
    scheduledVisitAt,
    slotKey,
    fechaHoraEntrada
  ];

  db.run(sql, params, function onInsert(err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(409).json({ error: "Fecha no disponible. Selecciona otra hora para la visita." });
      }
      return res.status(500).json({ error: "No se pudo registrar la visita." });
    }

    return res.status(201).json({
      id: this.lastID,
      codigo_visita: codigoVisita,
      scheduled_visit_at: scheduledVisitAt,
      fecha_hora_entrada: fechaHoraEntrada,
      ...payload
    });
  });
});

app.get("/api/visitas", authMiddleware, (_req, res) => {
  db.all(
    "SELECT * FROM visitas ORDER BY COALESCE(scheduled_visit_at, fecha_hora_entrada) DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "No se pudieron listar las visitas." });
      }
      return res.json(rows);
    }
  );
});

app.get("/api/visitas/:codigo", (req, res) => {
  const { codigo } = req.params;
  db.get("SELECT * FROM visitas WHERE codigo_visita = ?", [codigo], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Error al consultar la visita." });
    }
    if (!row) {
      return res.status(404).json({ error: "No se encontro la visita." });
    }
    return res.json(row);
  });
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
