import CartaoRetomada from "../components/CartaoRetomada";
import CardEstante from "../components/CardEstante";
import EstadoVazio from "../components/EstadoVazio";
import { proximoEpisodio } from "../services/progresso";


function Estante({ acompanhadas, aoRemover }) {
  if (acompanhadas.length === 0) {
    return (
      <EstadoVazio
        titulo="Sua estante está vazia"
        texto="Procure uma série que você está assistindo e marque os episódios que já viu. A partir daí o Continua guarda o ponto exato onde você parou."
        textoDoBotao="Procurar uma série"
        destino="/buscar"
      />
    );
  }

  const ordenadas = [...acompanhadas].sort((a, b) => b.atualizadoEm - a.atualizadoEm);
  const destaque = ordenadas[0];
  const restante = ordenadas.slice(1);

  const emAndamento = ordenadas.filter((serie) => proximoEpisodio(serie) !== null).length;

  return (
    <div className="pagina">
      <CartaoRetomada serie={destaque} />

      {restante.length > 0 && (
        <section className="secao">
          <div className="secao-cabecalho">
            <h2>Também na estante</h2>
            <p>{emAndamento} em andamento</p>
          </div>

          <div className="grade">
            {restante.map(  (serie) => (
              <CardEstante key={serie.id} serie={serie} aoRemover={aoRemover} />
            ))}
          </div>
        </section>
      )}

      {restante.length === 0 && (
        <p className="dica">
          Acompanhe outras séries para ver todas lado a lado aqui.
        </p>
      )}
    </div>
  );
}

export default Estante;
