import { describe, test, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

function getFiles(dir: string, fileList: string[]) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        if (file.isDirectory()) {
            getFiles(path.join(dir, file.name), fileList);
        } else {
            fileList.push(path.join(dir, file.name))
        }
    }

    return fileList
}


describe('Convenção de chamada para API', () => {
    const forbiddenPatterns = /fetch\(|axios|XMLHttpRequest/

    const componentFiles = getFiles('./src/pages/', [])
    const pageFiles = getFiles('./src/components/', [])

    test.each(componentFiles)('Verificando %s', (filePath) => {
        const content = fs.readFileSync(path.resolve(filePath), 'utf-8')

        const isForbiddenUsed = forbiddenPatterns.test(content)

        expect(isForbiddenUsed, 
            `O arquivo [${filePath}] contém chamada direta a API. Mova para src/services/ e importe de lá.`
        ).toBe(false)
    })

    test.each(pageFiles)('Verificando %s', (filePath) => {
        const content = fs.readFileSync(path.resolve(filePath), 'utf-8')

        const isForbiddenUsed = forbiddenPatterns.test(content)

        expect(isForbiddenUsed, 
            `O arquivo [${filePath}] contém chamada direta a API. Mova para src/services/ e importe de lá.`
        ).toBe(false)
    })

})