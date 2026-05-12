# DevMarket

## Fluxo de trabalho

1. Puxar Tarefa (Self-Assign): Acesse o Board do projeto no GitHub. Escolha uma issue da coluna "To Do" que não tenha ninguém atribuído. Abra a issue, clique em Assignees (na barra lateral direita) e selecione assign yourself (atribuir a si mesmo).
2. Sinalizar Início: Mova o card correspondente da coluna "To Do" para a coluna "In Progress" (Em Andamento) para avisar a equipe e o Scrum Master que você está atuando naquilo.
3. Criar a Branch: Crie sua branch local sempre a partir da main mais recente (ex: git checkout -b feat/nome-da-tarefa-12, onde 12 é o número da sua issue).
4. Desenvolver e Abrir PR: Faça o código, faça o push da sua branch e abra o Pull Request colocando o texto mágico para fechar a issue automaticamente (ex: "Closes #12").
5. Peça review a um Tech Lead ou outro dev no Discord
6. Enquanto espera review, faça review do PR de outra pessoa
7. Se pedirem mudanças, corrija, commite, e peça review de novo
8. Quando aprovado e mergeado, mova a issue para “Done”

> [!WARNING]
> Convenção de branch para adicionar nome ao contributors: docs/contributors-[usuario-github].


## Convenções de Arquitetura

**Estrutura de Pastas e Nomenclatura:**
* `src/components/`: Componentes reutilizáveis (`PascalCase.tsx`). Devem usar `export default`.
* `src/pages/`: Rotas (`PascalCasePage.tsx`).
* `src/services/`: Chamadas a APIs externas (`camelCaseService.ts`). Devem usar named exports.
* `src/hooks/`: Custom hooks (`usePascalCase.ts` ou `.tsx`).
* `src/utils/`: Funções utilitárias (`camelCase.ts`).
* `src/types/`: Tipos TypeScript (`camelCase.types.ts`).

**Regras de Importação:**
* `pages/` pode importar de `components`, `services`, `hooks`, `utils`, `types`. NÃO importa de outras `pages/`.
* `components/` pode importar de `hooks`, `utils`, `types`. NÃO importa de `pages/` ou `services/`.
* `services/` pode importar de `utils`, `types`. NÃO importa de `components/`, `pages/`, `hooks/`.

**Qualidade:**
* Proibido o uso de `console.log`.
* Proibido CSS inline (use classes do Tailwind).
* Componentes não podem fazer chamadas diretas com `fetch()` ou `axios`. Chamadas devem ficar em `services/`.
