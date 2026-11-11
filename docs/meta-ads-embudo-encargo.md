# Encargo: campañas de Meta Ads (embudo Seguidores + WhatsApp)

Para Claude Desktop (con navegador). Armar dos campañas en el Administrador de anuncios de Meta, cuenta publicitaria de Nekova **ID 2492377254519803**.

**Reglas:**
- La sesión de Meta la abre el dueño. No escribas contraseñas ni códigos.
- Creá todo **en pausa**. El dueño lo revisa y lo activa.
- Si algo del panel no coincide con estas instrucciones (un nombre de opción, una función que no aparece), elegí lo más parecido y anotá qué hiciste.

## 0. Antes de empezar

1. Revisá que la campaña de la **lista de lanzamiento** (LISTA15) y la del **Cyber Nekova** estén apagadas. Ya no se usan.
2. Revisá que el número de WhatsApp Business **+54 9 11 7812-4323** esté conectado a la página de Facebook de Nekova y a la cuenta publicitaria.

## 1. Públicos personalizados

Crealos en Audiencias.

**«Nekova · Cálido 90d»:** un solo público que incluye a cualquiera de estas personas:
- Interactuaron con la cuenta de Instagram @nekova_ok en los últimos 90 días.
- Interactuaron con la página de Facebook Nekova en los últimos 90 días.
- Vieron al menos el 50% de cualquier video de la cuenta en los últimos 90 días. Si pide elegir videos, seleccioná todos los de los anuncios de este encargo y los reels publicados.
- Visitaron nekova.com.ar en los últimos 30 días (píxel o API de Conversiones de Shopify).
- Enviaron un mensaje a la página o al WhatsApp en los últimos 90 días, si esa fuente está disponible.

**«Nekova · Compradores 180d»:** personas que hicieron el evento **Purchase** en la web en los últimos 180 días.

**«Nekova · Interacción IG 365d»:** personas que interactuaron con @nekova_ok en los últimos 365 días. Sirve para dejar afuera a los seguidores actuales.

## 2. Campaña «Nekova · Seguidores IG · Descubrimiento»

**Campaña:**
- Objetivo: **Interacción**.
- Presupuesto **de campaña** (Advantage+): **$10.000 ARS por día**.
- Estrategia de puja: mayor volumen.

**Conjunto «Frío · Argentina»:**
- Ubicación de la conversión: **Perfil de Instagram**.
- Optimización: seguidores de Instagram si aparece la opción; si no, visitas al perfil de Instagram.
- Público: Argentina, 22 a 60 años, todos los géneros, con el público Advantage+ activado.
- Excluir: «Nekova · Interacción IG 365d» y «Nekova · Compradores 180d».
- Ubicaciones: Advantage+.

**Anuncios:** 5 anuncios. Los archivos están en `marca/anuncios/meta/instagram-seguidores/`.

En los videos, cargá las dos medidas en el **mismo anuncio** y asigná cada una a sus ubicaciones:
- 9x16: Reels e Historias.
- 4x5: Feed.

Si hay portada, usala como miniatura en su formato.

| Anuncio | Archivos | Texto principal |
|---|---|---|
| IG1 · Cojín seguinos | `IG1-cojin-seguinos-9x16.mp4` + `-4x5.mp4` | ¿Muchas horas sentado? 🪑 Seguinos en @nekova_ok: ideas simples para estar más cómodo todos los días. |
| IG2 · Plantillas seguinos | `IG2-plantillas-seguinos-9x16.mp4` + `-4x5.mp4` | ¿Muchas horas de pie? 👟 Seguinos en @nekova_ok: ideas simples para que tus días sean más cómodos. |
| IG3 · Carrusel hábitos | `IG3-carrusel-habitos-1.png` a `-5.png`, en ese orden, como **carrusel** | Hábitos simples para pasar horas sentado más cómodo. Guardalo y seguinos para más 💙 |
| IG4 · Por dentro | `IG4-por-dentro-9x16.mp4` + `-4x5.mp4` (portadas `IG4-por-dentro-portada-*`) | ¿Qué tiene adentro un cojín Nekova? 👀 Te lo mostramos. Seguinos para ver más. |
| IG5 · El problema no es la silla | `IG5-el-problema-no-es-la-silla-9x16.mp4` + `-4x5.mp4` (portadas incluidas) | El problema no siempre es la silla 🪑 Seguinos: tips para estar más cómodo cada día. |

Los textos van sin precio y sin link a la web. En esta etapa solo se busca que la gente siga la cuenta.

**Reserva:** está en la subcarpeta `reserva/`. No lo cargues ahora: se usa cuando haya que reemplazar anuncios que dejaron de rendir.
- `IG6-pasas-horas-sentado` (video).
- `IG7-carrusel-plantillas-1..4` (carrusel).

