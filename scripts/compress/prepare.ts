import fs from 'fs-extra';
import { join } from 'path';
import ts from 'typescript';

const rootDir = join(__dirname, '..', '..', '..');

function getExterns(dtsFile: string) {
  const dts = fs.readFileSync(dtsFile, 'utf8');
  ts.transpileModule(dts, {
    transformers: {
      before: [convertDecoratorsToStatic()],
    },
  });
}

function convertDecoratorsToStatic(): ts.TransformerFactory<ts.SourceFile> {
  return transformCtx => {
    const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
      if (ts.isPropertySignature(node) || ts.isMethodSignature(node) || ts.isPropertyDeclaration(node) || ts.isMethodDeclaration(node)) {
        const propName = (node.name as ts.Identifier).text;
        if (typeof propName === 'string' && propName.length > 0) {
          props.add((node.name as ts.Identifier).text);
        }
      }
      return ts.visitEachChild(node, visit, transformCtx);
    };

    return tsSourceFile => {
      return ts.visitEachChild(tsSourceFile, visit, transformCtx);
    };
  };
}

function getDirectoryDts(dir) {
  const dirItems = fs.readdirSync(dir);
  dirItems.forEach(itemName => {
    const itemPath = join(dir, itemName);
    if (itemName.endsWith('.d.ts')) {
      getExterns(itemPath);
    } else {
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        getDirectoryDts(itemPath);
      }
    }
  });
}

const props = new Set<string>();
const externs = [fs.readFileSync(join(rootDir, 'scripts', 'compress', 'externs'), 'utf8')];

getExterns(join(rootDir, 'internal', 'stencil-public-compiler.d.ts'));
getExterns(join(rootDir, 'internal', 'stencil-public-docs.d.ts'));
getExterns(join(rootDir, 'internal', 'stencil-public-runtime.d.ts'));

getDirectoryDts(join(rootDir, 'node_modules', '@types', 'autoprefixer'));
getDirectoryDts(join(rootDir, 'node_modules', '@types', 'graceful-fs'));
getDirectoryDts(join(rootDir, 'node_modules', '@types', 'jest'));
getDirectoryDts(join(rootDir, 'node_modules', '@types', 'node-fetch'));
getDirectoryDts(join(rootDir, 'node_modules', '@types', 'pixelmatch'));
getDirectoryDts(join(rootDir, 'node_modules', '@types', 'pngjs'));
getDirectoryDts(join(rootDir, 'node_modules', '@types', 'puppeteer'));
getDirectoryDts(join(rootDir, 'node_modules', '@types', 'semver'));

getDirectoryDts(join(rootDir, 'node_modules', '@jest'));
getDirectoryDts(join(rootDir, 'node_modules', '@rollup'));
getDirectoryDts(join(rootDir, 'node_modules', 'postcss'));
getDirectoryDts(join(rootDir, 'node_modules', 'rollup'));

const nodeDtsDirPath = join(rootDir, 'node_modules', '@types', 'node');
const nodeDtsDir = fs.readdirSync(nodeDtsDirPath);
nodeDtsDir.forEach(n => {
  if (n.endsWith('.d.ts')) {
    const filePath = join(nodeDtsDirPath, n);
    getExterns(filePath);
  }
});

externs.push(`var externs = {`);
Array.from(props)
  .sort()
  .forEach(prop => {
    externs.push(`  "${prop}": {},`);
  });
externs.push(`};`);

fs.writeFileSync(join(__dirname, '..', 'externs'), externs.join('\n'));
