/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          base: 'var(--color-canvas-base, #0D0F12)',
          panel: 'var(--color-surface-panel, #16191E)',
          subdued: 'var(--color-surface-subdued, #1F242C)',
          sunken: 'var(--color-surface-sunken, #0A0C0F)',
        },
        divider: 'var(--color-border-divider, #262B34)',
        accent: {
          primary: '#6366F1',
          hover: '#818CF8',
          secondary: '#8B5CF6',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
        waveform: {
          vocal: '#6366F1',
          dubbed: '#8B5CF6',
          bg: '#10B981',
          playhead: '#EF4444',
        }
      },
      fontFamily: {
        'sans-ar': ['Readex Pro', 'Cairo', 'sans-serif'],
        'sans-en': ['Inter', 'system-ui', 'sans-serif'],
        'mono-timecode': ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
