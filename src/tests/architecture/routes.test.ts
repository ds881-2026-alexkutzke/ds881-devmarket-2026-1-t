import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("Architecture | Routes", () => {
  test("App.tsx não deve importar páginas diretamente", () => {
    const appPath = join(process.cwd(), "src", "App.tsx");
    const content = readFileSync(appPath, "utf8");
    const hasPagesImport = /from\s+["']\.\.?\/pages\//.test(content);

    expect(hasPagesImport).toBe(false);
    if (hasPagesImport) {
      throw new Error(
        "App.tsx não deve importar páginas diretamente. Use o arquivo routes.ts para registrar novas rotas."
      );
    }
  });
});
