const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export async function createVisit(data) {
  let response;
  try {
    response = await fetch(`${API_BASE}/visitas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  } catch (_error) {
    throw new Error("No se pudo conectar con el servidor. Verifica que el backend este ejecutandose.");
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "No se pudo registrar la visita.");
  }
  return payload;
}

export async function getVisitByCode(code) {
  let response;
  try {
    response = await fetch(`${API_BASE}/visitas/${code}`);
  } catch (_error) {
    throw new Error("No se pudo conectar con el servidor. Verifica que el backend este ejecutandose.");
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "No se pudo obtener la visita.");
  }
  return payload;
}