## 3. Campaña «Nekova · WhatsApp · Ventas»

**Campaña:**
- Objetivo: **Interacción** (o **Ventas**, si es la única opción con WhatsApp como destino).
- Ubicación de la conversión: **Apps de mensajes → WhatsApp**.
- Presupuesto **por conjunto**, no de campaña, para que se respete el reparto.
- Estrategia de puja: mayor volumen.

**Conjuntos:**

| Conjunto | Presupuesto diario | Público | Excluir |
|---|---|---|---|
| **Frío** | **$6.500** | Argentina, 22 a 60 años, público Advantage+ activado | «Nekova · Cálido 90d» y «Nekova · Compradores 180d» |
| **Cálido** | **$3.500** | «Nekova · Cálido 90d» | «Nekova · Compradores 180d» |

En los dos conjuntos:
- Optimización: conversaciones.
- Ubicaciones: Advantage+.

**Mensaje de bienvenida por anuncio:** usá una plantilla de mensaje de WhatsApp con el texto inicial que figura en cada fila. Así se sabe de qué producto viene cada consulta.
- Cojín: «Hola, quiero info del Cojín Ergonómico Nekova».
- Somnia: «Hola, quiero info de la Almohada Nekova Somnia».

Los archivos están en `marca/anuncios/meta/whatsapp/frio/` y `marca/anuncios/meta/whatsapp/calido/`. Hay 9x16 y 4x5 en el mismo anuncio, con su portada, igual que en la campaña de seguidores.

**Ningún anuncio lleva precio,** ni en el video ni en el texto: los precios pueden cambiar mientras estamos probando. A cambio, cada anuncio promete un **descuento exclusivo para quien escribe por WhatsApp**: el código NKV10 (ver punto 4). El monto del descuento no se escribe en el anuncio.

**Conjunto Frío (6 anuncios):**

| Anuncio | Archivos | Texto principal | Título |
|---|---|---|---|
| F1 · Imaginá tu silla | `F1-cojin-imagina-tu-silla-*` | Imaginá tu silla de siempre, más cómoda 🪑 Cojín Ergonómico en U de espuma viscoelástica. Escribinos y te pasamos un descuento exclusivo 👇 | Tu silla, más cómoda |
| F2 · Abrimos uno | `F2-cojin-abrimos-uno-*` | Abrimos uno para que veas cómo es por dentro 👀 Cojín Ergonómico en U, con envío a todo el país. Escribinos y te pasamos un descuento exclusivo 👇 | Mirá cómo es por dentro |
| F3 · Ruta larga | `F3-cojin-ruta-larga-*` | ¿Muchas horas al volante? 🚗 El Cojín Ergonómico en U también va en el auto. Escribinos y te pasamos un descuento exclusivo 👇 | También para el auto |
| F4 · ¿Qué preferís? | `F4-que-preferis-*` | ¿Silla nueva o cojín? 🪑 Sumale comodidad a la silla que ya tenés, sin gastar una fortuna. Escribinos y te pasamos un descuento exclusivo 👇 | ¿Silla nueva o cojín? |
| F5 · Antes y después | `F5-tu-silla-antes-y-despues-*` | Misma silla. Más cómoda 🪑 Cojín Ergonómico en U, con 10 días para devolverlo. Escribinos y te pasamos un descuento exclusivo 👇 | Misma silla, más cómoda |
| F6 · Somnia toma forma | `F6-somnia-toma-forma-*` | Imaginá apoyar la cabeza y que tu almohada tome tu forma 😴 Almohada Nekova Somnia. Escribinos y te pasamos un descuento exclusivo 👇 | Descansá más cómodo |

F1 a F5 usan el saludo del cojín y F6 el de Somnia.

**Conjunto Cálido (4 anuncios):**

| Anuncio | Archivos | Texto principal | Título |
|---|---|---|---|
| C1 · Cojín ya disponible | `C1-cojin-whatsapp-*` | Ya disponible ✅ Cojín Ergonómico en U, con envío gratis y 10 días para devolverlo. Escribinos y te pasamos un descuento exclusivo 👇 | Ya disponible |
| C2 · Somnia ya disponible | `C2-somnia-whatsapp-*` | Ya disponible ✅ Almohada Nekova Somnia, con envío gratis y 10 días para devolverla. Escribinos y te pasamos un descuento exclusivo 👇 | Ya disponible |
| C3 · Del paquete a tu silla | `C3-del-paquete-a-tu-silla-*` | Así llega y así queda en tu silla 📦 Cojín Ergonómico en U, con despacho en días hábiles. Escribinos y te pasamos un descuento exclusivo 👇 | Del paquete a tu silla |
| C4 · Somnia 3 hábitos | `C4-somnia-3-habitos-*` | 3 hábitos para descansar mejor, y una almohada que acompaña 😴 Nekova Somnia. Escribinos y te pasamos un descuento exclusivo 👇 | Descansá mejor |

