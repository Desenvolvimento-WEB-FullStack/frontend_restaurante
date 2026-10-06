import { useEffect, useState } from "react";

import { formatMoney } from "../../utils/formatMoney";
import Header from "../../components/Header/Header";

import api from "../../services/api";

import globalStyles from "../../index.module.css";
import styles from "./Pedidos.module.css";
import formatDate from "../../utils/formatDate";

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
  data: string;
  comprovante_key: string | null;
  mesa: {
    nome: string;
  };
  items: PedidoItem[];
};

function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<null | boolean>(false);
  const [comprovantes, setComprovantes] = useState<Record<number, string>>({});

  async function buscarComprovanteUrl(pedidoId: number) {
    const response = await api.get<string | { url: string }>(
      `/pedidos/${pedidoId}/comprovante`,
    );

    return typeof response.data === "string"
      ? response.data
      : response.data.url;
  }

  async function buscarPedidos() {
    const response = await api.get<Pedido[]>("pedidos");
    setPedidos(response.data);

    const pedidosComComprovante = response.data.filter(
      (pedido) => pedido.comprovante_key,
    );
    const urls = await Promise.all(
      pedidosComComprovante.map((pedido) => buscarComprovanteUrl(pedido.id)),
    );

    setComprovantes(
      Object.fromEntries(
        pedidosComComprovante.map((pedido, index) => [pedido.id, urls[index]]),
      ),
    );
  }

  useEffect(() => {
    buscarPedidos();
  }, []);

  const pedidosFiltrados =
    filtroStatus === null
      ? pedidos
      : pedidos.filter((pedido) => pedido.fechado === filtroStatus);

  async function uploadArquivo(
    pedidoId: number,
    arquivoSelecionado: File | undefined,
  ) {
    if (!arquivoSelecionado) return;

    const formData = new FormData();
    formData.append("comprovante", arquivoSelecionado);

    await api.put(`pedidos/${pedidoId}/comprovante`, formData);
    buscarPedidos();
  }

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
          <div className={styles.itemPedido} key={pedido.id}>
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
                  <li key={item.id}>
                    {item.quantidade}x - {item.itemCardapio.nome}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.itemPedidoFooter}>
              <span>{formatDate(pedido.data)}</span>
              <span>Total: {formatMoney(Number(pedido.total))}</span>
            </div>

            <div className={styles.itemPedidoComprovante}>
              {pedido.comprovante_key ? (
                comprovantes[pedido.id] && (
                  <img
                    className={styles.comprovante}
                    src={comprovantes[pedido.id]}
                    alt={`Comprovante do pedido ${pedido.id}`}
                  />
                )
              ) : (
                <input
                  type="file"
                  onChange={(event) =>
                    uploadArquivo(pedido.id, event.target.files?.[0])
                  }
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pedidos;
