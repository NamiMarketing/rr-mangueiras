# Checklist de ajustes — `src/file/Ajustes.xlsx`

Extraído das 8 abas da planilha (incluindo as 3 imagens de catálogo anotadas em
vermelho, que são o conteúdo real das abas "Conexões em Latão" e "Adaptadores
em Latão" — essas abas não têm texto nenhum).

**Legenda**

- `[x]` feito e conferido
- `[ ]` a fazer
- 📕 mexe no **catálogo PDF** — **parado até a equipe do catálogo entregar**.
  Decisão do cliente: nada que envolva catálogo + site é tocado por enquanto.
- 🚫 falta material (arte, foto ou texto) que ainda não temos

---

## Onde estamos

### Dá para fazer agora — só site, sem depender de ninguém

- **Geral, 4 itens de CSS/código**: bloquear download das imagens, logo do
  cabeçalho, botão "Fale Conosco", logo dos dois lados nas categorias
- **B2 — 2 renomeações**: `Luva` → `Luva Lisa`, `Niple Duplo` → `Niple Duplo Sextavado`

### 📕 Parado até o catálogo

- **B5 — os 21 itens faltantes**: as fotos não existem fora das páginas do
  catálogo coladas na planilha, onde cada produto tem ~150 px. Inútil para o site.
- **B6 — 4 atualizações** (AA, TIA, UFA, UDRA) e **7 inclusões**, todas marcadas
  "site + catálogo" na planilha
- **B6 — tubos de aço carbono e descrições dos 3 manômetros**
- **B2 — Bucha de Redução**: a planilha diz "INCLUIR NO CATÁLOGO E NO SITE"
- **B3 — ERT-C**: no site já está; falta só no catálogo

### 🚫 Parado esperando material ou definição do cliente

- **B2 — as 10 fotos das galvanizadas**: tecnicamente destravado (o 403 do
  acepilinox era só user-agent; com UA de navegador as fotos saem em 1000×1000),
  mas **falta definir o escopo**. Cada página de produto do fornecedor tem
  **4 imagens**, e o site hoje usa **1**. Em vários itens uma das 4 é justamente
  a que já está no ar. Então não dá para saber se o cliente quer as 4, ou uma
  outra no lugar da atual.
  > ⚠️ As duas respostas têm custos bem diferentes. Trocar por outra é só rodar
  > um script. **Passar a ter 4 por produto é mudança de schema**: hoje
  > `produto.imagem` é uma imagem só (`type: 'image'`), teria de virar array, e
  > a listagem renderiza 1 `<Image>` por item — precisaria de galeria. O lugar
  > natural para isso seria a página de detalhe (`/produtos/[slug]`), não a
  > linha da listagem.

- **Logo nova** (2 itens do Geral dependem dela)
- **Engate rápido hidráulico**: precisa de fotos novas
- **Descrições das conexões hidráulicas DIN**: a planilha só escreve
  "ATUALIZAR TODAS AS DESCRIÇÕES", nunca traz o texto
- **B2 — `União Assento Integral (Metal x Metal)` × `União com Assento Cônico em
  Bronze`**: não é divergência de nome, parecem peças diferentes. Precisa de
  alguém do cliente dizer qual vale.

---

## A. Geral (site / código)

- [ ] **Bloquear download das imagens** dos produtos (hoje dá pra salvar todas)
- [x] **Remover a marca Supreflex** das mangueiras alimentícias — 7 das 12 imagens
      da categoria trocadas por `scripts/trocar-imagens-alimenticias.mjs`, a partir
      de `scripts/alimenticias-limpas/`. As outras 5 (2 mangueiras + 3 válvulas)
      não tinham a marca e ficaram como estavam.
- [x] **Remover os banners** da aba Produtos — carrossel e componente removidos
      por você; a limpeza das sobras (3 imports `swiper/css` órfãos, a função
      morta `handleSelectByName`, o bloco `.banner*` do CSS e a `@media 480px`
      que só continha regra de banner) fechou o item. Também apagadas as 6
      imagens `destaque-*` que ficaram sem referência.
- [ ] **Aumentar a logo do cabeçalho** (está muito pequena)
- [ ] **Botão "Fale Conosco"**: aumentar e mover para o centro do cabeçalho
- [x] **Quem Somos**: imagem estourada — hero trocado e `object-fit: cover` no `.hero`
- [x] **Quem Somos**: foto da loja e funcionários colorida — `equipe.jpeg` no lugar do
      `equipe.png`, e o `.equipeOverlay` clareado (opacidade 0.85 → 0.2), que era o
      que deixava a foto escurecida
- [ ] **Cabeçalho das categorias de produtos**: preencher o espaço em branco com a logo dos dois lados

### 🚫 Bloqueados por falta de arte

- 🚫 **Atualizar a logo** — arquivo novo ainda não disponível

---

## B. Conteúdo por categoria (Sanity)

### B1. Tubos flexíveis inox — ✅ concluído

- [x] Descrições novas (AISI 316L) de **IS-0, IS-1, IS-2** — já estão no Sanity

> ⚠️ `scripts/seed-tubos-flexiveis-inox.mjs` ainda carrega as descrições **antigas
> e curtas**. Ele não sobrescreve produto existente (só corrige `subcategoria`/`ordem`),
> então não há risco imediato — mas o texto do script está defasado em relação ao Sanity.

### B2. Conexões galvanizadas e de aço inox

- [x] Descrições do site (coluna "DESCRIÇÃO SITE") — já estão no Sanity, todas as 10
- [ ] **Trocar todas as fotos** — a planilha traz a URL de origem de cada item (loja.acepilinox.com.br)
- [ ] **Incluir "Bucha de Redução"** — não existe no Sanity
- [ ] Conferir 3 divergências de nome entre planilha e Sanity:
  - planilha `Luva Lisa` × Sanity `Luva`
  - planilha `Niple Duplo Sextavado` × Sanity `Niple Duplo`
  - planilha `União Assento Integral (Metal x Metal) Rosca Fêmea` × Sanity `União com Assento Cônico em Bronze` — **parecem produtos diferentes**, não só nome
- [x] `Curva Macho x Fêmea 90º` — descrição atualizada (manter no site) 📕 tirar do catálogo

### B3. Engates — ✅ concluída

- [x] Descrições dos 8 ERT e dos 4 ERU — já estão no Sanity
- [x] **Fotos dos 8 ERT trocadas** — baixadas das URLs delcaflex da planilha
      (1280×1024, PNG transparente) por `scripts/trocar-imagens-engates.mjs`.
      Os 4 ERU ficaram como estavam; a planilha não manda trocar.
- [x] `ERT-C Acoplador Espigão`: foto atualizada (entrou nas 8 acima) 📕 falta no catálogo

### B4. Linha Pneumática — ✅ concluída

Feito por `scripts/ajuste-codigo-no-inicio.mjs`, `scripts/ajuste-latao-pneumatica.mjs`,
`scripts/incluir-8505-uniao-femea.mjs` e `scripts/ajuste-valvulas-manometros.mjs`:

- [x] **Código no início do nome** — 62 produtos (`Anilha 1001` → `1001 Anilha`).
      Os 13 itens que não são conexões (mangueiras, tubos, manômetros, válvulas) ficaram intactos.
- [x] **Ordenar por código** — campo `ordem` preenchido com o próprio código
- [x] **Latão movido** para "Conexões em Latão" — 24 produtos (4xxx, 21xx, 26xx)
- [x] **Grupo "Conexões plásticas" → "Conexões Pneumáticas"**.
      A **categoria segue "Linha Pneumática"**, de propósito: ela também guarda
      mangueiras, tubos, manômetros e válvulas, que não são conexões.
- [x] **Silenciadores 8554/8555/8556** movidos para a pneumática, em "Silenciadores"
      (a página 17 do catálogo não os traz em "Torneiras e Drenos")
- [x] **Incluir `8505 União Fêmea`** — criado em Linha Pneumática › Milímetro
      por `scripts/incluir-8505-uniao-femea.mjs`, com `ordem` 8505. Sem descrição,
      igual aos oito vizinhos da subcategoria.
- [x] `Válvulas`: foto nova + descrição prefixada com "Válvulas: "
- [x] `Manômetros`: foto nova sem fundo + descrição prefixada com "Manômetros: "
      (a inicial virou minúscula: "Utilizados" → "utilizados")

> Os slugs dos produtos **não** foram alterados, de propósito: slug é a URL de
> `/produtos/[slug]` e mudá-lo quebraria links já publicados. Nome e slug ficam
> divergentes, o que é esperado.

### B5. Conexões / Adaptadores em Latão

A categoria **"Conexões e adaptadores" virou "Conexões em Latão"** (slug
`conexoes-em-latao`), reunindo todo o latão num lugar só, como nas páginas
17/30/31. Nada no código apontava para o slug antigo. Ficou com 51 produtos em
7 subcategorias, ordenadas por faixa de código:

- [x] `Conexões latão - compressão` → **Compressão** (minúscula, não "COMPRESSÃO")
- [x] `Conexões latão - bicos para mangueira` → **Bicos para Mangueira**
- [x] `Conexões latão - drenos, silenciadores e torneiras` → **Torneiras e Drenos**
- [x] `Conexões latão - adaptadores` → **Adaptadores em Latão**
- [x] `Conexões para Tubos Plásticos` — nome já estava correto

- [x] **Tirar o `text-transform: uppercase`** dos cabeçalhos de subcategoria
      (anotação "Letra minúscula: Compressão" na página 30). Era o CSS que forçava
      o caixa alta — o dado no Sanity já estava certo. Mudança em
      `produtos.module.css`, nas duas ocorrências (desktop e mobile).
      `.categoriasTitle` ("CATEGORIAS") segue em caixa alta, que é o certo.

> ℹ️ Essa regra é **global**, vale para todas as categorias. Conferido: nenhuma
> quebrou, porque todo nome de subcategoria já está gravado com a caixa correta.
> De quebra corrigiu dois casos que estavam divergindo do Figma:
> "Disponível nas configurações:" (Tubos flexíveis inox) e as siglas de
> Válvulas industriais ("VEM - Válvulas de esfera monobloco", que antes saía
> inteiro em maiúscula).

> ⚠️ `produto.subcategoria` é uma **string solta**, casada por igualdade exata.
> Renomear a subcategoria na categoria sem reescrever a string em cada produto
> deixaria os 27 itens órfãos, fora de qualquer grupo. O script faz as duas coisas
> na mesma transação.

**Itens do catálogo que faltam no site — 21 no total** (conferido código a código):

- [ ] **Adaptadores em Latão (p.31)** — 9 de 24 no site, **faltam 15**:
      `6003A, 6007, 6008, 6009, 6011, 6012, 6033A, 6034, 6039, 6042, 6043, 6044, 6045, 6047, 6079`
- [ ] **Torneiras e Drenos (p.17)** — 3 de 7 no site, **faltam 4**: `9164, 9165, 9310, 9330`
- [ ] **Bicos para Mangueira (p.17)** — 6 de 8 no site, **faltam 2**: `7044, 7047`
- [ ] Conferir `1010 Tee Macho Central` — está no site, mas **não aparece** na página 30 do catálogo

Já completos: Compressão (8/8), Freio a Ar Milímetro (8/8), Freio a Ar engate
rápido (8/8), Conexões p/ Tubos Plásticos (8/8).

### B6. Linha Hidráulica

- [ ] **Atualizar todas as descrições** das Conexões Hidráulicas DIN
- [ ] `Anilhas B3 e B4 - AA` — atualizar 📕 (site + catálogo)
- [ ] `Conexão Tee Igual - TIA` — atualizar 📕 (site + catálogo)
- [ ] `Conexão Fêmea Reta Rosca Métrica - UFA` — atualizar 📕 (site + catálogo)
- [ ] `Conexão Redução Reta - UDRA` — atualizar no site 📕 remover do catálogo
- [ ] **Incluir no site** (7 itens): `Porca - PA`, `Conexão 90° Igual (Joelho) - JIA`,
      `Conexão 90° Macho (Joelho) - JMA`, `Conexão 90° Macho Orientável (Joelho) - JOA`,
      `Conexão Igual Reta - UDA`, `Conexão Macho Reto Rosca Métrica - UMA` 📕 (também no catálogo)
- [ ] `TUBOS DE AÇO CARBONO E AÇO INOX`: atualizar descrição/categorias 📕
- [x] **Manômetros**: "-" trocado por "com" no nome dos 3 ("Caixa Inox - Glicerina"
      → "Caixa Inox com Glicerina"). O campo `descricao` deles é null; o texto que
      aparece na listagem é o `nome`. 📕 o resto da descrição segue parado no catálogo.
- [x] **Os 2 terminais girados 180°** por `scripts/ajuste-hidraulica.mjs`
      (BSP e Métrico). No padrão da categoria a rosca fica em cima e o espigão
      embaixo — as duas estavam invertidas. No BSP a imagem traz as duas peças
      juntas, e ambas estavam de cabeça para baixo, então girar a imagem inteira
      acertou as duas.
- [ ] **Engate Rápido Hidráulico** (ISO-A, ISO-B, Face Plana): 🚫 fazer novas fotos

---

## C. Onde dá pra automatizar

O que é repetitivo e cabe num script `scripts/seed-*.mjs` (mesmo padrão dos que já existem):

1. **Renomear subcategorias** (B5) — `patch` em 4 subcategorias de uma categoria. Trivial.
2. **Código para o início do nome + ordenar por código** (B4) — regex no nome
   + preencher `ordem` com o próprio código. Pega ~45 itens de uma vez.
3. **Mover produtos entre categorias** (B4) — trocar a `reference` de `categoria`.
4. **Trocar fotos em lote** (B2, B3) — as URLs de origem estão na planilha;
   dá pra baixar e subir via `client.assets.upload`, como o seed de tubos flexíveis já faz.
5. **Incluir os 21 itens faltantes** (B5) + 7 da hidráulica (B6) — precisa de foto
   e descrição de cada um; as fotos dos que faltam **não estão na planilha**
   (só aparecem nas imagens do catálogo), então esse é o item que mais depende de material novo.

O que **não** dá pra automatizar: tudo marcado 📕 (catálogo PDF) e os itens 🚫.
