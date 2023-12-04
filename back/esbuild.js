import esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['src/server.ts'],
  bundle: true,
  platform: 'node',
  packages: 'external',
  outfile: 'dist/out.js',
  target: ['es2020'],
  format: "esm",
  sourcemap: true,
})
