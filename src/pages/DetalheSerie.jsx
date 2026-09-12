import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiPlus, FiTrash2, FiStar } from "react-icons/fi";

import Carregando from "../components/Carregando";
import MensagemErro from "../components/MensagemErro";
import BarraProgresso from "../components/BarraProgresso";
import { detalhesSerie, imagem } from "../services/tmdb";
import { porcentagem, vistosDaTemporada } from "../services/progresso";

function DetalheSerie({ acompanhadas, aoAdicionar, aoRemover }) {
  const { id } = useParams();

  const [serie, setSerie] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  const salva = acompanhadas.find((item) => item.id === Number(id));

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");

      try {
        const dados = await detalhesSerie(id);
        setSerie(dados);
      } catch (problema) {
        setErro(problema.message);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [id, tentativa]);

  if (carregando) {
    return <Carregando texto="Carregando a série" />;
  }

  if (erro) {
    return <MensagemErro mensagem={erro} aoTentarDeNovo={() => setTentativa(tentativa + 1)} />;
  }

  const fundo = imagem(serie.backdrop_path, "w780");
  const capa = imagem(serie.poster_path, "w342");
  const ano = serie.first_air_date ? serie.first_air_date.slice(0, 4) : "";
  const temporadas = (serie.seasons || []).filter(
    (temporada) => temporada.season_number > 0 && temporada.episode_count > 0
  );

  return (
    <div className="pagina">
      <section className="topo-serie">
        {fundo && (
          <div className="topo-fundo">
            <img src={fundo} alt="" />
          </div>
        )}

        <div className="topo-conteudo">
          <div className="topo-capa">
            {capa ? (
              <img src={capa} alt={`Pôster de ${serie.name}`} />
            ) : (
              <div className="sem-imagem">{serie.name}</div>
            )}
          </div>

          <div className="topo-texto">
            <h1>{serie.name}</h1>

            <p className="topo-meta">
              {ano && <span>{ano}</span>}
              <span>{temporadas.length} temporadas</span>
              {serie.vote_average > 0 && (
                <span className="nota">
                  <FiStar aria-hidden="true" />
                  {serie.vote_average.toFixed(1)}
                </span>
              )}
            </p>

            {serie.overview ? (
              <p className="sinopse">{serie.overview}</p>
            ) : (
              <p className="sinopse sinopse-vazia">
                O TMDB ainda não tem sinopse em português para esta série.
              </p>
            )}

            {salva ? (
              <div className="topo-acoes">
                <BarraProgresso
                  valor={porcentagem(salva)}
                  rotulo={`${salva.vistos.length} de ${salva.totalEpisodios} episódios`}
                />
                <button
                  type="button"
                  className="botao botao-contorno"
                  onClick={() => aoRemover(salva.id)}
                >
                  <FiTrash2 aria-hidden="true" />
                  Tirar da estante
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="botao botao-principal"
                onClick={() => aoAdicionar(serie.id)}
              >
                <FiPlus aria-hidden="true" />
                Acompanhar esta série
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="secao">
        <div className="secao-cabecalho">
          <h2>Temporadas</h2>
          <p>Escolha uma para marcar os episódios</p>
        </div>

        <ul className="lista-temporadas">
          {temporadas.map((temporada) => {
            const vistos = vistosDaTemporada(salva, temporada.season_number);
            const parcial = Math.round((vistos / temporada.episode_count) * 100);

            return (
              <li key={temporada.id}>
                <Link
                  to={`/serie/${serie.id}/temporada/${temporada.season_number}`}
                  className="linha-temporada"
                >
                  <span className="linha-temporada-nome">{temporada.name}</span>
                  <span className="linha-temporada-total">
                    {temporada.episode_count} episódios
                  </span>
                  {salva && (
                    <span className="linha-temporada-progresso">
                      <BarraProgresso valor={parcial} rotulo={`${vistos}/${temporada.episode_count}`} />
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export default DetalheSerie;
