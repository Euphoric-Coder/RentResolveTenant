export const LIGHT_COLORS = {
  primary: '#1E6B5A',
  primaryDark: '#155A4A',
  primaryLight: '#E6F5F0',
  primaryGlow: 'rgba(30, 107, 90, 0.12)',

  accent: '#0284C7',
  accentLight: '#E0F2FE',

  success: '#059669',
  successLight: '#D1FAE5',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  info: '#0284C7',
  infoLight: '#E0F2FE',

  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F0F2F5',
  surfaceElevated: '#FFFFFF',

  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  inputBg: '#F9FAFB',
  inputBorder: '#D1D5DB',

  headerBg: '#FFFFFF',
  headerBorder: '#E5E7EB',

  cardShadow: 'rgba(0, 0, 0, 0.06)',
  elevatedShadow: 'rgba(0, 0, 0, 0.10)',

  gradientStart: '#1E6B5A',
  gradientEnd: '#0D9488',
  gradientAccent: '#134E4A',
};

export const DARK_COLORS = {
  primary: '#34D399',
  primaryDark: '#10B981',
  primaryLight: 'rgba(52, 211, 153, 0.15)',
  primaryGlow: 'rgba(52, 211, 153, 0.08)',

  accent: '#38BDF8',
  accentLight: 'rgba(56, 189, 248, 0.15)',

  success: '#34D399',
  successLight: 'rgba(52, 211, 153, 0.15)',
  warning: '#FBBF24',
  warningLight: 'rgba(251, 191, 36, 0.15)',
  danger: '#F87171',
  dangerLight: 'rgba(248, 113, 113, 0.15)',
  info: '#38BDF8',
  infoLight: 'rgba(56, 189, 248, 0.15)',

  background: '#0F172A',
  surface: '#1E293B',
  surfaceSecondary: '#273548',
  surfaceElevated: '#1E293B',

  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0F172A',

  border: '#334155',
  borderLight: '#1E293B',
  inputBg: '#1E293B',
  inputBorder: '#334155',

  headerBg: '#1E293B',
  headerBorder: '#334155',

  cardShadow: 'rgba(0, 0, 0, 0.3)',
  elevatedShadow: 'rgba(0, 0, 0, 0.5)',

  gradientStart: '#134E4A',
  gradientEnd: '#0F766E',
  gradientAccent: '#064E3B',
};

export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Submitted: { bg: '#DBEAFE', text: '#1D4ED8' },
  'Under Review': { bg: '#FEF3C7', text: '#B45309' },
  Approved: { bg: '#D1FAE5', text: '#047857' },
  Assigned: { bg: '#E0E7FF', text: '#4338CA' },
  'In Progress': { bg: '#FEF3C7', text: '#D97706' },
  'Waiting for Tenant': { bg: '#FFEDD5', text: '#C2410C' },
  'Waiting for Landlord': { bg: '#FCE7F3', text: '#BE185D' },
  Resolved: { bg: '#D1FAE5', text: '#059669' },
  Reopened: { bg: '#FEE2E2', text: '#DC2626' },
  Escalated: { bg: '#FEE2E2', text: '#B91C1C' },
  Closed: { bg: '#F1F5F9', text: '#475569' },
  Rejected: { bg: '#FEE2E2', text: '#DC2626' },
};

export const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  Low: { bg: '#DBEAFE', text: '#1D4ED8' },
  Medium: { bg: '#FEF3C7', text: '#D97706' },
  High: { bg: '#FFEDD5', text: '#EA580C' },
  Emergency: { bg: '#FEE2E2', text: '#DC2626' },
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  prominent: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
  },
};

