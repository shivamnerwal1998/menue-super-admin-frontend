// Centralized Theme Configuration - Elegant Slate
// Change colors here to update the entire admin panel

export const theme = {
  // Primary Colors (Header, Sidebar, Main UI)
  primary: {
    bg: 'bg-slate-800',
    bgDark: 'bg-slate-900',
    bgLight: 'bg-slate-700',
    text: 'text-white',
    textMuted: 'text-slate-200',
    border: 'border-slate-700',
  },

  // Accent/Highlight Colors
  accent: {
    bg: 'bg-indigo-500',
    bgHover: 'bg-indigo-600',
    bgLight: 'bg-indigo-50',
    bgLightHover: 'bg-indigo-100',
    text: 'text-indigo-500',
    textDark: 'text-indigo-600',
    border: 'border-indigo-200',
    borderHover: 'border-indigo-300',
    ring: 'focus:ring-indigo-500',
    ringLight: 'focus:ring-indigo-200',
    focusBorder: 'focus:border-indigo-500',
  },

  // Secondary Colors (Cards, panels, page backgrounds)
  secondary: {
    bg: 'bg-white',
    bgHover: 'bg-slate-50',
    bgMuted: 'bg-gray-50',
    text: 'text-slate-900',
    textMuted: 'text-slate-500',
    textSubtle: 'text-slate-400',
    border: 'border-slate-200',
    borderHover: 'border-slate-300',
  },

  // Hero / Welcome banner
  hero: {
    gradient: 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-500',
    text: 'text-white',
    textMuted: 'text-indigo-100',
    buttonBg: 'bg-white/20',
    buttonBgHover: 'hover:bg-white/30',
    buttonBorder: 'border-white/25',
  },

  // Stat card icon backgrounds
  iconBg: {
    purple: 'bg-purple-100',
    purpleText: 'text-purple-600',
    blue: 'bg-indigo-100',
    blueText: 'text-indigo-600',
  },

  // Category level indent styles (used in CategoryCard)
  categoryLevel: {
    0: 'bg-white border-slate-200',
    1: 'bg-slate-50 border-l-4 border-l-indigo-400 ml-4',
    2: 'bg-indigo-50 border-l-4 border-l-indigo-600 ml-8',
  },

  // Status Colors
  status: {
    success: {
      bg: 'bg-green-100',
      bgLight: 'bg-green-50',
      text: 'text-green-700',
      textDark: 'text-green-800',
      textHeading: 'text-green-900',
      icon: 'text-green-600',
      border: 'border-green-200',
      borderStrong: 'border-green-300',
      button: 'bg-green-600',
      buttonHover: 'hover:bg-green-700',
    },
    warning: {
      bg: 'bg-orange-100',
      bgLight: 'bg-orange-50',
      text: 'text-orange-700',
      textDark: 'text-orange-800',
      border: 'border-orange-200',
      badge: 'bg-orange-500',
      icon: 'text-orange-600',
    },
    error: {
      bg: 'bg-red-100',
      bgLight: 'bg-red-50',
      text: 'text-red-700',
      textDark: 'text-red-800',
      border: 'border-red-200',
      borderStrong: 'border-red-300',
      icon: 'text-red-600',
    },
    info: {
      bg: 'bg-indigo-100',
      bgLight: 'bg-indigo-50',
      text: 'text-indigo-600',
      textDark: 'text-indigo-800',
      border: 'border-indigo-200',
    },
  },

  // Shadows
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  },

  // Rounded Corners
  rounded: {
    sm: 'rounded-sm',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full',
  },

  // Transitions
  transition: {
    base: 'transition-all duration-200 ease-in-out',
    fast: 'transition-all duration-150 ease-in-out',
    slow: 'transition-all duration-300 ease-in-out',
  },
}

// Helper function to get all classes for a specific component
export const getThemeClasses = {
  // Layout
  header: () => `${theme.primary.bg} ${theme.primary.text} ${theme.primary.border} border-b`,
  sidebar: () => `${theme.primary.bgDark} ${theme.primary.text} ${theme.primary.border} border-r`,
  sidebarItem: () => `${theme.primary.textMuted} hover:${theme.primary.bgLight} ${theme.transition.base}`,
  sidebarItemActive: () => `${theme.accent.bg} ${theme.primary.text} ${theme.shadow.sm}`,
  pageBackground: () => theme.secondary.bgMuted,

  // Cards
  card: () => `${theme.secondary.bg} ${theme.secondary.border} border ${theme.rounded.lg} ${theme.shadow.md}`,
  statCard: () => `${theme.secondary.bg} ${theme.rounded.md} border ${theme.secondary.border} p-6 ${theme.shadow.sm} hover:${theme.shadow.md} transition`,
  searchBar: () => `${theme.secondary.bg} ${theme.rounded.md} border ${theme.secondary.border} ${theme.shadow.sm} p-4`,

  // Buttons
  buttonPrimary: () => `${theme.accent.bg} ${theme.primary.text} hover:${theme.accent.bgHover} ${theme.transition.base} ${theme.rounded.md}`,
  buttonSecondary: () => `${theme.secondary.bg} ${theme.secondary.text} ${theme.secondary.border} border hover:${theme.secondary.bgHover} ${theme.transition.base} ${theme.rounded.md}`,

  // Forms
  input: () => `${theme.secondary.bg} border border-gray-300 ${theme.rounded.md} focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 focus:outline-none`,
  inputError: () => `${theme.secondary.bg} border border-red-500 ${theme.rounded.md} focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 focus:outline-none`,

  // Modal
  modalOverlay: () => `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50`,
  modalContent: () => `${theme.secondary.bg} ${theme.rounded.lg} ${theme.shadow['2xl']} max-w-2xl w-full max-h-[90vh] overflow-y-auto`,
  modalHeader: () => `sticky top-0 ${theme.secondary.bg} border-b ${theme.secondary.border} px-6 py-4 flex items-center justify-between`,

  // Hero
  heroBanner: () => `${theme.hero.gradient} ${theme.rounded.lg} p-6 ${theme.hero.text} ${theme.shadow.md}`,

  // Badges
  badge: (color: 'blue' | 'red' | 'green' | 'orange') => {
    const map = {
      blue:   `${theme.status.info.bgLight} ${theme.status.info.textDark}`,
      red:    `${theme.status.error.bg} ${theme.status.error.textDark}`,
      green:  `${theme.status.success.bg} ${theme.status.success.textDark}`,
      orange: `${theme.status.warning.bg} ${theme.status.warning.textDark}`,
    }
    return `${map[color]} text-xs font-medium rounded px-2 py-0.5`
  },

  // Load More
  loadMoreButton: () => `inline-flex items-center gap-2 px-6 py-3 ${theme.accent.bgLight} ${theme.accent.textDark} ${theme.rounded.md} hover:${theme.accent.bgLightHover} transition font-medium disabled:opacity-50 disabled:cursor-not-allowed border-2 ${theme.accent.border} hover:${theme.accent.borderHover}`,

  // Toast
  toastSuccess: () => `${theme.status.success.bgLight} border ${theme.status.success.border}`,
  toastError: () => `${theme.status.error.bgLight} border ${theme.status.error.border}`,
}

export default theme