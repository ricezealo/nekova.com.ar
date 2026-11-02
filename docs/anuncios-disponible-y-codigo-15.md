# Productos disponibles: anuncios nuevos, código 15% y contenido actualizado (29/10/2026)

Situación: el **cojín (solo gris)** y la **Almohada Nekova Somnia** ya están a la venta. Las plantillas llegan en unas 2 semanas. El **lanzamiento oficial sigue siendo el 11/11**. No hay sorteo.

## 1 · Anuncios (campaña "Nekova · Seguidores IG · Descubrimiento", AMBA e Interior)

**Pausar:**
- S2 · Video plantillas (los 2): las plantillas todavía no se pueden comprar.
- S4 · Carrusel plantillas (los 2): lo mismo.
- S5 · Reel Por dentro (los 2): dice "Lanzamiento 11/11" y "Gris o azul marino".

Reactivar S2 y S4 cuando lleguen las plantillas.

**Dejar activos:** S1 · Video cojín y S3 · Carrusel 3 hábitos.

**Nuevos** (mismo destino que los actuales: perfil de Instagram). Archivos en `marca/instagram/anuncios/`:

### S6 · Cojín ya disponible (`ad-cojin-disponible.mp4`, portada `ad-cojin-disponible-portada.jpg`)
```
Texto principal: Ya disponible: el cojín ergonómico en U de Nekova 🪑 Espuma viscoelástica que vuelve a su forma, para la silla o el auto. Seguinos en @nekova_ok para no perderte las promos.
Título: Cojín ergonómico Nekova
```

### S7 · Somnia ya disponible (`ad-somnia-disponible.mp4`, portada `ad-somnia-disponible-portada.jpg`)
```
Texto principal: Nueva: Almohada Nekova Somnia 🌙 Llega enrollada y al vacío, tiene una zona para cada postura y funda con cierre lavable. Seguinos en @nekova_ok para no perderte las promos.
Título: Almohada Nekova Somnia
```

Los videos no nombran fechas ni promociones, así que sirven todo noviembre: Cyber Nekova (20%, del 2 al 6/11) y el 15% del 11/11 al 18/11 se comunican en historias, publicaciones y emails.

## 2 · Código 15% para suscriptos (11/11 al 18/11)

**Shopify → Descuentos → `LISTA15` → Editar** (o crearlo como "Descuento en el pedido" si no se puede cambiar el tipo):

| Campo | Valor |
|---|---|
| Tipo | **Monto de descuento en el pedido** (toda la tienda), 15% |
| Código | `LISTA15` (es el que ya recibió quien se anotó) |
| Elegibilidad | **Segmentos de clientes → "Suscriptores de email"** (consulta `email_subscription_status = 'SUBSCRIBED'`) |
| Usos máximos | ☐ sin límite total · ☑ **Limitar a un uso por cliente** |
| Combinaciones | Ninguna |
| Vigencia | del **11/11/2026 00:00** al **18/11/2026 23:59** |

Con la elegibilidad por segmento, el código solo funciona con el email suscripto, aunque alguien lo comparta.

**Email de bienvenida** (Marketing → Automatizaciones): cambiar el texto por este.
```
Asunto: Tu código de 15% OFF ya está acá 🎉

Gracias por suscribirte. Este es tu código de 15% OFF para usar en toda la tienda:

LISTA15

Vale del 11/11 al 18/11, en nuestro lanzamiento oficial, y una sola vez. Ingresalo al pagar, con este mismo email.

Ya podés ver el Cojín Ergonómico en U y la Almohada Nekova Somnia en nekova.com.ar.

¿Dudas? Respondé este email o escribinos por WhatsApp.
```

**Página de la lista:** actualizada en `templates/page.lista.json` y `sections/nekova-launch-list.liquid` (sin el límite de 30 cupones, para toda la tienda). Hay que subirla al tema. También cambiar en Shopify el título SEO de la página: `15% OFF en toda la tienda para suscriptos | Nekova`.

## 3 · Contenido programado que cambió

Archivos nuevos (reemplazan a los anteriores) en `marca/instagram/reels-noviembre/` y `marca/instagram/somnia/`. Donde aparecía el cojín azul ahora está el gris:

| Fecha | Pieza | Qué cambió |
|---|---|---|
| Vie 30/10 12:30 | r03 · Ruta | Foto final: solo gris |
| Sáb 31/10 12:30 | r07 · Común vs. Nekova | Foto final: solo gris |
| Lun 2/11 12:30 | r06 · 3 señales | Foto final: solo gris |
| Mar 3/11 12:30 | r08 · ¿Entra en tu silla? | Foto final: solo gris |
| Mar 3/11 | h04 · Historia LISTA | "Código para suscriptos", toda la tienda, sin "30 cupones" ni precio del cojín |
| 4/11 al 10/11 | h02 · Cuenta regresiva | "Lanzamiento oficial 11/11 · 15% OFF en toda la tienda para suscriptos" |
| Dom 8/11 20:00 | c01 · Escritorio | Foto del cojín gris |
| Mié 11/11 10:00 | r09 · Lanzamiento | "15% OFF · Lanzamiento oficial", sin "primer lote" |
| Mié 11/11 10:00 | h05 · Historia | "Lanzamiento oficial: 15% OFF en toda la tienda" |
| Jue 12/11 22:00 | somnia-c4 · Día y noche | Foto del cojín gris |
| Vie 13/11 20:00 | c02 · Regalos | Fotos del cojín gris |

**Textos nuevos:**

r09 · Lanzamiento (11/11):
```
Hoy es nuestro lanzamiento oficial 🎉 Si estás suscripto, tenés 15% OFF en toda la tienda con tu código, hasta el 18/11.

¿Todavía no? Suscribite en nekova.com.ar (link en la bio) y te llega al instante.
#nekova #lanzamiento #cojinergonomico
```

**Publicaciones del feed (Business Suite) para corregir a mano:**
- **Mié 4/11 · 11 "3 dudas sobre el cojín"**: cambiar "🎨 ¿Qué colores hay? Gris y azul marino." por "🎨 ¿Qué colores hay? Por ahora, gris." Si la placa muestra los dos colores, cambiarla.
- **Vie 6/11 · 9 "Ya casi estamos listos"**: ya no aplica porque el producto está a la venta y ese día es el último de Cyber Nekova. Reemplazar por un post de "Último día de Cyber Nekova".
- **Plantillas del 1/11 al 12/11** (8 publicaciones): está bien que digan "muy pronto". Si llegan antes, cambiá las últimas por "ya disponible".
