import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

import CardSerie from "../components/CardSerie";
import Carregando from "../components/Carregando";
import MensagemErro from "../components/MensagemErro";
import { buscarSeries, seriesPopulares } from "../services/tmdb";

function Busca({ acompanhadas, aoAdicionar }) {
  const [termo, setTermo] = useState("");
  const [consulta, setConsulta] = useState("");
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");

      try {
        const dados = consulta ? await buscarSeries(consulta) : await seriesPopulares();
        setResultados(dados.results);
      } catch (problema) {
        setErro(problema.message);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [consulta, tentativa]);

  function enviar(evento) {
    evento.preventDefault();
    setConsulta(termo.trim());
  }

  return (
    <div className="pagina">
      <div className="secao-cabecalho">
        <h1>Buscar séries</h1>
        <p>{consulta ? `Resultados para "${consulta}"` : "Séries populares agora"}</p>
      </div>

      <form className="formulario-busca" onSubmit={enviar}>
        <FiSearch className="icone-busca" aria-hidden="true" />
        <input
          type="text"
          value={termo}
          onChange={(evento) => setTermo(evento.target.value)}
          placeholder="Nome da série"
          aria-label="Nome da série"
        />
        <button type="submit" className="botao botao-principal">
          Buscar
        </button>
      </form>

      {carregando && <Carregando texto="Procurando séries" />}

      {!carregando && erro && (
        <MensagemErro mensagem={erro} aoTentarDeNovo={() => setTentativa(tentativa + 1)} />
      )}

      {!carregando && !erro && resultados.length === 0 && (
        <div className="estado estado-vazio">
          <h2>Nenhuma série com esse nome</h2>
          <p>Confira a escrita ou tente o título original em inglês.</p>
        </div>
      )}

      {!carregando && !erro && resultados.length > 0 && (
        <div className="grade">
          {resultados.map((serie) => (
            <CardSerie
              key={serie.id}
              serie={serie}
              jaAcompanha={acompanhadas.some((salva) => salva.id === serie.id)}
              aoAdicionar={aoAdicionar}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Busca;
