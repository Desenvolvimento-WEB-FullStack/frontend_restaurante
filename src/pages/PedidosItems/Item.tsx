import { FaMinus, FaPlus } from "react-icons/fa";
import { formatMoney } from "../../utils/formatMoney";
import styles from "./PedidosItems.module.css";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { getDataLocalStorage } from "../../utils/getDataLocalStorage";

const dadosLocalStorage = getDataLocalStorage();

type ItemProps = {
  item: {
    id: number;
    nome: string;
    preco: string;
    tipo: string;
    porcoes: number;
    tamanho: "P" | "M" | "G";
    vegetariano: boolean;
    descricao: string | null;
    criado_em: string;
    atualizado_em: string;
  };
  refresh(): void;
};

function Item({ item, refresh }: ItemProps) {
  const params = useParams();

  const [quantidade, setQuantidade] = useState(1);

  function diminuirQuantidade() {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  }

  function aumentarQuantidade() {
    setQuantidade(quantidade + 1);
  }

  async function adicionarItemAoPedido() {
    await axios.post(
      "http://localhost:8888/items-pedidos",
      {
        pedido_id: Number(params.id),
        quantidade: quantidade,
        item_cardapio_id: item.id,
      },
      {
        headers: {
          Authorization: `Bearen ${dadosLocalStorage.token}`,
        },
      },
    );

    setQuantidade(1);

    refresh();
  }

  return (
    <div className={styles.item}>
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

          <input
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value) || 1)}
            style={{ width: 20 }}
          />
          <FaPlus onClick={aumentarQuantidade} />
        </div>
        <button onClick={adicionarItemAoPedido}>Adicionar</button>
      </div>
    </div>
  );
}

export default Item;
