/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#000000',
        'bg-card': '#101010ff',
        'primary': '#ffffff', //00e87c
        'primary-hover': '#d3d3d3ff',
        'secondary': '#cacacaff',
        'accent': '#da0000ff',
        'text-primary': '#ffffff',
        'text-secondary': '#7f7f7fff',
        'text-muted': '#a3a3a3ff',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-equip-extended)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
