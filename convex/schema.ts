import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({


  // ── Admin users ──────────────────────────────────────────────────────────
  admins: defineTable({
    username:        v.string(),
    passwordHash:    v.string(),
    name:            v.string(),
    role:            v.union(v.literal("SUPER_ADMIN"), v.literal("ADMIN"), v.literal("STAFF")),
    lastLoginAt:     v.optional(v.number()),
    tokenIdentifier: v.optional(v.string()),
  })
    .index("by_username",        ["username"])
    .index("by_tokenIdentifier", ["tokenIdentifier"]),

    // ── Admin users ──────────────────────────────────────────────────────────
  staffs: defineTable({
    username:        v.string(),
    passwordHash:    v.string(),
    name:            v.string(),
    role:            v.union(v.literal("SUPER_ADMIN"), v.literal("ADMIN"), v.literal("STAFF")),
    lastLoginAt:     v.optional(v.number()),
    tokenIdentifier: v.optional(v.string()),
  })
    .index("by_username",        ["username"])
    .index("by_tokenIdentifier", ["tokenIdentifier"]),


  // ── Announcements ────────────────────────────────────────────────────────
  announcements: defineTable({
    title:          v.string(),
    body:           v.string(),
    type:           v.union(
      v.literal("INFO"),    v.literal("WARNING"),
      v.literal("MAINTENANCE"), v.literal("HOLIDAY"),
    ),
    active:         v.boolean(),
    dateStart:      v.optional(v.number()),
    dateEnd:        v.optional(v.number()),
    expiresAt:      v.optional(v.number()),
    createdBy:      v.optional(v.string()),
    imageUrl:       v.optional(v.string()),
    imageStorageId: v.optional(v.string()),
    featured:       v.optional(v.boolean()),
    highlight:      v.optional(v.string()),
    featuredOrder:  v.optional(v.number()),
    tags:           v.optional(v.array(v.string())),
  })
    .index("by_active",           ["active"])
    .index("by_dateStart",        ["dateStart"])
    .index("by_dateEnd",          ["dateEnd"])
    .index("by_expiresAt",        ["expiresAt"])
    .index("by_active_expiresAt", ["active", "expiresAt"])
    .index("by_featured",         ["featured"]),

  // ── App settings (key-value store) ───────────────────────────────────────
  settings: defineTable({
    key:   v.string(),
    value: v.string(),
  })
    .index("by_key", ["key"]),

  // ── Documents ─────────────────────────────────────────────────────
  Documents: defineTable({
    name:           v.string(),
    type:           v.string(),
    url:            v.string(),
    uploadedBy:     v.optional(v.string()),
    storageId:      v.optional(v.id("_storage")),
    tags:           v.optional(v.array(v.string())),
    syncedAt:       v.optional(v.number()),
  })


})