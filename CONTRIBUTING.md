# Contribuindo para o Work On Dashboard

Obrigado por querer contribuir com este projeto! Este documento descreve o fluxo de trabalho recomendado, padrões de código e checklist para abrir Pull Requests (PRs).

## Conteúdo

- Visão geral rápida
- Como preparar o ambiente
- Branching e commits
- Padrões de código
- Abrindo um Pull Request
- Comunicação e suporte

## Visão geral rápida

1. Fork do repositório.
2. Crie uma branch baseada em `main`: `feature/minha-nova-funcionalidade` ou `fix/descricao-bug`.
3. Faça commits pequenos e claros.
4. Abra um Pull Request descrevendo as mudanças e incluindo um checklist.

## Preparar o ambiente

1. Clone seu fork e entre na pasta:

```
git clone git@github.com:SEU_USUARIO/Project_A_Work_On.git
cd Project_A_Work_On
```

2. Instale dependências:

```
npm install
```

3. Rode o projeto em desenvolvimento:

```
npm run dev
```

## Branching e commits

- Branch names:
  - `feature/<descricao>` para novas funcionalidades.
  - `fix/<descricao>` para correções.
  - `chore/<descricao>` para tarefas de manutenção.
- Commits pequenos e atômicos com mensagens descritivas. Ex.: `feat(reports): add monthly financial summary`.

## Padrões de código

- Typescript: prefira tipagens explícitas quando conveniente.
- Lint: siga as regras do `eslint` configuradas no projeto. Execute `npm run lint` antes de enviar PR.
- Type-check: rode `npm run type-check` para garantir integridade de tipos.

## Abrindo um Pull Request

Inclua no PR:

- Descrição clara do que foi alterado.
- Steps para rodar localmente e reproduzir a mudança.
- Checklist (exemplo abaixo).

Checklist de PR recomendado:

- [ ] Código compilando (`npm run type-check`).
- [ ] Lint sem erros (`npm run lint`).
- [ ] Testes (quando aplicáveis) passando.
- [ ] Atualização de documentação quando necessário.

## Comunicação e suporte

- Abra uma issue para discutir mudanças arquiteturais antes de implementá-las.
- Para problemas de segurança com chaves/API, contate o maintainer diretamente e não abra uma issue pública com segredos.

Obrigado por contribuir!
