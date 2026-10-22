# Encargo: cargar pesos de productos y tarifas de envío por peso en Shopify (Nekova)

Este archivo es el brief completo. No hace falta otro contexto.

## Contexto

- **Nekova** (nekova.com.ar) es una tienda Shopify argentina, con precios en pesos (ARS). Envía con **Correo Argentino**.
- Hoy todas las tarifas de envío del **perfil general** se calcularon pensando en el **cojín**, que es grande (se cobra por volumen, como un paquete de 5 a 6,5 kg). Los productos chicos (plantillas y tapones) pagan esa misma tarifa, que les resulta demasiado cara.
- **Objetivo:** que los pedidos de hasta 1 kg (plantillas y tapones) paguen la tarifa chica de Correo Argentino y que cualquier pedido con un cojín siga pagando la tarifa actual. Todo **en un solo perfil de envío**, con tarifas según el peso del pedido. Así, si alguien compra cojín + plantillas, paga **un solo envío**.
- **No crear un perfil de envío aparte** para las plantillas: cuando el carrito mezcla productos de dos perfiles, Shopify suma las dos tarifas y el cliente pagaría dos envíos.

## Paso 0 · Relevar antes de tocar nada

Entrar a **Shopify → Configuración → Envío y entrega → Perfil general** (Envío) y anotar exactamente lo que hay:

1. Las **zonas** (por ejemplo "Argentina", o una por provincia o región).
2. En cada zona, cada **tarifa**: nombre, precio y condición (sin condición, por peso o por precio del pedido).
3. Si hay tarifas **calculadas por una app** (por ejemplo una app de Correo Argentino que cotiza en vivo), un **envío gratis** o **retiro en persona**.
4. Si existe algún **perfil de envío personalizado** además del general, y qué productos tiene.

**Detenerse y avisar al dueño, sin cambiar nada, si:**
- las tarifas son calculadas por una app (no son tarifas fijas), o
- existe otro perfil personalizado con alguno de estos productos.

En cualquier otro caso, seguir.

## Paso 1 · Cargar el peso de cada variante

Shopify → **Productos** → abrir cada producto → en **cada variante**, sección **Envío**:
- marcar **"Es un producto físico"**;
- cargar el **peso** en **kg**.

| Producto | Handle | Variantes | Peso por variante |
|---|---|---|---|
| Cojín Ergonómico en U de Espuma Viscoelástica | `cojin-ortopedico-u` | Gris, Azul marino | **1,5 kg** |
| Plantillas Nekova Confort | `plantillas-multitalle` | 6 (Negro / Gris / Naranja × 35 al 40 / 41 al 46) | **0,15 kg** |
| Tapones Auditivos Reutilizables de Silicona | `tapones-auditivos-silicona` | Negro, Blanco | **0,08 kg** |

- En las plantillas hay que cargar el peso en **las 6 variantes**. Si el editor permite **editar variantes en bloque** (seleccionar todas → Editar → Peso), usarlo.
- Si la tienda usa otra unidad (g o lb), convertir: 1,5 kg = 1500 g; 0,15 kg = 150 g; 0,08 kg = 80 g.
- **Guardar** cada producto.
- **No cambiar** precios, stock, SKU, títulos, descripciones, imágenes ni nada más del producto.

## Paso 2 · Tarifas por peso en el perfil general

En **cada zona** del perfil general donde se envíe dentro de Argentina:

### 2a. Las tarifas actuales pasan a ser "del cojín" (1 kg o más)

Para **cada tarifa existente** (por ejemplo "Envío a sucursal" y "Envío a domicilio"):
1. **Editar tarifa** → **Agregar condiciones** → **Según el peso del artículo**.
2. **Peso mínimo: 1,01 kg** · **Peso máximo:** vacío (sin límite).
3. **No cambiar el nombre ni el precio.**
4. Listo.

Si una tarifa ya tenía condiciones por peso, **no tocarla**: anotarla y avisar al final.

### 2b. Agregar las tarifas nuevas para pedidos chicos (hasta 1 kg)

En la misma zona, **Agregar tarifa** → **Usar tarifa fija**, una por cada modalidad que ya existía en esa zona:

