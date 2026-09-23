# Ajustes pendentes — RR Mangueiras

Lista de ajustes recebida em 22/09/2026. Cada item traz o que já foi verificado no
código/nas imagens, o que é preciso para resolver e as dúvidas em aberto.

Legenda: `[ ]` a fazer · `[~]` bloqueado (depende de material externo) · `[x]` feito

---

## 🔒 Aguardando a logo nova

Três itens dependem do arquivo da logo atualizada. Enquanto ela não chega, nada
aqui deve ser mexido — mudar a logo antiga de tamanho agora só gera retrabalho,
porque as proporções da nova provavelmente serão outras.

### [~] 1. Atualizar logo

- Arquivo atual: `src/img/logo.png` (401×214, PNG).
- Usado no cabeçalho (`src/components/Header/Header.tsx:6`) — no desktop e no
  overlay do menu mobile.
- Existe também `src/img/hero-logo.png` (381×40), usada em outro lugar — conferir
  se ela também precisa ser trocada.
- **Precisa:** arquivo da logo nova, de preferência em SVG ou PNG com
  transparência e pelo menos 3× o tamanho de exibição.

### [~] 2. Logo do cabeçalho está muito pequena

- Hoje: `.logoContainer { width: 11rem }` (`src/components/Header/Header.module.css:21`),
  ou seja 110px de largura dentro de um cabeçalho de 100px de altura.
- No mobile cai para 7.5rem (`:106`) e no overlay 7rem (`:126`).
- Ajuste é de uma linha, mas depende da proporção da logo nova.
- **Faz par com o item 3 da seção "Cabeçalho"** — os dois mexem no mesmo layout e
  devem ser feitos juntos, numa passada só.

### [~] 3. Espaço em branco no cabeçalho das categorias de produtos: inserir logo dos dois lados

- Entendimento: a barra "CATEGORIAS" da página de produtos
  (`src/app/(site)/produtos/produtos.module.css:105`) é full-bleed (ocupa 100vw),
  com o título centralizado — sobra espaço vazio à esquerda e à direita dele.
  A ideia seria preencher esses dois vazios com a logo.
- ⚠️ **Dúvida:** pode ser também a faixa amarela de subcategoria
  (`.subcategoriaHeader`, `:182`), cujo degradê termina em cinza-claro e deixa um
  vazio à direita. Confirmar com quem mandou a lista qual dos dois é.
- **Precisa:** a logo nova + definição de qual cabeçalho.

---

## ✅ Podem ser feitos agora

### [ ] 4. Quem Somos — imagem do topo está estourada

- Arquivo: `src/img/quem-somos/hero.png` — **1024×576**.
- A seção é full-bleed em `aspect-ratio: 1440/500`
  (`src/app/(site)/quem-somos/page.module.css:2`), com `object-fit: cover`. Numa
  tela de 1440px a imagem é esticada ~1,4× e ainda cortada na vertical: daí a
  aparência estourada/pixelada.
- Há uma versão mobile separada, `hero-mob.png` (360×400), usada abaixo de 1200px
  (`:304`) — essa está proporcional e não precisa mexer.
- ⚠️ **Dúvida — são dois problemas diferentes, e o ajuste muda conforme a resposta:**
  - se "estourada" = **pixelada/serrilhada**, só resolve com o arquivo original em
    resolução maior (ideal ≥ 2880×1000). Não dá para recuperar detalhe ampliando.
  - se "estourada" = **muito ampliada / cortada demais** ("reduzir" = mostrar mais
    da cena), resolve no CSS ajustando `aspect-ratio`/`object-position` — sem
    arquivo novo.

### [ ] 5. Quem Somos — foto da loja e funcionários: deixar colorida

- Arquivo: `src/img/quem-somos/equipe.png` (2302×967), usado em
  `src/app/(site)/quem-somos/page.tsx:90`.
