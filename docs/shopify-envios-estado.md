# Envíos en Shopify: cómo quedó configurado (octubre de 2026)

Estado real después de los cambios hechos con Claude Desktop. El brief original ([shopify-envios-encargo.md](shopify-envios-encargo.md)) suponía otra configuración; este archivo manda.

## Origen

Todos los envíos salen desde **Longchamps, Buenos Aires (provincia), CP 1854** (AMBA), con **Correo Argentino**. La calle de la ubicación la carga el dueño en Configuración → Ubicaciones.

## Perfil general (único perfil, sin apps de tarifas)

Tarifas por **peso** del pedido (productos + paquete predeterminado), plazo 1 a 2 días hábiles:

| Zona | Standard, 0 a 1 kg | Standard, desde 1,01 kg | Gratis |
|---|---|---|---|
| AMBA (2 provincias) | $7.990 | $12.990 | desde $95.000 |
| Centro (4) | $10.490 | $16.990 | desde $95.000 |
| Cuyo, Norte y Patagonia norte (11) | $11.490 | $18.990 | desde $95.000 |
| Extremos (7) | $11.490 | $20.990 | desde $95.000 |

- Pedidos de hasta 1 kg (plantillas, tapones o las dos cosas, hasta ~6 pares) pagan la tarifa chica. Cualquier pedido con un cojín pasa de 1 kg y paga la del cojín: un solo envío aunque lleve otros productos.
- "Gratis" depende del precio y convive con "Standard": desde $95.000 el cliente ve las dos y elige la gratis.

## Pesos por variante

| Producto | Peso |
|---|---|
| Cojín (2 variantes) | 1,5 kg |
| Plantillas (6 variantes) | 0,15 kg |
| Tapones (2 variantes) | 0,08 kg |

**El cojín tiene que pesar siempre más de 1 kg cargado** (con el paquete), si no pagaría la tarifa chica.

## Paquetes y embalaje

El dueño prefiere **bolsas de envío** (polietileno) siempre que se pueda: plantillas, tapones y también un cojín solo. La caja queda para 2 cojines o más.

| Paquete | Medidas | Peso vacío | Para |
|---|---|---|---|
| **Nekova · Bolsa chica** (predeterminado) | 35 × 45 × 4 cm | 0,02 kg | 1 a 3 pares de plantillas, tapones o las dos cosas |
| Nekova · Bolsa mediana | 40 × 50 × 8 cm | 0,03 kg | 4 a 6 pares de plantillas |
| Nekova · Bolsa cojín | 60 × 70 × 14 cm (80 a 100 micrones) | 0,05 kg | 1 cojín, solo o con productos chicos |
| Cojín (caja) | 45 × 40 × 15 cm | 0,2 kg | 2 cojines o más |

- Shopify suma el peso del paquete **predeterminado** a todos los pedidos: tiene que ser uno liviano. Con la caja "Cojín" de 0,8 kg como predeterminada, 2 pares de plantillas pagaban la tarifa del cojín.
- Los paquetes no cambian lo que paga el cliente (las tarifas son fijas por peso); sirven de referencia al despachar.
- Al cargar el envío en MiCorreo, declarar las medidas de la bolsa **llena** (ej. plantillas 35 × 25 × 4 cm). El cojín se cobra por volumen igual en bolsa que en caja.
- Cada par de plantillas va en su envoltorio individual dentro de la bolsa, así se puede devolver "en su envase".
- 2 o 3 cojines siempre tienen envío gratis (más de $95.000): cotizar en MiCorreo una caja grande vs. un envío por cojín y despachar el más barato.

## Pendiente

- Probar el checkout hasta la pantalla de envío (sin pagar) cuando haya stock: 1 par de plantillas y 1 cojín.
- Pesar y medir los productos embalados cuando llegue la mercadería y corregir si hace falta.
