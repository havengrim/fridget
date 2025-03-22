
import Components from 'unplugin-vue-components/vite'
import { UnpluginVueComponentsResolver, UnpluginDirectivesResolver, UnpluginModulesResolver } from 'maz-ui/resolvers'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Components({
      dts: true,
      resolvers: [
        UnpluginVueComponentsResolver(),
        UnpluginDirectivesResolver(),
        UnpluginModulesResolver(),
      ],
    }),
  ]
})