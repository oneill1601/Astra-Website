// Astra Dashboard — capa visual
// Importante: esta versión NO conecta Discord, API ni MegaDB.
// Cada acción está preparada para ser reemplazada por una llamada al backend más adelante.

const starfield = document.querySelector('.starfield');
if (starfield) {
  for (let i = 0; i < 110; i++) {
    const star = document.createElement('span');
    star.className = `star${i % 9 ? '' : ' violet'}`;
    star.style.cssText = `--x:${Math.random() * 100}%;--y:${Math.random() * 100}%;--size:${Math.random() * 2 + 1}px;--opacity:${Math.random() * .6 + .2};--duration:${2 + Math.random() * 4}s;--delay:${-Math.random() * 5}s;--drift:${8 + Math.random() * 12}s`;
    starfield.appendChild(star);
  }
}

const cards = [...document.querySelectorAll('.server-card')];
const search = document.getElementById('search');
let filter = 'all';

function toast(message) {
  const element = document.getElementById('toast');
  if (!element) return;
  element.textContent = message;
  element.style.display = 'block';
  clearTimeout(window.astraToastTimer);
  window.astraToastTimer = setTimeout(() => {
    element.style.display = 'none';
  }, 2200);
}

function applyServerFilter() {
  const query = (search?.value || '').toLowerCase();
  let visible = 0;

  cards.forEach(card => {
    const matchesName = card.dataset.name.toLowerCase().includes(query);
    const matchesFilter = filter === 'all' || card.dataset.state === filter;
    const show = matchesName && matchesFilter;
    card.style.display = show ? 'block' : 'none';
    if (show) visible++;
  });

  const empty = document.getElementById('empty');
  if (empty) empty.style.display = visible ? 'none' : 'block';
}

