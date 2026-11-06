# Twitter React

Rede social inspirada no Twitter, desenvolvida em dupla com finalidade de aprendizado: frontend em React e
TypeScript consumindo uma API REST própria em NestJS.

**Status:** projeto educacional, **incompleto e descontinuado**. Fica público como registro de evolução; não é um
produto finalizado nem está pronto para produção.

## Autoria

Projeto colaborativo de **Richard Soares Mesquita** e **Emanoel Loreto**. Pelo histórico do Git, a contribuição de
Richard concentra-se no frontend e a de Emanoel tem participação relevante no backend; os dois fizeram commits nas
duas partes.

## Tecnologias presentes no projeto

**Frontend** (`frontend/`)

- React, TypeScript e Vite
- React Router (rotas protegidas e rota dinâmica de perfil)
- Axios (instância com interceptors para o token de acesso)
- Tailwind CSS e CSS Modules
- react-hot-toast (avisos na tela)

**Backend** (`backend/`)

- NestJS
- TypeORM com PostgreSQL
- Autenticação JWT com Passport; senhas com bcrypt
- DTOs validados com class-validator
- Helmet e limite de requisições (Throttler)

## Funcionalidades implementadas

- Cadastro e login; o token de acesso é guardado no navegador e enviado em cada requisição.
- Rotas protegidas: sem login, o usuário é levado para `/login`.
- Linha do tempo: criar publicações e listar as publicações.
- Curtidas e comentários nas publicações (criar, listar e excluir comentários).
- Perfil de usuário (`/profile/:username`): dados do perfil, edição, publicações do usuário, publicações curtidas,
  seguidores e seguindo.
- Seguir e deixar de seguir outros usuários.
- Página de melhorias (`/improvements`): sugestões registradas na API, com criação, mudança de status e exclusão.

## Funcionalidades simuladas ou incompletas

- **Eventos, Filmes e Compras** (`/events`, `/movies`, `/shopping`): as telas funcionam só com estado local do
  React. Os dados não são enviados à API e se perdem ao recarregar a página, embora o backend tenha módulos para
  esses recursos.
- Não há versão publicada (demo online).

## Como executar localmente

Pré-requisitos: Node.js, npm e um PostgreSQL acessível.

```bash
git clone https://github.com/Richard-coding/twitter-react.git
cd twitter-react
```

**Backend** (porta 3000):

```bash
cd backend
cp .env.example .env   # preencha os dados do PostgreSQL e um JWT_SECRET
npm install
npm run start:dev
```

As tabelas são criadas automaticamente pelo TypeORM ao iniciar (`synchronize`). Use `npm install`: o
`package-lock.json` do backend está desatualizado em relação ao `package.json`, e `npm ci` falha.

**Frontend** (porta 5175), em outro terminal:

```bash
cd frontend
cp .env.example .env   # VITE_API_URL=/api
npm install
npm run dev
```

O Vite encaminha as chamadas de `/api` para o backend em `http://localhost:3000`. Acesse
`http://localhost:5175`.

## Contato

- GitHub: [Richard-coding](https://github.com/Richard-coding)
