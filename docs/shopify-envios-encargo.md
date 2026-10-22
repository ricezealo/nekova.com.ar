# Encargo: cargar pesos de productos y tarifas de envío por peso en Shopify (Nekova)

> **Estado final:** la configuración real quedó distinta de lo que supone este brief (tarifas por zona que ya existían, pasadas a condición por peso). Ver [shopify-envios-estado.md](shopify-envios-estado.md).

Este archivo es el brief completo. No hace falta otro contexto.

## Contexto

- **Nekova** (nekova.com.ar) es una tienda Shopify argentina, con precios en pesos (ARS). Envía con **Correo Argentino**.
- **Todos los envíos salen desde Longchamps** (partido de Almirante Brown, provincia de Buenos Aires, **CP 1854**), que está dentro del AMBA.
- Hoy todas las tarifas de envío del **perfil general** se calcularon pensando en el **cojín**, que es grande (se cobra por volumen, como un paquete de 5 a 6,5 kg). Los productos chicos (plantillas y tapones) pagan esa misma tarifa, que les resulta demasiado cara.
- **Objetivo:** que los pedidos de hasta 1 kg (plantillas y tapones) paguen la tarifa chica de Correo Argentino y que cualquier pedido con un cojín siga pagando la tarifa actual. Todo **en un solo perfil de envío**, con tarifas según el peso del pedido. Así, si alguien compra cojín + plantillas, paga **un solo envío**.
- **No crear un perfil de envío aparte** para las plantillas: cuando el carrito mezcla productos de dos perfiles, Shopify suma las dos tarifas y el cliente pagaría dos envíos.

## Tarifas de Correo Argentino que se usan (referencia)

Correo Argentino cobra por **zona** según la provincia de destino. Saliendo de **Longchamps (CP 1854, AMBA)**, las zonas son las siguientes (tabla oficial "Lógica de zonas" de MiCorreo/Paq.Ar):

| Zona | Destinos |
|---|---|
| **Zona 1** | Mismo AMBA: CABA y Gran Buenos Aires (códigos postales 1000 a 1893, como Longchamps) |
| **Zona 2** | Buenos Aires (resto de la provincia), Córdoba, Entre Ríos, La Pampa, Santa Fe |
| **Zona 3** | Catamarca, Chaco, Corrientes, Formosa, La Rioja, Mendoza, Misiones, Neuquén, Río Negro, San Juan, San Luis, Santiago del Estero, Tucumán |
| **Zona 4** | Chubut, Jujuy, Salta, Santa Cruz, Tierra del Fuego |

Precio de lista de MiCorreo para un paquete de **hasta 1 kg** (octubre de 2026, con IVA):

| Zona | Clásico a sucursal | Clásico a domicilio |
|---|---|---|
| Zona 1 (AMBA) | ~$5.400 (estimado) | ~$8.500 (estimado) |
| Zona 2 | $6.739 | $10.227 |
| Zona 3 | $7.415 | $11.140 |
| Zona 4 | $7.745 | $11.221 |

**Decisión del dueño:** cobrar **una sola tarifa para todo el país** en pedidos de hasta 1 kg: **$7.800 a sucursal** y **$11.300 a domicilio**. Cubren la zona más cara (zona 4), así ningún envío sale a pérdida. Esta tabla es solo de referencia: **no crear zonas nuevas en Shopify** por provincia.

## Paso 0 · Relevar antes de tocar nada

Entrar a **Shopify → Configuración → Envío y entrega → Perfil general** (Envío) y anotar exactamente lo que hay:

1. Las **zonas** (por ejemplo "Argentina", o una por provincia o región).
2. En cada zona, cada **tarifa**: nombre, precio y condición (sin condición, por peso o por precio del pedido).
3. Si hay tarifas **calculadas por una app** (por ejemplo una app de Correo Argentino que cotiza en vivo), un **envío gratis** o **retiro en persona**.
4. Si existe algún **perfil de envío personalizado** además del general, y qué productos tiene.
5. **Origen de los envíos:** en el perfil general, sección **"Enviar desde"**, y en **Configuración → Ubicaciones**, anotar la dirección de la ubicación desde la que se despacha. Tiene que estar en **Longchamps, Buenos Aires, CP 1854**. **No cambiarla**: si dice otra localidad o CP, avisar al dueño al final (él tiene la dirección exacta).
6. En **Configuración → Envío y entrega → Paquetes**, anotar qué paquetes hay y cuál es el predeterminado.

**Detenerse y avisar al dueño, sin cambiar nada, si:**
- las tarifas son calculadas por una app (no son tarifas fijas), o
- existe otro perfil personalizado con alguno de estos productos.

