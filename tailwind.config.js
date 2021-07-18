const colors = require('tailwindcss/colors');

module.exports = {
    mode: 'jit',
    purge: {
        enabled: true,
        options: {
            safelist: [/^bg-/, /^text-/],
        },
        content: ['./src/**/*.{js,ts,jsx,tsx}'],
    },

    darkMode: false,
    theme: {
        extend: {},
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: colors.coolGray,
            red: colors.red,
            blue: colors.sky,
            indigo: colors.indigo,
            purple: colors.purple,
            pink: colors.pink,
            yellow: colors.yellow,
            green: colors.green,
            teal: colors.teal,
            cyan: colors.cyan,
        },
        // fontFamily: false,
    },
    variants: {
        extend: {},
    },
    plugins: [],
    xwind: {
        mode: 'objectstyles',
    },
};
