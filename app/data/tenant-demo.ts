export type TenantNavId = "inicio" | "inventario" | "clientes" | "proveedores" | "pedidos" | "portal" | "ajustes";

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  variant: string;
  stock: number;
  minStock: number;
  price: number;
  cost: number;
  published: boolean;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
};

export type Supplier = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  supplies: string;
};

export type OrderStatus = "Nuevo" | "Preparando" | "Listo" | "Entregado" | "Cancelado";

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  stockCommitted: boolean;
};

export type PortalSettings = {
  storeName: string;
  headline: string;
  description: string;
  whatsapp: string;
  accent: string;
  published: boolean;
};

export type TenantDemoState = {
  products: Product[];
  customers: Customer[];
  suppliers: Supplier[];
  orders: Order[];
  portal: PortalSettings;
};

export const tenantNavItems: { id: TenantNavId; label: string; glyph: string }[] = [
  { id: "inicio", label: "Inicio", glyph: "I" },
  { id: "inventario", label: "Productos y stock", glyph: "S" },
  { id: "clientes", label: "Clientes", glyph: "C" },
  { id: "proveedores", label: "Proveedores", glyph: "P" },
  { id: "pedidos", label: "Pedidos y ventas", glyph: "V" },
  { id: "portal", label: "Portal de ventas", glyph: "W" },
];

export const defaultTenantDemo: TenantDemoState = {
  products: [
    { id: "prd_01", name: "Taza Dragon Ball", sku: "TAZ-DB-001", category: "Tazas", variant: "Cerámica · 325 ml", stock: 8, minStock: 3, price: 12500, cost: 6900, published: true },
    { id: "prd_02", name: "Vaso térmico Minnie", sku: "VAS-MN-002", category: "Vasos térmicos", variant: "Acero · 500 ml", stock: 2, minStock: 3, price: 24500, cost: 14800, published: true },
    { id: "prd_03", name: "Llavero Stitch", sku: "LLA-ST-003", category: "Llaveros", variant: "Acrílico · 6 cm", stock: 14, minStock: 5, price: 4800, cost: 2100, published: true },
    { id: "prd_04", name: "Vinilo nombre personalizado", sku: "VIN-NO-004", category: "Vinilos", variant: "20 × 8 cm", stock: 21, minStock: 6, price: 7200, cost: 2300, published: true },
    { id: "prd_05", name: "Taza mágica personalizada", sku: "TAZ-MG-005", category: "Tazas", variant: "Negra · 325 ml", stock: 0, minStock: 2, price: 15800, cost: 8500, published: false },
    { id: "prd_06", name: "Botella infantil Disney", sku: "BOT-DI-006", category: "Botellas", variant: "Aluminio · 600 ml", stock: 5, minStock: 2, price: 18900, cost: 10500, published: true },
  ],
  customers: [
    { id: "cli_01", name: "Camila Torres", phone: "+54 9 11 6123-4490", email: "camila@email.com", notes: "Prefiere retirar por la tarde." },
    { id: "cli_02", name: "Rocío Benítez", phone: "+54 9 11 4491-8820", email: "rocio@email.com", notes: "Consulta siempre por regalos personalizados." },
    { id: "cli_03", name: "Valentina López", phone: "+54 9 11 5277-1042", email: "", notes: "Contacto por Instagram." },
    { id: "cli_04", name: "Diego Acosta", phone: "+54 9 11 3984-2201", email: "diego@email.com", notes: "Entrega en zona centro." },
  ],
  suppliers: [
    { id: "pro_01", name: "Insumos Creativos", contact: "Laura Pérez", phone: "+54 9 11 4410-2008", supplies: "Tazas, tintas y cajas" },
    { id: "pro_02", name: "Vinilos del Sur", contact: "Matías Gómez", phone: "+54 9 11 6300-1192", supplies: "Vinilo textil y autoadhesivo" },
    { id: "pro_03", name: "Importadora Central", contact: "Andrea Ruiz", phone: "+54 9 11 5501-7730", supplies: "Vasos térmicos y botellas" },
  ],
  orders: [
    { id: "PED-1048", customerId: "cli_01", customerName: "Camila Torres", productId: "prd_01", productName: "Taza Dragon Ball", quantity: 2, unitPrice: 12500, total: 25000, status: "Nuevo", createdAt: "Hoy, 10:24", stockCommitted: false },
    { id: "PED-1047", customerId: "cli_02", customerName: "Rocío Benítez", productId: "prd_04", productName: "Vinilo nombre personalizado", quantity: 3, unitPrice: 7200, total: 21600, status: "Preparando", createdAt: "Hoy, 09:12", stockCommitted: true },
    { id: "PED-1046", customerId: "cli_04", customerName: "Diego Acosta", productId: "prd_06", productName: "Botella infantil Disney", quantity: 1, unitPrice: 18900, total: 18900, status: "Listo", createdAt: "Ayer, 18:40", stockCommitted: true },
    { id: "PED-1045", customerId: "cli_03", customerName: "Valentina López", productId: "prd_03", productName: "Llavero Stitch", quantity: 2, unitPrice: 4800, total: 9600, status: "Entregado", createdAt: "12 ago, 16:05", stockCommitted: true },
  ],
  portal: {
    storeName: "Luna Creativa",
    headline: "Regalos hechos para sorprender",
    description: "Tazas, vinilos y detalles personalizados preparados con mucho amor.",
    whatsapp: "5491161234490",
    accent: "#e7674e",
    published: true,
  },
};
