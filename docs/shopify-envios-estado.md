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

## Paquetes

| Paquete | Medidas | Peso vacío |
|---|---|---|
| **Nekova · Paquete chico** (predeterminado) | 30 × 12 × 8 cm | 0,05 kg |
| Cojín | 45 × 40 × 15 cm | 0,2 kg |
| Nekova · Sobre | 32 × 22 cm | 0,02 kg |

Shopify suma el peso del paquete **predeterminado** a todos los pedidos: tiene que ser uno liviano. Con "Cojín" de 0,8 kg como predeterminado, 2 pares de plantillas pagaban la tarifa del cojín.

## Pendiente

- Probar el checkout hasta la pantalla de envío (sin pagar) cuando haya stock: 1 par de plantillas y 1 cojín.
- Pesar y medir los productos embalados cuando llegue la mercadería y corregir si hace falta.
