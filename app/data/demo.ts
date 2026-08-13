export type NavId =
  | "resumen"
  | "espacios"
  | "inventario"
  | "pedidos"
  | "clientes"
  | "finanzas"
  | "portal"
  | "configuracion";

export const navItems: { id: NavId; label: string; glyph: string }[] = [
  { id: "resumen", label: "Resumen", glyph: "R" },
  { id: "espacios", label: "Espacios", glyph: "E" },
  { id: "inventario", label: "Inventario", glyph: "I" },
  { id: "pedidos", label: "Pedidos", glyph: "P" },
  { id: "clientes", label: "Clientes", glyph: "C" },
  { id: "finanzas", label: "Finanzas", glyph: "$" },
  { id: "portal", label: "Portal de venta", glyph: "↗" },
];

export const spaces = [
  {
    id: "NX-0001",
    name: "Luna Creativa",
    owner: "Marina Suárez",
    plan: "Pro",
    status: "Activo",
    sales: "$ 1.284.500",
    orders: 48,
    initials: "LC",
    tone: "coral",
  },
  {
    id: "NX-0002",
    name: "Pequeños Detalles",
    owner: "Carla Méndez",
    plan: "Esencial",
    status: "Activo",
    sales: "$ 684.200",
    orders: 27,
    initials: "PD",
    tone: "mint",
  },
  {
    id: "NX-0003",
    name: "Tinta & Magia",
    owner: "Sofía Rojas",
    plan: "Prueba",
    status: "Configurando",
    sales: "$ 0",
    orders: 0,
    initials: "TM",
    tone: "lilac",
  },
];

export const orders = [
  { id: "#1048", customer: "Camila Torres", item: "Combo mate + vaso térmico", total: "$ 38.400", status: "Nuevo" },
  { id: "#1047", customer: "Martín Sosa", item: "2 tazas personalizadas", total: "$ 24.600", status: "Preparando" },
  { id: "#1046", customer: "Lucía Pérez", item: "Vinilos Dragon Ball × 4", total: "$ 15.200", status: "Listo" },
  { id: "#1045", customer: "Rocío Díaz", item: "Llavero Minnie + taza", total: "$ 18.900", status: "Entregado" },
];

export const products = [
  { name: "Vinilo Dragon Ball", variant: "Grande · Goku", stock: 3, reserved: 1, price: "$ 5.800", state: "Bajo" },
  { name: "Taza cerámica", variant: "Blanca · 11 oz", stock: 24, reserved: 4, price: "$ 12.300", state: "Disponible" },
  { name: "Vaso térmico", variant: "Rosa · 500 ml", stock: 8, reserved: 2, price: "$ 22.900", state: "Disponible" },
  { name: "Llavero Minnie", variant: "Acrílico · 5 cm", stock: 0, reserved: 0, price: "$ 4.900", state: "Sin stock" },
];
