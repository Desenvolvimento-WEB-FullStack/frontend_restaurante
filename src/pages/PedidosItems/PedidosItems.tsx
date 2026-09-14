import axios from "axios";
import { useEffect, useState } from "react";
import { getDataLocalStorage } from "../../utils/getDataLocalStorage";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./PedidosItems.module.css";
import Item from "./Item";
import { useParams, useNavigate } from "react-router";
import { formatMoney } from "../../utils/formatMoney";
import Swal from "sweetalert2";
import Header from "../../components/Header/Header";

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

type Mesa = {
  id: number;
  nome: string;
  reservado: boolean;
  quantidade_lugares: number;
  criado_em: string;
  atualizado_em: string;
};

type PedidoItem = {
  id: number;
  pedido_id: number;
  item_cardapio_id: number;
  quantidade: number;
  criado_em: string;
  atualizado_em: string;
  itemCardapio: ItemCardapio;
};

type DadosPedido = {
  id: number;
  nome_cliente: string;
  mesa_id: number;
  fechado: boolean;
  data: string;
  total: number | null;
  criado_em: string;
  atualizado_em: string;
  mesa: Mesa;
  items: PedidoItem[];
  subTotal: number;
};

function PedidosItems() {
  const params = useParams();
  const navigate = useNavigate();

  const [itemsCardapio, setItemsCardapio] = useState<ItemCardapio[]>([]);
  const [dadosPedido, setDadosPedido] = useState<DadosPedido | null>(null);

  async function buscarDadosPedidoAtual() {
    const response = await axios.get<DadosPedido>(
      `http://localhost:8888/pedidos/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${dadosLocalStorage.token}`,
        },
      },
    );
    setDadosPedido(response.data);
  }

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

  async function fecharPedido() {
    try {
      const respostaUsuario = await Swal.fire({
        title: "Deseja fechar essa mesa agora?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Sim, fechar Agora",
        cancelButtonText: `Cancelar`,
      });

      if (respostaUsuario.isConfirmed === true) {
        await axios.put(
          `http://localhost:8888/pedidos/${params.id}/fechar`,
          {},
          {
            headers: {
              Authorization: `Bearen ${dadosLocalStorage.token}`,
            },
          },
        );
        Swal.fire({
          icon: "success",
          title: `O pedido ${params.id} foi fechado com sucesso!`,
        });
        navigate("/mesas");
      }
    } catch {
      alert("Erro ao fechar o pedido");
    }
  }

  useEffect(() => {
    buscaItemsCardapio();
    buscarDadosPedidoAtual();
  }, []); // Deve executar durante a renderização inicial do componente, ou seja, quando o componente for montado na tela.

  return (
    <div className={styles.container}>
      <div className={styles.backTextContainer}>
        <FaArrowLeft color="#CCC" />
        <span className={styles.backText}>Voltar para mesas</span>
      </div>

      <div className={styles.headerContainer}>
        <div>
          <Header
            title={`Mesa ${dadosPedido?.mesa?.nome}`}
            description={`Cliente: ${dadosPedido?.nome_cliente}`}
          />
        </div>
        <span>Pedido em {dadosPedido?.fechado ? "Fechado" : "Aberto"}</span>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.itemsContainer}>
          <h3>Cardápio</h3>
          {itemsCardapio.map((item) => (
            <Item refresh={buscarDadosPedidoAtual} item={item} key={item.id} />
          ))}
        </div>
        <div className={styles.resumeContainer}>
          <div className={styles.resumeListContainer}>
            <h3>Resumo do pedido</h3>
            <ul>
              {dadosPedido?.items.map((item) => (
                <li>
                  <div>
                    <span>{item.quantidade}x - </span>
                    <span>{item.itemCardapio.nome}</span>
                  </div>
                  <span>
                    {formatMoney(
                      item.quantidade * Number(item.itemCardapio.preco),
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div>
              <span>Total</span>
              <span>{formatMoney(dadosPedido?.subTotal || 0)}</span>
            </div>
            <button onClick={fecharPedido}>Fechar pedido</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PedidosItems;
