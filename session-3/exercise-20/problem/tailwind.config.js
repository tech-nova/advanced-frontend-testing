/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        space: {
          'deep-blue': '#0A1128',
          'cosmic-purple': '#7B2CBF',
          'nebula-teal': '#38A3A5',
          'starlight-white': '#E0E1DD',
          'solar-flare': '#FF7F11',
          'alien-green': '#57CC99',
          'martian-red': '#FF4365',
          'dark-blue': '#1C2541',
        },
      },
    },
  },
  plugins: [],
};
