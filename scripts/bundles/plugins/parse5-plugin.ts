import fs from 'fs-extra';
import { aliasPlugin } from './alias-plugin';
import { join } from 'path';
import { BuildOptions } from '../../utils/options';
import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupResolve from '@rollup/plugin-node-resolve';
import { rollup, OutputChunk, Plugin } from 'rollup';

export function parse5Plugin(opts: BuildOptions): Plugin {
  return {
    name: 'parse5Plugin',
    resolveId(id) {
      if (id === 'parse5') {
        return id;
      }
      return null;
    },
    async load(id) {
      if (id === 'parse5') {
        return await bundleParse5(opts);
      }
      return null;
    },
    generateBundle(_, bundle) {
      Object.keys(bundle).forEach(fileName => {
        // not minifying, but we are reducing whitespace
        const chunk = bundle[fileName] as OutputChunk;
        if (chunk.type === 'chunk') {
          chunk.code = chunk.code.replace(/    /g, '  ');
        }
      });
    },
  };
}

async function bundleParse5(opts: BuildOptions) {
  const cacheFile = join(opts.buildDir, 'parse5-bundle-cache.js');

  try {
    return await fs.readFile(cacheFile, 'utf8');
  } catch (e) {}

  const rollupBuild = await rollup({
    input: '@parse5-entry',
    plugins: [
      {
        name: 'parse5EntryPlugin',
        resolveId(id) {
          if (id === '@parse5-entry') {
            return id;
          }
          return null;
        },
        load(id) {
          if (id === '@parse5-entry') {
            return `export { parse, parseFragment } from 'parse5';`;
          }
          return null;
        },
      },
      aliasPlugin(opts),
      rollupResolve(),
      rollupCommonjs(),
    ],
  });

  const { output } = await rollupBuild.generate({
    format: 'iife',
    name: 'EXPORT_PARSE5',
    footer: [
      'export const parse = EXPORT_PARSE5.parse;',
      'export const parseFragment = EXPORT_PARSE5.parseFragment;'
    ].join('\n'),
    preferConst: true
  });

  const code = output[0].code;

  await fs.writeFile(cacheFile, code);

  return code;
}
