import { Link } from "react-router-dom";

function NaoEncontrada() {
  return (
    <div className="estado estado-vazio">
      <h2>Esta página não existe</h2>
      <p>O endereço que você abriu não faz parte do Continua.</p>
      <Link to="/" className="botao botao-principal">
        Voltar para a estante
      </Link>
    </div>
  );
}

export default NaoEncontrada;
