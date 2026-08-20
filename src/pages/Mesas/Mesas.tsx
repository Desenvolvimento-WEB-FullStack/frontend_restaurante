import { FaDoorOpen } from "react-icons/fa";
import styles from "./Mesas.module.css";
import { GiWoodenChair } from "react-icons/gi";
import { useEffect } from "react";
import axios from "axios";

function Mesas() {
  function buscarMesas() {
    // fetch("http://localhost:8888/mesas");
    axios.get("http://localhost:8888/mesas", {
      headers: {
        Authorization:
          "Bearen eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Niwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg3MTg2NTExLCJleHAiOjE3ODcyNzI5MTF9.6im-aeum5lBLWN_ujc6TGDaO4IM1JyIpy_oGtgEmzG4",
      },
    });
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
          <span>Funcionário</span>
          <span>
            <FaDoorOpen />
          </span>
        </div>
      </div>

      <h2>Mesas</h2>
      <p>Selecione uma mesa para abrir ou acompanhar o pedido</p>

      <div className={styles.containerChairs}>
        <div className={styles.chair}>
          <div className={styles.chairHeader}>
            <span>Livre</span>
            <GiWoodenChair />
          </div>
          <h3>Mesa 01</h3>
          <span>3 lugares</span>
        </div>
      </div>
    </div>
  );
}

export default Mesas;
