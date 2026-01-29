/**
 * Database Types Export
 *
 * Types Supabase centralisés pour l'application.
 * Remplace les anciens types Prisma par les définitions générées par Supabase.
 */

import { Database as SupabaseDatabase } from './supabase'

// Export the main Database interface
export type Database = SupabaseDatabase

// Generic helpers to access Supabase types safely
type Tables<T extends keyof SupabaseDatabase['public']['Tables']> = SupabaseDatabase['public']['Tables'][T]['Row']
type Inserts<T extends keyof SupabaseDatabase['public']['Tables']> = SupabaseDatabase['public']['Tables'][T]['Insert']
type Updates<T extends keyof SupabaseDatabase['public']['Tables']> = SupabaseDatabase['public']['Tables'][T]['Update']
type Enums<T extends keyof SupabaseDatabase['public']['Enums']> = SupabaseDatabase['public']['Enums'][T]

// --- Domain Models ---

// Profiles
// Maps to 'profiles' table
export type Profile = Tables<'profiles'>
export type CreateProfileData = Inserts<'profiles'>
export type UpdateProfileData = Updates<'profiles'>
export type ProfileWhereInput = Partial<Profile>

// Organizations
// Maps to 'organizations' table
export type Organization = Tables<'organizations'>
// Add specific Create/Update types if needed, similar to Profile
// export type CreateOrganizationData = Inserts<'organizations'>

// Subscription Plans
// Maps to 'subscription_plans' table (Assuming name)
export type SubscriptionPlan = Tables<'subscription_plans'>

// Rate Limits
// Maps to 'rate_limits' table
export type RateLimit = Tables<'rate_limits'>
export type CreateRateLimitData = Inserts<'rate_limits'>
export type UpdateRateLimitData = Updates<'rate_limits'>
export type RateLimitWhereInput = Partial<RateLimit>

// Audit Logs
// Maps to 'audit_logs' table
export type AuditLog = Tables<'audit_logs'>
export type CreateAuditLogData = Inserts<'audit_logs'>
export type AuditLogWhereInput = Partial<AuditLog>

// Enums
// Check if 'audit_action' exists in database enums. 
// If TypeScript complains, this might need to be 'string' or checked against actual DB enums.
export type AuditAction = Enums<'audit_action'>

// --- Compound Types ---

// Equivalent to Prisma's 'include: { user: true }'
// Since we don't have automatic relations in pure types, we define the intersection manually
export type RateLimitWithUser = RateLimit & {
  user: Profile | null // Foreign key relations can be null if not inner joined
}

export type AuditLogWithUser = AuditLog & {
  user: Profile | null
}