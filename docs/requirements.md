# MetFlix (Requisitos)

## Objetivo

O Metflix resolve uma pergunta específica de quem acompanha várias séries ao mesmo
tempo: **"em que episódio eu parei?"**.

Com o fim do TV Time, quem acompanhava seis, sete séries em paralelo perdeu o registro
de onde estava em cada uma. Voltar a uma série depois de duas semanas vira um processo
de tentativa e erro: abrir o streaming, adivinhar a temporada, começar um episódio,
perceber que já tinha visto, voltar.

O produto guarda o ponto exato de cada série e responde a essa pergunta em um único
olhar, logo na tela inicial. **Tudo o que não serve a essa pergunta ficou fora do MVP.**

## Público

Pessoas que acompanham **várias séries simultaneamente**, em serviços diferentes, e com
intervalos irregulares entre um episódio e outro — quem assiste um episódio na terça,
some por dez dias e volta sem lembrar onde estava.

Não é o público de maratona (que não esquece porque assiste tudo de uma vez), nem o de
quem quer descobrir novidades (isso já é bem servido pelos próprios streamings).

## Problema escolhido

Da lista de oportunidades do enunciado, o produto ataca **"acompanhar séries e
episódios"**, com um recorte ainda mais estreito: a retomada.

Problemas conscientemente deixados de fora, com o motivo:

| Fora do escopo | Por quê |
| --- | --- |
| Rede social / comunidade | Exigiria backend e autenticação, e diluiria a proposta |
| Onde assistir (provedores) | É um problema de descoberta, não de retomada |
| Avaliações e resenhas | Resolvido melhor por Letterboxd e IMDb |
| Filmes | Filme não tem "onde parei" — o problema só existe em conteúdo episódico |
| Calendário de estreias | Bom complemento, mas é outro problema (antecipação, não retomada) |

## User stories e critérios de aceitação

### US01 — Ver onde parei

**Como** pessoa que acompanha várias séries, **quero** abrir o app e ver imediatamente
qual é o próximo episódio da série que assisti por último, **para** voltar a assistir sem
precisar lembrar de nada.

Critérios de aceitação:
- Na página inicial, a série com interação mais recente aparece em destaque, com nome,
  pôster, temporada e número do próximo episódio não assistido.
- O destaque tem um botão que leva direto à temporada desse episódio.
- As demais séries acompanhadas aparecem abaixo, cada uma com o próximo episódio visível.
- Se a estante estiver vazia, a página explica o que fazer e leva à busca.
- Se a pessoa já assistiu todos os episódios de uma série, o app indica que ela está
  completa em vez de sugerir um próximo episódio.

### US02 — Encontrar e acompanhar uma série

**Como** pessoa que começou uma série nova, **quero** procurar pelo nome e adicioná-la à
minha estante, **para** começar a registrar o progresso.

Critérios de aceitação:
- Há um campo de busca por nome que consulta o catálogo do TMDB.
- Cada resultado mostra pôster, nome e ano de estreia.
- Séries que já estão na estante aparecem marcadas, sem botão de adicionar duplicado.
- Sem nenhuma busca feita, a página mostra séries populares como ponto de partida.
- Uma busca sem resultados explica que nenhuma série foi encontrada e sugere uma ação.

### US03 — Marcar episódios assistidos

**Como** pessoa que acabou de assistir a um episódio, **quero** marcá-lo, **para** que o app
avance o meu ponto de retomada.

Critérios de aceitação:
- A página de uma temporada lista todos os episódios com número, nome, data de estreia e
  duração.
- Cada episódio pode ser marcado e desmarcado individualmente.
- Episódios assistidos são visualmente distintos dos não assistidos.
- É possível marcar ou desmarcar a temporada inteira em uma ação.
- Marcar um episódio atualiza imediatamente o próximo episódio da estante.
- Quem chega a uma temporada sem acompanhar a série vê os episódios, mas os controles
  ficam desativados até adicionar a série à estante.

### US04 — Ver detalhes e navegar pelas temporadas

**Como** pessoa acompanhando uma série, **quero** ver a sinopse e a lista de temporadas com
o meu progresso em cada uma, **para** me situar antes de voltar.

Critérios de aceitação:
- A página da série mostra pôster, imagem de fundo, sinopse, ano, número de temporadas e
  nota do público.
- Cada temporada da lista mostra quantos episódios tem e quantos já foram assistidos.
- A série pode ser adicionada ou removida da estante a partir dessa página.

### US05 — Ver quanto tempo eu assisti

**Como** pessoa curiosa sobre o próprio consumo, **quero** ver o total de episódios e de
horas, **para** ter uma noção do meu hábito.

Critérios de aceitação:
- Uma página mostra tempo total de tela, número de episódios marcados e número de séries
  na estante, com quantas já foram terminadas.
- O tempo é calculado pela duração média do episódio de cada série.
- Há uma lista das séries ordenada por episódios assistidos, com a barra de progresso.
- Sem séries na estante, a página explica por que está vazia.

### US06 — Não perder o progresso

**Como** pessoa que usa o app ao longo de semanas, **quero** que a minha estante continue lá
quando eu voltar, **para** não ter que remarcar tudo.

Critérios de aceitação:
- A estante é gravada no navegador a cada alteração.
- Ao reabrir o site, a estante aparece exatamente como estava.
- Um dado corrompido no armazenamento não quebra a aplicação: ela abre vazia.

## Estados da aplicação

Cada tela que depende da API trata quatro estados, sem exceção:

| Estado | Quando acontece | O que a pessoa vê |
| --- | --- | --- |
| Carregando | Enquanto a requisição ao TMDB não terminou | Indicador circular e o texto do que está sendo carregado |
| Erro | Rede fora, chave de API ausente ou resposta fora do padrão | Explicação do que aconteceu e botão "Tentar de novo" |
| Vazio | Estante sem séries, ou busca sem resultados | Explicação da situação e um caminho de saída |
| Preenchido | Requisição bem-sucedida com dados | O conteúdo da página |

Estados locais adicionais: episódio assistido / não assistido, série na estante / fora da
estante, temporada completa / incompleta, série concluída / em andamento.

## Regras do produto

1. Um episódio tem só dois estados: assistido ou não assistido. Não existe "assistindo
   pela metade".
2. O próximo episódio é sempre **o primeiro não assistido**, percorrendo as temporadas em
   ordem crescente. Se a pessoa pular o episódio 3 e marcar o 4, o próximo continua sendo
   o 3 — o app não assume que um pulo foi intencional.
3. Temporadas especiais (temporada 0) ficam fora da contagem, porque não fazem parte da
   linha principal e distorceriam o progresso.
4. O progresso é calculado sobre o total de episódios das temporadas regulares.
5. Marcar ou desmarcar qualquer episódio torna a série a mais recente da estante.
6. Remover uma série apaga o progresso dela. É uma ação direta, sem lixeira.
7. O tempo assistido usa a duração média do episódio informada pelo TMDB. Quando a série
   não informa, o app assume 45 minutos — é uma estimativa, e a interface diz isso.
8. Os dados ficam apenas no navegador da pessoa. Não há conta, login nem servidor: foi uma
   decisão de escopo, e o rodapé comunica isso para não criar expectativa de sincronização.
