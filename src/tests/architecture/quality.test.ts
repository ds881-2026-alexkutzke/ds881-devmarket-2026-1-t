import { describe, test, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as ts from 'typescript';

type ImportEdge = {
  from: string;
  to: string;
  line: number;
};

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const srcPath = path.resolve(currentDir, '../..');
const sourceExtensions = new Set(['.ts', '.tsx']);

function normalizePath(filePath: string): string {
  return filePath.split(path.sep).join('/');
}

function relativeToSrc(filePath: string): string {
  return normalizePath(path.relative(srcPath, filePath));
}

function getLine(content: string, index: number): number {
  return content.slice(0, index).split(/\r?\n/).length;
}

function getFiles(dir: string, extensions: Set<string>, excludeTests = false): string[] {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    const relativePath = path.relative(srcPath, entryPath);
    const segments = relativePath.split(path.sep);

    if (excludeTests && segments.includes('tests')) return [];

    if (entry.isDirectory()) {
      return getFiles(entryPath, extensions, excludeTests);
    }

    return extensions.has(path.extname(entry.name)) ? [entryPath] : [];
  }).sort();
}

function findRegexViolations(files: string[], regex: RegExp): string[] {
  return files.flatMap((file) => {
    const content = fs.readFileSync(file, 'utf8');
    const violations: string[] = [];
    let match: RegExpExecArray | null;

    regex.lastIndex = 0;
    while ((match = regex.exec(content)) !== null) {
      violations.push(`${relativeToSrc(file)}:${getLine(content, match.index)} ${match[0]}`);
    }

    return violations;
  });
}

function resolveImport(fromFile: string, importPath: string, knownFiles: Set<string>): string | null {
  if (!importPath.startsWith('.')) return null;

  const basePath = path.resolve(path.dirname(fromFile), importPath);
  const candidates = path.extname(basePath)
    ? [basePath]
    : [
        `${basePath}.ts`,
        `${basePath}.tsx`,
        path.join(basePath, 'index.ts'),
        path.join(basePath, 'index.tsx'),
      ];

  return candidates.find((candidate) => knownFiles.has(candidate)) ?? null;
}

function getImportEdges(file: string, knownFiles: Set<string>): ImportEdge[] {
  const content = fs.readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
  const edges: ImportEdge[] = [];

  sourceFile.forEachChild((node) => {
    if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) return;

    const target = resolveImport(file, node.moduleSpecifier.text, knownFiles);
    if (!target) return;

    edges.push({
      from: file,
      to: target,
      line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
    });
  });

  return edges;
}

function findCircularDependencies(files: string[]): string[] {
  const knownFiles = new Set(files);
  const graph = new Map<string, ImportEdge[]>(
    files.map((file) => [file, getImportEdges(file, knownFiles)]),
  );
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const stack: ImportEdge[] = [];
  const cycleKeys = new Set<string>();
  const cycles: string[] = [];

  function formatCycle(edges: ImportEdge[]): string {
    return edges
      .map((edge) => `${relativeToSrc(edge.from)}:${edge.line} -> ${relativeToSrc(edge.to)}`)
      .join('\n');
  }

  function dfs(file: string): void {
    visiting.add(file);

    graph.get(file)?.forEach((edge) => {
      if (visiting.has(edge.to)) {
        const startIndex = stack.findIndex((stackEdge) => stackEdge.from === edge.to);
        const cycleEdges = startIndex >= 0 ? [...stack.slice(startIndex), edge] : [edge];
        const cycleKey = cycleEdges.map((cycleEdge) => cycleEdge.from).sort().join('>');

        if (!cycleKeys.has(cycleKey)) {
          cycleKeys.add(cycleKey);
          cycles.push(formatCycle(cycleEdges));
        }
        return;
      }

      if (visited.has(edge.to)) return;

      stack.push(edge);
      dfs(edge.to);
      stack.pop();
    });

    visiting.delete(file);
    visited.add(file);
  }

  files.forEach((file) => {
    if (!visited.has(file)) dfs(file);
  });

  return cycles;
}

