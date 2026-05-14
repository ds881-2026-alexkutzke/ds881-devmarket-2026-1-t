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

describe('Convenções de Nomenclatura de Arquivos', () => {
  
  describe('src/components/', () => {
    test('Arquivos devem ser PascalCase e .tsx ou .css', () => {
      const dir = path.join(srcPath, 'components');
      const files = getFiles(dir).map(f => path.basename(f));

      const regex = /^[A-Z][a-zA-Z0-9]*\.(tsx|css)$/;

      files.forEach(file => {
        expect(file, `Erro em components: ${file}`).toMatch(regex);
      });
    });
  });

  describe('src/pages/', () => {
    test('Arquivos devem terminar com Page.tsx ou Page.css', () => {
      const dir = path.join(srcPath, 'pages');
      const files = getFiles(dir).map(f => path.basename(f));

      const regex = /^[A-Z][a-zA-Z0-9]*Page\.(tsx|css)$/;

      files.forEach(file => {
        expect(file, `Erro em pages: ${file}`).toMatch(regex);
      });
    });
  });

  describe('src/services/', () => {
    test('Arquivos devem terminar com Service.ts', () => {
      const dir = path.join(srcPath, 'services');
      const files = getFiles(dir).map(f => path.basename(f));
      const regex = /^[a-z][a-zA-Z0-9]*Service\.ts$/;

      files.forEach(file => {
        expect(file, `Erro em services: ${file}`).toMatch(regex);
      });
    });
  });

  describe('src/hooks/', () => {
    test('Arquivos devem começar com "use" e ser .ts ou .tsx', () => {
      const dir = path.join(srcPath, 'hooks');
      const files = getFiles(dir).map(f => path.basename(f));
      const regex = /^use[A-Z][a-zA-Z0-9]*\.tsx?$/;

      files.forEach(file => {
        expect(file, `Erro em hooks: ${file}`).toMatch(regex);
      });
    });
  });

  describe('src/utils/', () => {
    test('Arquivos devem ser camelCase e .ts', () => {
      const dir = path.join(srcPath, 'utils');
      const files = getFiles(dir).map(f => path.basename(f));
      const regex = /^[a-z][a-zA-Z0-9]*\.ts$/;

      files.forEach(file => {
        expect(file, `Erro em utils: ${file}`).toMatch(regex);
      });
    });
  });

  describe('src/types/', () => {
    test('Arquivos devem terminar com .types.ts', () => {
      const dir = path.join(srcPath, 'types');
      const files = getFiles(dir).map(f => path.basename(f));
      const regex = /^[a-z][a-zA-Z0-9]*\.types\.ts$/;

      files.forEach(file => {
        expect(file, `Erro em types: ${file}`).toMatch(regex);
      });
    });
  });
});