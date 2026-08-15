export type NavId = "resumen" | "espacios" | "administradores" | "planes" | "actividad" | "configuracion";

export type SpaceStatus = "Activo" | "Configurando" | "Suspendido" | "Archivado";

export type PlatformSpace = {
  id: string;
  name: string;
  owner: string;
  email: string;
  plan: "Base" | "Equipo" | "Prueba";
  status: SpaceStatus;
  modules: string[];
  users: number;
  maxUsers: number;
  storage: string;
  lastAccess: string;
  portal: string;
  initials: string;
  tone: "coral" | "mint" | "lilac" | "blue";
};

export const navItems: { id: NavId; label: string; glyph: string }[] = [
  { id: "resumen", label: "Resumen", glyph: "home" },
  { id: "espacios", label: "Espacios", glyph: "spaces" },
  { id: "administradores", label: "Administradores", glyph: "users" },
  { id: "planes", label: "Planes y módulos", glyph: "plans" },
  { id: "actividad", label: "Actividad", glyph: "activity" },
];

export const spaces: PlatformSpace[] = [
  {
    id: "NX-000001",
    name: "Luna Creativa",
    owner: "Marina Suárez",
    email: "marina@lunacreativa.com",
    plan: "Equipo",
    status: "Activo",
    modules: ["Inventario", "Clientes", "Pedidos", "Finanzas", "Portal"],
    users: 2,
    maxUsers: 3,
    storage: "1,8 GB",
    lastAccess: "Hoy, 09:42",
    portal: "Publicado",
    initials: "LC",
    tone: "coral",
  },
  {
    id: "NX-000002",
    name: "Pequeños Detalles",
    owner: "Carla Méndez",
    email: "carla@pequenosdetalles.com",
    plan: "Base",
    status: "Activo",
    modules: ["Inventario", "Clientes", "Pedidos", "Finanzas", "Portal"],
    users: 1,
    maxUsers: 1,
    storage: "620 MB",
    lastAccess: "Ayer, 18:16",
    portal: "Publicado",
    initials: "PD",
    tone: "mint",
  },
  {
    id: "NX-000003",
    name: "Tinta & Magia",
    owner: "Sofía Rojas",
    email: "sofia@tintaymagia.com",
    plan: "Prueba",
    status: "Configurando",
    modules: ["Inventario", "Clientes", "Pedidos", "Finanzas", "Portal"],
    users: 1,
    maxUsers: 1,
    storage: "84 MB",
    lastAccess: "Invitación pendiente",
    portal: "Borrador",
    initials: "TM",
    tone: "lilac",
  },
];

export const administrators = [
  { id: "usr_01", name: "Marina Suárez", email: "marina@lunacreativa.com", space: "Luna Creativa", spaceId: "NX-000001", role: "Administradora", status: "Activo", lastAccess: "Hoy, 09:42" },
  { id: "usr_02", name: "Carla Méndez", email: "carla@pequenosdetalles.com", space: "Pequeños Detalles", spaceId: "NX-000002", role: "Administradora", status: "Activo", lastAccess: "Ayer, 18:16" },
  { id: "usr_03", name: "Sofía Rojas", email: "sofia@tintaymagia.com", space: "Tinta & Magia", spaceId: "NX-000003", role: "Administradora", status: "Invitado", lastAccess: "Todavía no ingresó" },
  { id: "usr_04", name: "Nicolás Vega", email: "nico@lunacreativa.com", space: "Luna Creativa", spaceId: "NX-000001", role: "Empleado", status: "Activo", lastAccess: "Hoy, 08:10" },
];

export const platformEvents = [
  { id: "evt_01", action: "Inicio de sesión", subject: "Marina Suárez", context: "Luna Creativa · NX-000001", time: "Hace 18 min", tone: "mint" },
  { id: "evt_02", action: "Invitación enviada", subject: "Sofía Rojas", context: "Tinta & Magia · NX-000003", time: "Hace 2 h", tone: "lilac" },
  { id: "evt_03", action: "Módulos actualizados", subject: "Juan Martín", context: "Pequeños Detalles · NX-000002", time: "Ayer, 17:04", tone: "blue" },
  { id: "evt_04", action: "Espacio creado", subject: "Juan Martín", context: "Tinta & Magia · NX-000003", time: "12 ago, 14:22", tone: "coral" },
  { id: "evt_05", action: "Acceso restablecido", subject: "Carla Méndez", context: "Pequeños Detalles · NX-000002", time: "11 ago, 11:05", tone: "amber" },
];

export const modules = ["Inventario", "Clientes", "Proveedores", "Pedidos", "Finanzas", "Portal", "Combos", "Reportes"];

export const plans = [
  { name: "Base", price: "$ 18.000", users: "1 administrador", storage: "2 GB", spaces: 1, modules: 5, accent: "mint" },
  { name: "Equipo", price: "$ 28.000", users: "1 admin + 2 empleados", storage: "8 GB", spaces: 1, modules: 8, accent: "coral" },
  { name: "Prueba", price: "14 días", users: "1 administrador", storage: "500 MB", spaces: 1, modules: 5, accent: "lilac" },
];
