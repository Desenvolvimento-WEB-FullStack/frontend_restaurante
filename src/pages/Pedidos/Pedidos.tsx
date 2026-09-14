import axios from "axios";
import styles from "./Pedidos.module.css";
import { getDataLocalStorage } from "../../utils/getDataLocalStorage";
import { useEffect, useState } from "react";
import { formatMoney } from "../../utils/formatMoney";
import Header from "../../components/Header/Header";

const dadosLocalStorage = getDataLocalStorage();

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);

  async function buscarPedidos() {
    const response = await axios.get("http://localhost:8888/pedidos", {
      headers: {
        Authorization: `Bearen ${dadosLocalStorage.token}`,
      },
    });

    setPedidos(response.data);
  }

  useEffect(() => {
    buscarPedidos();
  }, []);

  return (
    <div>
      <Header
        title="Pedidos"
        description="Acompanhe todos os pedidos finalizados e em abertos"
      />

      <div>
        <button>Todos</button>
        <button>Abertos</button>
        <button>Finalizados</button>
      </div>

      <div className={styles.itemsContainer}>
        {pedidos.map((pedido) => (
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
