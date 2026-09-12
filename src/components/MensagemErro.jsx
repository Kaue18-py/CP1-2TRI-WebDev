import { FiRefreshCw } from "react-icons/fi";

function MensagemErro({ mensagem, aoTentarDeNovo }) {
  return (
    <div className="estado estado-erro">
      <p>{mensagem}</p>
      {aoTentarDeNovo && (
        <button type="button" className="botao botao-contorno" onClick={aoTentarDeNovo}>
          <FiRefreshCw aria-hidden="true" />
          Tentar de novo
        </button>
      )}
    </div>
  );
}

export default MensagemErro;
