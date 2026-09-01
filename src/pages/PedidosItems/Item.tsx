import { FaMinus, FaPlus } from "react-icons/fa";
import { formatMoney } from "../../utils/formatMoney";
import styles from "./PedidosItems.module.css";
import { useState } from "react";

function Item({ item }) {
  const [quantidade, setQuantidade] = useState(1);

  function diminuirQuantidade() {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  }

  function aumentarQuantidade() {
    setQuantidade(quantidade + 1);
  }

  return (
    <div key={item.id} className={styles.item}>
      <div className={styles.itemContainerLeft}>
        <h4>{item.nome}</h4>
        <p>{item.descricao}</p>
        <div className={styles.itemInfoContainer}>
          <span>TAM. {item.tamanho}</span>
          <span>{item.porcoes} PORÇ.</span>
        </div>
      </div>
      <div className={styles.itemContainerRight}>
        <span>{formatMoney(Number(item.preco))}</span>
        <div>
          <button disabled={quantidade <= 1}>
            <FaMinus onClick={diminuirQuantidade} />
          </button>

          <span>{quantidade}</span>
          <FaPlus onClick={aumentarQuantidade} />
        </div>
        <button>Adicionar</button>
      </div>
    </div>
  );
}

export default Item;
