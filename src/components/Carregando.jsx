function Carregando({ texto = "Carregando" }) {
  return (
    <div className="estado estado-carregando">
      <span className="pulso" aria-hidden="true"></span>
      <p>{texto}</p>
    </div>
  );
}

export default Carregando;
