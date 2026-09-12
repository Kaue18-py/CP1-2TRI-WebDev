import { Outlet } from "react-router-dom";
import { FiX } from "react-icons/fi";
import Cabecalho from "./Cabecalho";
import Rodape from "./Rodape";

function LayoutPrincipal({ acompanhadas, aviso, aoFecharAviso }) {
  return (
    <div className="app">
      <Cabecalho quantidade={acompanhadas.length} />

      {aviso && (
        <div className="faixa-aviso" role="status">
          <p>{aviso}</p>
          <button type="button" onClick={aoFecharAviso} aria-label="Fechar aviso">
            <FiX aria-hidden="true" />
          </button>
        </div>
      )}

      <main className="conteudo">
        <Outlet />
      </main>
      <Rodape />
    </div>
  );
}

export default LayoutPrincipal;
