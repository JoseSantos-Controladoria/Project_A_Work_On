# Arquitetura do Projeto Work On

## Visão Geral

Este projeto foi reformulado seguindo as melhores práticas de arquitetura de software, implementando uma estrutura profissional, escalável e manutenível.

## Estrutura de Pastas

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── ui/             # Componentes de UI base (shadcn/ui)
│   ├── reports/        # Componentes de relatórios
│   └── ...             # Outros componentes
├── contexts/           # Context API para gerenciamento de estado global
│   ├── AuthContext.tsx # Context de autenticação
│   └── AppContext.tsx  # Context da aplicação
├── hooks/              # Custom hooks reutilizáveis
│   ├── useBotActions.ts
│   └── useViewNavigation.ts
├── services/           # Camada de serviços (lógica de negócio)
│   ├── auth.service.ts
│   └── navigation.service.ts
├── types/              # Definições de tipos TypeScript
│   └── index.ts
├── constants/          # Constantes e configurações
│   └── index.ts
├── utils/              # Funções utilitárias
│   ├── month.utils.ts
│   └── index.ts
├── lib/                # Bibliotecas externas configuradas
│   └── openai.ts
├── data/               # Dados mockados (para desenvolvimento)
│   └── mockData.ts
└── App.tsx             # Componente principal
```

## Princípios Arquiteturais

### 1. Separação de Responsabilidades

- **Components**: Apenas lógica de apresentação
- **Services**: Toda lógica de negócio
- **Contexts**: Gerenciamento de estado global
- **Hooks**: Lógica reutilizável e composição
- **Utils**: Funções puras e utilitárias

### 2. Gerenciamento de Estado

O projeto utiliza **Context API** para gerenciamento de estado global:

- **AuthContext**: Gerencia autenticação, usuário e permissões
- **AppContext**: Gerencia estado da aplicação (views, departamentos, modais)

### 3. TypeScript

- Tipos centralizados em `src/types/index.ts`
- TypeScript strict mode habilitado
- Path aliases configurados para imports limpos

### 4. Services Layer

A camada de serviços encapsula toda a lógica de negócio:

- `AuthService`: Autenticação e autorização
- `NavigationService`: Lógica de navegação

### 5. Custom Hooks

Hooks customizados para lógica reutilizável:

- `useBotActions`: Gerencia ações do chatbot
- `useViewNavigation`: Gerencia navegação com verificação de permissões

## Fluxo de Dados

```
User Action
    ↓
Component
    ↓
Hook / Context
    ↓
Service
    ↓
API / Mock Data
```

## Configuração

### TypeScript

- `tsconfig.json`: Configuração principal
- `tsconfig.node.json`: Configuração para Node.js (Vite)

### Vite

- Path aliases configurados (`@/` para `src/`)
- Build otimizado com sourcemaps

## Boas Práticas Implementadas

1. ✅ **Separação de responsabilidades**
2. ✅ **TypeScript strict mode**
3. ✅ **Context API para estado global**
4. ✅ **Services layer para lógica de negócio**
5. ✅ **Custom hooks para reutilização**
6. ✅ **Tipos centralizados**
7. ✅ **Constantes centralizadas**
8. ✅ **Path aliases para imports limpos**
9. ✅ **Estrutura escalável**
10. ✅ **Código documentado**

## Próximos Passos

- [ ] Implementar testes unitários
- [ ] Adicionar testes de integração
- [ ] Implementar error boundaries
- [ ] Adicionar logging estruturado
- [ ] Implementar cache layer
- [ ] Adicionar internacionalização (i18n)

