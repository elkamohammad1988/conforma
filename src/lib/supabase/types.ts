/**
 * Typed database schema for the Supabase client.
 *
 * Hand-authored to mirror `supabase/migrations/*` exactly (there is no local
 * Postgres to run `supabase gen types` against in this environment). When a real
 * project is linked, `supabase gen types typescript` can regenerate this file
 * verbatim — the shapes are kept in the standard generated format so the two
 * stay drop-in compatible.
 *
 * jsonb columns that hold classifier output are typed as their real domain
 * types (`ClassificationAnswers` / `ClassificationResult`) rather than opaque
 * `Json`, so queries stay end-to-end type-safe.
 */

import type {
  ClassificationAnswers,
  ClassificationResult,
} from "@/lib/classifier";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrgRole = "owner" | "admin" | "member";
export type PlanTier = "free" | "pro" | "team";
export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
  | "paused";
export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired";
export type ProviderRole = "provider" | "deployer" | "both";
export type RiskTier = "prohibited" | "high" | "limited" | "minimal";
export type ObligationStateEnum = "todo" | "in-progress" | "done";
export type DocumentType =
  | "technical-documentation"
  | "transparency-notice"
  | "conformity-declaration";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      org_members: {
        Row: {
          org_id: string;
          user_id: string;
          role: OrgRole;
          created_at: string;
        };
        Insert: {
          org_id: string;
          user_id: string;
          role?: OrgRole;
          created_at?: string;
        };
        Update: {
          org_id?: string;
          user_id?: string;
          role?: OrgRole;
          created_at?: string;
        };
        Relationships: [];
      };
      systems: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          description: string;
          owner: string;
          role: ProviderRole;
          answers: ClassificationAnswers;
          result: ClassificationResult;
          tier: RiskTier;
          is_gpai: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          description?: string;
          owner?: string;
          role?: ProviderRole;
          answers: ClassificationAnswers;
          result: ClassificationResult;
          tier: RiskTier;
          is_gpai?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string;
          description?: string;
          owner?: string;
          role?: ProviderRole;
          answers?: ClassificationAnswers;
          result?: ClassificationResult;
          tier?: RiskTier;
          is_gpai?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      obligation_status: {
        Row: {
          system_id: string;
          obligation_id: string;
          state: ObligationStateEnum;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          system_id: string;
          obligation_id: string;
          state?: ObligationStateEnum;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          system_id?: string;
          obligation_id?: string;
          state?: ObligationStateEnum;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          org_id: string;
          system_id: string | null;
          doc_type: DocumentType;
          title: string;
          content: string;
          locale: string | null;
          model: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          system_id?: string | null;
          doc_type: DocumentType;
          title?: string;
          content: string;
          locale?: string | null;
          model?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          system_id?: string | null;
          doc_type?: DocumentType;
          title?: string;
          content?: string;
          locale?: string | null;
          model?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          org_id: string;
          plan: PlanTier;
          status: SubscriptionStatus;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          stripe_price_id: string | null;
          seats: number | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          org_id: string;
          plan?: PlanTier;
          status?: SubscriptionStatus;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          seats?: number | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          org_id?: string;
          plan?: PlanTier;
          status?: SubscriptionStatus;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          seats?: number | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      api_keys: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          key_prefix: string;
          key_hash: string;
          last_used_at: string | null;
          created_by: string | null;
          created_at: string;
          revoked_at: string | null;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          key_prefix: string;
          key_hash: string;
          last_used_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          revoked_at?: string | null;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string;
          key_prefix?: string;
          key_hash?: string;
          last_used_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          revoked_at?: string | null;
        };
        Relationships: [];
      };
      invitations: {
        Row: {
          id: string;
          org_id: string;
          email: string;
          role: OrgRole;
          token: string;
          status: InvitationStatus;
          invited_by: string | null;
          expires_at: string;
          accepted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          email: string;
          role?: OrgRole;
          token: string;
          status?: InvitationStatus;
          invited_by?: string | null;
          expires_at?: string;
          accepted_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          email?: string;
          role?: OrgRole;
          token?: string;
          status?: InvitationStatus;
          invited_by?: string | null;
          expires_at?: string;
          accepted_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: number;
          org_id: string;
          actor_id: string | null;
          action: string;
          target_type: string | null;
          target_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: number;
          org_id: string;
          actor_id?: string | null;
          action: string;
          target_type?: string | null;
          target_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: number;
          org_id?: string;
          actor_id?: string | null;
          action?: string;
          target_type?: string | null;
          target_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      create_organization: {
        Args: { p_name: string; p_slug: string };
        Returns: Database["public"]["Tables"]["organizations"]["Row"];
      };
      log_audit_event: {
        Args: {
          p_org: string;
          p_action: string;
          p_target_type?: string | null;
          p_target_id?: string | null;
          p_metadata?: Json;
        };
        Returns: undefined;
      };
      create_invitation: {
        Args: { p_org: string; p_email: string; p_role: OrgRole };
        Returns: Database["public"]["Tables"]["invitations"]["Row"];
      };
      accept_invitation: {
        Args: { p_token: string };
        Returns: string;
      };
    };
    Enums: {
      org_role: OrgRole;
      plan_tier: PlanTier;
      subscription_status: SubscriptionStatus;
      invitation_status: InvitationStatus;
      provider_role: ProviderRole;
      risk_tier: RiskTier;
      obligation_state: ObligationStateEnum;
      document_type: DocumentType;
    };
    CompositeTypes: Record<never, never>;
  };
}
