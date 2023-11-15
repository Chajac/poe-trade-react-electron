import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

export default {
	content: [
		"./src/**/*.{html,js,ts,tsx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	themes: {
		extend: {},
	},
	darkMode: "class",
	plugins: [nextui()],
} satisfies Config;
