import { Link } from "react-router-dom";

import CartaoNumero from "../components/CartaoNumero";
import BarraProgresso from "../components/BarraProgresso";
import EstadoVazio from "../components/EstadoVazio";
import {
  porcentagem,
  proximoEpisodio,
  minutosAssistidos,
  formatarTempo,
} from "../services/progresso";

function Estatisticas({ acompanhadas }) {
  if (acompanhadas.length === 0) {
    return (
      <EstadoVazio
        titulo="Ainda não há nada para contar"
        texto="Assim que você marcar os primeiros episódios, esta página mostra quanto tempo você passou assistindo."
        textoDoBotao="Procurar uma série"
        destino="/buscar"
      />
    );
  }

  const episodios = acompanhadas.reduce((soma, serie) => soma + serie.vistos.length, 0);
  const minutos = acompanhadas.reduce((soma, serie) => soma + minutosAssistidos(serie), 0);
  const concluidas = acompanhadas.filter((serie) => proximoEpisodio(serie) === null).length;

  const ranking = [...acompanhadas].sort((a, b) => b.vistos.length - a.vistos.length);

  return (
    <div className="pagina">
      <div className="secao-cabecalho">
        <h1>Seus números</h1>
        <p>Calculados a partir dos episódios que você marcou</p>
      </div>

      <div className="grade-numeros">
        <CartaoNumero
          valor={formatarTempo(minutos)}
          rotulo="de tela"
          detalhe="somando a duração média de cada episódio"
        />
        <CartaoNumero valor={episodios} rotulo="episódios marcados" />
        <CartaoNumero
          valor={acompanhadas.length}
          rotulo="séries na estante"
          detalhe={`${concluidas} já terminadas`}
        />
      </div>

      <section className="secao">
        <div className="secao-cabecalho">
          <h2>Série por série</h2>
        </div>

        <ul className="lista-ranking">
          {ranking.map((serie) => (
            <li key={serie.id}>
              <Link to={`/serie/${serie.id}`} className="linha-ranking">
                <span className="linha-ranking-nome">{serie.nome}</span>
                <BarraProgresso
                  valor={porcentagem(serie)}
                  rotulo={`${serie.vistos.length}/${serie.totalEpisodios}`}
                />
                <span className="linha-ranking-tempo">
                  {formatarTempo(minutosAssistidos(serie))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Estatisticas;
