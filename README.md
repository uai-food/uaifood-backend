# 🍽️ UaiFood

Projeto desenvolvido para a disciplina **DAW II - Desenvolvimento de Aplicações Web**, ministrada pelo **Instituto Federal do Triângulo Mineiro (IFTM)** no curso de **Análise e Desenvolvimento de Sistemas**.  

O **UaiFood** é uma aplicação web que simula uma plataforma de pedidos de comida online, permitindo que usuários explorem restaurantes, cardápios e façam pedidos de forma simples e intuitiva.

Este repositório contém a aplicação UaiFood dividida em dois projetos:

- `uaifood-backend/` — API REST em Node.js + Express + Prisma (Postgres)
- `uaifood-frontend/` — SPA em React + Vite + TypeScript + TailwindCSS
- O frontend **foi inicialmente desenvolvido pela ferramenta de IA Lovable**, mas recebeu **implementações e ajustes próprios no design**, incluindo componentes, páginas e fluxos de interface.

O README abaixo explica como configurar, executar, testar e depurar ambos os lados localmente, além de descrever endpoints importantes, autorização, modelagem e problemas comuns.

**Arquitetura**
- Backend: Node.js/Express, Prisma ORM (Postgres), Zod para validação, JWT para autenticação, bcrypt para senhas.
- Frontend: Vite + React + TypeScript, Context API para autenticação/estado, UI primitives customizadas.

**Pré-requisitos**
- Node.js (v18+ recomendado)
- npm (ou bun/pnpm se preferir ajustar comandos)
- PostgreSQL (local ou remoto)
- Git

**Estrutura principal**
- `uaifood-backend/` — servidor express, controllers em `src/controller`, rotas em `src/routes`, validações Zod em `src/zodValidation`, Prisma em `prisma/`.
- `uaifood-frontend/` — app React em `src/`, componentes em `src/components`, páginas em `src/pages`.

**Variáveis de ambiente (backend)**
Crie um arquivo `.env` em `uaifood-backend/` com pelo menos as seguintes variáveis (exemplo):

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/uaifooddb
JWT_SECRET=umsegredomuitoseguro
JWT_EXPIRES_IN=7d
```

A aplicação espera Postgres disponível na `DATABASE_URL`. Ajuste portas e credenciais conforme seu ambiente.

**Prisma (Banco de Dados)**
- Esquema: `uaifood-backend/prisma/schema.prisma`.
- Gerar cliente (após alterar schema):

```bash
cd uaifood-backend
npx prisma generate
```

- Rodar migrações (se estiver usando migrations):

```bash
npx prisma migrate deploy
# ou para desenvolvimento
npx prisma migrate dev --name descricao
```

- (Opcional) executar seed (o projeto inclui scripts de export/seed):

```bash
node prisma/seed.js
```

**Executando o backend (desenvolvimento)**
```bash
cd uaifood-backend
npm install
npx prisma generate
npm run dev    # se existir script nodemon, ou
node index.js
```

- O servidor, por padrão, roda em `http://localhost:3000`.

**Executando o frontend (desenvolvimento)**
```bash
cd uaifood-frontend
npm install
npm run dev
```
- O dev server do Vite irá expor a URL de desenvolvimento (ex.: `http://localhost:5173`).
- Certifique-se de que a `API_BASE_URL` em `src/lib/api.ts` aponta para o backend (ex.: `http://localhost:3000`).

**Endpoints principais (resumo rápido)**
- `POST /user` — criar usuário
- `POST /user/login` — autenticar, retorna `{ token, user }`
- `GET /user/profile` — perfil do usuário autenticado (Bearer token)
- `PUT /user/profile` — atualizar perfil (nome, phone, birthDate, address)
- `PUT /user/profile/change-password` — alterar senha
- `GET /user` — listar usuários (admin)
- `PUT /user/:id` — atualizar usuário (admin)
- `DELETE /user/:id` — deletar usuário (admin)
- `GET /order`, `POST /order`, `PUT /order/:id` — endpoints de pedido (ver `uaifood-backend/src/routes/order.js`)

Observações: consulte os controllers em `uaifood-backend/src/controller/` para detalhes de payloads e retornos.

**Autenticação e autorização**
- JWT: header `Authorization: Bearer <token>`.
- Middlewares:
  - `requireRole('ADMIN')` — apenas admins.
  - `requireSelfOrRole('ADMIN')` — permite o próprio usuário OU um admin.
- O frontend armazena token e usuário em `localStorage` como `token` e `user`.

**Modelagem importante**
- IDs no Prisma podem ser `BigInt` no schema; o backend costuma usar `Number(id)` ao buscar/atualizar.
- Usuário tem relacionamento com `address` via `addressId`.

**Validações**
- Zod é usado para validar requests — `src/zodValidation/*.js`.
- Os middlewares de validação retornam erros normalizados (ex.: `{ sucesso: false, erros: [...] }`).

**Uso de Promises no backend**
- O backend utiliza Promises em várias operações assíncronas, principalmente no gerenciamento de pedidos via Prisma.
- Permite encadeamento de fluxos, como a simulação do ciclo de vida de pedidos (PAID → PREPARING → OUT_FOR_DELIVERY → DELIVERED) sem bloquear o servidor.
- Garante que outras requisições continuem sendo processadas enquanto o banco responde.

**Fluxos de UI importantes implementados**
- Perfil (`/profile`): editar dados pessoais, endereço, trocar senha, encerrar conta (apaga conta e faz logout).
- Admin (Painel): gerenciar itens, pedidos e usuários. A tela de usuários permite:
  - alterar `type` (CLIENT / ADMIN) via `PUT /user/:id` (antes havia `promoteUser` separado; esse fluxo foi consolidado)
  - editar nome/email
  - deletar usuário
  - adicionar, editar e deletar itens
  - gerenciar pedidos

**Scripts e comandos úteis**
- Backend:
  - `npm install` — instalar dependências
  - `npx prisma generate` — gerar cliente Prisma
  - `npm run dev` — rodar servidor em dev (se configurado)
  - `node index.js` — rodar servidor
- Frontend:
  - `npm install`
  - `npm run dev` — rodar Vite
  - `npm run build` — build de produção
    
**Desenvolvedor(a) responsável**
Victoria Souza Santos
