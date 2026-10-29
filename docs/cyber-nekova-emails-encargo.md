# Encargo: armar y programar los 3 emails de Cyber Nekova en Shopify Messaging

Este archivo es el brief completo. No hace falta otro contexto.

## Contexto

- **Nekova** (nekova.com.ar, Shopify, Argentina) hace la promoción **Cyber Nekova: 20% OFF en toda la tienda**, del **lunes 2/11/2026 a las 00:00hs** al **viernes 6/11/2026 a las 23:59hs**. El CyberMonday oficial termina el miércoles 4; Nekova lo extiende hasta el viernes.
- El descuento ya está creado en Shopify (automático, **sin código**). Los precios con descuento ya se ven en la tienda.
- Hoy hay stock de dos productos: **Cojín Ergonómico en U** ($79.000 → $63.200) y **Almohada Nekova Somnia** ($82.000 → $65.600). Las plantillas y los tapones están sin stock: **no mostrarlos** en los emails.
- **No usar la expresión "Cyber Monday"** en ningún lado (Nekova no participa oficialmente): siempre **"Cyber Nekova"**.
- Tono: español rioplatense con voseo. No mencionar garantía ni afirmaciones de salud.

## Material

- **Imágenes de cabecera** (PNG 1200 × 1500, una por email), en `G:\Ryzen5\Documentos\GitHub\nekova.com.ar\marca\email\cyber\`:
  - `cyber-nekova-1-arranco.png` → email del lunes
  - `cyber-nekova-2-extendido.png` → email del jueves
  - `cyber-nekova-3-ultimo-dia.png` → email del viernes
- **Logo para el encabezado del email:** `G:\Ryzen5\Documentos\GitHub\nekova.com.ar\marca\email\nekova-logo-email.png`.
- **Textos:** abajo, en cada email. Copiarlos tal cual.

## Diseño de la plantilla (igual para los 3)

En **Shopify → Apps → Messaging → Crear mensaje → Email**, empezar desde una plantilla en blanco y armar esta estructura:

1. **Encabezado:** el logo de Nekova centrado, con un link a `https://www.nekova.com.ar`.
2. **Imagen** de cabecera del día, a todo el ancho, con un link a `https://www.nekova.com.ar/collections/all`. Texto alternativo: `Cyber Nekova: 20% OFF en toda la tienda`.
3. **Texto:** título y párrafo del día.
4. **Botón** principal, centrado, con el texto del día y el link a `https://www.nekova.com.ar/collections/all`.
5. **Dos botones o links por producto**, más chicos, uno debajo del otro:
   - "Cojín Ergonómico en U · $63.200" → `https://www.nekova.com.ar/products/cojin-ortopedico-u`
   - "Almohada Nekova Somnia · $65.600" → `https://www.nekova.com.ar/products/almohada-nekova-somnia`
6. **Texto chico** con las condiciones.
7. Pie de página estándar de Shopify (con el link para darse de baja: no sacarlo).

**No usar el bloque "Producto" de Messaging:** muestra el precio sin el descuento automático ($79.000 y $82.000) y contradice la imagen.

**Estilos** (en la configuración de estilos o de marca de la plantilla):

| Elemento | Valor |
|---|---|
| Fondo del email | `#F3F5F9` |
| Fondo del contenido | `#FFFFFF` |
| Texto | `#14161A` |
| Títulos | `#14161A`, en negrita; si está disponible, la tipografía **Poppins**; si no, Arial o Helvetica |
| Botón principal | fondo `#C94430` (rojo de ofertas), texto blanco, esquinas redondeadas |
| Botones de producto | fondo `#2F5BFF` (azul Nekova), texto blanco |
| Links | `#2F5BFF` |

Si Messaging permite **guardar la plantilla**, guardala como `Cyber Nekova` y usala para los tres emails. Si no, armá el primero y **duplicalo** para el segundo y el tercero.

## Destinatarios y remitente (los 3 emails)

- **Para:** el segmento **"Suscriptores de email"** ("Email subscribers"), que incluye a todos los que aceptaron recibir emails, con cualquier etiqueta. **No** elegir "Lista de lanzamiento" ni "cyber-nekova", que son solo una parte. Si ese segmento no existe, crealo en **Clientes → Segmentos** con la consulta `email_subscription_status = 'SUBSCRIBED'` y el nombre `Suscriptores de email`.
- **Remitente:** Nekova · info@nekova.com.ar.

