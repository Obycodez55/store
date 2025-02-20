import type { Config } from "tailwindcss";
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['class', "class"], // Enable dark mode variant
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': '#eff6ff',
  				'100': '#dbeafe',
  				'200': '#bfdbfe',
  				'300': '#93c5fd',
  				'400': '#60a5fa',
  				'500': '#3b82f6',
  				'600': '#2563eb',
  				'700': '#1d4ed8',
  				'800': '#1e40af',
  				'900': '#1e3a8a',
  				'950': '#172554',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			success: {
  				'50': '#f0fdf4',
  				'500': '#22c55e',
  				'600': '#16a34a'
  			},
  			warning: {
  				'50': '#fffbeb',
  				'500': '#f59e0b',
  				'600': '#d97706'
  			},
  			error: {
  				'50': '#fef2f2',
  				'500': '#ef4444',
  				'600': '#dc2626'
  			},
  			dark: {
  				bg: '#121212',
  				surface: '#1e1e1e',
  				border: '#2e2e2e',
  				text: {
  					primary: '#ffffff',
  					secondary: '#a0a0a0'
  				}
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter var',
                    ...defaultTheme.fontFamily.sans
                ],
  			display: [
  				'Outfit',
                    ...defaultTheme.fontFamily.sans
                ]
  		},
  		fontSize: {
  			display: [
  				'3rem',
  				{
  					lineHeight: '1.2',
  					letterSpacing: '-0.02em'
  				}
  			]
  		},
  		animation: {
  			'fade-in': 'fadeIn 200ms ease-out',
  			'fade-up': 'fadeUp 300ms ease-out',
  			'scale-in': 'scaleIn 200ms ease-out',
  			'slide-in-right': 'slideInRight 300ms ease-out',
  			'slide-in-left': 'slideInLeft 300ms ease-out',
  			'bounce-in': 'bounceIn 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  			'rotate-in': 'rotateIn 300ms ease-out',
  			'pulse-once': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) 1',
  			shake: 'shake 500ms cubic-bezier(0.36, 0, 0.66, 1)',
  			float: 'float 3s ease-in-out infinite'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			fadeUp: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(10px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			scaleIn: {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.95)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			slideInRight: {
  				'0%': {
  					transform: 'translateX(100%)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateX(0)',
  					opacity: '1'
  				}
  			},
  			slideInLeft: {
  				'0%': {
  					transform: 'translateX(-100%)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateX(0)',
  					opacity: '1'
  				}
  			},
  			bounceIn: {
  				'0%': {
  					transform: 'scale(0.3)',
  					opacity: '0'
  				},
  				'50%': {
  					transform: 'scale(1.05)'
  				},
  				'70%': {
  					transform: 'scale(0.9)'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			rotateIn: {
  				'0%': {
  					transform: 'rotate(-180deg)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'rotate(0)',
  					opacity: '1'
  				}
  			},
  			shake: {
  				'0%, 100%': {
  					transform: 'translateX(0)'
  				},
  				'20%, 60%': {
  					transform: 'translateX(-5px)'
  				},
  				'40%, 80%': {
  					transform: 'translateX(5px)'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-10px)'
  				}
  			}
  		},
  		transitionTimingFunction: {
  			'bounce-custom': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  			'spring-custom': 'cubic-bezier(0.43, 0.13, 0.23, 0.96)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
      require("tailwindcss-animate")
],
} satisfies Config;