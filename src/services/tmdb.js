const URL_BASE = "https://api.themoviedb.org/3";
const CHAVE = import.meta.env.VITE_TMDB_API_KEY;
const IDIOMA = "pt-BR";
export function imagem(caminho, tamanho = "w342") {
  if (!caminho) {
    return null;
  }
  return `https://image.tmdb.org/t/p/${tamanho}${caminho}`;
}

async function pedir(caminho, parametros = "") {
  if (!CHAVE) {
    throw new Error(
      "Chave da API não encontrada. Crie um arquivo .env na raiz do projeto com VITE_TMDB_API_KEY."
    );
  }

  const resposta = await fetch(
    `${URL_BASE}${caminho}?api_key=${CHAVE}&language=${IDIOMA}${parametros}`
  );

  if (!resposta.ok) {
    throw new Error("O TMDB não respondeu. Tente de novo em alguns segundos.");
  }

  return resposta.json();
}

export function seriesPopulares() {
  return pedir("/tv/popular");
}

export function buscarSeries(termo) {
  return pedir("/search/tv", `&query=${encodeURIComponent(termo)}&include_adult=false`);
}

export function detalhesSerie(id) {
  return pedir(`/tv/${id}`);
}

export function detalhesTemporada(id, numero) {
  return pedir(`/tv/${id}/season/${numero}`);
}
