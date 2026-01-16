export interface PlatformSettings {
  id: string;
  platform_name: string;
  platform_description: string;
  support_email: string;
  whatsapp_number?: string;
  timezone: string;
  date_format: string;
  default_language: string;
  primary_color: string;
  logo_url: string | null;
  favicon_url: string | null;
  maintenance_mode: boolean;
  auto_disable_accounts: boolean;
  allow_new_registrations: boolean;
  enable_analytics: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailSettings {
  id: string;
  
  // Configuration SMTP
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  smtp_encryption: 'none' | 'ssl' | 'tls';
  sender_name: string;
  sender_email: string;
  test_email: string;
  
  // Modèles d'emails
  welcome_email_subject: string;
  welcome_email_content: string;
  password_reset_subject: string;
  password_reset_content: string;
  account_confirmation_subject: string;
  account_confirmation_content: string;
  invoice_subject: string;
  invoice_content: string;
  subscription_renewal_subject: string;
  subscription_renewal_content: string;
  subscription_cancelled_subject: string;
  subscription_cancelled_content: string;
  course_reminder_subject: string;
  course_reminder_content: string;
  
  // Options de design des emails
  include_logo: boolean;
  include_social: boolean;
  include_footer: boolean;
  email_color: string;
  
  // Notifications
  notify_registrations: boolean;
  notify_payments: boolean;
  notify_subscription_renewals: boolean;
  notify_support_tickets: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface BillingSettings {
  id: string;
  // Configuration PayTech
  paytech_enabled: boolean;
  paytech_api_key: string;
  paytech_api_secret: string;
  // Configuration Paydunya
  paydunya_enabled: boolean;
  paydunya_master_key: string;
  paydunya_private_key: string;
  paydunya_token: string;
  paydunya_test_mode: boolean;
  // Informations entreprise
  company_name: string;
  company_address: string;
  tax_id: string;
  tax_rate: number;
  // Configuration factures
  invoice_prefix: string;
  invoice_footer: string;
  auto_invoice: boolean;
  invoice_due_days: number;
  grace_period: number;
  currency: string;
  send_receipt: boolean;
  prorata_billing: boolean;
  created_at: string;
  updated_at: string;
}

export interface SecuritySettings {
  id: string;
  max_sessions: number;
  password_min_length: number;
  require_special_chars: boolean;
  require_numbers: boolean;
  require_uppercase: boolean;
  two_factor_enabled: boolean;
  two_factor_optional: boolean;
  two_factor_method: 'app' | 'sms' | 'email';
  sso_enabled: boolean;
  password_expiry_days: number;
  prevent_password_reuse: boolean;
  password_reuse_limit: number;
  session_timeout_minutes: number;
  force_logout_inactive: boolean;
  remember_me_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export type Settings = {
  platform: PlatformSettings;
  billing: BillingSettings;
  security: SecuritySettings;
}; 