# Teloteca

Catálogo pessoal de filmes e séries, construído incrementalmente com React e Vite.

## Desenvolvimento

```bash
npm install
npm run dev
```

O projeto usa JavaScript, ESLint e CSS. A persistência com Supabase, autenticação
e as funcionalidades do catálogo serão adicionadas em etapas futuras.

## Scripts

- `npm run dev`: inicia o servidor local com HMR.
- `npm run lint`: verifica o código com ESLint.
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
