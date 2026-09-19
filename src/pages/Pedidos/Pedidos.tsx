import { useEffect, useState } from "react";

import { formatMoney } from "../../utils/formatMoney";
import Header from "../../components/Header/Header";

import api from "../../services/api";

import globalStyles from "../../index.module.css";
import styles from "./Pedidos.module.css";

type ItemCardapio = {
  id: number;
  nome: string;
};

type PedidoItem = {
  id: number;
  quantidade: number;
  itemCardapio: ItemCardapio;
};

type Pedido = {
  id: number;
  nome_cliente: string;
  fechado: boolean;
  total: number | null;
  mesa: {
    nome: string;
  };
  items: PedidoItem[];
};

function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<null | boolean>(false);

  async function buscarPedidos() {
    const response = await api.get("pedidos");
    setPedidos(response.data);
  }

  useEffect(() => {
    buscarPedidos();
  }, []);

  const pedidosFiltrados =
    filtroStatus === null
      ? pedidos
      : pedidos.filter((pedido) => pedido.fechado === filtroStatus);

  return (
    <div className={globalStyles.mainContainer}>
      <Header
        title="Pedidos"
        description="Acompanhe todos os pedidos finalizados e em abertos"
      />

      <div className={globalStyles.containerBotoesFiltro}>
        <button onClick={() => setFiltroStatus(null)}>Todos</button>
        <button onClick={() => setFiltroStatus(false)}>Abertos</button>
        <button onClick={() => setFiltroStatus(true)}>Finalizados</button>
      </div>

      <div className={styles.itemsContainer}>
        {pedidosFiltrados.map((pedido) => (
          <div className={styles.itemPedido}>
            <div className={styles.itemPedidoHeader}>
              <div>
                <h3>Mesa {pedido.mesa.nome}</h3>
                <span>{pedido.nome_cliente}</span>
              </div>
              <span>{pedido.fechado ? "Fechado" : "Aberto"}</span>
            </div>

            <div className={styles.itemPedidoBody}>
              <ul>
                {pedido.items.map((item) => (
                  <li>
                    {item.quantidade}x - {item.itemCardapio.nome}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.itemPedidoFooter}>
              <span>18:00</span>
              <span>Total: {formatMoney(Number(pedido.total))}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pedidos;
