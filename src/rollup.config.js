import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

const globals = {
  'moment': 'moment',
  'lodash': 'lodash',
};

export default {
  external: Object.keys(globals),
  plugins: [
    resolve(),
    sourcemaps(),
  ],
  output: {
    format: 'umd',
    name: 'ng.@ray-volution/core',
    globals: globals,
    sourcemap: true,
    exports: 'named',
    amd: {
      id: '@ray-volution/core',
    },
  },
};
