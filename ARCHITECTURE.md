# Arquitetura do Projeto Work On

## Visão Geral

Projeto full-stack profissional implementando uma plataforma de gestão integrada com **NestJS** no backend e **React + TypeScript** no frontend. A arquitetura segue princípios SOLID e clean architecture para escalabilidade e manutenibilidade.

## Stack Tecnológico

### Backend
- **NestJS**: Framework Node.js para APIs robustas
- **Prisma**: ORM moderno com schema-first approach
- **PostgreSQL**: Banco de dados relacional
- **JWT**: Autenticação stateless
- **Jest**: Testes unitários e E2E

### Frontend
- **React 18**: UI library moderna
- **TypeScript**: Type safety
- **Vite**: Build tool de alta performance
- **Context API**: Gerenciamento de estado global
- **Axios/Fetch**: HTTP client

## Estrutura do Projeto

```
Project_A_Work_On/
├── backend/                    # NestJS Application
│   ├── src/
│   │   ├── main.ts            # Entry point
│   │   ├── app.module.ts      # Root module
│   │   ├── app.controller.ts  # Root controller
│   │   ├── app.service.ts     # Root service
│   │   ├── auth/              # Autenticação
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── jwt.strategy.ts
│   │   ├── users/             # Gestão de usuários
│   │   ├── clients/           # Gestão de clientes
│   │   ├── documents/         # Gestão de documentos
│   │   ├── dossier/           # Gestão de dossiês
│   │   ├── legal/             # Módulo jurídico
│   │   ├── financial/         # Módulo financeiro
│   │   ├── audit/             # Auditoria e logs
│   │   ├── common/            # Interceptadores e middlewares
│   │   └── prisma/            # Serviço Prisma
│   ├── prisma/
│   │   ├── schema.prisma      # Schema do banco
│   │   ├── seed.ts            # Seed de dados
│   │   └── migrations/        # Histórico de migrações
│   ├── test/                  # Testes E2E
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── src/                        # React Frontend
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Entry point
│   ├── index.css              # Global styles
│   ├── components/
│   │   ├── AdminPanel.tsx     # Painel administrativo
│   │   ├── ChatbotPanel.tsx   # Interface do chatbot
│   │   ├── ClientCenter.tsx   # Centro de clientes
│   │   ├── DashboardHeader.tsx
│   │   ├── DashboardMain.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── LegalCenter.tsx    # Centro jurídico
│   │   ├── LoginScreen.tsx    # Tela de login
│   │   ├── ReauthDialog.tsx   # Diálogo de reautenticação
│   │   ├── UserSettings.tsx   # Configurações de usuário
│   │   ├── figma/             # Componentes do Figma
│   │   ├── reports/           # Componentes de relatórios
│   │   └── ui/                # Componentes base (shadcn/ui)
│   ├── contexts/
│   │   ├── AuthContext.tsx    # Contexto de autenticação
│   │   └── AppContext.tsx     # Contexto da aplicação
│   ├── hooks/
│   │   ├── useBotActions.ts   # Ações do chatbot
│   │   └── useViewNavigation.ts # Navegação e permissões
│   ├── services/
│   │   ├── api.service.ts     # Cliente HTTP
│   │   ├── auth.service.ts    # Lógica de autenticação
│   │   └── navigation.service.ts # Lógica de navegação
│   ├── types/                 # Definições de tipos TypeScript
│   ├── constants/             # Constantes da aplicação
│   ├── utils/                 # Funções utilitárias
│   ├── lib/                   # Bibliotecas configuradas (OpenAI)
│   ├── data/                  # Mock data para desenvolvimento
│   ├── styles/                # CSS global
│   ├── guidelines/            # Documentação de diretrizes
│   └── Attributions.md        # Atribuições e créditos
│
├── public/
│   └── logos/                 # Assets estáticos
├── package.json               # Root dependencies
├── tsconfig.json              # Configuração TypeScript
├── tsconfig.node.json
├── vite.config.ts             # Configuração Vite
├── ARCHITECTURE.md            # Esta documentação
├── CONTRIBUTING.md            # Guia de contribuição
├── REFACTORING_SUMMARY.md     # Resumo de refatorações
└── README.md
```

## Princípios Arquiteturais

### 1. **Clean Architecture**

