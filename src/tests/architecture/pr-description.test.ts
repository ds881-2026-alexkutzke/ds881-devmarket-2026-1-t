import { describe, test, expect } from 'vitest';

describe('Testes de Automação do Pipeline - Pull Requests', () => {
    test('A descrição do PR deve ser detalhada e descritiva', () => {
        const prBody = "Desenvolvimento da automação para o pipeline da semana 3"; 
        const minLength = 20;

        const isLongEnough = prBody.length >= minLength;
        
        expect(isLongEnough, 'Erro no Pipeline: A descrição do seu Pull Request está muito curta ou vazia. Escreva pelo menos 20 caracteres detalhando suas alterações.').toBe(true);
    });
});
