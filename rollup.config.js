import pkg from './package.json'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'ModuleName'
    }
  ],
  plugins: [
    resolve(),
  ]
}