- Verificado: a imagem **já está gravada em duotone azul** — o efeito está queimado
  no PNG, não é filtro CSS. Não existe informação de cor para restaurar.
- Sobre o azulado em cima da foto: há ainda um overlay em degradê no CSS
  (`.equipeOverlay`, `page.module.css:137`) que escurece a foto para o texto branco
  ficar legível. Quando a foto voltar a ser colorida, esse overlay precisa ser
  reavaliado — provavelmente afinado, senão a cor não aparece.
- **Precisa:** a foto original colorida. Pedir para a designer / para quem tirou.

### [ ] 6. Bloquear imagens (hoje dá para salvar todas as imagens dos produtos)

- Medidas possíveis, todas no front:
  - bloquear menu de contexto (botão direito) sobre as imagens;
  - `user-select: none` + `-webkit-touch-callout: none` (impede o "salvar imagem"
    do toque longo no celular);
  - `draggable={false}` / `pointer-events` para impedir arrastar a imagem para fora;
  - opcionalmente uma camada transparente por cima da imagem, de forma que o clique
    direito pegue a camada e não o `<img>`.
- Pontos de aplicação: `.rowImg` em `produtos.module.css:220` (listagem) e a
  página de produto `src/app/(site)/produtos/[slug]/`.
- ⚠️ **Importante dizer ao cliente:** isso é **dissuasão, não proteção**. Qualquer
  pessoa ainda consegue a imagem pelo print de tela ou pelo inspetor do navegador —
  as URLs do CDN do Sanity são públicas por natureza. Se o objetivo for mesmo
  impedir o reuso comercial, o caminho é marca d'água na imagem, não bloqueio no
  site.

### [~] 7. Remover marca SUPREFLEX das mangueiras alimentícias

> **Estado:** as 7 imagens já foram retocadas e aprovadas visualmente. Falta só
> subir para o Sanity — aguardando confirmação, porque a escrita vai direto para
> o dataset de produção.


Verificadas as **12 imagens** da categoria, uma a uma. **7 têm a marca** — não só as
mangueiras:

| Subcategoria | Produto | Marca SUPREFLEX |
|---|---|---|
| Conexões | Engate INOX TC | **Sim** — laranja sobre capa azul |
| Conexões | Engate Rápido INOX Macho | **Sim** — laranja sobre capa preta |
| Conexões | Ponteira INOX BSP Roscada | **Sim** — laranja, cortada na borda |
| Conexões | Ponteira INOX DIN | **Sim** — laranja sobre capa azul |
| Conexões | Ponteira INOX RJT Fêmea e Macho | **Sim** — laranja sobre capa azul |
| Conexões | Ponteira INOX SMS Fêmea e Macho | **Sim** — laranja, cortada na borda |
| Mangueiras | Mangueira Atóxica **Pressão** | **Sim** — laranja sobre capa azul |
| Mangueiras | Mangueira Atóxica Trama Dupla | Não (imagem já trocada) |
| Mangueiras | Mangueira Atóxica Trama Simples | Não |
| Válvulas | Válvula Borboleta com catraca/alavanca | Não |
| Válvulas | Válvula Borboleta tipo Wafer | Não (só marcações de fundição: "PN16") |
| Válvulas | Válvula de retenção | Não |

**O ponto central:** as 6 imagens de "Conexões" não são fotos da conexão isolada —
são renders de uma **mangueira SUPREFLEX com um terminal na ponta**. A marca não é
um detalhe no canto: ela é grande, diagonal, atravessa o corpo da mangueira e ocupa
boa parte do quadro. São renders de catálogo do próprio fabricante.

Recortar não resolveria: em "Pressão" o texto entra cortado na borda e daria para
aparar, mas nas conexões ele está no meio do corpo da mangueira. Pedir arte limpa
ao fabricante também não, porque a marca *é* de quem fez o render. Então o caminho
foi **reconstruir a superfície** por baixo do texto.