Separação clara de responsabilidades em camadas:

```
Apresentação (Components)
         ↓
Contextos (Context API)
         ↓
Serviços (Services)
         ↓
HTTP Client / Database
         ↓
APIs Externas / Database
```

### 2. **Backend - NestJS Modules**

Cada módulo é independente e segue o padrão:

```
[Feature]Module/
├── [feature].controller.ts    # Rotas HTTP
├── [feature].service.ts       # Lógica de negócio
├── [feature].module.ts        # Configuração do módulo
├── dto/                       # Data Transfer Objects
├── entities/                  # Entidades do banco
└── [feature].spec.ts          # Testes
```

**Módulos Implementados:**
- `AuthModule`: Autenticação com JWT
- `UsersModule`: Gestão de usuários
- `ClientsModule`: Gestão de clientes
- `DocumentsModule`: Gestão de documentos
- `DossierModule`: Gestão de dossiês
- `LegalModule`: Módulo jurídico
- `FinancialModule`: Módulo financeiro
- `AuditModule`: Logs e auditoria

### 3. **Frontend - Context-based State Management**

```
AuthContext (Autenticação)
├── user
├── token
└── permissions

AppContext (Estado Global)
├── currentView
├── selectedDepartment
├── modals
└── notifications
```

### 4. **Separação de Responsabilidades Frontend**

- **Components**: Apenas renderização e captura de eventos
- **Services**: Lógica de negócio e chamadas HTTP
- **Hooks**: Lógica reutilizável e efeitos colaterais
- **Contexts**: Estado global compartilhado
- **Utils**: Funções puras e helpers
- **Types**: Interfaces e tipos TypeScript

### 5. **Database - Prisma Schema**

Schema centralizado em `backend/prisma/schema.prisma`:

- Definição declarativa de modelos
- Migrações automáticas versionadas
- Seed de dados para desenvolvimento
- Relacionamentos e validações

## Fluxos Principais

### Autenticação

```
1. Usuário faz login no LoginScreen
2. AuthService chama auth.service.ts do backend
3. Backend retorna JWT token
4. AuthContext armazena token e usuário
5. Token incluído em headers das requisições
```

### Renderização de Views

```
1. useViewNavigation verifica permissões do usuário
2. Renderiza componente correspondente
3. Componente acessa AppContext para estado global
4. Services fazem requisições ao backend
5. Dados são exibidos/atualizados
```

### Criação de Recursos

```
1. Componente captura formulário
2. Valida dados localmente
3. Chamada HTTP via ApiService
4. Backend processa com lógica de negócio
5. Dados salvos no banco via Prisma
6. Resposta enviada ao frontend
7. Context atualizado com novo recurso
```

## Configurações Importantes

### Backend

- **Port**: 3000 (padrão)
- **Database**: PostgreSQL
- **JWT Secret**: Configurado via environment
- **CORS**: Habilitado para frontend

### Frontend

- **Vite Config**: Build otimizado, dev server rápido
- **Path Alias**: `@/` aponta para `src/`
- **API Base URL**: Configurado em `api.service.ts`
- **TypeScript**: Strict mode habilitado

## Boas Práticas Implementadas

1. ✅ **Separação de responsabilidades em camadas**
2. ✅ **TypeScript strict mode**
3. ✅ **JWT para autenticação stateless**
4. ✅ **Prisma para ORM typesafe**
5. ✅ **Context API para gerenciamento de estado**
6. ✅ **Services layer desacoplada**
7. ✅ **DTOs para validação de entrada**
8. ✅ **Logging e auditoria**
9. ✅ **Testes unitários no backend**
10. ✅ **Módulos independentes e reutilizáveis**
11. ✅ **Path aliases para imports limpos**
12. ✅ **Componentes escaláveis e manuteníveis**

## Próximos Passos

- [ ] Implementar testes e2e mais abrangentes
- [ ] Adicionar testes unitários no frontend
- [ ] Implementar error boundaries
- [ ] Adicionar logging estruturado no frontend
- [ ] Implementar cache layer (Redis)
- [ ] Adicionar internacionalização (i18n)
- [ ] Implementar rate limiting
- [ ] Adicionar CI/CD pipeline
- [ ] Documentar endpoints da API
- [ ] Implementar web sockets para features em tempo real

