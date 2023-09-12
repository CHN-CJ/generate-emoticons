import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import solid from 'vite-plugin-solid'
import { presetAttributify, presetUno, presetIcons } from 'unocss'


export default defineConfig({
  plugins: [solid(),
  UnoCSS({
    presets: [presetIcons(), presetAttributify(), presetUno()],
  }),],
})