## Email 1 · Lunes 2/11/2026 a las 09:00hs

- Imagen: `cyber-nekova-1-arranco.png`
- **Asunto:** `Arrancó Cyber Nekova: 20% OFF en toda la tienda`
- **Texto de vista previa:** `Ya está aplicado en los precios, sin códigos. Hasta el viernes 6/11.`
- **Título:** `Cyber Nekova ya empezó`
- **Texto:**
  ```
  Desde hoy y hasta el viernes 6 de noviembre, todo Nekova tiene 20% OFF. El descuento ya está aplicado en los precios: no necesitás ningún código.

  Envío gratis en compras desde $95.000. Despacho en días hábiles y 10 días para devolverlo.
  ```
- **Botón principal:** `Ver productos`
- **Condiciones:** `Válido del 2/11/2026 a las 00:00hs al 6/11/2026 a las 23:59hs o hasta agotar stock. No acumulable con otras promociones.`

## Email 2 · Jueves 5/11/2026 a las 09:00hs

- Imagen: `cyber-nekova-2-extendido.png`
- **Asunto:** `¡Extendimos Cyber Nekova hasta el viernes!`
- **Texto de vista previa:** `Seguís teniendo 20% OFF en toda la tienda. Últimos días.`
- **Título:** `Te damos dos días más`
- **Texto:**
  ```
  El CyberMonday terminó, pero en Nekova lo extendimos: seguís teniendo 20% OFF en toda la tienda hasta el viernes 6 de noviembre a las 23:59hs. El descuento ya está en los precios.

  Si lo estabas pensando, es ahora: el sábado vuelven los precios de siempre.
  ```
  > Ojo: acá "CyberMonday" se usa solo para contar que el evento general terminó. Si preferís evitarlo del todo, reemplazá la primera oración por: `Lo extendimos: seguís teniendo 20% OFF en toda la tienda hasta el viernes 6 de noviembre a las 23:59hs.`
- **Botón principal:** `Aprovechar ahora`
- **Condiciones:** `Válido hasta el 6/11/2026 a las 23:59hs o hasta agotar stock. No acumulable con otras promociones.`

## Email 3 · Viernes 6/11/2026 a las 18:00hs

- Imagen: `cyber-nekova-3-ultimo-dia.png`
- **Asunto:** `Últimas horas de Cyber Nekova`
- **Texto de vista previa:** `El 20% OFF termina hoy a las 23:59hs.`
- **Título:** `Hoy es el último día`
- **Texto:**
  ```
  El 20% OFF en toda la tienda termina hoy a las 23:59hs. Después vuelven los precios de siempre.
  ```
- **Botón principal:** `Ver productos`
- **Condiciones:** `Válido hasta el 6/11/2026 a las 23:59hs o hasta agotar stock. No acumulable con otras promociones.`

## Pasos para cada email

1. Armarlo con la estructura y los estilos de arriba.
2. **Enviar prueba** a info@nekova.com.ar y revisar la vista previa en celular y en computadora: que la imagen se vea entera, que los links funcionen y que no aparezca "Cyber Monday" (salvo el caso aclarado en el email 2).
3. **Programar** (no "Enviar ahora") para la fecha y hora del email, en hora de Argentina. Confirmar que quede en estado **Programado**.

## Reglas (importantes)

- **No enviar nada ahora**: solo pruebas a info@nekova.com.ar. Los tres quedan programados.
- **No tocar** descuentos, precios, productos, automatizaciones existentes (por ejemplo, la de la lista de lanzamiento) ni el tema.
- **No iniciar sesión ni manejar contraseñas o códigos**: la sesión la abre el dueño.
- Si algo no coincide con este brief (no aparece el segmento, no se puede programar, falta una opción de estilo), **parar y avisar** en vez de improvisar.

## Al terminar

Dejar un resumen con:
- Los tres emails: asunto, destinatarios, fecha y hora programada, y estado.
- Si se pudo guardar la plantilla o se duplicaron los emails.
- Captura de la vista previa de cada email y de la lista de mensajes programados.
- Cualquier problema o cosa que haya quedado sin hacer.
