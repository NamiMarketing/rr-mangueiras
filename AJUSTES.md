# ✅ Ajustes — RR Mangueiras

> Origem: `src/file/Ajustes.xlsx` · **28 de 49 feitos** · 21 abertos (5 livres, 16 travados)

| Área | Feito | Aberto |
|---|:---:|:---:|
| A · Geral (site/código) | 4 | 5 |
| B1 · Tubos flexíveis inox | 1 | — |
| B2 · Galvanizadas e inox | 2 | 5 |
| B3 · Engates | 3 | — |
| B4 · Linha Pneumática | 8 | — |
| B5 · Conexões e Adaptadores em Latão | 7 | 4 |
| B6 · Linha Hidráulica | 3 | 7 |

---

## ▶️ Fazer agora

- [ ] **Bloquear download das imagens** dos produtos · `A`
  - `produtos.module.css` e `produtos/[slug]/`
  - ⚠️ É dissuasão, não proteção — alinhar com o cliente antes (ver Notas)
- [ ] **Aumentar a logo do cabeçalho** · `A`
  - `Header.module.css:21` — hoje `width: 11rem`
  - Reajustar quando a logo nova chegar
- [ ] **Botão "Fale Conosco": aumentar e levar pro centro** · `A`
  - `Header.tsx:33` · `Header.module.css:50`
  - Fazer junto com a logo — os dois disputam o mesmo espaço
- [ ] **Renomear `Luva` → `Luva Lisa`** · `B2` · Sanity
- [ ] **Renomear `Niple Duplo` → `Niple Duplo Sextavado`** · `B2` · Sanity

---

## ⏸️ Travado

### 📕 Espera o catálogo PDF

> Decisão do cliente: nada que envolva catálogo + site é tocado por enquanto.

- [ ] **Adaptadores em Latão — faltam 15 de 24** · `B5` · p.31
  - `6003A` `6007` `6008` `6009` `6011` `6012` `6033A` `6034` `6039` `6042` `6043` `6044` `6045` `6047` `6079`
- [ ] **Torneiras e Drenos — faltam 4 de 7** · `B5` · p.17
  - `9164` `9165` `9310` `9330`
- [ ] **Bicos para Mangueira — faltam 2 de 8** · `B5` · p.17
  - `7044` `7047`
- [ ] **Conferir `1010 Tee Macho Central`** · `B5`
  - Está no site, mas não aparece na p.30
- [ ] **Incluir `Bucha de Redução`** · `B2`
- [ ] **Atualizar `Anilhas B3 e B4 - AA`** · `B6`
- [ ] **Atualizar `Conexão Tee Igual - TIA`** · `B6`
- [ ] **Atualizar `Conexão Fêmea Reta Rosca Métrica - UFA`** · `B6`
- [ ] **Atualizar `Conexão Redução Reta - UDRA`** · `B6` — no site; sai do catálogo
- [ ] **Tubos de aço carbono e aço inox: descrição e categorias** · `B6`

> As fotos dos itens faltantes só existem dentro das páginas do catálogo, com ~150 px por produto. Não servem para o site.

### 🚫 Falta arte, foto ou texto

- [ ] **Atualizar a logo** · `A`
  - Falta o arquivo — ideal SVG, ou PNG transparente em ~3× o tamanho de exibição
- [ ] **Logo dos dois lados no cabeçalho das categorias** · `A`
  - Depende da mesma logo nova
- [ ] **Descrições das conexões hidráulicas DIN** · `B6`
  - Falta o texto — a planilha só diz "ATUALIZAR TODAS AS DESCRIÇÕES"
- [ ] **Engate Rápido Hidráulico (ISO-A, ISO-B, Face Plana)** · `B6`
  - Faltam fotos novas

### ❓ Espera decisão do cliente

- [ ] **Trocar as 10 fotos das galvanizadas** · `B2`
  - Técnico já resolvido (o 403 do acepilinox era user-agent; fotos saem 1000×1000)
  - Falta escopo: o fornecedor tem **4 fotos por produto**, o site usa **1**
  - Trocar por outra = rodar script · Mostrar as 4 = **mudança de schema** + galeria na página do produto
