import { globSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import swc from '@rollup/plugin-swc';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';

const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'));

const external = [
  /node_modules/,
  ...Object.keys(packageJson.dependencies ?? {}).map((name) => new RegExp(`^${name}(?:/|$)`)),
];
const sourceDirectory = 'src';
const inputFiles = Object.fromEntries(
  globSync(`${sourceDirectory}/**/index.ts`).map((file) => [
    relative(sourceDirectory, file).replace(/\.ts$/, ''),
    file,
  ]),
);
const extensions = ['.ts', '.js'];
const targets = packageJson.browserslist;

const emitTypes =
  Boolean(packageJson.types) ||
  Object.values(packageJson.exports ?? {}).some(
    (entry) => entry !== null && typeof entry === 'object' && 'types' in entry,
  );

export default defineConfig([
  {
    external,
    input: inputFiles,
    output: [
      {
        dir: 'dist',
        format: 'esm',
        preserveModules: true,
        preserveModulesRoot: sourceDirectory,
        sourcemap: true,
      },
    ],
    plugins: [
      json(),
      nodeResolve({ extensions }),
      swc({
        swc: {
          jsc: {
            parser: { syntax: 'typescript' },
          },
          ...(targets ? { env: { targets } } : {}),
        },
      }),
    ],
    treeshake: true,
  },
  ...(emitTypes
    ? [
        {
          external,
          input: inputFiles,
          output: [
            {
              dir: 'dist',
              format: 'esm',
              preserveModules: true,
              preserveModulesRoot: sourceDirectory,
            },
          ],
          plugins: [dts()],
        },
      ]
    : []),
]);
