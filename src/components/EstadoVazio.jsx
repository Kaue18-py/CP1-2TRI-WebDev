import { Link } from "react-router-dom";

function EstadoVazio({ titulo, texto, textoDoBotao, destino }) {
  return (
    <div className="estado estado-vazio">
      <h2>{titulo}</h2>
      <p>{texto}</p>
      {destino && (
        <Link to={destino} className="botao botao-principal">
          {textoDoBotao}
        </Link>
      )}
    </div>
  );
}

export default EstadoVazio;
