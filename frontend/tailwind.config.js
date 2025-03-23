/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      transitionProperty: {
        width: "width",
      },

      // hex primary #0093ff
      // hex secondary #39ff14

      colors: {
        neutralSilver: "#F5F7FA",
        neutralDGray: "#4D4D4D",
        brandPrimary: "rgb(0, 147, 255)",
        brandSecondary: "rgb(57, 255, 20)",
        brandDSecondary: "#22D900",
        brandSecondary2: "rgb(231, 255, 227)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          scrollbarColor: "rgb(31 29 29) white",
        },
        ".scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "calc(100vh - calc(3.5rem + 1px))",
          },
          "&::-webkit-scrollbar-track": {
            background: "none",
          },
          "&::-webkit-scrollbar-thumb": {
            // backgroundColor: "#a9a9a9",
            backgroundColor: "rgb(63 63 70)",
            borderRadius: "20px",
            border: "0px solid white",
          },
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },

    require("flowbite/plugin"),
  ],
};
