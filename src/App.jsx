import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import LayoutPrincipal from "./components/LayoutPrincipal";
import LayoutSerie from "./components/LayoutSerie";
import Estante from "./pages/Estante";
import Busca from "./pages/Busca";
import DetalheSerie from "./pages/DetalheSerie";
import Temporada from "./pages/Temporada";
import Estatisticas from "./pages/Estatisticas";
import NaoEncontrada from "./pages/NaoEncontrada";

import { detalhesSerie } from "./services/tmdb";
import { chaveEpisodio } from "./services/progresso";

const ARMAZENAMENTO = "continua:series";

function lerEstanteSalva() {
  try {
    const salvo = localStorage.getItem(ARMAZENAMENTO);
    return salvo ? JSON.parse(salvo) : [];
  } catch {
    return [];
  }
}

function App() {

  const [acompanhadas, setAcompanhadas] = useState(lerEstanteSalva);


  const [aviso, setAviso] = useState("");

  useEffect(() => {
    localStorage.setItem(ARMAZENAMENTO, JSON.stringify(acompanhadas));
  }, [acompanhadas]);
  async function adicionarSerie(id) {
    try {
      const dados = await detalhesSerie(id);

      const temporadas = (dados.seasons || [])
        .filter((temporada) => temporada.season_number > 0 && temporada.episode_count > 0)
        .map((temporada) => ({
          numero: temporada.season_number,
          total: temporada.episode_count,
        }));

      const nova = {
        id: dados.id,
        nome: dados.name,
        poster: dados.poster_path,
        duracaoMedia: (dados.episode_run_time || [])[0] || 45,
        totalEpisodios: temporadas.reduce((soma, temporada) => soma + temporada.total, 0),
        temporadas: temporadas,
        vistos: [],
        atualizadoEm: Date.now(),
      };

      setAviso("");
      setAcompanhadas((anteriores) => [...anteriores, nova]);
    } catch (problema) {
      setAviso(problema.message);
    }
  }

  function removerSerie(id) {
    setAcompanhadas((anteriores) => anteriores.filter((serie) => serie.id !== id));
  }

  function alternarEpisodio(id, numeroTemporada, numeroEpisodio) {
    const chave = chaveEpisodio(numeroTemporada, numeroEpisodio);

    setAcompanhadas((anteriores) =>
      anteriores.map((serie) => {
        if (serie.id !== id) {
          return serie;
        }

        const vistos = serie.vistos.includes(chave)
          ? serie.vistos.filter((item) => item !== chave)
          : [...serie.vistos, chave];

        return { ...serie, vistos: vistos, atualizadoEm: Date.now() };
      })
    );
  }

  function alternarTemporada(id, numeroTemporada, numerosDosEpisodios) {
    const chaves = numerosDosEpisodios.map((numero) => chaveEpisodio(numeroTemporada, numero));

    setAcompanhadas((anteriores) =>
      anteriores.map((serie) => {
        if (serie.id !== id) {
          return serie;
        }

        const completa = chaves.every((chave) => serie.vistos.includes(chave));

        const vistos = completa
          ? serie.vistos.filter((chave) => !chaves.includes(chave))
          : [...serie.vistos.filter((chave) => !chaves.includes(chave)), ...chaves];

        return { ...serie, vistos: vistos, atualizadoEm: Date.now() };
      })
    );
  }

  return (
    <Routes>
      <Route path="/" element={
          <LayoutPrincipal
            acompanhadas={acompanhadas}
            aviso={aviso}
            aoFecharAviso={() => setAviso("")}
          />
        }>
        <Route index element={<Estante acompanhadas={acompanhadas} aoRemover={removerSerie} />} />

        <Route
          path="buscar"
          element={<Busca acompanhadas={acompanhadas} aoAdicionar={adicionarSerie} />}
        />

        <Route path="estatisticas" element={<Estatisticas acompanhadas={acompanhadas} />} />

        <Route path="serie/:id" element={<LayoutSerie />}>
          <Route
            index
            element={
              <DetalheSerie
                acompanhadas={acompanhadas}
                aoAdicionar={adicionarSerie}
                aoRemover={removerSerie}
              />
            }
          />
          <Route
            path="temporada/:numero"
            element={
              <Temporada
                acompanhadas={acompanhadas}
                aoAdicionar={adicionarSerie}
                aoAlternarEpisodio={alternarEpisodio}
                aoAlternarTemporada={alternarTemporada}
              />
            }
          />
        </Route>

        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  );
}

export default App;
