import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'var(--font-ibm-plex-sans-condensed)',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif'
  			],
  			'ibm-plex-sans-condensed': [
  				'var(--font-ibm-plex-sans-condensed)'
  			],
  			inter: [
  				'var(--font-inter)'
  			],
  			roboto: [
  				'var(--font-roboto)'
  			],
  			'open-sans': [
  				'var(--font-open-sans)'
  			],
  			montserrat: [
  				'var(--font-montserrat)'
  			],
  			poppins: [
  				'var(--font-poppins)'
  			],
  			lato: [
  				'var(--font-lato)'
  			],
  			oswald: [
  				'var(--font-oswald)'
  			],
  			raleway: [
  				'var(--font-raleway)'
  			],
  			'pt-sans': [
  				'var(--font-pt-sans)'
  			],
  			merriweather: [
  				'var(--font-merriweather)'
  			],
  			nunito: [
  				'var(--font-nunito)'
  			],
  			ubuntu: [
  				'var(--font-ubuntu)'
  			],
  			playfair: [
  				'var(--font-playfair)'
  			],
  			'work-sans': [
  				'var(--font-work-sans)'
  			],
  			'bebas-neue': [
  				'var(--font-bebas-neue)'
  			],
  			'dancing-script': [
  				'var(--font-dancing-script)'
  			],
  			pacifico: [
  				'var(--font-pacifico)'
  			],
  			'permanent-marker': [
  				'var(--font-permanent-marker)'
  			],
  			lobster: [
  				'var(--font-lobster)'
  			],
  			righteous: [
  				'var(--font-righteous)'
  			],
  			bangers: [
  				'var(--font-bangers)'
  			],
  			'russo-one': [
  				'var(--font-russo-one)'
  			],
  			inconsolata: [
  				'var(--font-inconsolata)'
  			],
  			'fira-code': [
  				'var(--font-fira-code)'
  			],
  			'jetbrains-mono': [
  				'var(--font-jetbrains-mono)'
  			],
  			'plus-jakarta-sans': [
  				'var(--font-plus-jakarta-sans)'
  			]
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
  		},
  		keyframes: {
  			float: {
  				'0%, 100%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-20px)' }
  			}
  		},
  		animation: {
  			float: 'float 3s ease-in-out infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
