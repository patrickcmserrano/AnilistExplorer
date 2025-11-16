# 🎬 Anime Explorer# 🎬 AnimeExplorer



> **Um explorador moderno de animes** com dados do **AniList** - Descubra, explore e acompanhe seus animes favoritos através de uma interface elegante e intuitiva.Um catálogo moderno e legal de animes com **descoberta de lançamentos recentes**, **metadados enriquecidos via AniList**, **recomendações personalizadas** e **interface intuitiva**.



[![Astro](https://img.shields.io/badge/Astro-4.0-FF5D01?logo=astro)](https://astro.build)[![Astro](https://img.shields.io/badge/Astro-4.0-FF5D01?logo=astro)](https://astro.build)

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://react.dev)

[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

[![AniList](https://img.shields.io/badge/AniList-API-02A9FF?logo=anilist)](https://anilist.co)[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python)](https://python.org)

[![AniList API](https://img.shields.io/badge/AniList-GraphQL-005FCC?logo=anilist)](https://anilist.co)

---

---

## ✨ Features

## ⚖️ LEGAL NOTICE - AVISO LEGAL

### 🔍 Exploração Inteligente

- **Busca em tempo real** - Encontre animes instantaneamente**AnimeExplorer** é um **catálogo de METADADOS de animes**, não um serviço de streaming.

- **Filtros avançados** - Por gênero, status, ano

- **Múltiplas ordenações** - Popularidade, avaliação, episódios, alfabética### ✅ O que fazemos:

- **Infinite scroll** - Carregamento suave e progressivo- Agregamos metadados públicos de APIs legais (AniList)

- Exibimos informações sobre animes (títulos, gêneros, ratings, estúdios)

### 🎨 Visualização Imersiva- Promovemos links para plataformas legais de streaming

- **Carrossel de capas** - Navegue visualmente pela biblioteca- Nenhum conteúdo protegido é hospedado aqui

- **Cards interativos** - Informações detalhadas ao passar o mouse

- **Grid responsivo** - Adapta de mobile a 4K### ❌ O que NÃO fazemos:

- **Dark mode** - Interface elegante e confortável- ❌ Scraping de torrents ou links ilegais

- ❌ Distribuição de conteúdo pirata

### 📊 Dados Completos- ❌ Links para sites ilegais de streaming

- **203+ animes catalogados** do AniList- ❌ Bypass de proteções de copyright

- **Metadados enriquecidos** - Títulos, gêneros, sinopses, estúdios

- **Avaliações e popularidade** - Scores da comunidade### 📺 Assista animes legalmente:

- **Status de lançamento** - Em exibição, finalizado, etc- [Crunchyroll](https://www.crunchyroll.com/) - Maior catálogo de anime

- **Links para plataformas legais** - Crunchyroll, Netflix, etc- [Netflix](https://www.netflix.com/browse/genre/7424) - Anime em 4K

- [Prime Video](https://www.amazon.com/) - Funimation + Amazon

### 🚀 Performance- [HIDIVE](https://www.hidive.com/) - Anime especializado

- **Static Site Generation** - Carregamento instantâneo- [JustWatch](https://www.justwatch.com/) - Encontre onde assistir

- **Lazy loading** - Imagens otimizadas

- **Cache inteligente** - Dados atualizados do AniList---

- **SEO otimizado** - Meta tags e sitemap

## ✨ Features Principais

---

### 🎬 Descoberta de Lançamentos

## 🎯 Screenshots- Página dedicada com animes em lançamento (status RELEASING)

- Atualização automática via AniList API

### Página Principal - Explorador- Filtros por gênero, status e data

```- Informações completas: sinopse, avaliações, gêneros

┌─────────────────────────────────────────────────────────┐

│  🔍 Explorador de Animes                                │### 🔍 Recomendações Personalizadas

│  203 animes · 2547 releases totais                      │- Algoritmo baseado em gêneros

├─────────────────────────────────────────────────────────┤- Sugestões de animes similares

│  📺 Visualizador de Capas                               │- Salvar favoritos localmente

│  [←] [Carrossel de Covers] [→]                         │

├─────────────────────────────────────────────────────────┤### 🎨 Interface Moderna

│  🔍 [Buscar...]              [✕ Filtros]               │- Dark Mode responsivo

│                                                          │- Grid adaptável (mobile → 4K)

│  Ordenar por:                                           │- Cards interativos

│  [🔥 Mais Populares] [⭐ Melhores] [📅 Recentes]       │- Busca em tempo real

│  [📺 Mais Episódios] [🔤 A-Z]                          │- Ordenação: Popularidade, Data, Avaliação

│                                                          │

│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐           │---

│  │ 📺 │ │ 📺 │ │ 📺 │ │ 📺 │ │ 📺 │ │ 📺 │           │

│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘           │## 🚀 Quick Start

│   Grid de Animes (60 por página, infinite scroll)      │

└─────────────────────────────────────────────────────────┘### Pré-requisitos

```- Node.js 18+

- Python 3.11+

---- Git



## 🚀 Quick Start### Instalação (2 minutos)



### Pré-requisitos

- **Node.js** 18 ou superior
- **npm** ou **pnpm**
- **Python** 3.11+ (para o scraper)

### Instalação

```bash
# 1. Clonar repositório
git clone https://github.com/patrickcmserrano/AnilistExplorer.git
cd AnilistExplorer

# 2. Instalar dependências Node
npm install

# 3. Configurar Python (para scraper)
cd scraper
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..

# 4. Iniciar desenvolvimento
npm run dev
```

**Pronto!** 🎉 Acesse http://localhost:4321

---

### Gerar dados (scraper)

## 📦 Scripts Disponíveis

```bash

```bash# Executar scraper manualmente

# Desenvolvimentonpm run scrape

npm run dev              # Inicia servidor dev (localhost:4321)

npm run build            # Build para produção# Ou via Python direto

npm run preview          # Preview do build de produçãocd scraper && python3 anilist_scraper.py

```

# Manutenção

npm run clean            # Limpa cache e builds---

npm run check            # Verifica código TypeScript

```## 📊 Stack Técnico



---### Frontend

- **Astro** - Static Site Generation (SSG)

## 🏗️ Arquitetura- **React** - Componentes interativos

- **TailwindCSS** - Estilização

### Stack Tecnológico- **TypeScript** - Type safety



- **[Astro](https://astro.build)** - Framework SSG moderno e performático### Backend / Scraper

- **[React](https://react.dev)** - Componentes interativos (busca, filtros, carrossel)- **Python 3.11+** - Core scraping

- **[TypeScript](https://typescriptlang.org)** - Type safety e melhor DX- **AniList GraphQL API** - Fonte de dados legal

- **[TailwindCSS](https://tailwindcss.com)** - Estilização utility-first- **requests** - HTTP client

- **[AniList API](https://anilist.co)** - Fonte de dados oficial- **JSON** - Persistência



### Estrutura do Projeto### Deploy

- **Docker** - Containerização

```- **Render.com** - Hosting recomendado

anime-explorer/- **GitHub Pages** - Alternativa estática

├── src/- **VPS** - Self-hosted com Nginx

│   ├── components/           # Componentes React/Astro

│   │   ├── SearchBar.tsx     # Busca e filtros---

│   │   ├── InfiniteAnimeGrid.tsx  # Grid com infinite scroll

│   │   ├── CoverCarousel.tsx # Carrossel de capas## 📋 Comandos

│   │   ├── AnimeCard.astro   # Card individual

│   │   └── ...### Desenvolvimento

│   │

│   ├── pages/                # Rotas do site```bash

│   │   ├── index.astro       # Página principalnpm run dev       # Dev server (localhost:4321)

│   │   ├── anime/[id].astro  # Página de detalhesnpm run build     # Build produção

│   │   └── api/              # Endpoints da APInpm run preview   # Preview do build

│   │npm run scrape    # Executar scraper

│   ├── layouts/npm run clean     # Limpar cache

│   │   └── Layout.astro      # Layout base```

│   │

│   ├── data/### Docker

│   │   └── anime.json        # Dados do AniList (203 animes)

│   │```bash

│   ├── styles/docker-compose up -d --build      # Iniciar tudo

│   │   └── global.css        # Estilos globaisdocker-compose logs -f             # Ver logs

│   │docker-compose down                # Parar

│   └── utils/```

│       └── streamingServices.ts  # Helpers

│---

├── public/                   # Assets estáticos

├── astro.config.mjs          # Config do Astro## 📁 Estrutura do Projeto

├── tailwind.config.cjs       # Config do Tailwind

├── tsconfig.json             # Config do TypeScript```

└── package.jsonanimeexplorer/

```├── src/

│   ├── pages/          # Páginas Astro

### Fluxo de Dados│   │   ├── index.astro

│   │   ├── recent.astro

```│   │   └── anime/[id].astro

AniList GraphQL API│   ├── components/     # Componentes React + Astro

        ↓│   │   ├── LegalDisclaimer.tsx

src/data/anime.json (203 animes)│   │   ├── SearchBar.tsx

        ↓│   │   └── ...

Componentes Astro/React│   ├── layouts/        # Layouts

        ↓│   └── data/

Build estático (SSG)│       └── anime.json  # Dados (gerados pelo scraper)

        ↓│

Site otimizado e rápido├── scraper/

```│   ├── anilist_scraper.py    # Novo scraper (legal)

│   ├── anime_cache.json      # Cache

---│   └── requirements.txt       # Dependências Python

│

## 🎨 Componentes Principais├── package.json

├── astro.config.mjs

### SearchBar.tsx├── tailwind.config.cjs

- Busca em tempo real por título└── README.md

- Filtros por gênero e status```

- Contador de resultados

- Integração com grid via callback---



### InfiniteAnimeGrid.tsx## 🔄 Fluxo de Dados

- Renderização de 60 cards por página

- Scroll infinito automático```

- 5 modos de ordenaçãoAniList GraphQL API (legal)

- Performance otimizada           ↓

scraper/anilist_scraper.py

### CoverCarousel.tsx           ↓

- Navegação por teclado (← → ou A/D)scraper/anime_data.json (cache)

- Modo fullscreen (F)           ↓

- Informações detalhadas (I)src/data/anime.json (frontend)

- Transições suaves           ↓

Astro build → site estático

### AnimeCard```

- Hover com informações extras

- Popularidade e avaliação---

- Gêneros e episódios

- Link para página de detalhes## 🌐 Deploy em Produção



---### Render.com (Recomendado - 5 minutos)



## 🌐 Deploy```bash

# 1. Push para GitHub

### Vercel (Recomendado - 2 minutos)git push origin main



```bash# 2. Conectar em Render Dashboard

# 1. Instale a CLI do Vercel# https://dashboard.render.com/select-repo

npm i -g vercel

# 3. Render detecta render.yaml automaticamente

# 2. Deploy

vercel# 4. Click "Deploy" e aguarde ~5 min

``````



### Netlify**Custo:** ~$7.25/mês (Free Tier disponível com sleep)



```bash### Alternativas

# 1. Build- [Vercel](https://vercel.com) - Frontend + Serverless

npm run build- [Netlify](https://netlify.com) - Frontend + Edge Functions

- [GitHub Pages](https://pages.github.com) - Estático grátis

# 2. Deploy a pasta dist/- VPS + Docker - Full control

netlify deploy --prod --dir=dist

```---



### Docker## 🧪 Testes da API



```dockerfile```bash

FROM node:18-alpine# Trending animes

WORKDIR /appcurl http://localhost:4321/api/trending

COPY package*.json ./

RUN npm install# Animes em lançamento

COPY . .curl http://localhost:4321/api/releasing

RUN npm run build

EXPOSE 4321# Estatísticas

CMD ["npm", "run", "preview"]curl http://localhost:4321/api/stats

``````



```bash---

docker build -t anime-explorer .

docker run -p 4321:4321 anime-explorer## 📖 Documentação

```

- [QUICKSTART.md](./QUICKSTART.md) - Setup rápido

---- [DEPLOY.md](./DEPLOY.md) - Guia de deploy completo

- [Código comentado](./src) - Implementação detalhada

## 📊 Dados

---

### Fonte: AniList API

## 🤝 Contribuindo

Os dados são obtidos da [AniList GraphQL API](https://anilist.co), uma fonte oficial e legal de metadados de animes.

Contribuições são bem-vindas! Sinta-se livre para:

**Inclui:**- Abrir issues para bugs ou sugestões

- ✅ Títulos (inglês, romaji, nativo)- Fazer pull requests com melhorias

- ✅ Sinopses e descrições- Reportar problemas de ética/legalidade

- ✅ Gêneros e tags

- ✅ Scores e popularidade---

- ✅ Estúdios de produção

- ✅ Datas de lançamento## 📄 Licença

- ✅ Links para streaming legal

- ✅ Imagens (covers e banners)[MIT](./LICENSE)



### Atualização dos Dados---



O arquivo `src/data/anime.json` contém 203 animes pré-processados. Para atualizar:## 🎯 Ideal Para



```python✅ **Portfólio de Desenvolvedor Freelancer**

# Script Python disponível (se necessário)- Projeto legal e ético

# Requer: requests, json- Stack moderno (Astro, React, Python)

# Faz query ao AniList e salva em anime.json- API integrada (GraphQL)

```- Deploy cloud-ready

- Documentação completa

---

✅ **Aprendizado**

## 🤝 Contribuindo- Full-stack development

- SSG e build tools

Contribuições são bem-vindas! Para contribuir:- APIs e GraphQL

- Docker e deployment

1. Fork o projeto- Scraping ético

2. Crie uma branch (`git checkout -b feature/MinhaFeature`)

3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)---

4. Push para a branch (`git push origin feature/MinhaFeature`)

5. Abra um Pull Request**Feito com ❤️ para a comunidade anime**



### Ideias de Contribuição*Última atualização: Nov 2025 | v1.0 | Production Ready ✅*

- 🎨 Temas de cores adicionais
- 🌍 Internacionalização (i18n)
- 📱 PWA (Progressive Web App)
- 🔔 Sistema de notificações
- 💾 Favoritos persistentes (localStorage)
- 🎯 Recomendações por IA

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 🙏 Créditos

- **Dados:** [AniList](https://anilist.co) - API GraphQL oficial
- **Framework:** [Astro](https://astro.build)
- **UI:** [TailwindCSS](https://tailwindcss.com)
- **Ícones:** Unicode Emojis

---

## 📞 Suporte

- **Issues:** [GitHub Issues](https://github.com/patrickcmserrano/AnilistTracker/issues)
- **Discussões:** [GitHub Discussions](https://github.com/patrickcmserrano/AnilistTracker/discussions)

---

## ⚖️ Aviso Legal

Este projeto é um **explorador de metadados** de animes, não um serviço de streaming ou distribuição de conteúdo.

- ✅ Usa apenas APIs públicas e legais (AniList)
- ✅ Não hospeda ou distribui conteúdo protegido
- ✅ Promove links para plataformas de streaming legais
- ❌ Não contém torrents ou links ilegais

Para assistir animes legalmente, utilize:
- [Crunchyroll](https://crunchyroll.com)
- [Netflix](https://netflix.com)
- [Amazon Prime Video](https://primevideo.com)
- [Funimation](https://funimation.com)

---

<div align="center">

**Feito com ❤️ para a comunidade anime**

⭐ Se você gostou deste projeto, considere dar uma estrela!

[🌟 Star no GitHub](https://github.com/patrickcmserrano/AnilistTracker)

</div>
