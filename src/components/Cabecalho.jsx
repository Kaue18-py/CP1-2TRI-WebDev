import { NavLink, Link } from "react-router-dom";
import { FiSearch, FiBookmark, FiBarChart2 } from "react-icons/fi";

function Cabecalho({ quantidade }) {
  return (
    <header className="cabecalho">
      <div className="cabecalho-interno">
        <Link to="/" className="marca">
          MetFlix
          <span className="marca-ponto" aria-hidden="true"></span>
        </Link>

        <nav className="navegacao">
          <NavLink to="/" end className="link-nav">
            <FiBookmark aria-hidden="true" />
            <span>Estante</span>
            {quantidade > 0 && <em className="contador">{quantidade}</em>}
          </NavLink>

          <NavLink to="/buscar" className="link-nav">
            <FiSearch aria-hidden="true" />
            <span>Buscar</span>
          </NavLink>

          <NavLink to="/estatisticas" className="link-nav">
            <FiBarChart2 aria-hidden="true" />
            <span>Números</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Cabecalho;