document.querySelectorAll('.filter').forEach(button => {
  button.onclick = () => {
    document.querySelectorAll('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    filter = button.dataset.filter;
    applyServerFilter();
  };
});

if (search) search.oninput = applyServerFilter;

function showPicker() {
  document.getElementById('admin')?.classList.remove('active');
  document.getElementById('picker')?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openAdmin(name, initial, desc) {
  document.getElementById('picker')?.classList.remove('active');
  document.getElementById('admin')?.classList.add('active');

  const sideName = document.getElementById('sideName');
  const sideAvatar = document.getElementById('sideAvatar');
  if (sideName) sideName.textContent = name;
  if (sideAvatar) sideAvatar.textContent = initial;

  renderSection('⚙️ General', { name, initial, desc });
}

// Funciones que dependen de autorización del dueño de Astra se mantienen fuera
// del menú hasta que el módulo esté autorizado para el servidor.
const hiddenModules = [
  'Rachas',
  'Nivelación',
  'Matrimonios',
  'Empresas',
  'AstraConomy',
  'Tienda',
  'Daily Questions'
];

document.querySelectorAll('.nav-item, .module').forEach(element => {
  if (hiddenModules.some(name => element.textContent.includes(name))) {
    element.remove();
  }
});

const sections = {
  '⚙️ General': {
    icon: '⚙️',
    category: 'Servidor',
    title: 'Configuración general',
    description: 'Las opciones principales de Astra para este servidor.'
  },
  '👋 Bienvenidas': {
    icon: '👋',
    category: 'Comunidad',
    title: 'Bienvenidas',
    description: 'Personaliza las bienvenidas que Astra enviará a los nuevos miembros.'
  },
  '🚀 Boosters': {
    icon: '🚀',
    category: 'Comunidad',
    title: 'Boosters',
    description: 'Configura visualmente las funciones de Booster que Astra ya soporta.'
  },
  '🛡️ Moderación': {
    icon: '🛡️',
    category: 'Seguridad',
    title: 'Moderación',
    description: 'Administra las herramientas de moderación disponibles para Astra.'
  },
  '🤖 Autorrespuestas': {
    icon: '🤖',
    category: 'Automático',
    title: 'Autorrespuestas',
    description: 'Crea y organiza respuestas automáticas para tu comunidad.'
  },
  '📜 Logs': {
    icon: '📜',
    category: 'Registro',
    title: 'Logs',
    description: 'Elige qué eventos registra Astra y dónde se envían.'
  },
  '🎭 Reacciones': {
    icon: '🎭',
    category: 'Social',
    title: 'Reacciones',
    description: 'Configura visualmente las respuestas sociales y automáticas de Astra.'
  },
  '📊 Estadísticas': {
    icon: '📊',
    category: 'Datos',
    title: 'Estadísticas',
    description: 'Consulta una representación visual de la actividad del servidor.'
  },
  '🔐 Permisos': {
    icon: '🔐',
    category: 'Acceso',
    title: 'Permisos',
    description: 'Define qué roles podrán administrar las funciones de Astra.'
  }
};

function switchControl(checked = true) {
  return `<label class="switch"><input type="checkbox" ${checked ? 'checked' : ''}><i></i></label>`;
}

function selectControl(options) {
  return `<select>${options.map(option => `<option>${option}</option>`).join('')}</select>`;
}

function settingRow(title, description, control) {
  return `<div class="setting-card"><div><b>${title}</b><span>${description}</span></div>${control}</div>`;
}

function renderGeneral() {
  return `
    <div class="settings-grid">
      ${settingRow('Astra en el servidor', 'Activa o desactiva el funcionamiento general de Astra.', switchControl(true))}
      ${settingRow('Canal principal', 'Canal predeterminado para funciones que necesiten un canal.', selectControl(['#・general', '#・chat', '#・comunidad']))}
      ${settingRow('Idioma', 'Idioma utilizado por las respuestas de Astra.', selectControl(['Español', 'English']))}
      ${settingRow('Zona horaria', 'Zona utilizada para funciones que dependen de horarios.', selectControl(['Argentina / Buenos Aires', 'UTC', 'España / Madrid']))}
    </div>
    <div class="preview-note"><b>Prefijo actual</b><span>ast</span><small>El prefijo pertenece a Astra y se muestra aquí solo como información.</small></div>`;
}

function renderWelcome() {
  const welcomeCards = Array.from({ length: 10 }, (_, index) => {
    const number = index + 1;
    const active = index < 2;
    return `
      <article class="config-card">
        <div class="config-icon">👋</div>
        <div class="config-main">
          <div class="config-top">
            <div><h4>Bienvenida #${number}</h4><span class="mini-status">${active ? '● Activa' : '○ Sin configurar'}</span></div>
            ${switchControl(active)}
          </div>
          <p>${active ? '¡Bienvenido {user} a {server}! 🌙' : 'Todavía no hay un mensaje configurado para esta bienvenida.'}</p>
          <div class="config-actions">
            <button class="btn" onclick="editWelcome(${number})">Editar</button>
            <button class="btn secondary" onclick="previewWelcome(${number})">Vista previa</button>
            <button class="btn secondary" onclick="toast('Prueba de bienvenida #${number} enviada (simulación)')">Enviar prueba</button>
          </div>
        </div>
      </article>`;
  }).join('');

  return `
    <div class="section-toolbar">
      <div><b>10 bienvenidas configurables</b><span>Cada una puede tener su propio mensaje, embed, imagen y canal.</span></div>
      <button class="btn" onclick="toast('Las 10 bienvenidas ya están disponibles (simulación)')">＋ Gestionar bienvenidas</button>
    </div>
    <div class="welcome-list">${welcomeCards}</div>`;
}

function renderBoosters() {
  return `
    <div class="feature-banner"><div class="large-module-icon">🚀</div><div><b>Boosters de Astra</b><span>El bonus de Booster definido por Astra es de <strong>+30% XP</strong> cuando corresponde.</span></div><span class="status-pill active">ACTIVO</span></div>
    <div class="settings-grid">
      ${settingRow('Bonus de Booster', '+30% de XP según la mecánica existente.', switchControl(true))}
      ${settingRow('XP por mensajes', 'El bonus se aplica cuando la mecánica de XP por mensajes está activa.', switchControl(true))}
      ${settingRow('XP por voz', 'El bonus se aplica cuando el usuario está hablando en voz.', switchControl(true))}
      ${settingRow('Indicador visual', 'Muestra el estado Booster en la tarjeta correspondiente.', switchControl(true))}
    </div>
    <div class="info-grid">
      <div class="info-card"><span>🚀</span><b>+30% XP</b><small>Bonus establecido por Astra.</small></div>
      <div class="info-card"><span>💬</span><b>Mensajes</b><small>Compatible con XP por mensajes.</small></div>
      <div class="info-card"><span>🎙️</span><b>Voz</b><small>Solo mientras el usuario habla.</small></div>
    </div>`;
}

function renderModeration() {
  return `
    <div class="settings-grid">
      ${settingRow('Moderación automática', 'Activa las herramientas automáticas de moderación disponibles.', switchControl(true))}
      ${settingRow('Filtros', 'Controla los filtros que Astra tenga configurados.', switchControl(true))}
      ${settingRow('Avisos', 'Configura la emisión de avisos de moderación.', switchControl(true))}
      ${settingRow('Canal de moderación', 'Canal destinado a las acciones de moderación.', selectControl(['#・moderacion', '#・logs', '#・staff']))}
    </div>
    <div class="moderation-actions">
      <div class="action-card"><span>⚠️</span><div><b>Avisos</b><small>Vista visual de las acciones disponibles.</small></div><button class="btn secondary" onclick="toast('Editor de avisos (simulación)')">Configurar</button></div>
      <div class="action-card"><span>🛡️</span><div><b>Acciones</b><small>Preparado para conectar las acciones reales.</small></div><button class="btn secondary" onclick="toast('Selector de acciones (simulación)')">Ver acciones</button></div>
    </div>`;
}

function renderAutoResponses() {
  const responses = [
    ['hola', '¡Hola {user}! 🌙', true],
    ['buenas noches', 'Que descanses bajo la luz de Astra. ✦', true],
    ['astra', 'Aquí estoy. 🌙', false]
  ];

  return `
    <div class="section-toolbar">
      <div><b>Respuestas automáticas</b><span>Disparadores y respuestas visuales preparadas para conectar.</span></div>
      <button class="btn" onclick="toast('Nueva autorrespuesta creada (simulación)')">＋ Añadir respuesta</button>
    </div>
    <div class="response-list">${responses.map(([trigger, response, active]) => `
      <div class="response-card"><div class="response-trigger"><span>Cuando aparezca</span><b>${trigger}</b></div><div class="response-arrow">→</div><div class="response-value"><span>Astra responde</span><b>${response}</b></div><div>${switchControl(active)}</div><button class="icon-button" onclick="toast('Editor de autorrespuesta (simulación)')">✎</button></div>`).join('')}</div>`;
}

function renderLogs() {
  const groups = [
    ['🛡️', 'Moderación', ['Bans', 'Kicks', 'Mutes', 'Warns']],
    ['👥', 'Miembros', ['Entradas', 'Salidas', 'Cambios de nickname']],
    ['💬', 'Mensajes', ['Mensajes eliminados', 'Mensajes editados']],
    ['🎙️', 'Voz', ['Entradas y salidas']]
  ];

  return `
    <div class="log-channel"><div><b>Canal principal de logs</b><span>Canal usado por defecto para los eventos seleccionados.</span></div>${selectControl(['#・logs', '#・moderacion', '#・staff', 'Sin canal'])}</div>
    <div class="log-groups">${groups.map(([icon, title, events]) => `
      <div class="log-group"><div class="group-head"><div><b>${icon} ${title}</b><span>Eventos registrados por Astra.</span></div>${switchControl(true)}</div>
      ${events.map(event => `<div class="log-row"><div><b>${event}</b><span>Registrar este evento.</span></div>${selectControl(['#・logs', '#・moderacion', 'Sin canal'])}</div>`).join('')}</div>`).join('')}</div>`;
}

function renderReactions() {
  const reactions = [
    ['💗', 'Kiss', 'Respuesta social con devolución y rechazo cuando corresponda.'],
    ['🤗', 'Hug', 'Interacción social mediante un nuevo embed.'],
    ['🐾', 'Pat', 'Interacción social visual.'],
    ['✨', 'Otras acciones', 'Preparado para las demás acciones existentes.']
  ];

  return `
    <div class="settings-grid">
      ${settingRow('Emociones sociales', 'Activa las acciones sociales que Astra tenga disponibles.', switchControl(true))}
      ${settingRow('GIFs', 'Conservar el GIF correspondiente en las respuestas.', switchControl(true))}
      ${settingRow('Devoluciones', 'Las devoluciones generan un nuevo embed en lugar de editar el original.', switchControl(true))}
      ${settingRow('Respuestas automáticas', 'Configuración visual de respuestas sociales.', switchControl(true))}
    </div>
    <div class="reaction-grid">${reactions.map(([icon, title, text]) => `<div class="reaction-card"><span>${icon}</span><div><b>${title}</b><small>${text}</small></div><button class="btn secondary" onclick="toast('Editor de ${title} (simulación)')">Editar</button></div>`).join('')}</div>`;
}

function renderStats() {
  return `
    <div class="stat-cards">
      <div class="stat-card"><span>👥</span><small>Miembros</small><strong>1,375</strong><em>+8.4%</em></div>
      <div class="stat-card"><span>💬</span><small>Mensajes</small><strong>24.8K</strong><em>+12.1%</em></div>
      <div class="stat-card"><span>🌙</span><small>Actividad Astra</small><strong>82%</strong><em>+5.2%</em></div>
      <div class="stat-card"><span>⚡</span><small>Funciones activas</small><strong>8</strong><em>Estable</em></div>
    </div>
    <div class="chart-card"><div class="chart-head"><div><b>Actividad del servidor</b><span>Representación visual de ejemplo.</span></div><select><option>Últimos 7 días</option><option>Últimos 30 días</option></select></div><div class="fake-chart"><span style="height:32%"></span><span style="height:48%"></span><span style="height:42%"></span><span style="height:68%"></span><span style="height:56%"></span><span style="height:82%"></span><span style="height:72%"></span></div></div>`;
}

function renderPermissions() {
  return `
    <div class="permission-banner"><span>🔐</span><div><b>Acceso administrativo</b><small>Cuando conectemos el backend, estos permisos deberán comprobarse realmente en Discord.</small></div></div>
    <div class="settings-grid">
      ${settingRow('Administrador del servidor', 'Permiso administrativo principal.', switchControl(true))}
      ${settingRow('Propietario del servidor', 'El propietario siempre puede administrar Astra.', switchControl(true))}
      ${settingRow('Roles autorizados', 'Permite definir roles que podrán utilizar el dashboard.', switchControl(false))}
    </div>
    <div class="role-manager"><div><b>Roles autorizados</b><span>Ningún rol personalizado configurado todavía.</span></div><button class="btn" onclick="toast('Selector de roles abierto (simulación)')">＋ Añadir rol</button></div>`;
}

function renderSection(key, server = {}) {
  const section = sections[key];
  if (!section) return;

  document.querySelectorAll('.nav-item').forEach(button => {
    button.classList.toggle('active', button.textContent.trim() === key);
  });

  const name = server.name || document.getElementById('sideName')?.textContent || 'Astra Community';
  const initial = server.initial || document.getElementById('sideAvatar')?.textContent || 'A';

  let body = renderGeneral();
  if (key === '👋 Bienvenidas') body = renderWelcome();
  if (key === '🚀 Boosters') body = renderBoosters();
  if (key === '🛡️ Moderación') body = renderModeration();
  if (key === '🤖 Autorrespuestas') body = renderAutoResponses();
  if (key === '📜 Logs') body = renderLogs();
  if (key === '🎭 Reacciones') body = renderReactions();
  if (key === '📊 Estadísticas') body = renderStats();
  if (key === '🔐 Permisos') body = renderPermissions();

  const content = document.querySelector('.admin-content');
  if (!content) return;

  content.innerHTML = `
    <div class="admin-head">
      <div class="admin-title">
        <div class="admin-avatar">${initial}</div>
        <div><h2>${name}</h2><p>Panel de administración de Astra</p></div>
      </div>
      <div class="admin-actions">
        <button class="btn secondary" onclick="showPicker()">← Volver</button>
        <a class="btn secondary" href="../">Web de Astra</a>
      </div>
    </div>
    <div class="notice">🔒 Configuración exclusiva de <b>${name}</b>. Esta interfaz es visual y todavía no modifica el bot.</div>
    <div class="module-page">
      <div class="module-page-head">
        <div class="large-module-icon">${section.icon}</div>
        <div><span class="module-tag">${section.category}</span><h3>${section.title}</h3><p>${section.description}</p></div>
      </div>
      <div class="module-body">${body}</div>
      <div class="save-bar"><span>Vista visual · sin conexión al bot.</span><button class="btn" onclick="toast('✓ Configuración actualizada (simulación)')">Guardar cambios</button></div>
    </div>`;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// La navegación se delega para que siga funcionando después de renderizar cada sección.
document.querySelectorAll('.nav-item').forEach(button => {
  button.onclick = () => renderSection(button.textContent.trim());
});

function previewWelcome(number) {
  toast(`Vista previa de Bienvenida #${number}`);
}

function editWelcome(number) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      <div class="modal-head"><div class="large-module-icon">👋</div><div><span class="module-tag">Bienvenida #${number}</span><h3>Editar bienvenida</h3><p>Personaliza el mensaje y mira cómo quedaría en Discord.</p></div></div>
      <div class="editor-layout">
        <div class="editor-fields">
          <label>Título del embed<input value="¡Bienvenido a {server}!" /></label>
          <label>Descripción<textarea>Nos alegra tenerte con nosotros, {user}. 🌙</textarea></label>
          <div class="two-fields"><label>Color<input value="#A987FF" /></label><label>Canal${selectControl(['#・bienvenidas', '#・general', '#・comunidad'])}</label></div>
          <label>Imagen del embed<input placeholder="URL de imagen (opcional)" /></label>
          <label>Pie del embed<input value="Que disfrutes tu estadía ✦" /></label>
          <div class="editor-actions"><button class="btn" onclick="toast('✓ Bienvenida guardada (simulación)');this.closest('.modal-overlay').remove()">Guardar</button><button class="btn secondary" onclick="toast('Vista previa actualizada')">Vista previa</button></div>
        </div>
        <div class="discord-preview"><span>Vista previa</span><div class="preview-message"><small>ASTRABOT</small><h4>¡Bienvenido a {server}!</h4><p>Nos alegra tenerte con nosotros, {user}. 🌙</p><footer>Que disfrutes tu estadía ✦</footer></div></div>
      </div>
    </div>`;
  document.body.appendChild(overlay);
}
