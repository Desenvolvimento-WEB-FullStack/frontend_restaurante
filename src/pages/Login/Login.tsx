// MODO ANTIGO import "./Login.module.css";
import styles from "./Login.module.css"; // MODO novo com CSS modules
import stylesIndex from "../../index.module.css";
import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Função que vai na api validar se usuario existe
  function fazerLogin(event) {
    event.preventDefault();

    axios.post("http://localhost:8888/auth/login", {
      email: email,
      senha: password,
    });
  }

  return (
    <form className={styles.container} onSubmit={fazerLogin}>
      <span className={styles.logo}>🍽️</span>
      <h1 className={styles.nome}>Sabor & Arte</h1>
      <p className={styles.subTitulo}>Acesse o painel do restaurante</p>

      <div className={stylesIndex.containerInput}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={stylesIndex.containerInput}>
        <label>Senha</label>
        <input
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>

      <button type="submit">Entrar</button>
    </form>
  );
}

export default Login;
