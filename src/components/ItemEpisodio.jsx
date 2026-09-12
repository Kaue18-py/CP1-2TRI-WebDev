import { FiCheck } from "react-icons/fi";
import { imagem } from "../services/tmdb";
function ItemEpisodio({ episodio, visto, bloqueado, aoAlternar }) {
  const foto = imagem(episodio.still_path, "w300");
  const data = episodio.air_date
    ? new Date(`${episodio.air_date}T00:00:00`).toLocaleDateString("pt-BR")
    : "sem data de estreia";

  return (
    <li className={visto ? "episodio episodio-visto" : "episodio"}>
      <div className="episodio-foto">
        {foto ? (
          <img src={foto} alt="" loading="lazy" />
        ) : (
          <div className="sem-imagem sem-imagem-pequena">{episodio.episode_number}</div>
        )}
      </div>

      <div className="episodio-texto">
        <p className="episodio-numero">Episódio {episodio.episode_number}</p>
        <h3 className="episodio-nome">{episodio.name}</h3>
        <p className="episodio-data">
          {data}
          {episodio.runtime ? ` — ${episodio.runtime} min` : ""}
        </p>
      </div>

      <button
        type="button"
        className={visto ? "marcar marcar-ativo" : "marcar"}
        onClick={() => aoAlternar(episodio.episode_number)}
        disabled={bloqueado}
        aria-pressed={visto}
        aria-label={visto ? "Desmarcar episódio" : "Marcar episódio como assistido"}
      >
        <FiCheck aria-hidden="true" />
      </button>
    </li>
  );
}

export default ItemEpisodio;
