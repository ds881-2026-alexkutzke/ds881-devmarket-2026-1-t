import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

function getFiles(dir: string, allFiles: string[] = []): string[] {
  if (!fs.existsSync(dir)) return allFiles;
  
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      if (file !== 'tests') {
        getFiles(filePath, allFiles);
      }
    } else {
      const isIndex = /^index\.(ts|tsx)$/.test(file);
      const isTest = /\.(test|spec)\.(ts|tsx)$/.test(file);

      if (!isIndex && !isTest) {
        allFiles.push(filePath);
      }
    }
  });

  return allFiles;
}

const srcPath = path.resolve(__dirname, '../../');

function validateFiles(folder: string, regex: RegExp, errorMessage: string) {
  const dir = path.join(srcPath, folder);
  if (!fs.existsSync(dir)) return;

  const files = getFiles(dir).map(f => path.basename(f));
  files.forEach(file => {
    expect(file, `${errorMessage}: ${file}`).toMatch(regex);
  });
}

describe('Convenções de Nomenclatura de Arquivos', () => {
  
  describe('src/components/', () => {
    test('Arquivos devem ser PascalCase e .tsx ou .css', () => {
      validateFiles('components', /^[A-Z][a-zA-Z0-9]*\.(tsx|css)$/, 'Erro em components');
    });
  });

  describe('src/pages/', () => {
    test('Arquivos devem terminar com Page.tsx ou Page.css', () => {
      validateFiles('pages', /^[A-Z][a-zA-Z0-9]*Page\.(tsx|css)$/, 'Erro em pages');
    });
  });

  describe('src/store/', () => {
    test('Arquivos devem ser camelCase e terminar com Store.ts', () => {
      validateFiles('store', /^[a-z][a-zA-Z0-9]*Store\.ts$/, 'Erro em store');
    });
  });

  describe('src/services/', () => {
    test('Arquivos devem terminar com Service.ts', () => {
      validateFiles('services', /^[a-z][a-zA-Z0-9]*Service\.ts$/, 'Erro em services');
    });
  });

  describe('src/hooks/', () => {
    test('Arquivos devem começar com "use" e ser .ts ou .tsx', () => {
      validateFiles('hooks', /^use[A-Z][a-zA-Z0-9]*\.tsx?$/, 'Erro em hooks');
    });
  });

  describe('src/utils/', () => {
    test('Arquivos devem ser camelCase e .ts', () => {
      validateFiles('utils', /^[a-z][a-zA-Z0-9]*\.ts$/, 'Erro em utils');
    });
  });

  describe('src/types/', () => {
    test('Arquivos devem terminar com .types.ts', () => {
      validateFiles('types', /^[a-z][a-zA-Z0-9]*\.types\.ts$/, 'Erro em types');
    });
  });
});