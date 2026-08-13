import { sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const createdAt = () => integer("created_at", { mode: "timestamp" })
  .notNull()
  .default(sql`(unixepoch())`);

export const tenants = sqliteTable("tenants", {
  id: text("id").primaryKey(),
  publicId: text("public_id").notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  ownerName: text("owner_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  plan: text("plan", { enum: ["trial", "essential", "pro"] }).notNull().default("trial"),
  status: text("status", { enum: ["configuring", "active", "suspended", "archived"] }).notNull().default("configuring"),
  accentColor: text("accent_color").notNull().default("#e7674e"),
  createdAt: createdAt(),
}, (table) => [uniqueIndex("idx_tenants_slug").on(table.slug), index("idx_tenants_status").on(table.status)]);

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  authSubject: text("auth_subject").notNull().unique(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  platformRole: text("platform_role", { enum: ["superadmin", "member"] }).notNull().default("member"),
  status: text("status", { enum: ["invited", "active", "disabled"] }).notNull().default("invited"),
  createdAt: createdAt(),
});

export const memberships = sqliteTable("memberships", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["owner", "admin", "staff"] }).notNull(),
  status: text("status", { enum: ["invited", "active", "disabled"] }).notNull().default("invited"),
  createdAt: createdAt(),
}, (table) => [uniqueIndex("idx_memberships_tenant_user").on(table.tenantId, table.userId), index("idx_memberships_user").on(table.userId)]);

export const modules = sqliteTable("modules", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});

export const tenantModules = sqliteTable("tenant_modules", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  moduleId: text("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  configJson: text("config_json").notNull().default("{}"),
}, (table) => [uniqueIndex("idx_tenant_modules_tenant_module").on(table.tenantId, table.moduleId)]);

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  sku: text("sku").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  variantName: text("variant_name"),
  cost: real("cost").notNull().default(0),
  price: real("price").notNull().default(0),
  physicalStock: integer("physical_stock").notNull().default(0),
  reservedStock: integer("reserved_stock").notNull().default(0),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(3),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  createdAt: createdAt(),
}, (table) => [uniqueIndex("idx_products_tenant_sku").on(table.tenantId, table.sku), index("idx_products_tenant_category").on(table.tenantId, table.category)]);

export const customers = sqliteTable("customers", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address"),
  notes: text("notes"),
  createdAt: createdAt(),
}, (table) => [index("idx_customers_tenant_phone").on(table.tenantId, table.phone)]);

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  customerId: text("customer_id").notNull().references(() => customers.id),
  orderNumber: integer("order_number").notNull(),
  status: text("status", { enum: ["new", "confirmed", "preparing", "ready", "delivered", "cancelled"] }).notNull().default("new"),
  subtotal: real("subtotal").notNull(),
  discount: real("discount").notNull().default(0),
  total: real("total").notNull(),
  notes: text("notes"),
  createdAt: createdAt(),
}, (table) => [uniqueIndex("idx_orders_tenant_number").on(table.tenantId, table.orderNumber), index("idx_orders_tenant_status").on(table.tenantId, table.status), index("idx_orders_customer").on(table.customerId)]);

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: real("unit_price").notNull(),
  lineTotal: real("line_total").notNull(),
}, (table) => [index("idx_order_items_tenant_order").on(table.tenantId, table.orderId)]);

export const inventoryMovements = sqliteTable("inventory_movements", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  type: text("type", { enum: ["purchase", "reservation", "release", "sale", "adjustment", "return"] }).notNull(),
  quantity: integer("quantity").notNull(),
  referenceId: text("reference_id"),
  note: text("note"),
  createdBy: text("created_by").references(() => users.id),
  createdAt: createdAt(),
}, (table) => [index("idx_inventory_movements_tenant_product").on(table.tenantId, table.productId)]);

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id, { onDelete: "set null" }),
  actorId: text("actor_id").notNull().references(() => users.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  metadataJson: text("metadata_json").notNull().default("{}"),
  createdAt: createdAt(),
}, (table) => [index("idx_audit_logs_tenant_created").on(table.tenantId, table.createdAt), index("idx_audit_logs_actor").on(table.actorId)]);
