# Encargo: lista de lanzamiento del cojín con 15% OFF (Shopify + Meta Ads)

Este archivo es el brief completo. No hace falta otro contexto.

## Contexto

- **Nekova** (nekova.com.ar, Shopify, Argentina) lanza su primer lote del **Cojín Ergonómico en U** el **11/11/2026**. Precio: **$79.000**. Son 40 unidades.
- Antes del lanzamiento se arma una **lista**: la gente deja su email en una página de la web y recibe al instante un código de **15% OFF** (`LISTA15`), que vale del **11/11 al 18/11** y solo para las **primeras 30 compras**.
- Flujo: anuncio en Meta → página `/pages/lista-de-lanzamiento` → la persona deja su email → Shopify la guarda con la etiqueta `lista-lanzamiento` → automatización: email con el código → 11/11: email "¡Ya llegó!".
- El tema ya tiene la página hecha (sección "Nekova · lista lanzamiento", plantilla `page.lista`). Solo hay que crear la página en Shopify.
- Tono: español rioplatense con voseo. **No escribir** afirmaciones de salud ("ortopédico", "alivia el dolor", "corrige la postura"): hablar de comodidad y apoyo. **No mencionar garantía.**

## Paso 1 · Crear la página

Shopify → **Tienda online → Páginas → Agregar página**:
- **Título:** `Lista de lanzamiento`
- **Contenido:** vacío.
- **Plantilla del tema** (columna derecha): **`lista`**.
- **Visibilidad:** Visible.
- En "Publicación en motores de búsqueda" → Editar → **Identificador de URL:** `lista-de-lanzamiento` (la dirección tiene que quedar `https://www.nekova.com.ar/pages/lista-de-lanzamiento`). Título: `15% OFF en el lanzamiento del cojín | Nekova`. Descripción: `Anotate en la lista de lanzamiento de Nekova y recibí un código de 15% OFF para tu cojín ergonómico en U. Primeras 30 compras, del 11/11 al 18/11.`
- **Guardar.** Abrir la página en el navegador y comprobar que se ve el título "Tu cojín con 15% OFF, antes que nadie", el precio $79.000 tachado y $67.150, y el formulario.
- **No agregarla al menú** de la tienda: se llega por los anuncios y por el link de la bio.

## Paso 2 · Segmento de clientes

Shopify → **Clientes → Segmentos → Crear segmento**:
- Consulta: `customer_tags CONTAINS 'lista-lanzamiento'`
- Nombre: `Lista de lanzamiento`
- Guardar.

## Paso 3 · Código de descuento

Shopify → **Descuentos → Crear descuento → Monto de descuento en productos**:

| Campo | Valor |
|---|---|
| Método | **Código de descuento** |
| Código | `LISTA15` |
| Tipo de valor | **Porcentaje: 15** |
| Se aplica a | **Productos específicos** → *Cojín Ergonómico en U de Espuma Viscoelástica* |
| Requisitos mínimos de compra | Ninguno |
| Elegibilidad de los clientes | **Segmentos de clientes específicos** → `Lista de lanzamiento` |
| Usos máximos | ☑ **Limitar el número total de veces que se puede usar este descuento: 30** · ☑ **Limitar a un uso por cliente** |
| Combinaciones | **Ninguna** (no combinar con otros descuentos) |
| Fecha de inicio | **11/11/2026, 00:00** (hora de Argentina) |
| Fecha de finalización | ☑ **18/11/2026, 23:59** |

Guardar. Debe quedar **programado** (no activo todavía).

## Paso 4 · Email automático con el código (bienvenida)

Shopify → **Marketing → Automatizaciones**. Hay una automatización "Dar la bienvenida a nuevos suscriptores" (con descuento) que está **inactiva**, con plantillas en inglés. Usarla si sirve, o crear una nueva desde la plantilla de bienvenida a suscriptores:

- **Disparador:** el cliente se suscribe al marketing por email.
- **Condición:** las etiquetas del cliente incluyen `lista-lanzamiento`. (Si el editor no permite agregar esa condición, **parar y avisar** antes de activarla.)
- **Un solo email**, enviado **de inmediato**. Borrar los demás emails de la secuencia si los tiene.
- **No** usar la opción de descuento automático de la plantilla: el código va escrito en el texto (es `LISTA15`, creado en el Paso 3).
- Remitente: Nekova. Respuesta a: info@nekova.com.ar.

Texto del email (copiar tal cual):