describe('Regras gerais de qualidade', () => {
  test('nao permite chamadas console.* em src fora de tests', () => {
    const files = getFiles(srcPath, sourceExtensions, true);
    const violations = findRegexViolations(files, /console\.(log|warn|error|debug)\(/g);

    expect(violations, 'Console nao permitido').toEqual([]);
  });

  test('nao permite CSS inline em arquivos .tsx', () => {
    const files = getFiles(srcPath, new Set(['.tsx']));
    const violations = findRegexViolations(files, /style=\{/g);

    expect(violations, 'CSS inline nao permitido').toEqual([]);
  });

  test('componentes .tsx usam export default', () => {
    const files = getFiles(path.join(srcPath, 'components'), new Set(['.tsx']));
    const violations = files
      .filter((file) => !/export default/.test(fs.readFileSync(file, 'utf8')))
      .map((file) => `${relativeToSrc(file)}:1 falta export default`);

    expect(violations, 'Componente sem export default').toEqual([]);
  });

  test('services .ts usam apenas named exports', () => {
    const files = getFiles(path.join(srcPath, 'services'), new Set(['.ts']));
    const violations = files.flatMap((file) => {
      const content = fs.readFileSync(file, 'utf8');
      const fileViolations: string[] = [];
      const defaultExportMatch = /export default/.exec(content);

      if (defaultExportMatch) {
        fileViolations.push(`${relativeToSrc(file)}:${getLine(content, defaultExportMatch.index)} usa export default`);
      }

      if (!/(export function|export const)/.test(content)) {
        fileViolations.push(`${relativeToSrc(file)}:1 falta export function ou export const`);
      }

      return fileViolations;
    });

    expect(violations, 'Service deve usar named export').toEqual([]);
  });

  test('nao permite dependencias circulares', () => {
    const files = getFiles(srcPath, sourceExtensions, true);
    const violations = findCircularDependencies(files);

    expect(violations, 'Dependencia circular nao permitida').toEqual([]);
  });
});

describe('Regras de Arquitetura de Importação', () => {
  function getFolderName(filePath: string): string {
    const segments = relativeToSrc(filePath).split('/');
    return segments[0];
  }

  function fileIsInFolder(filePath: string, folderName: string): boolean {
    return getFolderName(filePath) === folderName;
  }

  test('services/ nao pode importar de components/, pages/, ou hooks/', () => {
    const files = getFiles(srcPath, sourceExtensions, true);
    const knownFiles = new Set(files);
    const violations: string[] = [];

    files
      .filter((file) => fileIsInFolder(file, 'services'))
      .forEach((file) => {
        const edges = getImportEdges(file, knownFiles);

        edges.forEach((edge) => {
          const targetFolder = getFolderName(edge.to);

          if (['components', 'pages', 'hooks'].includes(targetFolder)) {
            violations.push(
              `${relativeToSrc(edge.from)}:${edge.line} nao pode importar de ${targetFolder}/ (importou: ${relativeToSrc(edge.to)})`,
            );
          }
        });
      });

    expect(violations, 'Services nao podem importar de components/, pages/ ou hooks/').toEqual([]);
  });

  test('components/ nao pode importar de pages/ ou services/', () => {
    const files = getFiles(srcPath, sourceExtensions, true);
    const knownFiles = new Set(files);
    const violations: string[] = [];

    files
      .filter((file) => fileIsInFolder(file, 'components'))
      .forEach((file) => {
        const edges = getImportEdges(file, knownFiles);

        edges.forEach((edge) => {
          const targetFolder = getFolderName(edge.to);

          if (['pages', 'services'].includes(targetFolder)) {
            violations.push(
              `${relativeToSrc(edge.from)}:${edge.line} nao pode importar de ${targetFolder}/ (importou: ${relativeToSrc(edge.to)})`,
            );
          }
        });
      });

    expect(violations, 'Components nao podem importar de pages/ ou services/').toEqual([]);
  });

  test('pages/ nao pode importar de outras pages/', () => {
    const files = getFiles(srcPath, sourceExtensions, true);
    const knownFiles = new Set(files);
    const violations: string[] = [];

    files
      .filter((file) => fileIsInFolder(file, 'pages'))
      .forEach((file) => {
        const edges = getImportEdges(file, knownFiles);

        edges.forEach((edge) => {
          const targetFolder = getFolderName(edge.to);

          if (targetFolder === 'pages' && edge.to !== file) {
            violations.push(
              `${relativeToSrc(edge.from)}:${edge.line} nao pode importar de outra page/ (importou: ${relativeToSrc(edge.to)})`,
            );
          }
        });
      });

    expect(violations, 'Pages nao podem importar de outras pages/').toEqual([]);
  });
});
