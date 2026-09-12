# Metflix — Arquitetura

## Visão geral

Aplicação React criada com Vite, sem backend próprio. Os dados de catálogo vêm da API do
TMDB; o progresso da pessoa vive no estado do React e é espelhado no `localStorage`.

A decisão estrutural central: **todo o estado compartilhado mora no `App.jsx`** e desce
para as páginas por props. As páginas não escrevem no estado diretamente — elas recebem
funções do `App` e chamam essas funções. Isso mantém uma única fonte de verdade e torna o
fluxo de dados fácil de seguir de cima para baixo.

## Estrutura de pastas

```
src/
  components/    componentes reutilizáveis e os dois layouts
  pages/         um arquivo por rota
  services/      comunicação com a API e cálculos de progresso
  App.jsx        estado compartilhado e definição das rotas
  main.jsx       ponto de entrada, monta o BrowserRouter
  index.css      folha de estilo única
```

`services/` existe para que nenhuma página precise saber a URL do TMDB nem repetir a
lógica de "qual é o próximo episódio". As páginas importam uma função e usam.

## Rotas

O `BrowserRouter` é montado em `main.jsx`. As rotas são declaradas em `App.jsx` com
`<Routes>` e `<Route>`, usando aninhamento para os layouts.

| Rota | Página | Tipo | O que faz |
| --- | --- | --- | --- |
| `/` | `Estante` | índice | Destaque da última série e grade das demais |
| `/buscar` | `Busca` | estática | Busca no TMDB e séries populares |
| `/estatisticas` | `Estatisticas` | estática | Totais e ranking de progresso |
| `/serie/:id` | `DetalheSerie` | **dinâmica** | Sinopse e lista de temporadas |
| `/serie/:id/temporada/:numero` | `Temporada` | **dinâmica (2 parâmetros)** | Lista de episódios com marcação |
| `*` | `NaoEncontrada` | coringa | Página 404 |

Os parâmetros `:id` e `:numero` são lidos com `useParams()` dentro das páginas.

## Layouts

São dois, um aninhado no outro:

- **`LayoutPrincipal`** — envolve todas as rotas. Renderiza `Cabecalho`, a faixa de aviso
  de erro, o `<Outlet />` com a página atual e o `Rodape`.
- **`LayoutSerie`** — envolve só `/serie/:id` e `/serie/:id/temporada/:numero`. Acrescenta
  a barra "Voltar" que as duas páginas compartilham, evitando repetir o mesmo trecho em
  cada uma.

```
LayoutPrincipal
├── Estante            (/)
├── Busca              (/buscar)
├── Estatisticas       (/estatisticas)
├── LayoutSerie        (/serie/:id)
│   ├── DetalheSerie   (índice)
│   └── Temporada      (temporada/:numero)
└── NaoEncontrada      (*)
```

## Modelo de dados

Uma série salva na estante:

```js
{
  id: 1399,          
  nome: "Game of Thrones",
  poster: "/caminho.jpg",    
  duracaoMedia: 57,            
  totalEpisodios: 73,          
  temporadas: [              
    { numero: 1, total: 10 },
    { numero: 2, total: 10 }
  ],
  vistos: ["1-1", "1-2", "2-1"],
  atualizadoEm: 1757600000000    
}
```

Guardar os assistidos como uma lista de strings `"temporada-episodio"` deixa a verificação
de "este episódio já foi visto?" em uma única chamada de `includes`, e o dado salvo no
navegador fica pequeno e legível.

## Componentes e props

| Componente | Props recebidas | Responsabilidade |
| --- | --- | --- |
| `LayoutPrincipal` | `acompanhadas`, `aviso`, `aoFecharAviso` | Moldura de todas as páginas |
| `LayoutSerie` | — | Barra de voltar das páginas de série |
| `Cabecalho` | `quantidade` | Navegação e contador da estante |
| `Rodape` | — | Aviso de armazenamento local e crédito do TMDB |
| `CartaoRetomada` | `serie` | Destaque com o próximo episódio |
| `CardEstante` | `serie`, `aoRemover` | Card de série acompanhada |
| `CardSerie` | `serie`, `jaAcompanha`, `aoAdicionar` | Card de resultado de busca |
| `ItemEpisodio` | `episodio`, `visto`, `bloqueado`, `aoAlternar` | Linha de episódio com o botão de marcar |
| `BarraProgresso` | `valor`, `rotulo` | Barra usada em quatro telas diferentes |
| `CartaoNumero` | `valor`, `rotulo`, `detalhe` | Destaque numérico das estatísticas |
| `Carregando` | `texto` | Estado de carregamento |
| `MensagemErro` | `mensagem`, `aoTentarDeNovo` | Estado de erro |
| `EstadoVazio` | `titulo`, `texto`, `textoDoBotao`, `destino` | Estado vazio |

Props que começam com `ao` são sempre funções vindas do `App`: `aoAdicionar`,
`aoRemover`, `aoAlternarEpisodio`, `aoAlternarTemporada`, `aoTentarDeNovo`. A convenção
deixa claro, ao ler um componente, o que é dado e o que é ação.

### Props das páginas

| Página | Props |
| --- | --- |
| `Estante` | `acompanhadas`, `aoRemover` |
| `Busca` | `acompanhadas`, `aoAdicionar` |
| `DetalheSerie` | `acompanhadas`, `aoAdicionar`, `aoRemover` |
| `Temporada` | `acompanhadas`, `aoAdicionar`, `aoAlternarEpisodio`, `aoAlternarTemporada` |
| `Estatisticas` | `acompanhadas` |

