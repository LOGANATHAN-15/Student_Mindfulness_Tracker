/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: ['selector', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#4ade80', // green-400
                    dark: '#22c55e', // green-500
                    light: '#dcfce7', // green-100
                },
                secondary: {
                    DEFAULT: '#60a5fa', // blue-400
                    light: '#dbeafe', // blue-100
                },
                background: '#f8fafc', // slate-50
                glass: 'rgba(255, 255, 255, 0.7)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
