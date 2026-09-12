
function CartaoNumero({ valor, rotulo, detalhe }) {
  return (
    <div className="cartao-numero">
      <strong>{valor}</strong>
      <span>{rotulo}</span>
      {detalhe && <small>{detalhe}</small>}
    </div>
  );
}

export default CartaoNumero;