En cualquier otro caso, seguir.

## Paso 1 · Cargar el peso y las medidas

Shopify guarda el **peso** en cada variante del producto. Las **medidas** no van en el producto: se cargan como **paquetes** (Configuración → Envío y entrega → Paquetes). Hoy las tarifas son fijas por peso, así que las medidas no cambian el precio del envío, pero sirven para cotizar con Correo Argentino y para una futura app que calcule tarifas en vivo.

### 1a. Peso de cada variante

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

### 1b. Paquetes con las medidas

Shopify → **Configuración → Envío y entrega → Paquetes** → **Agregar paquete**. Crear estos (tipo **Caja** o **Sobre/bolsa** según corresponda), con las medidas en cm y el peso del paquete vacío:

| Nombre del paquete | Tipo | Largo × Ancho × Alto | Peso vacío | Para |
|---|---|---|---|---|
| Nekova · Caja cojín | Caja | **50 × 40 × 13 cm** | 0,2 kg | 1 cojín (con o sin otros productos chicos) |
| Nekova · Paquete chico | Caja | **30 × 12 × 8 cm** | 0,05 kg | 1 a 3 pares de plantillas y/o tapones |
| Nekova · Sobre | Sobre/bolsa | **32 × 22 × 3 cm** | 0,02 kg | 1 par de plantillas o tapones solos |

- Si ya existe un paquete predeterminado, **no cambiarlo**. Si no hay ninguno, marcar como predeterminado **Nekova · Paquete chico**.
- Si ya hay paquetes con esas medidas, no duplicarlos: anotarlos y seguir.

Medidas de cada producto ya embalado, para la ficha del resumen final:

| Producto | Medidas embalado | Peso embalado |
|---|---|---|
| Cojín (48 × 38 × 12 cm sin embalar) | 50 × 40 × 13 cm | ~1,5 kg (se cobra por volumen: ~5 a 6,5 kg) |
| Plantillas, 1 par | 30 × 12 × 3 cm | ~0,15 kg |
| Plantillas, 3 pares | 30 × 12 × 8 cm | ~0,45 kg |
| Tapones con estuche | 10 × 8 × 5 cm | ~0,08 kg |

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
- **No cambiar precios de productos, stock, descuentos, impuestos, la dirección de la ubicación ni el resto de la configuración.**
- **No borrar tarifas**: solo agregar condiciones y tarifas nuevas.
- **No instalar apps** ni conectar servicios.
- **No iniciar sesión ni manejar contraseñas o códigos de verificación**: la sesión la abre el dueño.
- **No hacer compras** ni completar ningún pago.
- Si algo no coincide con este brief (otra moneda, otras unidades, zonas raras, tarifas de app), **parar y avisar** en vez de improvisar.

## Al terminar

Dejar un resumen con:
- Lo relevado en el Paso 0: zonas y tarifas **antes** de los cambios, con nombres y precios.
- Los pesos cargados por producto y variante (confirmar las 6 variantes de las plantillas) y los paquetes creados.
- La dirección de origen que figura (debería ser Longchamps, CP 1854).
- Las tarifas de cada zona **después** de los cambios, con condición y precio.
- El resultado de la prueba del checkout, si se pudo hacer.
- Cualquier problema o cosa que haya quedado sin hacer.
- Captura de la pantalla del **Perfil general** con las zonas y tarifas finales.

---

### Nota para el dueño (no es parte del encargo)

- $7.800 y $11.300 salen de las tarifas de lista de MiCorreo para 1 kg saliendo del AMBA, como Longchamps (octubre de 2026), redondeadas al valor de la zona más cara (zona 4). Las zonas salen de la tabla oficial de Paq.Ar de enero de 2025: la lógica de zonas no cambió, pero los precios sí, así que los de la zona 1 son una estimación a partir de esa tabla actualizada al aumento de las otras zonas.
- En AMBA (zona 1) el envío real cuesta ~$2.400 a $2.800 menos que lo que se cobra. Si más adelante se quiere ajustar, se puede crear en Shopify una zona "Ciudad Autónoma de Buenos Aires" con tarifas más bajas. Shopify no separa el Gran Buenos Aires del resto de la provincia, así que el GBA seguiría con la tarifa general.
- Los pesos son estimados con embalaje. Cuando llegue la mercadería, pesar un cojín y un par de plantillas embalados y corregir si hace falta.
- Si después se conecta una app de Correo Argentino que cotice en vivo, hay que cargar también las medidas de la caja: el cojín se cobra por volumen.
