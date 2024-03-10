import scrollbarPlugin from 'tailwind-scrollbar'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#CCCCCC',
          100: '#999999',
          200: '#6A6A6A',
          300: '#515151',
          400: '#393939',
          500: '#2D2D2D',
        },
      },
    },
  },
  plugins: [scrollbarPlugin({})],
}
export default config
