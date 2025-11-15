/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./tests/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Premium Color Palette - Exact specifications
      colors: {
        // Dark backgrounds
        'bg-dark': '#0F1724',
        'panel': '#121826',
        'panel-elevated': '#1A202E',
        
        // Primary gradient colors
        'primary-from': '#2A2A72',
        'primary-to': '#6C4AB6',
        
        // Accent colors
        'accent-green': '#3DD6B8',
        'accent-amber': '#F6C94A',
        'muted-ink': '#9AA3B2',
        'discrete-highlight': '#7C5CFA',
        
        // Chat-specific colors
        'chat-bg': '#0B1320',
        'chat-bubble-user': '#2B3646',
        'chat-bubble-ai': '#1E293B',
        
        // Semantic colors
        'card-border': 'rgba(255, 255, 255, 0.03)',
        'card-hover': 'rgba(255, 255, 255, 0.05)',
        
        // Extended slate for consistency
        slate: {
          850: '#1A202E',
          925: '#0F1419',
        }
      },
      
      // Typography - Inter font with fallbacks
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      
      // Font sizes with line heights
      fontSize: {
        'hero-desktop': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'hero-mobile': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        'section-title': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'micro': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      
      // Premium shadows
      boxShadow: {
        'hero': '0 8px 30px rgba(12, 14, 20, 0.55)',
        'card': '0 4px 20px rgba(12, 14, 20, 0.25)',
        'card-hover': '0 8px 30px rgba(12, 14, 20, 0.35)',
        'subtle': '0 2px 8px rgba(12, 14, 20, 0.15)',
      },
      
      // Border radius
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      
      // Animations with reduced motion support
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-out-right': 'slideOutRight 0.3s ease-in',
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'typing-dots': 'typingDots 1.4s infinite',
        'gradient-pulse': 'gradientPulse 2s ease-in-out infinite',
      },
      
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        typingDots: {
          '0%, 60%, 100%': { opacity: '0.3' },
          '30%': { opacity: '1' },
        },
        gradientPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      
      // Spacing scale (8px base unit)
      spacing: {
        '18': '4.5rem',  // 72px
        '22': '5.5rem',  // 88px
      },
      
      // Backdrop blur
      backdropBlur: {
        xs: '2px',
      },
      
      // Grid template columns for dashboard layout
      gridTemplateColumns: {
        'dashboard': '1fr 1.5fr 0.9fr',  // Left | Middle | Right
      },
    },
  },
  plugins: [],
}
