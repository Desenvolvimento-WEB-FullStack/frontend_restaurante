import styles from "./Mesas.module.css";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import stylesIndex from "../../index.module.css";
import Header from "../../components/Header/Header";
import api from "../../services/api";
import { MdTableBar } from "react-icons/md";

type Mesa = {
  id: number;
  nome: string;
  quantidade_lugares: number | null;
  reservado: boolean;
  criado_em: string;
  atualizado_em: string;
  pedido_atual_id: number;
};

function Mesas() {
  const navigate = useNavigate();

  const [statusFiltro, setStatusFiltro] = useState<null | boolean>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [mesaClicada, setMesaClicada] = useState<Mesa | null>(null);
  const [nomeCliente, setNomeCliente] = useState("");

  function abrirModal(mesa: Mesa) {
    setModalAberto(true);
    setMesaClicada(mesa);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  async function criarPedido(event: React.SubmitEvent) {
    try {
      event.preventDefault();

      const response = await api.post("pedidos", {
        mesa_id: mesaClicada?.id,
        nome_cliente: nomeCliente,
        data: "2026-08-26",
      });

      navigate(`/pedido-items/${response.data.id}`);
    } catch {
      alert("Erro ao criar pedido");
    }
  }

  async function buscarMesas() {
    const response = await api.get<Mesa[]>("mesas");
    setMesas(response.data);
  }

  function visualizarCardapio(mesa: Mesa) {
    navigate(`/pedido-items/${mesa.pedido_atual_id}`);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    buscarMesas();
  }, []); // Deve executar durante a renderização inicial da tela

  const mesasFiltradas =
    statusFiltro === null
      ? mesas
      : mesas.filter((mesa) => mesa.reservado === statusFiltro);

  return (
    <div>
      <Header
        title="Mesas"
        description="Selecione uma mesa para abrir ou acompanhar o pedido"
      />

      <div className={styles.containerBotoesFiltro}>
        <button
          className={
            statusFiltro === null ? styles.filtroAtivo : styles.filtroInativo
          }
          onClick={() => setStatusFiltro(null)}
        >
          Todas
        </button>
        <button
          className={
            statusFiltro === false ? styles.filtroAtivo : styles.filtroInativo
          }
          onClick={() => setStatusFiltro(false)}
        >
          Livres
        </button>
        <button
          className={
            statusFiltro === true ? styles.filtroAtivo : styles.filtroInativo
          }
          onClick={() => setStatusFiltro(true)}
        >
          Ocupadas
        </button>
      </div>

      <div className={styles.containerChairs}>
        {mesasFiltradas.map((mesa) => (
          <div
            className={styles.chair}
            key={mesa.id}
            onClick={
              mesa.pedido_atual_id === null
                ? () => abrirModal(mesa)
                : () => visualizarCardapio(mesa)
            }
          >
            <div className={styles.chairHeader}>
              <span className={mesa.reservado ? styles.ocupado : styles.livre}>
                {mesa.reservado ? "Ocupado" : "Livre"}
              </span>

              <MdTableBar color="#987f78" width={20} />
            </div>
            <h3>Mesa {mesa.nome}</h3>
            <span className={styles.quantidade_lugares}>
              {mesa.quantidade_lugares || 0} lugares
            </span>
          </div>
        ))}
      </div>

      <Dialog open={modalAberto} onClose={fecharModal} maxWidth="md">
        <form onSubmit={criarPedido}>
          <DialogTitle>Mesa {mesaClicada?.nome}</DialogTitle>
          <DialogContent>
            <p>Informe o nome do cliente para abrir o pedido</p>
            <div className={stylesIndex.containerInput}>
              <label>Nome do cliente</label>
              <input
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                required
              />
            </div>
          </DialogContent>
          <DialogActions>
            <button type="submit">Criar pedido</button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default Mesas;
