import { FaDoorOpen } from "react-icons/fa";
import styles from "./Mesas.module.css";
import { GiWoodenChair } from "react-icons/gi";
import { useEffect, useState } from "react";
import axios from "axios";
import { getDataLocalStorage } from "../../utils/getDataLocalStorage";
import { useNavigate } from "react-router";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import stylesIndex from "../../index.module.css";

const dadosLocalStorage = getDataLocalStorage();

type Mesa = {
  id: number;
  nome: string;
  quantidade_lugares: number | null;
  reservado: boolean;
  criado_em: string;
  atualizado_em: string;
};

function Mesas() {
  const navigate = useNavigate();
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

      await axios.post(
        "http://localhost:8888/pedidos",
        {
          mesa_id: mesaClicada?.id,
          nome_cliente: nomeCliente,
          data: "2026-08-26",
        },
        {
          headers: {
            Authorization: `Bearen ${dadosLocalStorage.token}`,
          },
        },
      );

      navigate("/pedido-items");
    } catch {
      alert("Erro ao criar pedido");
    }
  }

  async function buscarMesas() {
    const response = await axios.get<Mesa[]>("http://localhost:8888/mesas", {
      headers: {
        Authorization: `Bearen ${dadosLocalStorage.token}`,
      },
    });

    setMesas(response.data);
  }

  useEffect(() => {
    buscarMesas();
  }, []); // Deve executar durante a renderização inicial da tela

  return (
    <div>
      <div className={styles.containerMenu}>
        <div className={styles.contentLeft}>
          <span className={styles.logoMenu}>🍽️</span>
          <h1>Sabor & Arte</h1>
          <ul>
            <li>Mesas</li>
            <li>Pedidos</li>
          </ul>
        </div>

        <div className={styles.contentRight}>
          <span>{dadosLocalStorage.role}</span>
          <span>
            <FaDoorOpen />
          </span>
        </div>
      </div>

      <h2>Mesas</h2>
      <p>Selecione uma mesa para abrir ou acompanhar o pedido</p>

      <div className={styles.containerChairs}>
        {mesas.map((mesa) => (
          <div
            className={styles.chair}
            key={mesa.id}
            onClick={() => abrirModal(mesa)}
          >
            {mesa.nome}
            <div className={styles.chairHeader}>
              <span>{mesa.reservado ? "Ocupado" : "Livre"}</span>
              <GiWoodenChair />
            </div>
            <h3>{mesa.nome}</h3>
            <span>{mesa.quantidade_lugares || 0} lugares</span>
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
