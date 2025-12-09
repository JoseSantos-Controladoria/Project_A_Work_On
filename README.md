# Project_A_Work_On

**Visão Geral**

Projeto frontend em React + TypeScript construído com Vite. Este repositório contém a interface de um dashboard administrativo modular chamado **Work On Dashboard**, projetado para gestão de clientes, relatórios financeiros e legais, painel administrativo, chatbot integrado e configurações de usuário.

**Objetivo deste README**

Este documento explica de forma didática e profissional como entender a arquitetura do projeto, rodar localmente, criar builds para produção, navegar pela estrutura de pastas e contribuir com o código.

**Sumário**
- **Visão Geral**: descrição e objetivos do projeto.
- **Tecnologias**: principais stacks e bibliotecas.
- **Como Rodar**: comandos e pré-requisitos.
- **Arquitetura & Estrutura**: visão de alto nível e mapeamento das pastas importantes.
- **Fluxos Principais**: autenticação, navegação, integração com OpenAI (quando aplicável).
- **Scripts Úteis**: comandos do `package.json`.
- **Contribuição**: guidelines básicas para abrir PRs.
- **Licença & Contato**: como entrar em contato.

**Tecnologias e Dependências Principais**

- **Plataforma**: `Vite` + `React` + `TypeScript`.
- **UI primitives**: `@radix-ui/*` e componentes locais em `src/components/ui`.
- **Estilização**: Tailwind (presumivelmente), `globals.css` em `src/styles`.
- **Estado & Contextos**: React Context (`src/contexts`).
- **Integrações**: `openai` client em `src/lib/openai.ts` (uso de API externa configurável via variáveis de ambiente).

**Pré-requisitos**

- **Node.js**: versão 18+ recomendada.
- **Gerenciador de pacotes**: `npm` (ou `pnpm`/`yarn` se preferir).
- **Variáveis de ambiente**: para integrações externas (por exemplo a OpenAI), crie um arquivo `.env` com as chaves necessárias. Para Vite use prefixo `VITE_` (ex.: `VITE_OPENAI_KEY=seu_token_aqui`).

**Como Rodar (Desenvolvimento)**

1. Instalar dependências:

	 - `npm install`

2. Rodar em modo de desenvolvimento:

	 - `npm run dev`

3. Abrir no navegador o endereço mostrado pelo Vite (por padrão `http://localhost:5173`).

**Build para Produção**

- Gerar build otimizado: `npm run build`
- Servir a build localmente para checagem: `npm run preview`

Observação: o `build` executa `tsc` (type-check) antes de executar o `vite build` conforme o `package.json`.

**Scripts Disponíveis**

- **`npm run dev`**: roda o servidor de desenvolvimento (Vite).
- **`npm run build`**: executa `tsc` e gera o build de produção com Vite.
- **`npm run preview`**: inicia um servidor local para visualizar o build gerado.
- **`npm run lint`**: executa `eslint` sobre o código do projeto.
- **`npm run type-check`**: roda `tsc --noEmit` para checar tipos TypeScript.

**Arquitetura & Estrutura de Pastas (resumo)**

Raiz do projeto (apenas os pontos mais relevantes):

- `index.html` : entrada base do Vite.
- `src/` : código fonte principal da aplicação.
	- `main.tsx` : bootstrap do React e mount.
	- `App.tsx` : componente raiz que orquestra rotas/contexts.
	- `components/` : componentes de UI e telas (ex.: `LoginScreen.tsx`, `DashboardSidebar.tsx`, painéis e relatórios).
		- `ui/` : primitives e componentes reutilizáveis (botões, inputs, dialogs, tabelas, etc.).
		- `reports/` : relatórios específicos (ex.: `FinancialReport.tsx`, `LegalReport.tsx`).
	- `contexts/` : React Contexts (ex.: `AuthContext.tsx`, `AppContext.tsx`).
	- `hooks/` : hooks reutilizáveis (ex.: `useBotActions.ts`, `useViewNavigation.ts`).
	- `lib/` : bibliotecas específicas do projeto (ex.: `openai.ts` para cliente OpenAI).
	- `services/` : serviços de alto nível que encapsulam chamadas externas e lógica (ex.: `auth.service.ts`, `navigation.service.ts`).
	- `styles/` : estilos globais (`globals.css`).
	- `types/` : tipagens TypeScript compartilhadas.
	- `utils/` : utilitários e helpers.

