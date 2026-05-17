import { describe, test, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type Layer = 'pages' | 'components' | 'services' | 'hooks' | 'utils' | 'types';

type ImportRecord = {
  importerFile: string;
  rawImport: string;
  importerLayer: Layer;
  importedLayer: Layer;
  normalizedTarget: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../../');

const LAYERS: Layer[] = ['pages', 'components', 'services', 'hooks', 'utils', 'types'];
const IMPORT_REGEX = /\b(?:import|export)\s+(?:type\s+)?(?:[\w*\s{},]*\s+from\s+)?["']([^"']+)["']|\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;

const FORBIDDEN_RULES: Record<Exclude<Layer, 'types'>, Layer[]> = {
  pages: ['pages'],
  components: ['pages', 'services'],
  services: ['components', 'pages', 'hooks'],
  hooks: ['components', 'pages'],
  utils: ['components', 'pages', 'hooks', 'services'],
};

function normalizePath(value: string): string {
  return value.split(path.sep).join('/');
}

function isLayer(value: string): value is Layer {
  return LAYERS.includes(value as Layer);
}

function getLayerFromPath(normalizedPath: string): Layer | null {
  const [firstSegment] = normalizedPath.split('/');
  return firstSegment && isLayer(firstSegment) ? firstSegment : null;
}

function isTestFile(filePath: string): boolean {
  const normalized = normalizePath(filePath);
  return /\.(test|spec)\.(ts|tsx)$/.test(normalized) || normalized.includes('/tests/');
}

function isCodeImport(importPath: string): boolean {
  const extension = path.extname(importPath);
  if (!extension) return true;

  return extension === '.ts' || extension === '.tsx';
}

function getSourceFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getSourceFiles(fullPath));
      continue;
    }

    if (!/\.(ts|tsx)$/.test(entry.name)) continue;
    if (isTestFile(fullPath)) continue;

    files.push(fullPath);
  }

  return files;
}

function normalizeImportTarget(importerFile: string, importPath: string): string | null {
  if (importPath.startsWith('@/')) {
    return normalizePath(importPath.slice(2));
  }

  if (importPath.startsWith('.')) {
    const resolved = path.resolve(path.dirname(importerFile), importPath);
    const relativeToSrc = normalizePath(path.relative(srcDir, resolved));

    if (relativeToSrc.startsWith('..')) return null;
    return relativeToSrc;
  }

  return null;
}

function collectLayerImports(): ImportRecord[] {
  const sourceFiles = getSourceFiles(srcDir);
  const imports: ImportRecord[] = [];

  for (const importerFile of sourceFiles) {
    const importerRelative = normalizePath(path.relative(srcDir, importerFile));
    const importerLayer = getLayerFromPath(importerRelative);
    if (!importerLayer) continue;

    const content = fs.readFileSync(importerFile, 'utf8');
    let match: RegExpExecArray | null;

    IMPORT_REGEX.lastIndex = 0;
    while ((match = IMPORT_REGEX.exec(content)) !== null) {
      const rawImport = match[1] ?? match[2];
      if (!rawImport) continue;

      // Ignora bibliotecas externas: apenas caminhos relativos ou alias "@/".
      if (!(rawImport.startsWith('.') || rawImport.startsWith('@/'))) continue;
      if (!isCodeImport(rawImport)) continue;

      const normalizedTarget = normalizeImportTarget(importerFile, rawImport);
      if (!normalizedTarget) continue;

      const importedLayer = getLayerFromPath(normalizedTarget);
      if (!importedLayer) continue;

      imports.push({
        importerFile: importerRelative,
        rawImport,
        importerLayer,
        importedLayer,
        normalizedTarget,
      });
    }
  }

  return imports;
}

function getViolations(records: ImportRecord[], fromLayer: Layer, forbiddenLayer: Layer): string[] {
  return records
    .filter((record) => record.importerLayer === fromLayer && record.importedLayer === forbiddenLayer)
    .map(
      (record) =>
        `${record.importerFile} importou "${record.rawImport}" -> "${record.normalizedTarget}". Regra violada: ${fromLayer} nao pode importar de ${forbiddenLayer}.`,
    );
}

const records = collectLayerImports();

describe('Arquitetura de imports - camada pages', () => {
  test('pages nao pode importar de pages', () => {
    const violations = getViolations(records, 'pages', 'pages');
    expect(violations, violations.join('\n')).toEqual([]);
  });
});

describe('Arquitetura de imports - camada components', () => {
  test('components nao pode importar de pages', () => {
    const violations = getViolations(records, 'components', 'pages');
    expect(violations, violations.join('\n')).toEqual([]);
  });

  test('components nao pode importar de services', () => {
    const violations = getViolations(records, 'components', 'services');
    expect(violations, violations.join('\n')).toEqual([]);
  });
});

describe('Arquitetura de imports - camada services', () => {
  test('services nao pode importar de components', () => {
    const violations = getViolations(records, 'services', 'components');
    expect(violations, violations.join('\n')).toEqual([]);
  });

  test('services nao pode importar de pages', () => {
    const violations = getViolations(records, 'services', 'pages');
    expect(violations, violations.join('\n')).toEqual([]);
  });

  test('services nao pode importar de hooks', () => {
    const violations = getViolations(records, 'services', 'hooks');
    expect(violations, violations.join('\n')).toEqual([]);
  });
});

describe('Arquitetura de imports - camada hooks', () => {
  test('hooks nao pode importar de components', () => {
    const violations = getViolations(records, 'hooks', 'components');
    expect(violations, violations.join('\n')).toEqual([]);
  });

  test('hooks nao pode importar de pages', () => {
    const violations = getViolations(records, 'hooks', 'pages');
    expect(violations, violations.join('\n')).toEqual([]);
  });
});

describe('Arquitetura de imports - camada utils', () => {
  test('utils nao pode importar de components', () => {
    const violations = getViolations(records, 'utils', 'components');
    expect(violations, violations.join('\n')).toEqual([]);
  });

  test('utils nao pode importar de pages', () => {
    const violations = getViolations(records, 'utils', 'pages');
    expect(violations, violations.join('\n')).toEqual([]);
  });

  test('utils nao pode importar de hooks', () => {
    const violations = getViolations(records, 'utils', 'hooks');
    expect(violations, violations.join('\n')).toEqual([]);
  });

  test('utils nao pode importar de services', () => {
    const violations = getViolations(records, 'utils', 'services');
    expect(violations, violations.join('\n')).toEqual([]);
  });
});

// Garante que as regras descritas no enunciado permanecem consistentes.
describe('Sanidade das regras de proibicao', () => {
  test('mapa de regras proibidas confere com as camadas solicitadas', () => {
    expect(FORBIDDEN_RULES).toEqual({
      pages: ['pages'],
      components: ['pages', 'services'],
      services: ['components', 'pages', 'hooks'],
      hooks: ['components', 'pages'],
      utils: ['components', 'pages', 'hooks', 'services'],
    });
  });
});
