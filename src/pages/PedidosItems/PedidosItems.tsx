import axios from "axios";
import { useEffect, useState } from "react";
import { getDataLocalStorage } from "../../utils/getDataLocalStorage";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./PedidosItems.module.css";
import Item from "./Item";

const dadosLocalStorage = getDataLocalStorage();

type ItemCardapio = {
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

function PedidosItems() {
  const [itemsCardapio, setItemsCardapio] = useState<ItemCardapio[]>([]);

  async function buscaItemsCardapio() {
    const response = await axios.get<ItemCardapio[]>(
      "http://localhost:8888/items-cardapio",
      {
        headers: {
          Authorization: `Bearer ${dadosLocalStorage.token}`,
        },
      },
    );
    setItemsCardapio(response.data);
  }

  useEffect(() => {
    buscaItemsCardapio();
  }, []); // Deve executar durante a renderização inicial do componente, ou seja, quando o componente for montado na tela.

  return (
    <div className={styles.container}>
      <div className={styles.backTextContainer}>
        <FaArrowLeft color="#CCC" />
        <span className={styles.backText}>Voltar para mesas</span>
      </div>

      <div className={styles.headerContainer}>
        <div>
          <h2>Mesa 01</h2>
          <span>Cliente: Joao da Silva</span>
        </div>
        <span>Pedido em aberto</span>
      </div>

      <div className={styles.itemsContainer}>
        <h3>Cardápio</h3>
        {itemsCardapio.map((item) => (
          <Item item={item} />
        ))}
      </div>
    </div>
  );
}

export default PedidosItems;
