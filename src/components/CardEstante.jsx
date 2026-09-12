import { Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { imagem } from "../services/tmdb";
import { proximoEpisodio, porcentagem } from "../services/progresso";
import BarraProgresso from "./BarraProgresso";

function CardEstante({ serie, aoRemover }) {
  const proximo = proximoEpisodio(serie);
  const capa = imagem(serie.poster);
  const destino = proximo
    ? `/serie/${serie.id}/temporada/${proximo.temporada}`
    : `/serie/${serie.id}`;

  return (
    <article className="card card-estante">
      <Link to={destino} className="card-capa">
        {capa ? (
          <img src={capa} alt={`Pôster de ${serie.nome}`} loading="lazy" />
        ) : (
          <div className="sem-imagem">{serie.nome}</div>
        )}
        <span className="selo-proximo">
          {proximo ? `T${proximo.temporada} E${proximo.episodio}` : "Completa"}
        </span>
      </Link>

      <div className="card-info">
        <h3 className="card-titulo">
          <Link to={`/serie/${serie.id}`}>{serie.nome}</Link>
        </h3>

        <BarraProgresso
          valor={porcentagem(serie)}
          rotulo={`${serie.vistos.length}/${serie.totalEpisodios}`}
        />

        <button
          type="button"
          className="botao-icone"
          onClick={() => aoRemover(serie.id)}
          aria-label={`Tirar ${serie.nome} da estante`}
        >
          <FiTrash2 aria-hidden="true" />
          Tirar da estante
        </button>
      </div>
    </article>
  );
}

export default CardEstante;
