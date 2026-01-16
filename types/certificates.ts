export type CertificateStatus = 'draft' | 'published' | 'archived';
export type CertificateOrientation = 'portrait' | 'landscape';
export type CertificateFieldType = 'text' | 'date' | 'image' | 'signature' | 'qrcode';

export type CertificateField = {
  id: string;
  type: "text" | "date" | "signature" | "image";
  label: string;
  value: string;
  position: {
    x: number;
    y: number;
  };
  style: {
    font_size?: number;
    font_family?: string;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
  is_required: boolean;
  is_editable: boolean;
  placeholder?: string;
};

export type CertificateDesign = {
  background_color?: string;
  border_color?: string;
  border_width?: number;
  font_family?: string;
  font_size?: number;
};

export type CertificateLayout = {
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
};

export type CertificateTemplateData = {
  design: CertificateDesign;
  fields: CertificateField[];
  layout: CertificateLayout;
};

export interface CertificateTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  status: CertificateStatus;
  thumbnail_url: string | null;
  template_data: {
    model: 'standard' | 'premium';
    clientLogo: string;
    eduproLogo: string;
    backgroundColor: string;
    backgroundImage: string;
    backgroundOption: 'color' | 'image' | 'gradient';
    gradientStart: string;
    gradientEnd: string;
    clientLogoSize: number;
    eduproLogoSize: number;
    showDirectorSignature: boolean;
    showInstructorSignature: boolean;
    certificateTitle: string;
    certificateSubtitle: string;
    studentIntroText: string;
    courseIntroText: string;
    gradeIntroText: string;
    showDistinction: boolean;
    distinctionText: string;
    distinctionThresholds: Array<{
      threshold: number;
      text: string;
    }>;
    selectedDirectorId?: string;
    orientation?: 'portrait' | 'landscape';
    studentName?: string;
    courseName?: string;
    grade?: string;
    instructorName?: string;
    instructorTitle?: string;
    directorName?: string;
    directorTitle?: string;
  };
  organization_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  template_id: string;
  student_id: string;
  course_id: string;
  organization_id: string;
  issued_at: string;
  issued_by: string;
  status: 'draft' | 'issued' | 'revoked';
  metadata: {
    student_name: string;
    course_name: string;
    completion_date: string;
    grade?: string;
    certificate_number: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CertificateTemplateFormData {
  name: string;
  description?: string;
  category: string;
  status: CertificateStatus;
  thumbnail_url?: string;
  template_data: {
    design: {
      background_color?: string;
      border_color?: string;
      border_width?: number;
      font_family?: string;
      font_size?: number;
    };
    fields: any[];
    layout: {
      width: number;
      height: number;
      orientation: "portrait" | "landscape";
    };
  };
}

export interface IssuedCertificate {
  id: string;
  verification_code: string;
  student_id: string;
  course_id: string;
  template_id: string;
  cohort_id?: string;
  status: 'active' | 'revoked' | 'expired';
  issued_at: string;
  expires_at?: string;
  revoked_at?: string;
  revoked_reason?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface IssuedCertificateFormData extends Omit<IssuedCertificate, 'id' | 'verification_code' | 'issued_at' | 'created_at' | 'updated_at'> {}

export interface CertificateCriteria {
  minProgressPercentage: number;
  minQuizScore?: number;
  requirePreTraining?: boolean;
  requirePostTraining?: boolean;
  minPostTrainingScore?: number;
  requireLiveSessions?: boolean;
  minLiveSessionAttendance?: number | { percentage: number } | { count: number };
  requireInstructorApproval?: boolean;
  minTimeSpentPercentage?: number;
  minPracticalExercisesAverage?: number; // moyenne minimale des exercices pratiques en %
}

export interface CertificateEligibilityCheck {
  eligible: boolean;
  criteria: CertificateCriteria;
  results: {
    progress: { met: boolean; current: number; required: number };
    quizScore?: { met: boolean; current: number; required: number };
    preTraining?: { met: boolean; completed: boolean };
    postTraining?: { met: boolean; completed: boolean; score?: number };
    liveSessions?: { met: boolean; attended: number; required: number };
    instructorApproval?: { met: boolean; status: string };
    timeSpent?: { met: boolean; current: number; required: number };
    practicalExercises?: { met: boolean; average: number; required: number };
  };
  missingCriteria: string[];
} 