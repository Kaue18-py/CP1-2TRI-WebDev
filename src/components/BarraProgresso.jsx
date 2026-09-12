function BarraProgresso({ valor, rotulo }) {
  return (
    <div className="progresso">
      <div className="progresso-trilho">
        <div className="progresso-preenchido" style={{ width: `${valor}%` }}></div>
      </div>
      {rotulo && <span className="progresso-rotulo">{rotulo}</span>}
    </div>
  );
}

export default BarraProgresso;
