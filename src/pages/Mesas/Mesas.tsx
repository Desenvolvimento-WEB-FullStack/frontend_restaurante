import { FaDoorOpen } from "react-icons/fa";
import styles from "./Mesas.module.css";
import { GiWoodenChair } from "react-icons/gi";
import { useEffect, useState } from "react";
import axios from "axios";
import { getDataLocalStorage } from "../../utils/getDataLocalStorage";

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
  const [mesas, setMesas] = useState<Mesa[]>([]);

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
          <div className={styles.chair} key={mesa.id}>
            {mesa.name}
            <div className={styles.chairHeader}>
              <span>{mesa.reservado ? "Ocupado" : "Livre"}</span>
              <GiWoodenChair />
            </div>
            <h3>{mesa.nome}</h3>
            <span>{mesa.quantidade_lugares || 0} lugares</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Mesas;