C1 y C3 usan el saludo del cojín; C2 y C4, el de Somnia.

**Antes de publicar,** confirmá con el dueño que la tarifa de envío gratis desde $55.000 está activa en Shopify → Envíos. Si no lo está, sacá «con envío gratis y» de C1 y C2.

**Regla de textos:**
- No escribas precios, «alivia», «dolor», «postura», «ortopédico», «cervical» ni «garantía».
- Hablá de comodidad, apoyo y descanso.

## 4. Código de descuento NKV10

**Ya está creado en Shopify.** No crees otro ni lo modifiques.

Se comparte solo por WhatsApp, de una de estas dos formas:
- **Link:** https://www.nekova.com.ar/discount/NKV10. Al abrirlo, el descuento queda aplicado en el carrito.
- **QR:** el archivo `marca/anuncios/meta/whatsapp/nkv10-qr.png` lleva al mismo link.

En Shopify → Análisis → Informes → «Ventas por código de descuento», las ventas con NKV10 son las que vinieron por WhatsApp. Es la forma de medir cuánto vende la campaña.

## 5. WhatsApp Business: lo configura el dueño desde el celular

**Paso manual: Claude Desktop no tiene acceso a la app.** Hacelo antes de activar la campaña de WhatsApp.

El anuncio solo abre el chat con el mensaje inicial ya escrito. Nada se contesta solo hasta que actives el mensaje de bienvenida.

**1. Mensaje de bienvenida** (manda el código automáticamente): en la app, andá a **Herramientas para la empresa → Mensaje de bienvenida**, activalo, elegí **Todos** como destinatarios y pegá:

```
¡Hola! Gracias por escribirle a Nekova 🙌
Tu descuento exclusivo es NKV10. Entrá desde este link y ya queda aplicado:
https://www.nekova.com.ar/discount/NKV10
Contanos qué producto te interesa y te ayudamos.
```

Le llega a quien te escribe por primera vez, o después de 14 días sin hablar con vos.

**2. Mensaje de ausencia** (opcional): andá a **Herramientas para la empresa → Mensaje de ausencia**, configurá tu horario y pegá:

```
¡Gracias por escribirnos! Ahora estamos fuera de horario, te respondemos apenas volvamos 🙌
```

**3. Respuestas rápidas**: andá a **Herramientas para la empresa → Respuestas rápidas → +** y cargá cada una de las de abajo con su atajo. No se mandan solas: en el chat escribís `/` y elegís una. Los precios no van en las respuestas: se mandan con el link, así siempre están actualizados.

- **/codigo:** ¡Gracias por escribirnos! 🙌 Tu descuento exclusivo es **NKV10**. Entrá desde este link y ya queda aplicado: https://www.nekova.com.ar/discount/NKV10. ¿Te ayudo con algo más?
- **/cojin:** Acá ves el Cojín Ergonómico en U, con el precio actualizado (color gris): https://www.nekova.com.ar/products/cojin-ortopedico-u. Con el código NKV10 tenés tu descuento al pagar.
- **/somnia:** Acá ves la Almohada Nekova Somnia, con el precio actualizado: https://www.nekova.com.ar/products/almohada-nekova-somnia. Con el código NKV10 tenés tu descuento al pagar.
- **/envio:** Despachamos los pedidos hechos antes de las 13:00hs en días hábiles; si no, el día hábil siguiente. Enviamos a todo el país, gratis desde $55.000.
- **/devolucion:** Tenés 10 días desde que lo recibís para devolverlo.
- **/pago:** Pagás seguro en la web con los medios de pago habilitados.

Hoy el azul marino del cojín está agotado. Si alguien lo pide, ofrecé el gris o anotá la consulta para avisarle cuando vuelva.

## 6. Qué entregarle al dueño

1. Captura o lista de las 2 campañas, 3 conjuntos y 15 anuncios, en pausa, con presupuestos y públicos.
2. Avisos o rechazos del panel, si los hubo.
3. Recordatorio de cómo seguirlas:
   - No tocar nada durante 7 días.
   - Mirar costo por seguidor nuevo y costo por conversación.
   - Mínimos de referencia: 15% de interacción en los videos; 0,5% de conversaciones sobre el alcance.
   - Si el conjunto cálido pasa de 4 de frecuencia semanal, bajarle presupuesto y pasarlo al frío.
   - Anotar a mano cuántas conversaciones terminan en venta.
