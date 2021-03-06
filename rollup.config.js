import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import sourceMaps from 'rollup-plugin-sourcemaps';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');

export default [
  {
    input: 'index.js',
    output: [{ file: pkg.main, format: 'es', sourcemap: true }],
    external: [],
    watch: {
      include: 'src/**',
    },
    plugins: [
      json(),
      svelte(),
      resolve(),
      commonjs(),
      typescript(),
      sourceMaps(),
    ],
  },
];
