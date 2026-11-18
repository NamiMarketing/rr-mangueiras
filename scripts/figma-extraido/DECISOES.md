# Decisões do cliente — nós 866:456, 1018:558, 909:690

Confirmadas em 18/11/2026:

- **Segunda seção "MANGUEIRAS DE PVC"** do nó 909:690 (top 7203, 6 itens) está
  **errada no design**. O nome certo é **"Mangueiras Atóxicas"**. A primeira
  (top 4888, 11 itens) continua "Mangueiras de PVC".
- **`1010 Tee Macho Central`**: **remover** do site. Não está no design novo nem
  na página 30 do catálogo.
- **`7044 Nipe do Bico para Mangueira`**: fica como está no design ("Nipe", não
  "Niple").
- **`2103 União`**: imagem própria, do nó **915:994** (no design dos nós anteriores
  ela compartilhava o asset com `2109 Tee União`).

## Em aberto

- **Bloco "CONTROLE INTELIGENTE DE MANGUEIRAS — CPRA"** (nó 909:690, top 2649):
  seção de marketing com 6 ícones + parágrafo, no meio da categoria Mangueiras.
  Não é lista de produtos; exige código novo no ProdutosClient. Sem resposta ainda.

## Resolvido

- **Bloco CPRA**: implementado em `src/components/Cpra/`. Conteúdo fixo no
  componente (é texto institucional, não catálogo); ícones em `public/cpra/`.
  Entra na listagem logo após a subcategoria "Mangueiras Hidráulicas", que é
  onde o Figma o posiciona — a constante `CPRA_DEPOIS_DE` no ProdutosClient
  controla isso.
- **Nomes das subcategorias**: gravados em Title Case ("Mangueiras Hidráulicas"),
  não no caixa alta do design. Mesmo critério já aplicado em Conexões em Latão,
  onde o cliente pediu "Letra minúscula: Compressão" para a mesma faixa amarela.
- **17 mangueiras hidráulicas sem imagem**: é assim no design (só nome +
  descrição). O campo `imagem` deixou de ser obrigatório no schema e a listagem
  ganhou a variante `.rowSemImagem`, que fecha a coluna quando nenhum item do
  grupo tem imagem.
