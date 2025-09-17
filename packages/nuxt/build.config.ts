import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  entries: [
    'src/module'
  ],
  dependencies: [
    '@nuxt/kit',
    '@suggesto/vue'
  ],
  externals: [
    '@nuxt/kit',
    '@nuxt/schema'
  ]
});
