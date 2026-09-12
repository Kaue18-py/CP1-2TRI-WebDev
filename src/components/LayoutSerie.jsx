import { Outlet, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

function LayoutSerie() {
  const navegar = useNavigate();

  return (
    <div className="pagina-serie">
      <button type="button" className="botao-voltar" onClick={() => navegar(-1)}>
        <FiArrowLeft aria-hidden="true" />
        Voltar
      </button>
      <Outlet />
    </div>
  );
}

export default LayoutSerie;