**Padrões e Convenções**

- Componentes de UI são colocados em `src/components/ui` e seguem o pattern de componentes reutilizáveis.
- Separação clara entre camadas: `components` (apresentação), `services` (integração/negócio), `lib` (clientes externos), `contexts` (estado global).
- Usar hooks em `src/hooks` para lógica de componente reutilizável.

**Fluxos Principais**

- **Autenticação**: gerenciada por `AuthContext` e `auth.service.ts`. A UI inclui telas e diálogos de login/reauth.
- **Navegação**: serviços e hooks em `navigation.service.ts` e `useViewNavigation.ts` centralizam o fluxo entre seções do dashboard.
- **Chatbot / OpenAI**: existe um cliente em `src/lib/openai.ts` – para ativar, defina a chave apropriada em variáveis de ambiente e consulte o código para ver tratamento de prompts e limites.

**Boas Práticas para Desenvolvimento**

- Mantenha tipagem explícita em novas APIs e componentes (`.tsx`) e rode `npm run type-check` antes de abrir PR.
- Execute `npm run lint` e corrija warnings/erros automaticamente quando possível.
- Faça commits pequenos e descritivos; prefira branches por feature (`feature/descricao`) ou bugfix (`fix/descricao`).

**Testes**

O repositório atual não traz uma suíte de testes explícita (ex.: `jest`, `vitest`) incluída. Recomenda-se adicionar testes unitários e de integração com `vitest` e `@testing-library/react` caso o projeto cresça em complexidade.

**Deploy**

- O `npm run build` gera os artefatos no diretório padrão (`dist/`).
- Hospedagem recomendada: Vercel, Netlify, Cloudflare Pages ou qualquer servidor estático que suporte SPA.
- Para variáveis de ambiente no deploy, configure-as via dashboard do provedor (ex.: `VITE_OPENAI_KEY`).

**Contribuição**

- Fork → Branch feature/bug → Commit pequenos → Pull Request com descrição clara e checklist.
- Inclua no PR: passos para reproduzir, mudanças principais e screenshots quando pertinente.
- Siga o padrão de code style do projeto e corrija `eslint`/`tsc` antes da revisão final.

**Checklist antes de abrir PR**

- [ ] Código compilando (`npm run type-check`).
- [ ] Lint sem erros (`npm run lint`).
- [ ] Testes (se adicionados) passando.
- [ ] Documentação e comentários atualizados quando necessário.

**Contatos & Suporte**

- **Autor / Maintainer**: `JoseSantos-Controladoria` (contato via GitHub do repositório).
- Para questões técnicas, abra uma issue descrevendo o problema com passos mínimos para reproduzir.

**Licença**

Adicione a licença apropriada ao repositório (ex.: `MIT`, `Apache-2.0`) se desejar tornar o projeto público. No momento, não há arquivo `LICENSE` incluído neste repositório.

---

**Variáveis de Ambiente**

O projeto usa variáveis de ambiente no formato esperado pelo Vite (`import.meta.env`), que precisam ser definidas antes de rodar a aplicação. O arquivo fonte `src/lib/openai.ts` utiliza a seguinte variável:

- `VITE_OPENAI_API_KEY` — chave de API do OpenAI usada pelo cliente `openai`.

Exemplo mínimo de `.env` (arquivo na raiz do projeto):

```
VITE_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Observações importantes sobre a chave OpenAI:

- O cliente em `src/lib/openai.ts` está configurado com `dangerouslyAllowBrowser: true`. Isso permite que chamadas à API sejam feitas diretamente do navegador quando a chave estiver embutida no bundle — o que NÃO é recomendado para produção, pois expõe sua chave pública.
- Para produção, prefira:
	- mover as chamadas ao OpenAI para um backend/proxy seguro que mantenha a chave no servidor;
	- ou usar políticas de segurança adicionais e rotação de chave.

Se desejar, posso automaticamente:

- extrair e documentar outras variáveis de ambiente usadas em arquivos adicionais do projeto;
- gerar um exemplo mais completo de `.env.example` sem chaves reais;
- adicionar instruções para configuração de variáveis de ambiente no provedor de hospedagem (Vercel/Netlify).

---

Se preferir que eu crie agora o `CONTRIBUTING.md` e templates para issues/PRs, confirme e eu os adiciono ao repositório.