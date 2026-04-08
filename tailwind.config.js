// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slide: {
          '100%': { transform: 'translateX(-400%)' }, // 4 images
        },
      },
      animation: {
        slide: 'slide 12s steps(4) infinite', // steps = number of images
      },
    },
  },
  plugins: [],
}