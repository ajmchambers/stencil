import fs from 'fs-extra';
import { join } from 'path';
import { minify } from 'terser';

const compilerDirPath = join(__dirname, '..', '..', '..', 'compiler');
const compilerInputPath = join(compilerDirPath, 'stencil.js');
const compilerOutputPath = join(compilerDirPath, 'stencil.min.js');

const code = fs.readFileSync(compilerInputPath, 'utf8');

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
