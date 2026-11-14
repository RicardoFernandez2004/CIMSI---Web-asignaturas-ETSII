// =============================================================================
// api.js — ÚNICO punto de contacto entre el frontend y el backend.
//
// Las pantallas (pages/) nunca hacen fetch directamente: llaman a estas
// funciones. Así, cuando el backend real esté listo, solo cambiamos USE_MOCKS.
//
// Rutas reales (las reparte Nginx en la MV1):
//   /api/auth/*      -> Auth Service
//   /api/academic/*  -> Academic Service
//   /api/feedback/*  -> Feedback Service (MV2 y réplica en MV4)
// =============================================================================
import * as mock from './mockDb';

// true  -> usa los datos simulados de mockDb.js
// false -> llama al backend real
const USE_MOCKS = true;

// -----------------------------------------------------------------------------
// TOKEN JWT: se guarda en el navegador (localStorage) para no perder la sesión
// al recargar la página.
// -----------------------------------------------------------------------------
const TOKEN_KEY = 'cimsi_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const removeToken = () => localStorage.removeItem(TOKEN_KEY);

// -----------------------------------------------------------------------------
// request(): hace la petición HTTP real al backend.
//  - Añade la cabecera "Authorization: Bearer <token>" si hay sesión.
//  - Convierte el cuerpo a JSON.
//  - Si la respuesta es un error (4xx/5xx), lanza un Error con .status
// -----------------------------------------------------------------------------
async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401) removeToken(); // token caducado o inválido

    // FastAPI devuelve los errores como { "detail": "mensaje" }
    let message = `Error ${response.status}`;
    try {
      const data = await response.json();
      if (typeof data.detail === 'string') message = data.detail;
    } catch {
      // la respuesta no era JSON: nos quedamos con el mensaje genérico
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null; // 204 No Content (p. ej. al borrar)
  return response.json();
}

// Convierte { degree_id: 'abc', academic_year: 2 } en "?degree_id=abc&academic_year=2"
// (ignora los filtros vacíos)
function toQuery(params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') query.append(key, value);
  }
  const text = query.toString();
  return text ? `?${text}` : '';
}

// =============================================================================
// AUTH SERVICE — docs/contratos/contratos_auth_service.md
// =============================================================================
export async function login(email, password) {
  const data = USE_MOCKS
    ? await mock.login(email, password)
    : await request('POST', '/api/auth/login', { email, password });
  saveToken(data.access_token);
  return data;
}

export async function register(userData) {
  const data = USE_MOCKS
    ? await mock.register(userData)
    : await request('POST', '/api/auth/register', userData);
  saveToken(data.token.access_token);
  return data.user;
}

export function logout() {
  removeToken();
}

export function getMe() {
  return USE_MOCKS ? mock.getMe(getToken()) : request('GET', '/api/auth/me');
}

export function getUsersBulk(userIds) {
  return USE_MOCKS
    ? mock.getUsersBulk(userIds)
    : request('POST', '/api/auth/users/bulk', { user_ids: userIds });
}

// =============================================================================
// ACADEMIC SERVICE — docs/contratos/contratos_academic_service.md
// =============================================================================
export function getDegrees() {
  return USE_MOCKS ? mock.getDegrees() : request('GET', '/api/academic/degrees');
}

// filters: { degree_id, academic_year } (opcionales)
export function getSubjects(filters = {}) {
  return USE_MOCKS ? mock.getSubjects(filters) : request('GET', `/api/academic/subjects${toQuery(filters)}`);
}

// =============================================================================
// FEEDBACK SERVICE — docs/contratos/contratos_feedback_service.md
// =============================================================================
// filters: { subject_id, student_id } (opcionales)
export function getReviews(filters = {}) {
  return USE_MOCKS ? mock.getReviews(filters) : request('GET', `/api/feedback/reviews${toQuery(filters)}`);
}

export function createReview(reviewData) {
  return USE_MOCKS
    ? mock.createReview(getToken(), reviewData)
    : request('POST', '/api/feedback/reviews', reviewData);
}
