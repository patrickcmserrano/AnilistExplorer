# Carousel Component - Estrutura Refatorada

## 📁 Estrutura de Arquivos

```
carousel/
├── index.ts                          # Exportações principais
├── types.ts                          # Definições de tipos TypeScript
├── utils.ts                          # Funções auxiliares
├── CoverCarousel.tsx                 # Componente principal (orquestrador)
├── CarouselImageDisplay.tsx          # Exibição de imagem com blur de fundo
├── CarouselInfoOverlay.tsx           # Overlay de informações (top/bottom)
├── CarouselNavigationButtons.tsx     # Botões de navegação (setas)
├── CarouselActionButtons.tsx         # Botões de ação (info, fullscreen, abrir)
├── CarouselProgressBar.tsx           # Barra de progresso
├── useKeyboardNavigation.ts          # Hook para navegação por teclado
├── useTouchNavigation.ts             # Hook para gestos touch/swipe
└── useFullscreen.ts                  # Hook para fullscreen
```

## 🎯 Benefícios da Refatoração

### ✅ Separação de Responsabilidades
- Cada componente tem uma única responsabilidade
- Lógica de negócio separada da apresentação
- Hooks customizados para funcionalidades específicas

### ✅ Reutilização
- Componentes podem ser reutilizados em outros contextos
- Hooks podem ser usados em outros carousels
- Utilitários são testáveis independentemente

### ✅ Manutenibilidade
- Arquivos menores e mais focados (~50-150 linhas cada)
- Fácil localizar e corrigir bugs
- Mudanças localizadas não afetam todo o sistema

### ✅ Testabilidade
- Cada componente pode ser testado isoladamente
- Hooks podem ser testados com renderHook
- Funções utilitárias são puras e fáceis de testar

## 📦 Componentes

### `CoverCarousel.tsx` (Principal)
Orquestra todos os sub-componentes e gerencia o estado global do carousel.

**Responsabilidades:**
- Gerenciar índices (anime atual, imagem atual)
- Coordenar navegação entre componentes
- Controlar estado de hover e informações

### `CarouselImageDisplay.tsx`
Renderiza a imagem principal e o background com blur.

**Props:**
- `imageUrl`: URL da imagem
- `imageLabel`: Label para acessibilidade
- `animeTitle`: Título do anime
- `animeId`: ID único
- `imageIndex`: Índice da imagem

### `CarouselInfoOverlay.tsx`
Exibe informações do anime (título, descrição, gêneros, etc).

**Props:**
- `anime`: Dados completos do anime
- `title`, `score`, `count`: Dados processados
- Índices e totais para navegação

### `CarouselNavigationButtons.tsx`
Botões de navegação (esquerda/direita para imagens, cima/baixo para animes).

**Props:**
- Callbacks de navegação
- `hasMultipleImages`: Habilita/desabilita botões
- `isHovering`: Controla visibilidade

### `CarouselActionButtons.tsx`
Botões flutuantes (Info, Fullscreen, Abrir anime).

**Props:**
- `animeId`: Para link
- `isFullscreen`: Estado atual
- Callbacks para ações

### `CarouselProgressBar.tsx`
Barra de progresso na parte inferior.

**Props:**
- `progress`: Porcentagem (0-100)

## 🔧 Hooks Customizados

### `useKeyboardNavigation`
Gerencia navegação por teclado (setas, WASD, Enter, F, I, Esc).

**Parâmetros:**
- Estados e referências do carousel
- Callbacks de navegação

### `useTouchNavigation`
Detecta gestos de swipe (horizontal para imagens, vertical para animes).

**Parâmetros:**
- Referência do carousel
- Callbacks de navegação

### `useFullscreen`
Gerencia estado de fullscreen e eventos relacionados.

**Retorna:**
- `isFullscreen`: Estado atual
- `toggleFullscreen`: Função para alternar

## 🛠️ Utilitários

### `utils.ts`
Funções auxiliares para processar dados de anime:
- `getTitle()`: Extrai título (suporta formatos antigos/novos)
- `getCover()`: Extrai URL da capa
- `getScore()`: Extrai pontuação
- `getCount()`: Extrai contagem de episódios
- `getAvailableImages()`: Coleta todas as imagens disponíveis

## 📝 Types

### `types.ts`
Definições TypeScript compartilhadas:
- `Anime`: Interface completa do anime
- `ImageItem`: Item de imagem no carousel
- `CarouselProps`: Props do componente principal

## 🔄 Fluxo de Dados

```
CoverCarousel (estado principal)
    ├─> CarouselImageDisplay (imagem atual)
    ├─> CarouselInfoOverlay (informações)
    ├─> CarouselNavigationButtons (navegação)
    ├─> CarouselActionButtons (ações)
    └─> CarouselProgressBar (progresso)

Hooks (efeitos colaterais)
    ├─> useKeyboardNavigation (teclado)
    ├─> useTouchNavigation (touch)
    └─> useFullscreen (fullscreen)

Utils (processamento)
    └─> Funções puras para extrair dados
```

## 🚀 Como Usar

```tsx
import CoverCarousel from '@/components/CoverCarousel';

<CoverCarousel client:load animes={animeArray} />
```

O componente mantém a mesma API externa, mas internamente está organizado de forma modular.

## 🧪 Próximos Passos Sugeridos

1. **Testes Unitários**: Adicionar testes para cada componente e hook
2. **Storybook**: Documentar componentes visualmente
3. **Animações**: Melhorar transições entre imagens
4. **Performance**: Implementar virtualização para muitos animes
5. **Acessibilidade**: Adicionar mais ARIA labels e suporte a screen readers