| Nombre de la tarifa | Precio | Condición |
|---|---|---|
| Igual que la tarifa de sucursal existente (por ejemplo "Correo Argentino · Envío a sucursal") | **$7.800** | Según el peso del artículo: **0 kg a 1 kg** |
| Igual que la tarifa de domicilio existente (por ejemplo "Correo Argentino · Envío a domicilio") | **$11.300** | Según el peso del artículo: **0 kg a 1 kg** |

- **Usar el mismo nombre** que la tarifa equivalente del cojín, para que el cliente vea siempre la misma opción y solo cambie el precio.
- Si en la zona hay una sola modalidad (por ejemplo solo domicilio), crear solo la equivalente.
- Si la tarifa existente tiene un tiempo de entrega o una descripción, copiarlos igual.
- Si hay **retiro en persona** o **envío gratis**, **no tocarlos**.

### Resultado esperado en cada zona

| Tarifa | Condición | Precio |
|---|---|---|
| Envío a sucursal (chico) | 0 a 1 kg | $7.800 |
| Envío a domicilio (chico) | 0 a 1 kg | $11.300 |
| Envío a sucursal (cojín) | desde 1,01 kg | el precio que ya tenía |
| Envío a domicilio (cojín) | desde 1,01 kg | el precio que ya tenía |

### Cómo queda cada pedido (para revisar que esté bien)

| Pedido | Peso | Tarifa que debe ver el cliente |
|---|---|---|
| 1 par de plantillas | 0,15 kg | chica |
| 3 pares de plantillas | 0,45 kg | chica |
| Tapones | 0,08 kg | chica |
| Plantillas + tapones | 0,23 kg | chica |
| 1 cojín | 1,5 kg | la del cojín (como hoy) |
| Cojín + plantillas | 1,65 kg | la del cojín (un solo envío) |
| 2 cojines | 3 kg | la del cojín (como hoy) |

**Guardar** el perfil.

## Paso 3 · Comprobar

1. Volver a abrir el perfil general y verificar que cada zona quede como en "Resultado esperado".
2. Si algún producto tiene stock, **probar en la tienda** (nekova.com.ar): agregar al carrito → **Pagar** → cargar una dirección de prueba de otra provincia (por ejemplo Córdoba capital, CP 5000) hasta la pantalla de **Envío** y anotar las tarifas que aparecen. **No completar el pago**, no cargar datos de tarjeta. Después vaciar el carrito.
3. Si ningún producto tiene stock, no se puede probar el checkout: solo revisar la configuración.

## Reglas (importantes)

- **No crear perfiles de envío nuevos** ni mover productos de perfil.
- **No cambiar precios de productos, stock, descuentos, impuestos ni el resto de la configuración.**
- **No borrar tarifas**: solo agregar condiciones y tarifas nuevas.
- **No instalar apps** ni conectar servicios.
- **No iniciar sesión ni manejar contraseñas o códigos de verificación**: la sesión la abre el dueño.
- **No hacer compras** ni completar ningún pago.
- Si algo no coincide con este brief (otra moneda, otras unidades, zonas raras, tarifas de app), **parar y avisar** en vez de improvisar.

## Al terminar

Dejar un resumen con:
- Lo relevado en el Paso 0: zonas y tarifas **antes** de los cambios, con nombres y precios.
- Los pesos cargados por producto y variante (confirmar las 6 variantes de las plantillas).
- Las tarifas de cada zona **después** de los cambios, con condición y precio.
- El resultado de la prueba del checkout, si se pudo hacer.
- Cualquier problema o cosa que haya quedado sin hacer.
- Captura de la pantalla del **Perfil general** con las zonas y tarifas finales.

---

### Nota para el dueño (no es parte del encargo)

- $7.800 y $11.300 salen de las tarifas de lista de MiCorreo para 1 kg saliendo de Buenos Aires (octubre de 2026), redondeadas al valor de la zona más cara (Salta, Ushuaia). Antes de que Claude Desktop las cargue, conviene cotizar en MiCorreo un paquete de 30 × 12 × 8 cm y 0,5 kg a Salta. Si da distinto, cambiar los dos precios de este archivo.
- Los pesos son estimados con embalaje. Cuando llegue la mercadería, pesar un cojín y un par de plantillas embalados y corregir si hace falta.
- Si después se conecta una app de Correo Argentino que cotice en vivo, hay que cargar también las medidas de la caja: el cojín se cobra por volumen.
