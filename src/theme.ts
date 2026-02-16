import { createSystem, defaultConfig, defineConfig, mergeConfigs } from '@chakra-ui/react'

// Chakra UI v3 equivalent of the design system
// Original spec: purple brand, teal accent, custom dark backgrounds, Inter font

const customConfig = defineConfig({
  // Global CSS styles (replaces v2's styles.global)
  globalCss: {
    'html, body': {
      bg: { _light: '{colors.gray.50}', _dark: '{colors.dark.bg}' },
      color: { _light: '{colors.gray.800}', _dark: 'white' },
    },

  },

  theme: {
    // Primitive design tokens
    tokens: {
      colors: {
        // Brand purple palette
        brand: {
          50: { value: '#F3E8FF' },
          100: { value: '#D8B4FE' },
          200: { value: '#C084FC' },
          300: { value: '#A855F7' },
          400: { value: '#9333EA' },
          500: { value: '#7E22CE' },  // Main Brand Color
          600: { value: '#6B21A8' },
          700: { value: '#581C87' },
          800: { value: '#4C1D95' },
          900: { value: '#2E1065' },
        },
        // Accent teal palette
        accent: {
          50: { value: '#E6FFFA' },
          100: { value: '#B2F5EA' },
          200: { value: '#81E6D9' },
          300: { value: '#4FD1C5' },
          400: { value: '#38B2AC' },
          500: { value: '#319795' },  // Main Accent Color
          600: { value: '#2C7A7B' },
          700: { value: '#285E61' },
          800: { value: '#234E52' },
          900: { value: '#1D4044' },
        },
        // Custom dark backgrounds (not just black)
        dark: {
          bg: { value: '#0f1117' },     // Very dark blue-gray (page background)
          card: { value: '#1e212b' },   // Slightly lighter (card background)
          hover: { value: '#2d303e' },  // Hover state
        },
      },
      fonts: {
        heading: { value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" },
        body: { value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" },
      },
    },

    // Semantic tokens: light/dark mode aware
    semanticTokens: {
      colors: {
        // Page & card backgrounds
        'bg.page': {
          value: { _light: '{colors.gray.50}', _dark: '{colors.dark.bg}' },
        },
        'bg.card': {
          value: { _light: '#ffffff', _dark: '{colors.dark.card}' },
        },
        'bg.card.hover': {
          value: { _light: '{colors.gray.100}', _dark: '{colors.dark.hover}' },
        },
        'border.card': {
          value: { _light: '{colors.gray.200}', _dark: 'rgba(255, 255, 255, 0.06)' },
        },
        'shadow.card': {
          value: { _light: '0px 3px 5px rgba(112, 144, 176, 0.08)', _dark: 'none' },
        },

        // Brand semantic tokens
        'brand.solid': {
          value: { _light: '{colors.brand.500}', _dark: '{colors.brand.500}' },
        },
        'brand.contrast': {
          value: { _light: 'white', _dark: 'white' },
        },
        'brand.fg': {
          value: { _light: '{colors.brand.500}', _dark: '{colors.brand.200}' },
        },
        'brand.muted': {
          value: { _light: '{colors.brand.50}', _dark: 'rgba(255, 255, 255, 0.06)' },
        },
        'brand.border': {
          value: { _light: '{colors.brand.500}', _dark: '{colors.brand.200}' },
        },
        'brand.solid.hover': {
          value: { _light: '{colors.brand.600}', _dark: '{colors.brand.600}' },
        },

        // Input borders
        'input.border': {
          value: { _light: '{colors.gray.200}', _dark: 'rgba(255, 255, 255, 0.16)' },
        },
        'input.border.hover': {
          value: { _light: '{colors.gray.300}', _dark: 'rgba(255, 255, 255, 0.24)' },
        },
        'input.border.focus': {
          value: { _light: '{colors.brand.500}', _dark: '{colors.brand.500}' },
        },
      },
    },
  },
})

export const system = createSystem(mergeConfigs(defaultConfig, customConfig))
