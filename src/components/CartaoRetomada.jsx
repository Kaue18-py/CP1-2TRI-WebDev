import { Link } from "react-router-dom";
import { FiPlay } from "react-icons/fi";
import { imagem } from "../services/tmdb";
import { proximoEpisodio, porcentagem } from "../services/progresso";
import BarraProgresso from "./BarraProgresso";


function CartaoRetomada({ serie }) {
  const proximo = proximoEpisodio(serie);
  const capa = imagem(serie.poster, "w500");
  const assistidos = serie.vistos.length;

  return (
    <section className="retomada">
      <div className="retomada-capa">
        {capa ? (
          <img src={capa} alt={`Pôster de ${serie.nome}`} />
        ) : (
          <div className="sem-imagem">{serie.nome}</div>
        )}
      </div>

      <div className="retomada-texto">
        <p className="retomada-etiqueta">Você parou aqui</p>
        <h1 className="retomada-titulo">{serie.nome}</h1>

        {proximo ? (
          <>
            <p className="retomada-episodio">
              Temporada {proximo.temporada}, episódio {proximo.episodio}
            </p>
            <BarraProgresso
              valor={porcentagem(serie)}
              rotulo={`${assistidos} de ${serie.totalEpisodios} episódios`}
            />
            <Link
              to={`/serie/${serie.id}/temporada/${proximo.temporada}`}
              className="botao botao-principal"
            >
              <FiPlay aria-hidden="true" />
              Continuar de onde parei
            </Link>
          </>
        ) : (
          <>
            <p className="retomada-episodio">Você assistiu a série inteira.</p>
            <BarraProgresso valor={100} rotulo={`${serie.totalEpisodios} episódios`} />
            <Link to={`/serie/${serie.id}`} className="botao botao-contorno">
              Ver a série
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

export default CartaoRetomada;
