import { Link } from "react-router-dom";
import { FiPlus, FiCheck } from "react-icons/fi";
import { imagem } from "../services/tmdb";
function CardSerie({ serie, jaAcompanha, aoAdicionar }) {
  const capa = imagem(serie.poster_path);
  const ano = serie.first_air_date ? serie.first_air_date.slice(0, 4) : "";

  return (
    <article className="card">
      <Link to={`/serie/${serie.id}`} className="card-capa">
        {capa ? (
          <img src={capa} alt={`Pôster de ${serie.name}`} loading="lazy" />
        ) : (
          <div className="sem-imagem">{serie.name}</div>
        )}
      </Link>

      <div className="card-info">
        <h3 className="card-titulo">
          <Link to={`/serie/${serie.id}`}>{serie.name}</Link>
        </h3>
        {ano && <p className="card-ano">{ano}</p>}

        {jaAcompanha ? (
          <span className="marcador-estante">
            <FiCheck aria-hidden="true" />
            Na estante
          </span>
        ) : (
          <button
            type="button"
            className="botao botao-pequeno"
            onClick={() => aoAdicionar(serie.id)}
          >
            <FiPlus aria-hidden="true" />
            Acompanhar
          </button>
        )}
      </div>
    </article>
  );
}

export default CardSerie;
