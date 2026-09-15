# MetFlix

Aplicação web responsiva em React que guarda o ponto exato onde você parou em cada série e
mostra, na primeira tela, qual é o próximo episódio.

CP1 — 2º trimestre — Desenvolvimento Web — FIAP

## Integrantes

Kauê Herculano - RM: 570699
Lucca Braga - RM:571044
João Pedro - RM:571827
## Links

- **Repositório: (https://github.com/WebDev-JS-e-React/projeto-loja-virtual.git)
- **Site publicado: https://cp-1-2-tri-web-dev.vercel.app/buscar

## O problema

O TV Time encerrou as atividades em julho de 2026 e levou junto o histórico de milhões de
pessoas. Quem acompanhava várias séries em paralelo ficou sem o registro de onde estava em
cada uma.

O problema não é descobrir o que assistir — os streamings já fazem isso bem demais. É
voltar. Depois de duas semanas longe de uma série, retomar vira tentativa e erro: abrir o
serviço, adivinhar a temporada, começar um episódio, perceber que já tinha visto, voltar.
E quanto mais séries em andamento, pior fica.

## A solução

O Metflix resolve uma pergunta só, e resolve em zero cliques: "em que episódio eu
parei?"

Você marca os episódios que assistiu. O app calcula o primeiro episódio não assistido de
cada série e coloca o da série mais recente em destaque, logo na abertura, com um botão que
leva direto até ele. Todo o resto do produto existe para alimentar essa tela.

## Funcionalidades

- **Estante com retomada** — a série mexida por último em destaque, com temporada e número
  do próximo episódio, e as demais em grade abaixo.
- **Busca de séries** — consulta ao catálogo do TMDB, com séries populares como ponto de
  partida enquanto nada foi buscado.
- **Página da série** — sinopse, ano, nota e lista de temporadas com o progresso de cada uma.
- **Marcação de episódios** — episódio a episódio ou a temporada inteira de uma vez, com o
  ponto de retomada recalculado na hora.
- **Números pessoais** — tempo total de tela, episódios marcados, séries terminadas e um
  ranking de progresso por série.
- **Progresso salvo no navegador** — a estante continua lá quando você voltar.
- **Interface responsiva** — do celular ao desktop, com estados de carregamento, erro e
  vazio tratados em todas as telas.

## Tecnologias

- React 18 com componentização e comunicação por props
- React Router 6 — múltiplas páginas, dois layouts aninhados e rotas dinâmicas
- `useState` para estados de interação e `useEffect` para os efeitos de consumo de API
- react-icons (conjunto Feather) para os ícones
- CSS puro com variáveis
- Vite como ferramenta de build
- `localStorage` para persistir a estante

## API

**TMDB** — The Movie Database (https://developer.themoviedb.org/docs/getting-started)

Endpoints usados:

| Endpoint | Para quê |
| --- | --- |
| `GET /tv/popular` | Séries populares na página de busca |
| `GET /search/tv` | Busca por nome |
| `GET /tv/{id}` | Detalhes da série e lista de temporadas |
| `GET /tv/{id}/season/{numero}` | Episódios de uma temporada |

Todas as chamadas usam `language=pt-BR`.

## Como executar

**Pré-requisitos:** Node.js 18 ou superior.

1. Clone o repositório e entre na pasta:

   bash
   git clone <(https://github.com/WebDev-JS-e-React/projeto-loja-virtual.git)>
   cd continua
   

2. Instale as dependências:

   bash
   npm install
   

3. Crie um arquivo `.env` na raiz do projeto, a partir do `.env.example`, com a sua chave
   do TMDB (gratuita, em https://www.themoviedb.org/settings/api):

   ```
   VITE_TMDB_API_KEY=sua_chave_aqui
   ```

4. Rode o projeto:

   ```bash
   npm run dev
   ```

   O site sobe em `http://localhost:5173`.

Para gerar a versão de produção: `npm run build`, e `npm run preview` para conferir o
resultado localmente.

**Publicação na Vercel:** importe o repositório, mantenha o preset Vite e cadastre a
variável `VITE_TMDB_API_KEY` nas configurações de ambiente do projeto. O arquivo
`vercel.json` já está configurado para que as rotas do React Router funcionem ao recarregar
a página.

## Documentação

Seguindo a metodologia de Spec Driven Development, a especificação foi escrita antes do
código e está na pasta `docs/`:

- [`docs/requirements.md`](docs/requirements.md) — objetivo, público, user stories,
  critérios de aceitação, estados da aplicação e regras do produto
- [`docs/architecture.md`](docs/architecture.md) — páginas, rotas, componentes, props,
  estados, efeitos e decisões de implementação
- [`docs/references/references.md`](docs/references/references.md) — as quatro referências
  visuais e o que cada uma inspirou

## Uso de IA

A IA foi usada como apoio dentro do fluxo de Spec Driven Development, na seguinte ordem:

1. **Especificação primeiro.** O problema, o recorte do MVP e o que ficaria de fora foram
   definidos antes de qualquer código, e escritos em `docs/requirements.md`.
2. **Arquitetura em seguida.** Rotas, componentes, props e estados foram desenhados em
   `docs/architecture.md` a partir dos requisitos.
3. **Código por último,** seguindo a spec — sem funcionalidades fora do que estava
   documentado.

Onde a IA ajudou: revisão da redação das user stories, sugestões de organização dos
componentes, escrita das funções de cálculo de progresso e revisão do CSS.

As decisões continuaram sendo nossas: qual problema atacar entre os dez do enunciado, o
recorte do MVP, o modelo de dados dos episódios assistidos, as referências visuais
escolhidas e a direção estética. Nenhum trecho do código usa recurso fora do que foi visto
em aula.
