-- Datos de ejemplo (opcional) para probar el catálogo.
-- Las fotos se pueden agregar después desde el panel /admin.
insert into public.vehiculos
  (marca, modelo, version, anio, kilometraje, combustible, transmision, precio, moneda, estado, destacado, descripcion)
values
  ('Toyota', 'Corolla', '1.8 XEi CVT', 2019, 62000, 'Nafta', 'Automática', 21500, 'USD', 'Disponible', true,
   'Único dueño. Service al día en concesionario oficial. Cubiertas nuevas.'),
  ('Volkswagen', 'Gol Trend', '1.6 Highline', 2017, 88000, 'Nafta', 'Manual', 9800, 'USD', 'Disponible', false,
   'Muy buen estado general. Aire acondicionado y dirección asistida.'),
  ('Ford', 'Ranger', '3.2 XLT 4x4', 2018, 120000, 'Diésel', 'Automática', 28900, 'USD', 'Reservado', true,
   'Cubre caja, enganche y cámara de retroceso.'),
  ('Chevrolet', 'Onix', '1.4 LTZ', 2016, 95000, 'GNC', 'Manual', 11500000, 'ARS', 'Disponible', false,
   'Equipo de GNC de 5ta generación con oblea al día.'),
  ('Toyota', 'Prius', '1.8 Híbrido', 2020, 45000, 'Híbrido', 'Automática', null, 'USD', 'Disponible', true,
   'Consumo mínimo. Consulte precio y financiación.');
