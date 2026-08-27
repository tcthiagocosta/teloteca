# Teloteca

Catálogo pessoal de filmes e séries, construído incrementalmente com React e Vite.

## Desenvolvimento

```bash
npm install
npm run dev
```

O projeto usa JavaScript, ESLint, CSS e Supabase para persistência. A autenticação
e outras funcionalidades do catálogo serão adicionadas em etapas futuras.

## Supabase

Preencha as credenciais do projeto em `src/config/supabase.js`:

```bash
export const SUPABASE_URL = "https://your-project-ref.supabase.co";
export const SUPABASE_ANON_KEY = "your-anon-key";
```

As operações de banco ficam centralizadas em `src/repositories/`. Importe o
repository correspondente em uma página ou componente, por exemplo:

```js
import { mediaRepository } from "./repositories/mediaRepository.js";

const savedMedia = await mediaRepository.create({
  tmdb_id: 123,
  type: "movie",
  title: "Example title",
});
```

O schema precisa disponibilizar as tabelas `media`, `seasons` e `episodes` pela
Data API e ter políticas RLS que permitam as operações necessárias para a chave
anônima utilizada pelo aplicativo.

## Scripts

- `npm run dev`: inicia o servidor local com HMR.
- `npm run lint`: verifica o código com ESLint.
- `npm run typecheck`: valida os tipos do schema Supabase.
- `npm run build`: gera o build de produção em `dist/`.
- `npm run preview`: serve localmente o build de produção.

## Estrutura atual

```text
src/
├── components/   # Componentes reutilizáveis, quando surgirem
├── pages/        # Páginas da aplicação
├── App.css       # Estilos da composição principal
├── App.jsx       # Componente principal
├── index.css     # Estilos globais
└── main.jsx      # Entrada do React
```