- [ ] **`União Assento Integral` × `União com Assento Cônico em Bronze`** · `B2`
  - Parecem peças diferentes, não só nome diferente — o cliente precisa dizer qual vale

---

## ✅ Feito

**A · Geral**
- [x] Marca Supreflex removida — 7 imagens das alimentícias (`retocar-marca.mjs` + `trocar-imagens-alimenticias.mjs`)
- [x] Banners da aba Produtos removidos, com limpeza de imports, CSS e imagens órfãs
- [x] Quem Somos: imagem do topo trocada (não está mais estourada)
- [x] Quem Somos: foto da loja colorida (`equipe.jpeg` + overlay 0.85 → 0.2)

**B1 · Tubos flexíveis inox**
- [x] Descrições AISI 316L de IS-0, IS-1 e IS-2

**B2 · Galvanizadas e inox**
- [x] Descrições do site — as 10
- [x] `Curva Macho x Fêmea 90º` — descrição atualizada (📕 falta tirar do catálogo)

**B3 · Engates**
- [x] Descrições dos 8 ERT e 4 ERU
- [x] Fotos dos 8 ERT trocadas — delcaflex, 1280×1024 (`trocar-imagens-engates.mjs`)
- [x] `ERT-C Acoplador Espigão` — foto nova (📕 falta no catálogo)

**B4 · Linha Pneumática**
- [x] Código no início do nome — 62 produtos (`Anilha 1001` → `1001 Anilha`)
- [x] Ordenação pelo código (`ordem` = código)
- [x] Latão movido para "Conexões em Latão" — 24 produtos
- [x] Grupo "Conexões plásticas" → "Conexões Pneumáticas"
- [x] Silenciadores 8554 / 8555 / 8556 movidos para "Silenciadores"
- [x] `8505 União Fêmea` incluído
- [x] Válvulas — foto nova + prefixo "Válvulas: "
- [x] Manômetros — foto sem fundo + prefixo "Manômetros: "

**B5 · Conexões em Latão**
- [x] Subcategoria → **Compressão**
- [x] Subcategoria → **Bicos para Mangueira**
- [x] Subcategoria → **Torneiras e Drenos**
- [x] Subcategoria → **Adaptadores em Latão**
- [x] **Adaptadores em Latão virou categoria própria** — os 9 produtos saíram de Conexões em Latão (que ficou com 42 em 6 subcategorias), como na planilha, que já traz as duas em abas separadas (`separar-adaptadores-latao.mjs`)
- [x] `Conexões para Tubos Plásticos` — já estava correto
- [x] Cabeçalhos de subcategoria sem caixa alta forçada (`text-transform` removido)

**B6 · Linha Hidráulica**
- [x] Manômetros: "Caixa Inox - Glicerina" → "Caixa Inox com Glicerina"
- [x] Terminais BSP e Métrico girados 180° (`ajuste-hidraulica.mjs`)
- [x] 6 conexões DIN incluídas no site — PA, JIA, JMA, JOA, UDA, UMA (📕 falta no catálogo)
  - Nomes idênticos aos da planilha; fotos da hennings sem fundo (`remover-fundo.mjs`)
  - Ordem 10–15 em "Conexões hidráulicas DIN" (`incluir-conexoes-din.mjs`)

---

## 📌 Notas

- **`produto.subcategoria` é texto solto**, não referência. Renomear uma subcategoria sem reescrever o texto em cada produto deixa os itens órfãos — sem erro nenhum.
- **Slugs nunca foram alterados** — são a URL do produto. Nome e slug divergentes é esperado.
- **O fim da caixa alta nos cabeçalhos vale para todas as categorias.** Conferido: nenhuma quebrou.
- **Bloquear imagem é dissuasão.** Dá para barrar botão direito, arrastar e toque longo; não dá para barrar print nem o inspetor, e as URLs do Sanity são públicas. Para impedir reuso de verdade, o caminho é marca d'água.
- **`seed-tubos-flexiveis-inox.mjs` está defasado** — traz as descrições antigas. Não sobrescreve nada hoje, mas diverge do que está no ar.
