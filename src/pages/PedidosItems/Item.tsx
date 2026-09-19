import { FaMinus, FaPlus } from "react-icons/fa";
import { formatMoney } from "../../utils/formatMoney";
import styles from "./PedidosItems.module.css";
import { useState } from "react";

import { useParams } from "react-router";

import api from "../../services/api";

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
    await api.post("items-pedidos", {
      pedido_id: Number(params.id),
      quantidade: quantidade,
      item_cardapio_id: item.id,
    });

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
        <span className={styles.itemPreco}>
          {formatMoney(Number(item.preco))}
        </span>

        <div className={styles.containerBotoes}>
          <button disabled={quantidade <= 1} className={styles.botaoDiminuir}>
            <FaMinus fontSize={12} onClick={diminuirQuantidade} />
          </button>

          <input
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value) || 1)}
            style={{ width: 20 }}
          />
          <button
            onClick={aumentarQuantidade}
            className={styles.botaoAcrescentar}
          >
            <FaPlus fontSize={12} />
          </button>
        </div>
        <button
          className={styles.botaoAdicionar}
          onClick={adicionarItemAoPedido}
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}

export default Item;
