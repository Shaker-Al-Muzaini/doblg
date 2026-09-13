export type Language = 'ar' | 'en';
export type Theme = 'dark' | 'light';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  locale: Language;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  status: 'active' | 'quota_warning' | 'suspended';
}

export type ProjectStatus = 
  | 'CREATED'
  | 'COMPLIANCE_CHECK'
  | 'INGESTING'
  | 'SEPARATING'
  | 'TRANSCRIBING'
  | 'TRANSLATING'
  | 'REVIEW_PENDING'
  | 'SYNTHESIZING'
  | 'MIXING'
  | 'RENDERING'
  | 'COMPLETED'
  | 'FAILED';

export interface Project {
  id: string;
  title: string;
  description?: string;
  sourceOrigin: 'UPLOAD' | 'URL';
  sourceUrl?: string;
  status: ProjectStatus;
  progressPercentage: number;
  durationMs: number;
  targetLanguage: string;
  createdAt: string;
  completedAt?: string;
  thumbnailUrl?: string;
  confidenceScore?: number;
}

export interface TimelineBlock {
  id: string;
  timelineId: string;
  sequenceOrder: number;
  sourceText: string;
  translatedText: string;
  startTimeMs: number;
  endTimeMs: number;
  speakerLabel?: string;
  confidence: number;
  status: 'AUTO' | 'EDITED' | 'APPROVED' | 'FLAGGED';
  timingDeltaPct: number;
  flagReason?: string;
}

export interface MediaAsset {
  id: string;
  projectId: string;
  role: 'ORIGINAL_VIDEO' | 'ORIGINAL_AUDIO' | 'VOCAL_STEM' | 'BACKGROUND_STEM' | 'SYNTHESIZED_VOICE' | 'FINAL_VIDEO';
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  storageTier: 'HOT' | 'WARM' | 'COLD';
  createdAt: string;
}

export interface Subscription {
  planTier: 'FREE' | 'PRO' | 'ENTERPRISE';
  usedHours: number;
  totalHours: number;
  billingCycle: 'monthly' | 'yearly';
  renewalDate: string;
  storageUsedGb: number;
  storageLimitGb: number;
}
