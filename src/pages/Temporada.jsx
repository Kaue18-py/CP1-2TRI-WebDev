import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

import ItemEpisodio from "../components/ItemEpisodio";
import Carregando from "../components/Carregando";
import MensagemErro from "../components/MensagemErro";
import { detalhesTemporada } from "../services/tmdb";
import { estaVisto } from "../services/progresso";

function Temporada({ acompanhadas, aoAdicionar, aoAlternarEpisodio, aoAlternarTemporada }) {
  const { id, numero } = useParams();

  const [temporada, setTemporada] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  const salva = acompanhadas.find((item) => item.id === Number(id));

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");

      try {
        const dados = await detalhesTemporada(id, numero);
        setTemporada(dados);
      } catch (problema) {
        setErro(problema.message);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [id, numero, tentativa]);

  if (carregando) {
    return <Carregando texto="Carregando os episódios" />;
  }

  if (erro) {
    return <MensagemErro mensagem={erro} aoTentarDeNovo={() => setTentativa(tentativa + 1)} />;
  }

  const episodios = temporada.episodes || [];
  const numerosDosEpisodios = episodios.map((episodio) => episodio.episode_number);
  const vistosAqui = salva
    ? episodios.filter((episodio) => estaVisto(salva, Number(numero), episodio.episode_number)).length
    : 0;

  return (
    <div className="pagina">
      <div className="secao-cabecalho">
        <h1>{temporada.name}</h1>
        <p>
          {episodios.length} episódios
          {salva && ` — ${vistosAqui} assistidos`}
        </p>
      </div>

      {!salva && (
        <div className="aviso">
          <p>Adicione a série à estante para marcar episódios e guardar o seu progresso.</p>
          <button
            type="button"
            className="botao botao-principal"
            onClick={() => aoAdicionar(Number(id))}
          >
            Acompanhar esta série
          </button>
        </div>
      )}

      {salva && (
        <button
          type="button"
          className="botao botao-contorno"
          onClick={() => aoAlternarTemporada(salva.id, Number(numero), numerosDosEpisodios)}
        >
          <FiCheckCircle aria-hidden="true" />
          {vistosAqui === episodios.length
            ? "Desmarcar a temporada"
            : "Marcar a temporada inteira"}
        </button>
      )}

      <ul className="lista-episodios">
        {episodios.map((episodio) => (
          <ItemEpisodio
            key={episodio.id}
            episodio={episodio}
            visto={estaVisto(salva, Number(numero), episodio.episode_number)}
            bloqueado={!salva}
            aoAlternar={(numeroEpisodio) =>
              aoAlternarEpisodio(Number(id), Number(numero), numeroEpisodio)
            }
          />
        ))}
      </ul>
    </div>
  );
}

export default Temporada;
