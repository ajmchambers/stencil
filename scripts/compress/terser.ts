import fs from 'fs-extra';
import { join } from 'path';
import { minify } from 'terser';

const rootDir = join(__dirname, '..', '..', '..');
const compilerDirPath = join(rootDir, 'compiler');
const buildDirPath = join(rootDir, 'build');
const compilerInputPath = join(compilerDirPath, 'stencil.js');
const compilerOutputPath = join(buildDirPath, 'stencil.terser.min.js');

const code = fs.readFileSync(compilerInputPath, 'utf8');
console.log('terser minify started:', compilerInputPath);

const results = minify(code, {
  parse: {
    ecma: 2018,
  },
  compress: {
    ecma: 2018,
    passes: 2,
    side_effects: false,
    unsafe_arrows: true,
    unsafe_methods: true,
  },
  output: {
    ecma: 2018,
    comments: false,
    keep_quoted_props: true,
  },
});

fs.writeFileSync(compilerOutputPath, results.code);
console.log('terser minify finished:', compilerOutputPath);