```
Asunto: Tu código de 15% OFF ya está acá 🎉
Texto de vista previa: Guardalo: lo usás desde el 11/11 en tu cojín ergonómico.

Título: ¡Ya estás en la lista!

Gracias por sumarte. Este es tu código de 15% OFF para el Cojín Ergonómico en U:

LISTA15

Cómo usarlo
1. El 11/11 lanzamos el primer lote en nekova.com.ar.
2. Elegí tu color (gris o azul marino) y pasá al checkout.
3. Ingresá el código con este mismo email.

Con el código lo pagás $67.150 en lugar de $79.000.

Importante: el código vale del 11/11 al 18/11 y solo para las primeras 30 compras. Son pocas unidades: el 11/11 te avisamos apenas esté disponible.

¿Dudas? Respondé este email o escribinos por WhatsApp.

Botón: Ver el cojín → https://www.nekova.com.ar/products/cojin-ortopedico-u

Nekova · Tu bienestar, en los detalles.
```

Enviar un **email de prueba** a info@nekova.com.ar, revisar que se vea bien y recién ahí **activar** la automatización.

## Paso 5 · Email del lanzamiento (programado para el 11/11)

Shopify → **Marketing → Crear campaña → Shopify Email**:
- **Destinatarios:** segmento `Lista de lanzamiento`.
- **Programar** para el **11/11/2026 a las 10:00** (hora de Argentina). **No enviar ahora.**

```
Asunto: ¡Ya llegó! Tu 15% OFF está activo
Texto de vista previa: Solo para las primeras 30 compras. Vence el 18/11.

Título: El cojín ya está disponible

Hoy lanzamos el primer lote del Cojín Ergonómico en U, en gris y azul marino.

Tu código: LISTA15
Precio con el código: $67.150 (en lugar de $79.000)

Vale hasta el 18/11 o hasta que se usen los 30 cupones, lo que pase primero. Son pocas unidades.

Botón: Comprar con mi 15% OFF → https://www.nekova.com.ar/products/cojin-ortopedico-u

Despacho en días hábiles · 10 días para devolverlo · Atención por WhatsApp
```

Enviar un email de prueba antes de programar.

## Paso 6 · Campaña en Meta Ads (dejarla EN PAUSA)

En **Meta Ads Manager** (cuenta publicitaria de Nekova), crear la campaña y **dejar todo en pausa / borrador**. El dueño la revisa y la activa.

### Campaña
- **Nombre:** `Nekova · Lista lanzamiento cojín · nov 2026`
- **Objetivo:** **Tráfico** (el píxel todavía no registra suscripciones como evento; si Meta ofrece el evento "Suscribirse" o "Cliente potencial" del sitio, usar **Clientes potenciales** con ese evento y avisarlo en el resumen).
- **Presupuesto de la campaña (Advantage):** diario. **Lo decidís vos** con tu guía/skill de Meta Ads (ver "Cómo definir el presupuesto", abajo).
- **Fechas:** del **24/10/2026** al **10/11/2026 23:59**.

### Cómo definir el presupuesto

El dueño delega en vos esta decisión: **elegí el presupuesto diario usando la guía/skill de campañas de Meta Ads que ya tenés** (libros, recomendaciones y estrategias). No uses un número genérico: justificalo con esa guía y con estos datos del negocio:

- **Margen por cojín con el cupón:** precio 9.000 − 15% = 7.150. Después de costo puesto (~0.400) y comisiones e impuestos (~.900, calculadas sobre el precio de lista), quedan **~.900 por venta antes de publicidad**.
- **Cupos:** 30 compras con descuento (40 cojines en total). Cada compra con cupón requiere un suscriptor; con una conversión de la lista de 5 a 10%, hacen falta **300 a 600 suscriptores** para llenar los 30 cupos.
- **Costo máximo razonable por suscriptor:** **50 a 00**.
- **Duración:** del 24/10 al 10/11 (18 días), con **2 conjuntos** (AMBA e Interior) y 4 anuncios cada uno; el presupuesto es de campaña (Advantage), así que Meta lo reparte.
- Necesita alcanzar la **fase de aprendizaje** de Meta y dejar datos para comparar conjuntos y anuncios.
- Es la **primera campaña** de la marca: cuenta y píxel sin historial.

En el resumen final, dejá el número elegido y una explicación corta: qué principios de tu guía usaste, cuánto suma en total en los 18 días, cuántos suscriptores esperás y con qué costo por suscriptor, y en qué momento conviene revisarlo (por ejemplo, a los 3 o 4 días) y con qué criterio subirlo, bajarlo o cortar anuncios. **Cargalo en la campaña, pero dejala en pausa**: el dueño lo aprueba antes de activarla.

### Conjuntos de anuncios (2)

| | Conjunto A · AMBA | Conjunto B · Interior |
|---|---|---|
| Nombre | `AMBA` | `Interior` |
| Ubicación | Ciudad Autónoma de Buenos Aires + radio de 40 km | Argentina, **excluyendo** CABA + radio de 40 km |
| Edad | 25 a 60 | 25 a 60 |
| Intereses (segmentación detallada) | Teletrabajo, Oficina en casa, Ergonomía, Muebles de oficina | igual |
| Ubicaciones | Advantage+ (automáticas) | igual |
| Optimización | Visitas a la página de destino | igual |

