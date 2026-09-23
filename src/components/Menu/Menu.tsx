import { Link, useNavigate } from "react-router";
import { FaDoorOpen } from "react-icons/fa";

import { getDataLocalStorage } from "../../utils/getDataLocalStorage";
import styles from "./Menu.module.css";

const dadosLocalStorage = getDataLocalStorage();

function Menu() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("@dadoslogin");
    navigate("/");
  }

  return (
    <div className={styles.containerMenu}>
      <div className={styles.contentLeft}>
        <span className={styles.logoMenu}>🍽️</span>
        <h1>Sabor & Arte</h1>
        <ul>
          <Link to="/mesas">
            <li>Mesas</li>
          </Link>
          <Link to="/pedidos">
            <li>Pedidos</li>
          </Link>
          <Link to="/chefes">
            <li>Chefes</li>
          </Link>
          <Link to="/mesas/nova">
            <li>Nova mesa</li>
          </Link>
          <Link to="/cardapio/novo">
            <li>Cardapio</li>
          </Link>
        </ul>
      </div>

      <div className={styles.contentRight}>
        <span className={styles.roleText}>
          {dadosLocalStorage.role?.toUpperCase()}
        </span>
        <span>
          <FaDoorOpen onClick={logout} size={24} />
        </span>
      </div>
    </div>
  );
}

export default Menu;
