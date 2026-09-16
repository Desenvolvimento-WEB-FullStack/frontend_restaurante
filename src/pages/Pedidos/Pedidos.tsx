import styles from "./Pedidos.module.css";
import { useEffect, useState } from "react";
import { formatMoney } from "../../utils/formatMoney";
import Header from "../../components/Header/Header";
import api from "../../services/api";

type Pedido = {
  id: number;
  nome_cliente: string;
  fechado: boolean;
  total: number | null;
  mesa: {
    nome: string;
  };
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
    <div>
      <Header
        title="Pedidos"
        description="Acompanhe todos os pedidos finalizados e em abertos"
      />

      <div>
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
                <li>
                  <span>2x Coxinha</span> <span>R$ 123</span>
                </li>
                <li>
                  <span>2x Coxinha</span> <span>R$ 123</span>
                </li>
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
