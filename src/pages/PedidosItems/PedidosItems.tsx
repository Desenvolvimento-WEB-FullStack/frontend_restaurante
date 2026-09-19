import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";

import { formatMoney } from "../../utils/formatMoney";

import Header from "../../components/Header/Header";
import Item from "./Item";

import api from "../../services/api";

import styles from "./PedidosItems.module.css";
import globalStyles from "../../index.module.css";

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
    const response = await api.get<DadosPedido>(`pedidos/${params.id}`);
    setDadosPedido(response.data);
  }

  async function buscaItemsCardapio() {
    const response = await api.get<ItemCardapio[]>("items-cardapio");
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
        await api.put(`pedidos/${params.id}/fechar`);
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
    <div className={globalStyles.mainContainer}>
      <Link to="/mesas" className={styles.backTextContainer}>
        <FaArrowLeft color="#A58D80" />
        <span className={styles.backText}>Voltar para mesas</span>
      </Link>

      <div className={styles.headerContainer}>
        <Header
          title={`Mesa ${dadosPedido?.mesa?.nome}`}
          description={`Cliente: ${dadosPedido?.nome_cliente}`}
        />

        <span className={styles.statusPedido}>
          Pedido em {dadosPedido?.fechado ? "Fechado" : "Aberto"}
        </span>
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
                    <span>
                      <span className={styles.itemCarrinhoQuantidade}>
                        {item.quantidade}x
                      </span>{" "}
                      -{" "}
                    </span>
                    <span>{item.itemCardapio.nome}</span>
                  </div>
                  <span className={styles.itemCarrinhoPreco}>
                    {formatMoney(
                      item.quantidade * Number(item.itemCardapio.preco),
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div className={styles.totalContainer}>
              <span>Total</span>
              <span>{formatMoney(dadosPedido?.subTotal || 0)}</span>
            </div>
            <button className={styles.botaoFecharPedido} onClick={fecharPedido}>
              Fechar pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PedidosItems;
