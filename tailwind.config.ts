
import type { Config } from "tailwindcss";

export default {
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// New pastel blue, sage green, soft gold, and cream color scheme
				pastel: {
					50: '#f0f8ff',
					100: '#e0f1ff',
					200: '#c5e4ff',
					300: '#a3d2ff',
					400: '#7db8ff',
					500: '#5a9cff',
					600: '#4285f4',
					700: '#3367d6',
					800: '#2e5bba',
					900: '#1a4480',
				},
				sage: {
					50: '#f6f8f6',
					100: '#e8f0e8',
					200: '#d3e2d3',
					300: '#b5cdb5',
					400: '#8fb38f',
					500: '#6b9a6b',
					600: '#4f7f4f',
					700: '#3e6b3e',
					800: '#335533',
					900: '#2a472a',
				},
				gold: {
					50: '#fefcf0',
					100: '#fef7d7',
					200: '#fdeaae',
					300: '#fbd97a',
					400: '#f8c444',
					500: '#f5b220',
					600: '#e19308',
					700: '#b8740a',
					800: '#955e0f',
					900: '#7a4d10',
				},
				cream: {
					50: '#fefffe',
					100: '#fdfcfa',
					200: '#faf8f3',
					300: '#f6f2e9',
					400: '#f0e9d9',
					500: '#e8ddc4',
					600: '#d6c7a3',
					700: '#c1ad81',
					800: '#a89468',
					900: '#8f7d57',
				}
			},
			fontFamily: {
				'nunito': ['Nunito', 'sans-serif'],
				'poppins': ['Poppins', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'33%': { transform: 'translateY(-10px) rotate(2deg)' },
					'66%': { transform: 'translateY(-5px) rotate(-1deg)' }
				},
				'wiggle': {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(1deg)' },
					'75%': { transform: 'rotate(-1deg)' }
				},
				'bounce-gentle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 15px rgba(173, 216, 230, 0.4)' },
					'50%': { boxShadow: '0 0 25px rgba(173, 216, 230, 0.7)' }
				},
				'sparkle': {
					'0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
					'50%': { transform: 'scale(1.1) rotate(180deg)', opacity: '0.8' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'wiggle': 'wiggle 3s ease-in-out infinite',
				'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
				'glow': 'glow 3s ease-in-out infinite',
				'sparkle': 'sparkle 2s ease-in-out infinite',
				'fade-in': 'fade-in 0.6s ease-out'
			},
			backdropBlur: {
				xs: '2px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

