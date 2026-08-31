(() => {
  'use strict';

  const STORAGE_KEY = 'rumbo:encrypted-vault:v1';
  const TRUST_KEY = 'rumbo:trusted-browser';
  const DEVICE_KEY = 'rumbo:device-key';
  const ACCESS_PIN = '0808';
  const PBKDF2_ITERATIONS = 160000;

  const COURSES = [
    { id: 'is286', code: 'IS-286', name: 'Modelado y Análisis de Software', color: '#22d3ee', hours: 6, source: '08deebed-2242-49ec-805a-dbcf2dccabb2.pdf', provisional: true, weights: [{ name: 'IUPP · criterios por confirmar', weight: 100 }] },
    { id: 'is380', code: 'IS-380', name: 'Sistemas operativos', color: '#a3e635', hours: 5, source: '08deebed-3c59-4468-8e5f-20c836c95d1a.pdf', provisional: true, weights: [{ name: 'IUPP · criterios por confirmar', weight: 100 }] },
    { id: 'is384', code: 'IS-384', name: 'Sistemas digitales y arquitectura de computadoras', color: '#f59e0b', hours: 6, source: '08deebed-3e89-46d3-841a-1077815f914f.pdf', provisional: true, weights: [{ name: 'IUPP · criterios por confirmar', weight: 100 }] },
    { id: 'is386', code: 'IS-386', name: 'Innovación tecnológica, creatividad y emprendimiento', color: '#fb7185', hours: 4, source: '08def703-15d4-43c6-8ac8-8625432715f3.pdf', provisional: true, weights: [{ name: 'IUPP · criterios por confirmar', weight: 100 }] },
    { id: 'ps182', code: 'PS-182', name: 'Psicología y desarrollo humano', color: '#c084fc', hours: 4, source: 'Silabo_-_PS-182_-_Psicologia_y_desarrollo_Humano.pdf', provisional: false, weights: [{ name: 'Primer examen', weight: 33 }, { name: 'Segundo examen', weight: 33 }, { name: 'Trabajo grupal', weight: 34 }] }
  ];

  const SESSIONS = [
    { id: 'mon-is386', courseId: 'is386', day: 0, start: 7, end: 9, type: 'Práctica', status: 'pending', note: 'Falta definir' },
    { id: 'mon-is380', courseId: 'is380', day: 0, start: 9, end: 10, type: 'Teoría', status: 'confirmed', note: 'Horario indicado' },
    { id: 'tue-is286', courseId: 'is286', day: 1, start: 9, end: 11, type: 'Teoría', status: 'confirmed', note: 'Horario indicado' },
    { id: 'tue-is380', courseId: 'is380', day: 1, start: 9, end: 11, type: 'Teoría', status: 'confirmed', note: 'Horario indicado' },
    { id: 'tue-ps182', courseId: 'ps182', day: 1, start: 14, end: 16, type: 'Teoría', status: 'confirmed', note: 'Horario indicado' },
    { id: 'tue-is384', courseId: 'is384', day: 1, start: 16, end: 18, type: 'Teoría', status: 'confirmed', note: 'Horario indicado' },
    { id: 'fri-is286', courseId: 'is286', day: 4, start: 9, end: 11, type: 'Laboratorio', status: 'pending', note: 'Aún esperando confirmación' },
    { id: 'fri-is384', courseId: 'is384', day: 4, start: 14, end: 16, type: 'Práctica', status: 'pending', note: 'Laboratorio por definir' },
    { id: 'fri-ps182', courseId: 'ps182', day: 4, start: 18, end: 20, type: 'Práctica', status: 'pending', note: 'Nada estático' }
  ];
  const UNSCHEDULED = [{ courseId: 'is380', type: 'Práctica', note: 'Día y hora por definir' }];

  const ACADEMIC_DATES = [
    { date: '03–05 ago', label: 'Publicación de horarios proyectados', detail: 'Horarios teóricos y prácticos proyectados por las Escuelas Profesionales.', tone: 'muted' },
    { date: '10–11 ago', label: 'Matrícula regular', detail: 'Generación de esquemas de pago, pagos y matrícula regular.', tone: 'muted' },
    { date: '10–13 ago', label: 'Nivelación, rectificación y validación', detail: 'Solicitudes de nivelación, rectificación presencial y validación de pagos.', tone: 'muted' },
    { date: '14 ago', label: 'Citación extraordinaria', detail: 'Reajuste de carga académica con número real de matriculados.', tone: 'muted' },
    { date: '17 ago', label: 'Reajuste de carga académica', detail: 'Remisión a la DGA por los Directores de Departamento Académico.', tone: 'muted' },
    { date: '18–21 ago', label: 'Revisión del reajuste', detail: 'Revisión técnica y publicación de horarios con número real de matriculados.', tone: 'muted' },
    { date: '24–28 ago', label: 'Horario final reajustado', detail: 'Publicación del horario final por las Escuelas Profesionales.', tone: 'muted' },
    { date: '24 ago–04 sep', label: 'Sílabos y ponderaciones', detail: 'Subida de sílabos y ponderación de criterios de evaluación en el SIIGE.', tone: 'cyan' },
    { date: '31 ago', label: 'Inicio de clases', detail: 'Inicio del semestre académico 2026-II · presencial.', tone: 'cyan', featured: true },
    { date: '07 sep–30 oct', label: 'Exoneración de cursos', detail: 'Presentación de solicitudes, remisión de expedientes y administración de exámenes de exoneración.', tone: 'amber', featured: true },
    { date: '07 sep–30 oct', label: 'Cursos únicos', detail: 'Solicitudes, expedientes y administración de exámenes de cursos únicos.', tone: 'muted' },
    { date: '26 sep–04 oct', label: 'Olimpiadas deportivas inter escuelas', detail: 'Actividad institucional.', tone: 'muted' },
    { date: '05–09 oct', label: 'Proyección académica 2027-I', detail: 'Proyección del número de estudiantes por asignatura.', tone: 'muted' },
    { date: '12–16 oct', label: 'Petición de cursos 2027-I', detail: 'Las Escuelas Profesionales solicitan cursos a los Departamentos Académicos.', tone: 'muted' },
    { date: '19–23 oct', label: 'Distribución de carga 2027-I', detail: 'Elaboración y remisión de la distribución de carga académica.', tone: 'muted' },
    { date: '26–30 oct', label: 'Evaluación de distribución', detail: 'Evaluación de la distribución de asignaturas por la DGA.', tone: 'muted' },
    { date: '26 oct–06 nov', label: 'Cuestionario de desempeño docente', detail: 'Llenado virtual en el SIIGE.', tone: 'muted' },
    { date: '09–13 nov', label: 'Horarios 2027-I', detail: 'Elaboración de horarios proyectados de clases teóricas y prácticas.', tone: 'muted' },
    { date: '18–20 nov', label: 'Desmatrícula', detail: 'Desmatrícula previa generación de esquemas de pago en el SIIGE.', tone: 'muted' },
    { date: '16–17 dic', label: 'Programación de sustitutorios', detail: 'Programación de fecha, hora y lugar de exámenes sustitutorios.', tone: 'muted' },
    { date: '18 dic', label: 'Subida de notas al SIIGE', detail: 'Registro de evaluaciones sin publicación de notas.', tone: 'muted' },
    { date: '21–22 dic', label: 'Exámenes sustitutorios', detail: 'Administración de exámenes sustitutorios en las Escuelas Profesionales.', tone: 'amber' },
    { date: '23 dic', label: 'Fin de clases y notas finales', detail: 'Finalización de clases y publicación de notas finales de cursos regulares.', tone: 'cyan', featured: true },
    { date: '24 dic', label: 'Programación de aplazados', detail: 'Programación de exámenes aplazados por los Departamentos Académicos.', tone: 'muted' },
    { date: '28 dic', label: 'Matrícula para aplazados', detail: 'Fecha incorporada desde el chat “Acelera carrera Ingeniería Sistemas”.', tone: 'muted', fromChat: true },
    { date: '29–30 dic', label: 'Exámenes aplazados', detail: 'Periodo incorporado desde el chat “Acelera carrera Ingeniería Sistemas”.', tone: 'muted', fromChat: true }
  ];

  const DEFAULT_STATE = {
    grades: {},
    tasks: [
      { id: 't1', title: 'Pedir confirmación de práctica IS-380', courseId: 'is380', date: '2026-09-04', priority: 'Alta', reminder: true, done: false },
      { id: 't2', title: 'Guardar ponderaciones de cada sílabo', courseId: 'ps182', date: '2026-09-04', priority: 'Alta', reminder: true, done: false },
      { id: 't3', title: 'Revisar requisitos de exoneración', courseId: 'personal', date: '2026-09-07', priority: 'Media', reminder: true, done: false }
    ],
    books: [
      { id: 'b1', title: 'Sílabo PS-182 · base de notas', author: 'Documento de curso', courseId: 'ps182', status: 'En revisión' },
      { id: 'b2', title: 'Operating System Concepts', author: 'Silberschatz · referencia', courseId: 'is380', status: 'Por leer' }
    ],
    projects: [
      { id: 'p1', title: 'Panel de horario 2026-II', courseId: 'personal', status: 'En progreso', note: 'Publicar versión para uso diario' },
      { id: 'p2', title: 'Idea de emprendimiento tecnológico', courseId: 'is386', status: 'Idea', note: 'Definir problema y usuario' }
    ]
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));
  let state = clone(DEFAULT_STATE);
  let vaultKey = null;
  let selectedWeekStart = new Date(2026, 7, 31);

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const courseById = (id) => COURSES.find((course) => course.id === id);
  const courseName = (id) => courseById(id)?.code || (id === 'personal' ? 'Personal' : 'Sin curso');
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  function bytesToBase64(bytes) { return btoa(String.fromCharCode(...new Uint8Array(bytes))); }
  function base64ToBytes(value) { return Uint8Array.from(atob(value), (char) => char.charCodeAt(0)); }
  function bufferToBase64(buffer) { return bytesToBase64(new Uint8Array(buffer)); }
  function localDate(iso) {
    if (!iso) return null;
    const [year, month, day] = iso.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  function formatShortDate(iso) {
    const date = localDate(iso);
    if (!date) return 'Sin fecha';
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }).replace('.', '');
  }
  function formatWeekDate(date) { return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }).replace('.', ''); }
  function addDays(date, days) { const next = new Date(date); next.setDate(next.getDate() + days); return next; }
  function normalizeState(saved) {
    const base = clone(DEFAULT_STATE);
    return { ...base, ...saved, grades: saved.grades || {}, tasks: saved.tasks || [], books: saved.books || [], projects: saved.projects || [] };
  }

  async function deriveKey(password, salt) {
    const encoded = new TextEncoder().encode(password);
    const baseKey = await crypto.subtle.importKey('raw', encoded, 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' }, baseKey, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  }
  async function deriveVerifier(password, salt) {
    const encoded = new TextEncoder().encode(password);
    const baseKey = await crypto.subtle.importKey('raw', encoded, 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' }, baseKey, 256);
    return bufferToBase64(bits);
  }
  async function encryptState(key, nextState) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const payload = new TextEncoder().encode(JSON.stringify(nextState));
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, payload);
    return JSON.stringify({ iv: bufferToBase64(iv), ciphertext: bufferToBase64(ciphertext) });
  }
  async function decryptState(key, vault) {
    const raw = JSON.parse(vault);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(raw.iv) }, key, base64ToBytes(raw.ciphertext));
    return normalizeState(JSON.parse(new TextDecoder().decode(decrypted)));
  }
  async function saveVault() {
    if (!vaultKey) return;
    localStorage.setItem(STORAGE_KEY, await encryptState(vaultKey, state));
  }
  async function createVault(password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    vaultKey = await deriveKey(password, salt);
    await saveVault();
    // The local vault is still encrypted so the planner data is not stored as plain JSON.
    localStorage.setItem(`${STORAGE_KEY}:meta`, JSON.stringify({ salt: bufferToBase64(salt), verifier: await deriveVerifier(password, salt) }));
  }
  async function importVault(password) {
    const metaRaw = localStorage.getItem(`${STORAGE_KEY}:meta`);
    if (metaRaw) {
      const meta = JSON.parse(metaRaw);
      const verifier = await deriveVerifier(password, base64ToBytes(meta.salt));
      if (verifier !== meta.verifier) throw new Error('Contraseña incorrecta');
      vaultKey = await deriveKey(password, base64ToBytes(meta.salt));
    } else {
      throw new Error('Este navegador aún no tiene una bóveda configurada');
    }
    const vault = localStorage.getItem(STORAGE_KEY);
    if (vault) state = await decryptState(vaultKey, vault);
    else await saveVault();
  }
  async function tryTrustedUnlock() {
    const storedKey = localStorage.getItem(DEVICE_KEY);
    if (localStorage.getItem(TRUST_KEY) !== 'true' || !storedKey || !localStorage.getItem(STORAGE_KEY)) return false;
    try {
      vaultKey = await crypto.subtle.importKey('raw', base64ToBytes(storedKey), { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
      state = await decryptState(vaultKey, localStorage.getItem(STORAGE_KEY));
      return true;
    } catch {
      localStorage.removeItem(TRUST_KEY);
      localStorage.removeItem(DEVICE_KEY);
      return false;
    }
  }
  async function rememberThisBrowser() {
    const exported = await crypto.subtle.exportKey('raw', vaultKey);
    localStorage.setItem(DEVICE_KEY, bufferToBase64(exported));
    localStorage.setItem(TRUST_KEY, 'true');
  }
  function forgetTrustedBrowser() { localStorage.removeItem(TRUST_KEY); localStorage.removeItem(DEVICE_KEY); }

  function openApp() {
    $('#lock-screen').classList.add('is-hidden');
    $('#app-shell').classList.remove('is-locked');
    $('#app-shell').setAttribute('aria-hidden', 'false');
    renderAll();
  }
  function lockNow() {
    forgetTrustedBrowser();
    vaultKey = null;
    $('#app-shell').classList.add('is-locked');
    $('#app-shell').setAttribute('aria-hidden', 'true');
    $('#lock-screen').classList.remove('is-hidden');
    $('#auth-form').reset();
    configureAuthScreen(false);
    updatePinDisplay();
    $('#access-password').focus();
  }
  function configureAuthScreen(isReturning = false) {
    const hasLocalVault = Boolean(localStorage.getItem(STORAGE_KEY));
    $('#auth-button-label').textContent = 'Desbloquear';
    $('#auth-copy').textContent = hasLocalVault ? 'Ingresa tu PIN de 4 dígitos para abrir tus datos. Este navegador será reconocido solo si eliges recordarlo.' : 'Ingresa tu PIN de 4 dígitos para abrir tu espacio académico.';
    $('#auth-footnote').textContent = 'PIN de acceso · 4 dígitos · navegador reconocido';
    if (isReturning) $('#access-password').placeholder = '••••';
  }
  async function handleAuth(event) {
    event.preventDefault();
    const password = $('#access-password').value;
    const error = $('#auth-error');
    error.textContent = '';
    try {
      if (!/^\d{4}$/.test(password)) throw new Error('Ingresa los 4 dígitos del PIN.');
      if (password !== ACCESS_PIN) throw new Error('PIN incorrecto.');
      const hasVault = Boolean(localStorage.getItem(STORAGE_KEY));
      if (hasVault) await importVault(password); else await createVault(password);
      if ($('#remember-device').checked) await rememberThisBrowser(); else forgetTrustedBrowser();
      openApp();
    } catch (authError) {
      error.textContent = authError.message || 'No se pudo abrir el espacio.';
      $('#access-password').value = '';
      updatePinDisplay();
    }
  }

  function setPinValue(nextValue, submitWhenComplete = true) {
    const input = $('#access-password');
    input.value = String(nextValue).replace(/\D/g, '').slice(0, 4);
    updatePinDisplay();
    if (submitWhenComplete && input.value.length === 4) window.setTimeout(() => $('#auth-form').requestSubmit(), 110);
  }

  function showView(viewName) {
    $$('.view').forEach((view) => {
      const active = view.dataset.viewPanel === viewName;
      view.hidden = !active;
      view.classList.toggle('is-visible', active);
    });
    $$('.nav-item').forEach((item) => item.classList.toggle('is-active', item.dataset.view === viewName));
    if (viewName === 'horario') renderCalendar();
    if (viewName === 'notas') renderGrades();
    if (viewName === 'plan') renderPlan();
    if (viewName === 'fechas') renderDates();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderAll() {
    configureAuthScreen(true);
    populateCourseSelects();
    renderCalendar();
    renderGrades();
    renderPlan();
    renderDates();
    updateTaskMetric();
  }
  function populateCourseSelects() {
    const options = `<option value="personal">Personal</option>${COURSES.map((course) => `<option value="${course.id}">${course.code} · ${escapeHTML(course.name)}</option>`).join('')}`;
    ['task-course', 'book-course', 'project-course'].forEach((id) => { const select = $(`#${id}`); if (select) select.innerHTML = options; });
  }
  function updateTaskMetric() { $('#metric-tasks').textContent = String(state.tasks.filter((task) => !task.done).length).padStart(2, '0'); }

  function renderCalendar() {
    const grid = $('#calendar-grid');
    if (!grid) return;
    const days = Array.from({ length: 7 }, (_, index) => addDays(selectedWeekStart, index));
    grid.innerHTML = '';
    const timeHeader = document.createElement('div');
    timeHeader.className = 'calendar-corner';
    timeHeader.textContent = 'Hora';
    grid.append(timeHeader);
    days.forEach((day, index) => {
      const header = document.createElement('div');
      header.className = `day-header ${index === 0 ? 'is-today' : ''}`;
      header.innerHTML = `<span>${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][index]}</span><strong>${day.getDate()}</strong><small>${day.toLocaleDateString('es-PE', { month: 'short' }).replace('.', '')}</small>`;
      grid.append(header);
    });
    for (let hour = 7; hour < 20; hour += 1) {
      const time = document.createElement('div');
      time.className = 'time-label';
      time.style.gridRow = String(hour - 7 + 2);
      time.textContent = `${String(hour).padStart(2, '0')}:00`;
      grid.append(time);
      days.forEach((_, dayIndex) => {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        cell.style.gridColumn = String(dayIndex + 2);
        cell.style.gridRow = String(hour - 7 + 2);
        grid.append(cell);
      });
    }
    const byDay = Array.from({ length: 7 }, () => []);
    SESSIONS.forEach((session) => byDay[session.day].push(session));
    SESSIONS.forEach((session) => {
      const course = courseById(session.courseId);
      const conflict = byDay[session.day].some((other) => other.id !== session.id && session.start < other.end && session.end > other.start);
      const event = document.createElement('article');
      event.className = `schedule-event ${session.status === 'pending' ? 'is-pending' : ''} ${conflict ? 'is-conflict' : ''}`;
      event.style.gridColumn = String(session.day + 2);
      event.style.gridRow = `${session.start - 7 + 2} / span ${session.end - session.start}`;
      event.style.setProperty('--course-color', course.color);
      event.innerHTML = `<div class="event-stripe"></div><div class="event-code">${course.code} ${conflict ? '<span class="conflict-tag">Cruce</span>' : ''}</div><strong>${escapeHTML(session.type)}</strong><span class="event-time">${String(session.start).padStart(2, '0')}:00 – ${String(session.end).padStart(2, '0')}:00</span><span class="event-status">${session.status === 'pending' ? 'Pendiente · ' : ''}${escapeHTML(session.note)}</span>`;
      grid.append(event);
    });
    const confirmedHours = SESSIONS.filter((session) => session.status === 'confirmed').reduce((sum, session) => sum + session.end - session.start, 0);
    const pendingHours = SESSIONS.filter((session) => session.status === 'pending').reduce((sum, session) => sum + session.end - session.start, 0);
    $('#schedule-total').textContent = `${confirmedHours} h confirmadas · ${pendingHours} h provisionales · ${UNSCHEDULED.length} sin horario`;
    $('#week-current').textContent = `${formatWeekDate(days[0])} — ${formatWeekDate(days[6])}`;
  }

  function courseAverage(course) {
    const entries = state.grades[course.id] || {};
    let knownWeight = 0;
    let contribution = 0;
    course.weights.forEach((item, index) => {
      const note = Number(entries[index]);
      if (Number.isFinite(note) && note >= 0 && note <= 20) {
        knownWeight += item.weight;
        contribution += note * (item.weight / 100);
      }
    });
    const remainingWeight = 100 - knownWeight;
    const projected = knownWeight ? contribution / (knownWeight / 100) : null;
    const final = remainingWeight === 0 ? contribution : null;
    const needed = remainingWeight > 0 ? Math.max(0, Math.min(20, (11 - contribution) / (remainingWeight / 100))) : null;
    return { knownWeight, contribution, remainingWeight, projected, final, needed };
  }
  function renderGrades() {
    const container = $('#course-grade-grid');
    if (!container) return;
    container.innerHTML = COURSES.map((course, courseIndex) => {
      const entries = state.grades[course.id] || {};
      const result = courseAverage(course);
      const scoreLabel = result.final !== null ? result.final.toFixed(2) : result.projected !== null ? `${result.projected.toFixed(2)}*` : '—';
      const note = result.final !== null ? (result.final >= 10.5 ? 'Aprobación estimada' : 'Requiere refuerzo') : result.knownWeight ? `${result.knownWeight}% cargado · fórmula parcial` : 'Aún sin evaluaciones';
      const fields = course.weights.map((item, index) => `<div class="grade-row"><div><strong>${escapeHTML(item.name)}</strong><span>${item.weight}% del curso</span></div><input class="grade-input focus-glow" data-course="${course.id}" data-grade-index="${index}" type="number" min="0" max="20" step="0.1" inputmode="decimal" value="${entries[index] ?? ''}" placeholder="—" aria-label="Nota de ${escapeHTML(item.name)}" /></div>`).join('');
      const needed = result.needed === null ? result.final !== null ? 'Ponderación completa' : '—' : result.needed.toFixed(2);
      return `<article class="grade-card panel fade-up" style="--delay:${courseIndex * 55}ms;--course-color:${course.color}"><div class="grade-card-head"><div><span class="course-kicker">${course.code}</span><h2>${escapeHTML(course.name)}</h2></div><div class="course-score"><strong>${scoreLabel}</strong><span>/ 20</span></div></div><div class="grade-badges"><span class="course-dot" style="background:${course.color}"></span><span>${course.provisional ? 'Ponderación IUPP · por configurar' : 'Ponderación cargada desde sílabo'}</span><span class="grade-status">${note}</span></div><div class="grade-rows">${fields}</div><div class="grade-card-foot"><span>Para llegar a 11: <strong>${needed}${result.needed !== null ? ' en lo restante' : ''}</strong></span><span class="grade-source">${escapeHTML(course.source)}</span></div></article>`;
    }).join('');
    $$('.grade-input').forEach((input) => input.addEventListener('change', handleGradeChange));
    updateOverallGrade();
  }
  async function handleGradeChange(event) {
    const input = event.currentTarget;
    let value = input.value === '' ? null : Number(input.value);
    if (value !== null) value = Math.max(0, Math.min(20, value));
    const courseId = input.dataset.course;
    const index = input.dataset.gradeIndex;
    state.grades[courseId] = state.grades[courseId] || {};
    if (value === null) delete state.grades[courseId][index]; else state.grades[courseId][index] = value;
    await saveVault();
    renderGrades();
  }
  function updateOverallGrade() {
    const complete = COURSES.map(courseAverage).filter((result) => result.final !== null);
    const average = complete.length ? complete.reduce((sum, result) => sum + result.final, 0) / complete.length : null;
    $('#overall-average').textContent = average === null ? '—' : average.toFixed(2);
    $('#overall-status').textContent = average === null ? 'Completa las evaluaciones de un curso para ver el promedio.' : `${complete.length} de ${COURSES.length} cursos con ponderación completa.`;
    $('#overall-progress').style.width = `${average === null ? 0 : Math.min(100, average * 5)}%`;
  }

  function renderPlan() {
    const taskList = $('#task-list');
    const bookList = $('#book-list');
    const projectList = $('#project-list');
    if (!taskList || !bookList || !projectList) return;
    const tasks = [...state.tasks].sort((a, b) => Number(a.done) - Number(b.done) || (a.date || '9999').localeCompare(b.date || '9999'));
    taskList.innerHTML = tasks.length ? tasks.map((task) => `<article class="plan-item ${task.done ? 'is-done' : ''}"><label class="task-check"><input type="checkbox" data-task-toggle="${task.id}" ${task.done ? 'checked' : ''} /><span></span></label><div class="plan-item-copy"><strong>${escapeHTML(task.title)}</strong><span>${courseName(task.courseId)} · ${formatShortDate(task.date)}${task.reminder ? ' · recordatorio' : ''}</span></div><span class="priority priority-${task.priority.toLowerCase()}">${task.priority}</span><button class="item-delete" data-delete-type="task" data-delete-id="${task.id}" type="button" aria-label="Eliminar tarea">×</button></article>`).join('') : '<div class="empty-state"><span>✓</span><p>Todo despejado por aquí.</p></div>';
    bookList.innerHTML = state.books.length ? state.books.map((book) => `<article class="plan-item book-item"><div class="book-spine" style="background:${courseById(book.courseId)?.color || '#22d3ee'}"></div><div class="plan-item-copy"><strong>${escapeHTML(book.title)}</strong><span>${escapeHTML(book.author || 'Sin autor')} · ${courseName(book.courseId)}</span></div><span class="status-label">${escapeHTML(book.status)}</span><button class="item-delete" data-delete-type="book" data-delete-id="${book.id}" type="button" aria-label="Eliminar recurso">×</button></article>`).join('') : '<div class="empty-state"><span>＋</span><p>Añade tu primera referencia.</p></div>';
    projectList.innerHTML = state.projects.length ? state.projects.map((project) => `<article class="project-item"><div class="project-orbit" style="--course-color:${courseById(project.courseId)?.color || '#22d3ee'}"><span></span></div><div class="plan-item-copy"><strong>${escapeHTML(project.title)}</strong><span>${courseName(project.courseId)} · ${escapeHTML(project.note || 'Sin próximo entregable')}</span></div><span class="status-label status-${project.status.toLowerCase().replaceAll(' ', '-')}">${escapeHTML(project.status)}</span><button class="item-delete" data-delete-type="project" data-delete-id="${project.id}" type="button" aria-label="Eliminar proyecto">×</button></article>`).join('') : '<div class="empty-state"><span>＋</span><p>Empieza un proyecto pequeño.</p></div>';
    $$('[data-task-toggle]').forEach((input) => input.addEventListener('change', handleTaskToggle));
    $$('[data-delete-type]').forEach((button) => button.addEventListener('click', handleDeleteItem));
  }
  async function handleTaskToggle(event) { const task = state.tasks.find((item) => item.id === event.currentTarget.dataset.taskToggle); if (task) task.done = event.currentTarget.checked; await saveVault(); renderPlan(); updateTaskMetric(); }
  async function handleDeleteItem(event) { const type = event.currentTarget.dataset.deleteType; const key = `${type}s`; state[key] = state[key].filter((item) => item.id !== event.currentTarget.dataset.deleteId); await saveVault(); renderPlan(); updateTaskMetric(); }

  function renderDates() {
    const timeline = $('#date-timeline');
    if (!timeline) return;
    timeline.innerHTML = ACADEMIC_DATES.map((item) => `<article class="timeline-item ${item.featured ? 'is-featured' : ''}"><div class="timeline-date ${item.tone}">${escapeHTML(item.date)}</div><div class="timeline-pin ${item.tone}"></div><div class="timeline-copy"><div class="timeline-title"><h3>${escapeHTML(item.label)}</h3>${item.fromChat ? '<span class="chat-source">Desde chat</span>' : ''}</div><p>${escapeHTML(item.detail)}</p></div></article>`).join('');
  }

  function openDialog(id) { const dialog = $(`#${id}`); if (dialog?.showModal) dialog.showModal(); }
  function closeDialog(form) { form.closest('dialog')?.close(); form.reset(); }
  async function handleTaskForm(event) {
    event.preventDefault();
    if (event.submitter?.value === 'cancel') return closeDialog(event.currentTarget);
    const form = event.currentTarget;
    state.tasks.push({ id: uid('task'), title: $('#task-title').value.trim(), courseId: $('#task-course').value, date: $('#task-date').value, priority: $('#task-priority').value, reminder: $('#task-reminder').checked, done: false });
    await saveVault(); closeDialog(form); renderPlan(); updateTaskMetric();
  }
  async function handleBookForm(event) {
    event.preventDefault();
    if (event.submitter?.value === 'cancel') return closeDialog(event.currentTarget);
    const form = event.currentTarget;
    state.books.push({ id: uid('book'), title: $('#book-title').value.trim(), author: $('#book-author').value.trim(), courseId: $('#book-course').value, status: 'Por leer' });
    await saveVault(); closeDialog(form); renderPlan();
  }
  async function handleProjectForm(event) {
    event.preventDefault();
    if (event.submitter?.value === 'cancel') return closeDialog(event.currentTarget);
    const form = event.currentTarget;
    state.projects.push({ id: uid('project'), title: $('#project-title').value.trim(), courseId: $('#project-course').value, status: $('#project-status').value, note: $('#project-note').value.trim() });
    await saveVault(); closeDialog(form); renderPlan();
  }
  function setupInteractions() {
    $('#auth-form').addEventListener('submit', handleAuth);
    $$('.pin-key[data-pin]').forEach((button) => button.addEventListener('click', () => {
      const input = $('#access-password');
      if (input.value.length >= 4) return;
      setPinValue(`${input.value}${button.dataset.pin}`);
    }));
    $('#pin-delete').addEventListener('click', () => {
      const input = $('#access-password');
      setPinValue(input.value.slice(0, -1), false);
      $('#auth-error').textContent = '';
    });
    $('#access-password').addEventListener('keydown', (event) => {
      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        setPinValue(`${event.currentTarget.value}${event.key}`);
      } else if (event.key === 'Backspace') {
        event.preventDefault();
        setPinValue(event.currentTarget.value.slice(0, -1), false);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        $('#auth-form').requestSubmit();
      }
    });
    $('#lock-now').addEventListener('click', lockNow);
    $('#profile-chip').addEventListener('click', lockNow);
    $('#main-nav').addEventListener('click', (event) => { const target = event.target.closest('[data-view]'); if (target) showView(target.dataset.view); });
    document.addEventListener('click', (event) => {
      const target = event.target.closest('[data-view-target]'); if (target) showView(target.dataset.viewTarget);
      const dialogTarget = event.target.closest('[data-open-dialog]'); if (dialogTarget) openDialog(dialogTarget.dataset.openDialog);
    });
    $('#quick-add').addEventListener('click', () => openDialog('task-dialog'));
    $('#plan-add').addEventListener('click', () => openDialog('task-dialog'));
    $('#prev-week').addEventListener('click', () => { selectedWeekStart = addDays(selectedWeekStart, -7); renderCalendar(); });
    $('#next-week').addEventListener('click', () => { selectedWeekStart = addDays(selectedWeekStart, 7); renderCalendar(); });
    $('#week-current').addEventListener('click', () => { selectedWeekStart = new Date(2026, 7, 31); renderCalendar(); });
    $('#task-form').addEventListener('submit', handleTaskForm);
    $('#book-form').addEventListener('submit', handleBookForm);
    $('#project-form').addEventListener('submit', handleProjectForm);
    $('#reset-grades').addEventListener('click', async () => { state.grades = {}; await saveVault(); renderGrades(); });
    $('#enable-notifications').addEventListener('click', async (event) => {
      if (!('Notification' in window)) { event.currentTarget.textContent = 'No disponible'; return; }
      const permission = await Notification.requestPermission();
      event.currentTarget.textContent = permission === 'granted' ? 'Activado' : 'Bloqueado';
    });
  }
  function updatePinDisplay() {
    const value = $('#access-password').value;
    const display = $('#pin-display');
    display.setAttribute('aria-label', value.length ? `${value.length} de 4 dígitos ingresados` : 'Ningún dígito ingresado');
    $$('#pin-display .pin-dot').forEach((dot, index) => {
      const isFilled = index < value.length;
      dot.classList.toggle('is-filled', isFilled);
      dot.dataset.filled = isFilled ? 'true' : 'false';
    });
  }

  async function boot() {
    setupInteractions();
    configureAuthScreen();
    updatePinDisplay();
    if (await tryTrustedUnlock()) openApp();
    else $('#access-password').focus();
  }
  boot();
})();