### Anuncios (los mismos 4 en cada conjunto)

- **Imágenes:** `G:\Ryzen5\Documentos\GitHub\nekova.com.ar\marca\anuncios\` (PNG 1080 × 1350).
- **URL de destino (todos):** `https://www.nekova.com.ar/pages/lista-de-lanzamiento?utm_source=meta&utm_medium=paid&utm_campaign=lista-lanzamiento`
- **Botón (CTA):** **Registrarte**.
- Identidad: página de Facebook de Nekova e Instagram @nekova_ok.

| Anuncio | Imagen | Texto principal | Título | Descripción |
|---|---|---|---|---|
| 1 · Oferta | `lanzamiento-1-oferta.png` | Lanzamos el primer lote de nuestro cojín ergonómico en U el 11/11 🎉 Anotate gratis y recibí al instante un código de 15% OFF. Solo para las primeras 30 compras. | Tu cojín con 15% OFF | Anotate gratis |
| 2 · Precio | `lanzamiento-2-precio.png` | El Cojín Ergonómico en U cuesta $79.000. Si te anotás en la lista, lo pagás $67.150 el día del lanzamiento 👇 Código para las primeras 30 compras, del 11/11 al 18/11. | Pagalo $67.150 | Primeras 30 compras |
| 3 · Silla | `lanzamiento-3-silla.png` | Imaginá tu silla de todos los días, pero más cómoda 🪑 Espuma viscoelástica, ranura en U y funda lavable. Anotate en la lista y llevate 15% OFF en el lanzamiento. | Más cómodo al sentarte | 15% OFF para la lista |
| 4 · Cupones | `lanzamiento-4-cupones.png` | Primer lote, pocas unidades: solo hay 30 cupones de 15% OFF para el cojín ergonómico. Anotate gratis y te llega el código al instante 📩 | Solo 30 cupones | Se usa desde el 11/11 |

Al terminar: **todo en pausa**. Captura de la estructura (campaña, 2 conjuntos, 8 anuncios) y de la vista previa de un anuncio en Instagram y en Facebook.

## Reglas (importantes)

- **No activar la campaña de Meta ni gastar dinero.** Todo queda en pausa.
- **No enviar emails ahora**: solo pruebas a info@nekova.com.ar. La automatización se activa recién después de la prueba (Paso 4). La campaña del 11/11 queda **programada**.
- **No cambiar precios, stock, productos, envíos ni otros descuentos** (las plantillas tienen descuentos automáticos por cantidad: no tocarlos).
- **No tocar el tema** ni el menú.
- **No iniciar sesión ni manejar contraseñas o códigos**: la sesión la abre el dueño.
- Si algo no coincide con este brief, **parar y avisar** en vez de improvisar.

## Al terminar

Dejar un resumen con:
- Link de la página creada y captura.
- Configuración del código `LISTA15` (captura).
- Estado de la automatización (activa, con su condición) y del email del 11/11 (programado, fecha y hora).
- Estructura de la campaña de Meta en pausa, con capturas.
- **El presupuesto diario elegido**, con su justificación según tu guía de Meta Ads, el total estimado de la campaña y los criterios para revisarlo.
- Cualquier problema o cosa que haya quedado sin hacer.

---

### Para el dueño (no es parte del encargo)

**Antes de que Claude Desktop arranque**
- El presupuesto diario lo propone Claude Desktop con su guía de Meta Ads (Paso 6) y queda cargado con la campaña en pausa: revisá su propuesta y el total de los 18 días antes de activarla. Referencia: cada suscriptor no debería costar más de **$350 a $700**. Mirarlo a los 3 o 4 días y cortar los anuncios que estén muy por encima.
- El tema (con la página nueva) tiene que estar publicado: se sube con `main`.

**Mientras corre (24/10 al 10/11)**
- Poner el link de la página en la bio de Instagram.
- Revisar cada 2 o 3 días: costo por clic, visitas a la página y cuántos clientes nuevos con la etiqueta `lista-lanzamiento` hay (Clientes → segmento "Lista de lanzamiento").
- Probar vos mismo el formulario con un email tuyo y confirmar que llega el código. Ojo: si un email ya era cliente (por ejemplo, se suscribió en el footer), puede que Shopify no le agregue la etiqueta; revisarlo y agregarla a mano si falta.

**El 11/11**
- Cargar el stock (20 gris + 20 azul marino) **antes de las 10:00**, cuando sale el email.
- Mirar Descuentos → `LISTA15` ("X de 30 usados") un par de veces en el día.

**Cuando se agoten los 30 cupones**
1. Tema → página "Lista de lanzamiento" → activar **"Cupones agotados"**.
2. Pausar la automatización de bienvenida o cambiar el email por uno sin código.
3. Si la campaña de Meta sigue activa, pausarla.