## Estados do React (`useState`)

### Em `App.jsx` (compartilhado)

| Estado | Tipo | Para quê |
| --- | --- | --- |
| `acompanhadas` | array | A estante inteira. Única fonte de verdade do progresso |
| `aviso` | string | Mensagem de erro ao tentar acompanhar uma série |

O valor inicial de `acompanhadas` vem da função `lerEstanteSalva`, passada para o
`useState` sem parênteses — assim ela roda uma única vez, na montagem, em vez de a cada
renderização. Se o JSON salvo estiver corrompido, ela devolve uma lista vazia.

### Nas páginas (local)

| Página | Estados |
| --- | --- |
| `Busca` | `termo` (o que está digitado), `consulta` (o que foi enviado), `resultados`, `carregando`, `erro`, `tentativa` |
| `DetalheSerie` | `serie`, `carregando`, `erro`, `tentativa` |
| `Temporada` | `temporada`, `carregando`, `erro`, `tentativa` |

`termo` e `consulta` são separados de propósito: o campo muda a cada tecla, mas a
requisição só acontece quando o formulário é enviado. Isso evita uma chamada à API por
caractere digitado.

`tentativa` é um contador que só existe para servir de dependência do `useEffect`:
incrementá-lo faz o efeito rodar de novo, que é como o botão "Tentar de novo" funciona.

## Efeitos (`useEffect`)

| Onde | Dependências | O que faz |
| --- | --- | --- |
| `App` | `[acompanhadas]` | Grava a estante no `localStorage` a cada mudança |
| `Busca` | `[consulta, tentativa]` | Busca no TMDB, ou lista os populares quando a consulta está vazia |
| `DetalheSerie` | `[id, tentativa]` | Carrega os detalhes da série |
| `Temporada` | `[id, numero, tentativa]` | Carrega os episódios da temporada |

Os três efeitos de API seguem o mesmo desenho: declaram uma função assíncrona interna e
a chamam em seguida (a função passada ao `useEffect` não pode ser `async`). Dentro dela,
`try` guarda os dados, `catch` guarda a mensagem de erro e `finally` desliga o
carregamento — assim o indicador some mesmo quando a requisição falha.

Ter `id` e `numero` nas dependências é o que faz a página se recarregar quando a pessoa
navega de uma temporada para outra sem sair da rota.

## Camada de serviços

**`services/tmdb.js`** — monta as URLs e faz o `fetch`. Uma função privada `pedir()`
concentra a chave, o idioma e o tratamento de resposta; as funções exportadas
(`seriesPopulares`, `buscarSeries`, `detalhesSerie`, `detalhesTemporada`) só dizem qual
caminho da API querem. `imagem()` monta a URL do pôster e devolve `null` quando não há
imagem, para o componente decidir o que mostrar no lugar.

**`services/progresso.js`** — funções puras, sem estado e sem efeito colateral:
`proximoEpisodio`, `porcentagem`, `estaVisto`, `vistosDaTemporada`, `minutosAssistidos`,
`formatarTempo`, `chaveEpisodio`. Elas recebem a série e devolvem um valor calculado, o
que significa que nada é guardado duas vezes: o progresso é derivado de `vistos` sempre
que a tela renderiza.

`proximoEpisodio` percorre as temporadas em ordem e devolve o primeiro par
temporada/episódio que não está em `vistos`, ou `null` quando a série acabou.

## Fluxo de uma interação

Marcar o episódio 4 da temporada 2:

1. `ItemEpisodio` chama `aoAlternar(4)`.
2. `Temporada` repassa para `aoAlternarEpisodio(id, 2, 4)`, recebida do `App` por props.
3. `App` monta a chave `"2-4"` e atualiza `acompanhadas` de forma imutável, com `map` e
   espalhamento, criando um novo objeto para a série alterada.
4. A mudança de estado rerenderiza tudo que depende de `acompanhadas`.
5. O `useEffect` do `App` grava a nova estante no `localStorage`.
6. Na volta à estante, `proximoEpisodio` já calcula o episódio 5 como próximo.

## Bibliotecas

| Biblioteca | Para quê |
| --- | --- |
| `react` / `react-dom` | Base da aplicação |
| `react-router-dom` | Rotas, rotas dinâmicas, layouts aninhados e navegação |
| `react-icons` (conjunto Feather) | Ícones da interface |
| `vite` / `@vitejs/plugin-react` | Servidor de desenvolvimento e build |

## Decisões de implementação

- **Sem Context API e sem biblioteca de estado.** Com um único estado compartilhado e
  cinco páginas, props resolvem sem esconder o caminho do dado.
- **Sem cache das respostas do TMDB.** Cada visita refaz a requisição. É mais simples e o
  volume de dados é pequeno; um cache entraria numa próxima versão.
- **CSS puro em um arquivo só,** com variáveis para cor, raio e largura. O projeto tem
  poucas telas e a folha inteira cabe em uma leitura.
- **`vercel.json` com rewrite para `index.html`.** Sem isso, recarregar a página em
  `/serie/1399` retorna 404 na Vercel, porque o servidor procura um arquivo nesse caminho
  em vez de deixar o React Router resolver a rota.
