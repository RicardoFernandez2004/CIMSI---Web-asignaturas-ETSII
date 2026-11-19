const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));


function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const users = [
  { id: '11111111-0000-0000-0000-000000000001', email: 'student1@alum.us.es', password: '1234', name: 'Carlos', surname: 'Gómez Ruiz', date_of_birth: '2001-05-14', role: 'student' },
  { id: '11111111-0000-0000-0000-000000000002', email: 'student2@alum.us.es', password: '1234', name: 'Ana', surname: 'Martínez Silva', date_of_birth: '2002-11-20', role: 'student' },
  { id: '11111111-0000-0000-0000-000000000004', email: 'admin@us.es', password: '1234', name: 'Admin', surname: 'System', date_of_birth: '1990-01-01', role: 'admin' },
];


const degrees = [
  { id: '22222222-0000-0000-0000-000000000410', code: 'G410', name: 'Ingeniería Informática – Ingeniería del Software', department: 'Lenguajes y Sistemas Informáticos', duration_years: 4 },
  { id: '22222222-0000-0000-0000-000000000420', code: 'G420', name: 'Ingeniería Informática – Ingeniería de Computadores', department: 'Arquitectura y Tecnología de Computadores', duration_years: 4 },
];

const subjects = [
  { id: '33333333-0000-0000-0000-000000000001', code: '2000001', name: 'Fundamentos de Programación', academic_year: 1, semester: 1, ects: 6, degree_id: '22222222-0000-0000-0000-000000000410' },
  { id: '33333333-0000-0000-0000-000000000002', code: '2000015', name: 'Bases de Datos', academic_year: 2, semester: 1, ects: 6, degree_id: '22222222-0000-0000-0000-000000000410' },
  { id: '33333333-0000-0000-0000-000000000003', code: '2000030', name: 'Sistemas Distribuidos', academic_year: 3, semester: 2, ects: 6, degree_id: '22222222-0000-0000-0000-000000000410' },
  { id: '33333333-0000-0000-0000-000000000004', code: '2050010', name: 'Estructura de Computadores', academic_year: 1, semester: 2, ects: 6, degree_id: '22222222-0000-0000-0000-000000000420' },
  { id: '33333333-0000-0000-0000-000000000005', code: '2050022', name: 'Redes de Computadores', academic_year: 2, semester: 2, ects: 6, degree_id: '22222222-0000-0000-0000-000000000420' },
];


const reviews = [
  { id: '55555555-0000-0000-0000-000000000001', subject_id: '33333333-0000-0000-0000-000000000002', student_grade: 8, general_rating: 5, difficulty_rating: 3, teaching_rating: 5, comments: 'Muy buena asignatura; los modelos relacionales quedan muy bien explicados.', is_anonymous: false, student_id: '11111111-0000-0000-0000-000000000001', created_at: '2026-11-01T10:00:00Z', updated_at: '2026-11-01T10:00:00Z' },
  { id: '55555555-0000-0000-0000-000000000002', subject_id: '33333333-0000-0000-0000-000000000003', student_grade: 7, general_rating: 4, difficulty_rating: 4, teaching_rating: 5, comments: 'Contenido interesante sobre contenedores en Docker, pero hay que echarle horas.', is_anonymous: false, student_id: '11111111-0000-0000-0000-000000000002', created_at: '2026-11-03T12:30:00Z', updated_at: '2026-11-03T12:30:00Z' },
  { id: '55555555-0000-0000-0000-000000000003', subject_id: '33333333-0000-0000-0000-000000000002', student_grade: 6, general_rating: 3, difficulty_rating: 4, teaching_rating: 3, comments: 'Las prácticas de SQL ayudan mucho, pero el examen es largo.', is_anonymous: true, student_id: null, created_at: '2026-11-05T09:15:00Z', updated_at: '2026-11-05T09:15:00Z' },
];


function userFromToken(token) {
  const id = token?.startsWith('mock-token.') ? token.slice('mock-token.'.length) : null;
  const user = users.find((u) => u.id === id);
  if (!user) throw httpError(401, 'Sesión no válida o caducada');
  return user;
}


const publicUser = ({ password, ...rest }) => rest;


// POST /api/auth/login
export async function login(email, password) {
  await wait();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw httpError(401, 'Correo o contraseña incorrectos');
  return { access_token: `mock-token.${user.id}`, token_type: 'bearer', expires_in: 3600 };
}

// POST /api/auth/register
export async function register(data) {
  await wait();
  if (users.some((u) => u.email === data.email)) throw httpError(400, 'Ese correo ya está registrado');
  const user = { ...data, id: crypto.randomUUID(), role: 'student', created_at: new Date().toISOString() };
  users.push(user);
  return {
    user: publicUser(user),
    token: { access_token: `mock-token.${user.id}`, token_type: 'bearer', expires_in: 3600 },
  };
}

// GET /api/auth/me
export async function getMe(token) {
  await wait(100);
  return publicUser(userFromToken(token));
}

// POST /api/auth/users/bulk
export async function getUsersBulk(ids) {
  await wait(100);
  return users.filter((u) => ids.includes(u.id)).map(({ id, name, surname }) => ({ id, name, surname }));
}

// GET /api/academic/degrees
export async function getDegrees() {
  await wait();
  return [...degrees];
}

// GET /api/academic/subjects?degree_id=...&academic_year=...
export async function getSubjects({ degree_id, academic_year } = {}) {
  await wait();
  return subjects.filter(
    (s) => (!degree_id || s.degree_id === degree_id) && (!academic_year || s.academic_year === Number(academic_year)),
  );
}

// GET /api/feedback/reviews?subject_id=...&student_id=...
export async function getReviews({ subject_id, student_id } = {}) {
  await wait();
  return reviews
    .filter((r) => (!subject_id || r.subject_id === subject_id) && (!student_id || r.student_id === student_id))
    .map(({ author_id, ...review }) => review); 
}

// POST /api/feedback/reviews
export async function createReview(token, data) {
  await wait();
  const user = userFromToken(token);
  if (user.role !== 'student') throw httpError(403, 'Solo los estudiantes pueden escribir reseñas');
  if (reviews.some((r) => r.subject_id === data.subject_id && r.author_id === user.id)) {
    throw httpError(409, 'Ya has valorado esta asignatura');
  }
  const now = new Date().toISOString();
  const review = {
    ...data,
    id: crypto.randomUUID(),
    student_id: data.is_anonymous ? null : user.id,
    author_id: user.id,
    created_at: now,
    updated_at: now,
  };
  reviews.push(review);
  return review;
}
