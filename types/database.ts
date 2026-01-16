/**
 * Database Types Export
 * Epic 1: Sécurité et Conformité
 * 
 * Types Prisma centralisés pour l'application
 */

import type { Prisma, Profile, Organization } from '@prisma/client'

export type {
  Profile,
  Organization,
  SubscriptionPlan,
  RateLimit,
  AuditLog,
  AuditAction,
  Prisma
} from '@prisma/client'

// Legacy type for compatibility
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Prisma.ProfileCreateInput;
        Update: Prisma.ProfileUpdateInput;
      };
      organizations: {
        Row: Organization;
        Insert: Prisma.OrganizationCreateInput;
        Update: Prisma.OrganizationUpdateInput;
      };
    };
  };
};

// Types utilitaires pour les requêtes complexes
export type RateLimitWithUser = Prisma.RateLimitGetPayload<{
  include: { user: true }
}>

export type AuditLogWithUser = Prisma.AuditLogGetPayload<{
  include: { user: true }
}>


// Types pour les créations
export type CreateProfileData = Prisma.ProfileCreateInput
export type CreateRateLimitData = Prisma.RateLimitCreateInput
export type CreateAuditLogData = Prisma.AuditLogCreateInput

// Types pour les mises à jour
export type UpdateProfileData = Prisma.ProfileUpdateInput
export type UpdateRateLimitData = Prisma.RateLimitUpdateInput

// Types pour les filtres
export type ProfileWhereInput = Prisma.ProfileWhereInput
export type RateLimitWhereInput = Prisma.RateLimitWhereInput
export type AuditLogWhereInput = Prisma.AuditLogWhereInput