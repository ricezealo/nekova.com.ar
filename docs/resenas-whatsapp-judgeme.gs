/**
 * Nekova · reseñas por WhatsApp → Judge.me
 *
 * Va como ARCHIVO NUEVO dentro del Apps Script de la planilla "calculadora-nekova"
 * (Extensiones → Apps Script → "+" → Secuencia de comandos → nombre: Resenas).
 * No usa onOpen ni nombres genéricos, para no chocar con los scripts que ya existen:
 * todas las funciones y constantes empiezan con "resenas" / "RESENAS_".
 *
 * Lee la hoja "Reseñas" y sube a Judge.me, como reseñas de la TIENDA, las filas con estrellas,
 * texto, nombre y "¿Dio permiso?" = "Sí", que todavía no tienen nada en "Estado".
 * Después escribe en "Estado" cuándo la mandó (o el error), así nunca se sube dos veces.
 *
 * Primera vez: elegir la función "resenasInstalar" arriba y tocar Ejecutar (crea el menú
 * "Nekova · reseñas" al abrir la planilla). Después, en la planilla: Nekova · reseñas → Configurar.
 *
 * El token se guarda en las propiedades del script, no en la planilla.
 * Judge.me pide un email por reseña: si el cliente no tiene, se usa el de la tienda con un
 * agregado por fila (ej. info+wa5@nekova.com.ar), que no se publica.
 */

const RESENAS_HOJA = 'Reseñas';
const RESENAS_COLUMNAS = {
  nombre: 'Nombre a publicar',
  estrellas: 'Estrellas (1 a 5)',
  texto: 'Reseña (tal cual la escribió)',
  permiso: '¿Dio permiso?',
  email: 'Email (opcional)',
  estado: 'Estado (lo completa el script)',
};

/** Ejecutar UNA vez desde el editor: crea el activador que arma el menú al abrir la planilla. */
function resenasInstalar() {
  const ss = SpreadsheetApp.getActive();
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'resenasMenu')
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('resenasMenu').forSpreadsheet(ss).onOpen().create();
  resenasMenu();
}

function resenasMenu() {
  SpreadsheetApp.getUi()
    .createMenu('Nekova · reseñas')
    .addItem('Subir reseñas nuevas a Judge.me', 'resenasSubir')
    .addSeparator()
    .addItem('Configurar', 'resenasConfigurar')
    .addItem('Subida automática (cada hora)', 'resenasActivarAutomatico')
    .addItem('Apagar subida automática', 'resenasApagarAutomatico')
    .addToUi();
}

function resenasConfigurar() {
  const ui = SpreadsheetApp.getUi();
  const props = PropertiesService.getScriptProperties();
  const pedir = (texto, actual) => {
    const r = ui.prompt('Nekova · reseñas', `${texto}${actual ? `\n(actual: ${actual})` : ''}`, ui.ButtonSet.OK_CANCEL);
    return r.getSelectedButton() === ui.Button.OK ? r.getResponseText().trim() : null;
  };
  const dominio = pedir('Dominio de la tienda en Shopify (termina en .myshopify.com). Está en Judge.me → Configuración → Integraciones → Ver tokens de API.', props.getProperty('RESENAS_SHOP_DOMAIN'));
  if (dominio === null) return;
  const token = pedir('Token PRIVADO de la API de Judge.me (mismo lugar). No lo compartas con nadie. Dejalo vacío para mantener el guardado.', props.getProperty('RESENAS_API_TOKEN') ? 'guardado' : '');
  if (token === null) return;
  const email = pedir('Email de la tienda para las reseñas sin email del cliente.', props.getProperty('RESENAS_FALLBACK_EMAIL') || 'info@nekova.com.ar');
  if (email === null) return;
  if (dominio) props.setProperty('RESENAS_SHOP_DOMAIN', dominio);
  if (token) props.setProperty('RESENAS_API_TOKEN', token);
  if (email) props.setProperty('RESENAS_FALLBACK_EMAIL', email);
  ui.alert('Listo. Ya podés usar Nekova · reseñas → Subir reseñas nuevas a Judge.me.');
}

function resenasActivarAutomatico() {
  resenasApagarAutomatico();
  ScriptApp.newTrigger('resenasSubir').timeBased().everyHours(1).create();
  SpreadsheetApp.getActive().toast('Las reseñas nuevas se van a subir solas cada hora.', 'Nekova · reseñas');
}

function resenasApagarAutomatico() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'resenasSubir')
    .forEach((t) => ScriptApp.deleteTrigger(t));
}

function resenasSubir() {
  const props = PropertiesService.getScriptProperties();
  const dominio = props.getProperty('RESENAS_SHOP_DOMAIN');
  const token = props.getProperty('RESENAS_API_TOKEN');
  const respaldo = props.getProperty('RESENAS_FALLBACK_EMAIL') || 'info@nekova.com.ar';
  if (!dominio || !token) throw new Error('Falta configurar: menú Nekova · reseñas → Configurar.');

  const hoja = SpreadsheetApp.getActive().getSheetByName(RESENAS_HOJA);
  if (!hoja) throw new Error(`No encuentro la hoja "${RESENAS_HOJA}".`);
  const datos = hoja.getDataRange().getValues();
  const encabezado = datos[0].map(String);
  const col = {};
  Object.entries(RESENAS_COLUMNAS).forEach(([clave, titulo]) => {
    col[clave] = encabezado.indexOf(titulo);
    if (col[clave] < 0) throw new Error(`No encuentro la columna "${titulo}". No cambies los títulos de la fila 1.`);
  });
  const [usuario, dominioMail] = respaldo.split('@');
  let subidas = 0;

  for (let i = 1; i < datos.length; i++) {
    const fila = datos[i];
    if (String(fila[col.estado]).trim()) continue; // ya procesada
    if (String(fila[col.permiso]).trim() !== 'Sí') continue;
    const estrellas = Number(fila[col.estrellas]);
    const texto = String(fila[col.texto]).trim();
    const nombre = String(fila[col.nombre]).trim();
    if (!texto || !nombre || !(estrellas >= 1 && estrellas <= 5)) continue;
    const email = String(fila[col.email]).trim() || `${usuario}+wa${i + 1}@${dominioMail}`;

    const respuesta = UrlFetchApp.fetch('https://judge.me/api/v1/reviews', {
      method: 'post',
      muteHttpExceptions: true,
      payload: {
        api_token: token,
        shop_domain: dominio,
        platform: 'shopify',
        name: nombre,
        email: email,
        rating: String(Math.round(estrellas)),
        body: texto,
        // sin "id" de producto: queda como reseña de la tienda
      },
    });
    const codigo = respuesta.getResponseCode();
    const celda = hoja.getRange(i + 1, col.estado + 1);
    if (codigo >= 200 && codigo < 300) {
      celda.setValue(`Enviada ${Utilities.formatDate(new Date(), 'America/Argentina/Buenos_Aires', 'dd/MM/yyyy HH:mm')} · revisala y aprobala en Judge.me`);
      subidas++;
    } else {
      celda.setValue(`Error ${codigo}: ${respuesta.getContentText().slice(0, 150)}`);
    }
  }
  if (!subidas) return; // en la subida automática no molesta si no hay nada
  try { SpreadsheetApp.getActive().toast(`${subidas} reseña(s) enviadas a Judge.me.`, 'Nekova · reseñas'); } catch (e) { /* sin interfaz (activador) */ }
}