**Feito.** As 7 imagens estão retocadas em `scripts/alimenticias-limpas/`, com as
mesmas dimensões e transparência dos originais (que seguem intactos em
`scripts/alimenticias-src/`). O script é `scripts/retocar-marca.mjs` — o cabeçalho
dele explica o método e o porquê de cada exceção por imagem.

    node scripts/retocar-marca.mjs            # processa tudo
    node scripts/retocar-marca.mjs --mascara  # só as máscaras, para conferir

Duas imagens precisaram de ajuste próprio, registrado no script: a **Pressão** tem
tramas de cobre que caem no mesmo limiar de cor do logotipo (daí a detecção ficar
restrita a um retângulo), e a **DIN** transplantava um brilho especular que virava
um risco de luz (daí o limite de amplitude da textura).

**Falta subir para o Sanity.** Não fiz porque a escrita vai direto para produção.
Quando for, é trocar só o campo `imagem` destes 7 produtos, sem tocar em mais nada.

⚠️ **Ainda vale confirmar o motivo do pedido:** se a RR revende SUPREFLEX, talvez a
marca só incomodasse nas conexões (onde a mangueira "rouba" o produto anunciado) e
não nas mangueiras. Se for o caso, é só não subir a da Pressão.

- Aproveitar a passada: a **Trama Simples** está com imagem de só **256×200**,
  contra ~1400px das vizinhas — aparece mais mole que as outras na listagem.

### [ ] 8. Remover banners da aba produtos

- Carrossel no fim da página:
  `src/app/(site)/produtos/components/ProdutosClient.tsx:318–364`, CSS em
  `produtos.module.css:9–102`.
- ⚠️ **Atenção:** esses banners não são só decoração — cada um é um botão que
  filtra a listagem por categoria (`handleSelectByName`). Remover tira também esse
  atalho. As pílulas de categoria no topo continuam cobrindo a navegação, então na
  prática não se perde acesso a nada.
- Confirmar se é remover de vez ou só esconder por ora.

---

## Cabeçalho (fazer numa passada só)

### [ ] 9. Ajustar e aumentar o botão "Fale conosco" para o centro do cabeçalho

- Hoje o botão é o último item do `<nav>`, colado à direita
  (`Header.tsx:33-35`, `.contactButton` em `Header.module.css:50`).
- Levar para o centro muda a estrutura do cabeçalho: hoje é
  `logo | nav+botão` com `justify-content: space-between`. Para centralizar de
  verdade vira uma grade de três colunas (`logo | nav | botão`) ou a nav se divide
  em torno do botão.
- Esse trabalho **encosta nos itens 2 e 3** (tamanho da logo): o espaço que a logo
  maior ocupa define onde o botão cabe. Por isso os três devem sair juntos, quando
  a logo nova chegar.

---

## Verificar com o cliente antes de começar

1. **Item 4** — "estourada" é pixelada (precisa de arquivo maior) ou ampliada
   demais (ajuste de CSS)?
2. **Item 5** — a foto colorida original existe? Sem ela o item não anda.
3. **Item 3** — qual cabeçalho: a barra "CATEGORIAS" ou a faixa amarela de
   subcategoria?
4. **Item 8** — remover os banners de vez ou apenas ocultar?
5. **Item 6** — alinhar a expectativa: bloqueio no site é dissuasão, não proteção.
6. **Item 7** — são 7 imagens, sendo 6 renders de catálogo em que a marca é o
   elemento principal. Retocar ou substituir por imagens novas?

---

## Ordem sugerida

1. Item 8 — independente, rápido, sem depender de ninguém.
2. Item 6 — depois de alinhar a expectativa.
3. Item 7 — fazer um teste de retoque em uma imagem e mostrar antes de fechar as 7.
4. Item 4 — assim que vier a resposta sobre o tipo do problema.
5. Item 5 — assim que vier a foto colorida.
6. Itens 1, 2, 3 e 9 juntos — quando a logo nova chegar.
