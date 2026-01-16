export type PaymentStatus = 'pending' | 'completed' | 'cancelled' | 'failed'
export type PaymentMethod = 'paytech' | 'paydunya' | 'cash' | 'bank_transfer'

export interface Payment {
  id: string
  user_id: string
  course_id: string
  cohort_id?: string
  enrollment_id?: string
  reference: string
  amount: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  payment_plan?: string
  payment_details?: any
  payment_token?: string
  payment_data?: any
  custom_field?: string | any
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface PaymentRequest {
  amount: number
  userId: string
  courseId: string
  cohortId?: string
  paymentPlan: string
  paymentDetails: any
  currency?: string
  description?: string
  gatewayId: 'paytech' | 'paydunya'
}

export interface PaymentResponse {
  success: boolean
  redirectUrl?: string
  token?: string
  reference?: string
  message?: string
  error?: any
}

export interface WebhookEvent {
  id: string
  type: 'payment.success' | 'payment.failed' | 'payment.pending'
  payment_id: string
  amount: number
  currency: string
  status: string
  timestamp: string
  signature: string
  gateway: 'paytech' | 'paydunya'
}

export interface WebhookResult {
  success: boolean
  processed: boolean
  enrollmentCreated?: boolean
  message?: string
  error?: any
}