import fs from 'fs-extra';
import { Plugin } from 'rollup';

export function typescriptSourcePlugin(): Plugin {
  const tsPath = require.resolve('typescript');
  return {
    name: 'typescriptSourcePlugin',
    resolveId(id) {
      if (id === 'typescript') {
        return tsPath;
      }
      return null;
    },
    async load(id) {
      if (id !== tsPath) {
        return null;
      }

      // get the source typescript.js file to modify
      let code = await fs.readFile(tsPath, 'utf8');

      // remove the default ts.getDefaultLibFilePath because it uses some
      // node apis and we'll be replacing it withour own anyways and
      const getDefaultLibFilePath = `ts.getDefaultLibFilePath = getDefaultLibFilePath;`;
      if (!code.includes(getDefaultLibFilePath)) {
        throw new Error(`"${getDefaultLibFilePath}" not found`);
      }
      code = code.replace(getDefaultLibFilePath, `/* commented out: ${getDefaultLibFilePath} */`);

      // remove the CPUProfiler since it uses node apis
      const enableCPUProfiler = `enableCPUProfiler: enableCPUProfiler,`;
      if (!code.includes(enableCPUProfiler)) {
        throw new Error(`"${enableCPUProfiler}" not found`);
      }
      code = code.replace(enableCPUProfiler, `/* commented out: ${enableCPUProfiler} */`);

      const disableCPUProfiler = `disableCPUProfiler: disableCPUProfiler,`;
      if (!code.includes(disableCPUProfiler)) {
        throw new Error(`"${disableCPUProfiler}" not found`);
      }
      code = code.replace(disableCPUProfiler, `/* commented out: ${disableCPUProfiler} */`);

      // trim off the last part that sets module.exports and polyfills globalThis since
      // we dont' want typescript to add itself to module.exports when in a node env
      const tsEnding = `})(ts || (ts = {}));`;
      if (!code.includes(tsEnding)) {
        throw new Error(`"${tsEnding}" not found`);
      }
      const lastEnding = code.lastIndexOf(tsEnding);
      code = code.substr(0, lastEnding + tsEnding.length);

      // minification is crazy better if it doesn't use typescript's
      // namespace closures, like (function(ts) {...})(ts = ts || {});
      code = code.replace(/var ts;/g, '');
      code = code.replace(/ \|\| \(ts \= \{\}\)/g, '');

      // "process.browser" is used by typescript to know if it should use the node sys or not
      // this ensures its using our checks. Deno should also be process.browser = true
      // because we don't want deno using the node apis
      code = `import { IS_NODE_ENV } from '@utils';\n` + code;
      code = `process.browser = !IS_NODE_ENV;\n` + code;

      // make a nice clean default export
      code = `const ts = {};\n${code}\n;export default ts;`;

      return code;
    },
  };
}

function getDefault() {
  return '/*adam*/';
}
