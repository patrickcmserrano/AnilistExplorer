# Deploy no GitHub Pages - Instruções

## Configuração Completa ✅

O projeto já está configurado para deploy automático no GitHub Pages. As seguintes alterações foram feitas:

### 1. Configuração do Astro
- ✅ Alterado de `output: 'hybrid'` para `output: 'static'`
- ✅ Removido adapter do Node.js
- ✅ Configurado `site: 'https://patrickcmserrano.github.io'`
- ✅ Configurado `base: '/AnilistTracker'` (apenas em produção no GitHub Actions)

### 2. GitHub Actions Workflow
- ✅ Criado arquivo `.github/workflows/deploy.yml`
- ✅ Workflow configurado para rodar em push para branches `main` e `AnimeExplorer`
- ✅ Build e deploy automáticos configurados

### 3. Arquivos Adicionais
- ✅ Criado arquivo `public/.nojekyll` para evitar processamento Jekyll

## 🚀 Como Ativar o GitHub Pages

Siga estes passos no seu repositório GitHub:

1. Vá para **Settings** (Configurações) do repositório
2. No menu lateral, clique em **Pages**
3. Em **Source**, selecione **GitHub Actions**
4. Pronto! O deploy será feito automaticamente

## 📦 Como Fazer Deploy

### Deploy Automático
Sempre que você fizer push para as branches `main` ou `AnimeExplorer`, o deploy será feito automaticamente.

```bash
git add .
git commit -m "sua mensagem"
git push origin AnimeExplorer
```

### Deploy Manual
Você também pode executar o workflow manualmente:
1. Vá para a aba **Actions** no GitHub
2. Selecione o workflow "Deploy to GitHub Pages"
3. Clique em **Run workflow**

## 🌐 URL do Site

Após o deploy, seu site estará disponível em:
```
https://patrickcmserrano.github.io/AnilistTracker/
```

## 🔧 Comandos Úteis

```bash
# Desenvolvimento local
npm run dev

# Build local (para testar)
npm run build

# Preview do build local
npm run preview

# Scraper de dados
npm run scrape

# Scraper + Build
npm run scrape:prod
```

## 📝 Notas Importantes

- O site é **totalmente estático** - 501 páginas HTML geradas no build
- As rotas de API (`/api/*`) foram removidas pois não funcionam no GitHub Pages
- Funcionalidades que dependiam de API foram desabilitadas:
  - Scraping dinâmico de novos animes
  - Busca de episódios em tempo real
- Para adicionar novos animes:
  1. Execute `npm run scrape` localmente
  2. Faça commit do arquivo `src/data/anime.json` atualizado
  3. Push para o GitHub - o deploy automático será acionado
- O arquivo `.nojekyll` garante que o GitHub Pages não processe os arquivos
- Build gera 500 páginas de anime individuais + página inicial

## ⚠️ Troubleshooting

Se o deploy não funcionar:
1. Verifique se a opção GitHub Actions está selecionada em Settings > Pages
2. Veja os logs do workflow na aba Actions
3. Certifique-se de que as permissões do GITHUB_TOKEN estão corretas (já configurado no workflow)
